/**
 * @fileOverview This file contains shared Zod schemas and TypeScript types for Genkit flows.
 * By centralizing them here, we avoid "use server" conflicts when importing schemas
 * into server-only files.
 */

import {z} from 'zod';

// Schema for a single chat message
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({text: z.string()})),
  isUser: z.boolean().optional().describe("True if the role is 'user'"),
  isModel: z.boolean().optional().describe("True if the role is 'model'"),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Input schema for the main chatbot flow
export const CyberLawChatbotInputSchema = z.object({
  query: z
    .string()
    .describe('The user query about cyber law or cybersecurity in Tamil or English.'),
  userName: z.string().optional().describe('The name of the user, if known. Use for personalization if available.'),
  userContact: z.string().optional().describe("The user's contact info (email/phone) for pre-filling documents."),
  chatHistory: z.array(ChatMessageSchema).optional().describe('The previous turns in the current conversation. Use this to maintain context, avoid repetition, and provide more relevant follow-up answers.'),
  userDetails: z.object({
    gender: z.string().optional(),
    age: z.number().nullable().optional(),
    maritalStatus: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    preferredLanguage: z.string().optional(),
  }).optional().describe('Additional details about the user like gender, age, marital status, and location. Use this for personalization.'),
  isProfileIncomplete: z.boolean().optional().describe('True if the user has a new or incomplete profile. Use this to gently prompt them to complete it for a better experience.'),
});
export type CyberLawChatbotInput = z.infer<typeof CyberLawChatbotInputSchema>;


// Output schema for the main chatbot flow
export const CyberLawChatbotOutputSchema = z.object({
  answer: z
    .string()
    .describe('The chatbot response providing a layman-friendly explanation and mitigation techniques in Tamil and/or English.'),
});
export type CyberLawChatbotOutput = z.infer<typeof CyberLawChatbotOutputSchema>;


// Input schema for the legal document generator tool
export const LegalDocumentInputSchema = z.object({
  documentType: z.enum(['FIR', 'ComplaintLetter', 'TakedownNotice'])
    .describe("The type of legal document to generate: 'FIR' for First Information Report, 'ComplaintLetter' for a general complaint to police/cyber cell, or 'TakedownNotice' for copyright/defamation issues."),
  incidentDetails: z.string().describe("A detailed description of the incident provided by the user. This should include what happened, when, who was involved, and any evidence available."),
  userName: z.string().optional().describe("The user's full name."),
  userContact: z.string().optional().describe("The user's contact information (phone or email)."),
  accusedDetails: z.string().optional().describe("Details about the accused person or entity, if known (e.g., name, username, website, email)."),
});
export type LegalDocumentInput = z.infer<typeof LegalDocumentInputSchema>;


// Output schema for the legal document generator tool
export const LegalDocumentOutputSchema = z.object({
  generatedDocument: z.string().describe("The fully drafted legal document in Markdown format."),
});
export type LegalDocumentOutput = z.infer<typeof LegalDocumentOutputSchema>;
