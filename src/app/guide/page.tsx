import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, MessageCircle, FileText, BookOpen, ShieldCheck, Users, AlertTriangle, LifeBuoy, LogIn, UserCircle, Linkedin, Github, Instagram, Mail, SquareArrowOutUpRight } from "lucide-react";
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Site Guide - CyberMozhi',
  description: 'Learn how to effectively use CyberMozhi to understand Indian cyber laws and cybersecurity.',
};

const guideSections = [
  {
    icon: MessageCircle,
    title: "AI Chatbot Assistant",
    content: "Ask CyberMozhi anything about Indian cyber law, online scams, or digital safety. Every answer streams in live and covers both English and Tamil — toggle which language appears first using the language switch above the chat box. If your question involves a police complaint, FIR, or takedown notice, the assistant can draft one for you inside the chat, ready to review and export.",
    tips: [
      "Toggle Tamil-first mode if you'd rather read Tamil before English in every response.",
      "Tap the microphone icon to ask your question by voice instead of typing.",
      "After each answer, tap one of the suggested follow-up questions to go deeper without retyping.",
      "You'll need to be logged in to use the chatbot — this keeps your chat history saved and private to your account.",
    ]
  },
  {
    icon: FileText,
    title: "Document Drafting & Save as PDF",
    content: "When you ask the chatbot to help with an FIR, police complaint, or legal notice, it generates a complete draft directly in the chat. Look for the 'Save as PDF' button on that message — it opens a print-ready version in a new tab and triggers your browser's print dialog automatically, so you just choose 'Save as PDF' as the destination.",
    tips: [
      "Always fill in any [bracketed] placeholders in the draft before submitting it anywhere.",
      "Treat every draft as a starting point — have it reviewed by a professional before filing.",
      "If the print dialog doesn't open automatically, allow pop-ups for this site and try again.",
    ]
  },
  {
    icon: ShieldCheck,
    title: "Scam Checker",
    content: "Paste a suspicious message, email, or link into the Scam Checker and get an instant AI analysis of whether it looks like a scam, what red flags it contains, and what to do next.",
    tips: [
      "Paste the full message text for the most accurate analysis — partial snippets give partial answers.",
      "Use it before clicking any link or sharing any OTP you weren't expecting.",
      "If it's confirmed as fraud, report it immediately at cybercrime.gov.in or call 1930.",
    ]
  },
  {
    icon: FileText,
    title: "Indian Cyber Law Summaries",
    content: "Browse plain-language summaries of key sections from the IT Act 2000, relevant IPC sections, and the Digital Personal Data Protection Act 2023. Each entry explains what the law covers, its real-world implications, and applicable penalties.",
    tips: [
      "Browse by category to find laws relevant to your situation.",
      "These summaries are for educational purposes only, not a substitute for formal legal advice.",
      "If the chatbot cites a law by section number, look it up here for the full picture.",
    ]
  },
  {
    icon: BookOpen,
    title: "Cybersecurity Glossary",
    content: "A growing glossary of cybersecurity and cyber-law terms explained in simple language, organized by category for easy browsing.",
    tips: [
      "Use this whenever the chatbot or a law summary uses a term you don't recognize.",
      "Browsing by category is a good way to build broader digital-safety awareness.",
    ]
  },
  {
    icon: Users,
    title: "Cyber Crime Cell Locator",
    content: "Find contact details for cyber crime cells across India's states and union territories, sourced from official government listings — useful when you need to report an incident in person or by phone.",
    tips: [
      "Search by your state or union territory to find the nearest cell.",
      "Keep the national helpline (1930) handy as your first call in an active fraud situation.",
    ]
  },
  {
    icon: LogIn,
    title: "Accounts & Chat History",
    content: "Create a free account to unlock the AI chatbot and have your conversations saved automatically, so you can pick up where you left off. Guest visitors can browse law summaries, the glossary, cyber cell listings, and the scam checker without logging in.",
    tips: [
      "Use 'Sign Up' in the header to create a free account, or 'Login' if you already have one.",
      "Your past chat sessions are listed in the sidebar once you're logged in.",
      "Keep your account credentials secure and log out on shared devices.",
    ]
  },
  {
    icon: LifeBuoy,
    title: "General Tips for Effective Use",
    content: "CyberMozhi is designed to be an empowering resource. Here's how to make the most of it:",
    tips: [
      "In an active emergency (ongoing fraud, threats, harassment), call 1930 first — the chatbot is for guidance, not emergency response.",
      "Start with the tool most relevant to your need: chatbot for guidance, scam checker for a suspicious message, law summaries for legal detail, glossary for terminology.",
      "Cross-reference: if the chatbot mentions a law, look it up in Law Summaries; if it uses an unfamiliar term, check the Glossary.",
      "The platform is actively evolving — check back for new features and expanded content.",
    ]
  },
];

