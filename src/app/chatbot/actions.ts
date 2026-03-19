
'use server';

import {
  cyberLawChatbot,
} from '@/ai/flows/cyber-law-chatbot';
import {
  type CyberLawChatbotInput,
  type CyberLawChatbotOutput,
} from '@/ai/flows/types';
import { generateChatTitle } from '@/ai/flows/chat-title-generator';

import { z } from 'zod';
import { admin, db } from '@/lib/firebase-admin'; // Use admin SDK on server
const { Timestamp } = admin.firestore;


const UserDetailsSchema = z.object({
  gender: z.string().optional(),
  age: z.number().nullable().optional(),
  maritalStatus: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  preferredLanguage: z.string().optional(),
}).nullable().optional();


const ChatAIInputSchema = z.object({
  query: z.string(),
  userName: z.string().optional(),
  userContact: z.string().optional(),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({ text: z.string() })),
  })),
  userDetails: UserDetailsSchema,
  isProfileIncomplete: z.boolean().optional(),
  chatSessionId: z.string().nullable(),
  userId: z.string(),
});

export async function getAIChatResponse(
  input: z.infer<typeof ChatAIInputSchema>
): Promise<{ output: CyberLawChatbotOutput; newChatSessionId?: string }> {

  const validatedFields = ChatAIInputSchema.safeParse(input);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    throw new Error('Invalid input for getAIChatResponse');
  }

  const { query, userName, userContact, chatHistory, userDetails, isProfileIncomplete, userId } = validatedFields.data;
  let { chatSessionId } = validatedFields.data;

  // Save the user's message
  const userMessage = {
    role: 'user',
    text: query,
    timestamp: Timestamp.now(),
  };

  try {
    // If it's a new chat, create a session first
    if (!chatSessionId) {
      // Generate a title using the new AI flow
      const titleResponse = await generateChatTitle({ query });
      const newTitle = titleResponse.title;

      const sessionRef = await db.collection(`users/${userId}/chatSessions`).add({
        title: newTitle,
        userId: userId,
        createdAt: Timestamp.now(),
        lastMessageAt: Timestamp.now(),
      });
      chatSessionId = sessionRef.id;
      // Add the first message to this new session
      await db.collection(`users/${userId}/chatSessions/${chatSessionId}/messages`).add(userMessage);
    } else {
      // Just add the message to the existing session
      await db.collection(`users/${userId}/chatSessions/${chatSessionId}/messages`).add(userMessage);
      await db.doc(`users/${userId}/chatSessions/${chatSessionId}`).update({
        lastMessageAt: Timestamp.now(),
      });
    }

    // Prepare input for the Genkit flow
    const aiInput: CyberLawChatbotInput = {
      query,
      userName,
      userContact,
      chatHistory,
      userDetails: userDetails || undefined,
      isProfileIncomplete,
    };

    // Call Genkit flow
    const result = await cyberLawChatbot(aiInput);

    // Save the AI's response
    const aiResponse = {
      role: 'model',
      text: result.answer,
      timestamp: Timestamp.now(),
    };
    await db.collection(`users/${userId}/chatSessions/${chatSessionId}/messages`).add(aiResponse);

    return {
      output: result,
      newChatSessionId: chatSessionId, // Return the ID so the client knows it
    };
  } catch (e) {
    console.error("Critical Error in getAIChatResponse:", e);
    let errorMessage = "An unexpected system error occurred while processing your request.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    // Return a structured error to be handled by the client
    return {
      output: {
        answer: `Sorry, there was a critical error: ${errorMessage}`
      },
      newChatSessionId: chatSessionId || undefined,
    };
  }
}