export default function GuidePage() {
  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-10 text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out">
        <Rocket className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">Site Guide</h1>
        <p className="mt-2 text-md sm:text-lg text-foreground/70 max-w-2xl mx-auto">
          Learn how to effectively use CyberMozhi to navigate the world of cyber laws and cybersecurity.
        </p>
      </header>

      <div className="w-full max-w-4xl space-y-8">
        {guideSections.map((section, index) => (
          <Card
            key={index}
            className="shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-[1.02] hover:rotate-x-1 hover:-rotate-y-1 rounded-lg animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-start gap-4 bg-primary/5 p-6">
              <section.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-xl font-headline text-primary">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-foreground/80 mb-4 leading-relaxed">{section.content}</p>
              {section.tips && section.tips.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-foreground mb-2">Key Tips:</h3>
                  <ul className="list-disc list-inside space-y-1 text-foreground/70 text-sm pl-1">
                    {section.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <section
        className="group w-full max-w-4xl mt-12 p-6 sm:p-8 bg-accent/5 rounded-2xl shadow-xl border border-accent/20 transition-transform duration-300 ease-in-out hover:shadow-accent/20 hover:scale-[1.02] hover:rotate-y-1 animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out"
        style={{ animationDelay: `${guideSections.length * 100}ms` }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
          <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-accent flex-shrink-0 border-2 border-accent/30 rounded-full p-1" />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-accent">Meet the Creator</h2>
            <p className="text-xl font-semibold text-primary mt-1">Vishwa</p>
          </div>
        </div>
        <p className="text-foreground/75 text-center sm:text-left leading-relaxed mb-6 text-md">
          Driven by passion to build CyberMozhi as a <strong className="font-semibold text-primary">public service platform</strong> for spreading cyber law awareness and digital safety — not just a project, but a <strong className="font-semibold text-accent">purpose</strong>.
        </p>
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-md font-medium text-foreground/70 mb-3">Connect with Vishwa:</span>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
            <Button variant="outline" size="icon" asChild className="text-foreground/70 hover:text-primary hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 group-hover:text-primary group-hover:border-primary">
              <Link href="https://vichu-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" aria-label="Vishwa's Portfolio">
                <SquareArrowOutUpRight className="h-5 w-5 transition-transform duration-200 ease-in-out transform hover:scale-110" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="text-foreground/70 hover:text-primary hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 group-hover:text-primary group-hover:border-primary">
              <Link href="https://github.com/vishwavichu67" target="_blank" rel="noopener noreferrer" aria-label="Vishwa's GitHub">
                <Github className="h-5 w-5 transition-transform duration-200 ease-in-out transform hover:scale-110" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="text-foreground/70 hover:text-primary hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 group-hover:text-primary group-hover:border-primary">
              <Link href="https://www.instagram.com/vi.s.h.w.a_/?igsh=MnltMW11cmp1NTJw" target="_blank" rel="noopener noreferrer" aria-label="Vishwa's Instagram">
                <Instagram className="h-5 w-5 transition-transform duration-200 ease-in-out transform hover:scale-110" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="text-foreground/70 hover:text-primary hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 group-hover:text-primary group-hover:border-primary">
              <Link href="https://www.linkedin.com/in/urlvishwa" target="_blank" rel="noopener noreferrer" aria-label="Vishwa's LinkedIn">
                <Linkedin className="h-5 w-5 transition-transform duration-200 ease-in-out transform hover:scale-110" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild className="text-foreground/70 hover:text-primary hover:border-primary transition-all duration-200 ease-in-out transform hover:scale-110 group-hover:text-primary group-hover:border-primary">
              <Link href="mailto:vishwaceo67@gmail.com" aria-label="Email Vishwa">
                <Mail className="h-5 w-5 transition-transform duration-200 ease-in-out transform hover:scale-110" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

       <section
        className="w-full max-w-4xl mt-12 p-6 bg-destructive/10 rounded-xl shadow-lg border border-destructive/20 animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out"
        style={{ animationDelay: `${(guideSections.length + 1) * 100}ms` }}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl sm:text-2xl font-headline font-semibold text-destructive">Important Disclaimer</h2>
            <p className="text-foreground/70 mt-2 leading-relaxed">
              The information provided on CyberMozhi is for general informational and educational purposes only, and does not constitute legal advice. While we strive to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
            </p>
            <p className="text-foreground/70 mt-3 leading-relaxed">
              For specific legal advice or concerns, please consult with a qualified legal professional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}