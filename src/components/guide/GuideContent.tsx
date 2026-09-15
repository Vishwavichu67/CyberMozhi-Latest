"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  AlertTriangle,
  UserCircle,
  Linkedin,
  Github,
  Instagram,
  Mail,
  SquareArrowOutUpRight,
  ArrowUp,
  Sparkles,
  MessageCircle,
  FileText,
  BookOpen,
  ShieldCheck,
  Users,
  LifeBuoy,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuideSection {
  icon: LucideIcon;
  title: string;
  content: string;
  tips: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    icon: MessageCircle,
    title: "AI Chatbot Assistant",
    content:
      "Ask CyberMozhi anything about Indian cyber law, online scams, or digital safety. Every answer streams in live and covers both English and Tamil — toggle which language appears first using the language switch above the chat box. If your question involves a police complaint, FIR, or takedown notice, the assistant can draft one for you inside the chat, ready to review and export.",
    tips: [
      "Toggle Tamil-first mode if you'd rather read Tamil before English in every response.",
      "Tap the microphone icon to ask your question by voice instead of typing.",
      "After each answer, tap one of the suggested follow-up questions to go deeper without retyping.",
      "You'll need to be logged in to use the chatbot — this keeps your chat history saved and private to your account.",
    ],
  },
  {
    icon: FileText,
    title: "Document Drafting & Save as PDF",
    content:
      "When you ask the chatbot to help with an FIR, police complaint, or legal notice, it generates a complete draft directly in the chat. Look for the 'Save as PDF' button on that message — it opens a print-ready version in a new tab and triggers your browser's print dialog automatically, so you just choose 'Save as PDF' as the destination.",
    tips: [
      "Always fill in any [bracketed] placeholders in the draft before submitting it anywhere.",
      "Treat every draft as a starting point — have it reviewed by a professional before filing.",
      "If the print dialog doesn't open automatically, allow pop-ups for this site and try again.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Scam Checker",
    content:
      "Paste a suspicious message, email, or link into the Scam Checker and get an instant AI analysis of whether it looks like a scam, what red flags it contains, and what to do next.",
    tips: [
      "Paste the full message text for the most accurate analysis — partial snippets give partial answers.",
      "Use it before clicking any link or sharing any OTP you weren't expecting.",
      "If it's confirmed as fraud, report it immediately at cybercrime.gov.in or call 1930.",
    ],
  },
  {
    icon: FileText,
    title: "Indian Cyber Law Summaries",
    content:
      "Browse plain-language summaries of key sections from the IT Act 2000, relevant IPC sections, and the Digital Personal Data Protection Act 2023. Each entry explains what the law covers, its real-world implications, and applicable penalties.",
    tips: [
      "Browse by category to find laws relevant to your situation.",
      "These summaries are for educational purposes only, not a substitute for formal legal advice.",
      "If the chatbot cites a law by section number, look it up here for the full picture.",
    ],
  },
  {
    icon: BookOpen,
    title: "Cybersecurity Glossary",
    content:
      "A growing glossary of cybersecurity and cyber-law terms explained in simple language, organized by category for easy browsing.",
    tips: [
      "Use this whenever the chatbot or a law summary uses a term you don't recognize.",
      "Browsing by category is a good way to build broader digital-safety awareness.",
    ],
  },
  {
    icon: Users,
    title: "Cyber Crime Cell Locator",
    content:
      "Find contact details for cyber crime cells across India's states and union territories, sourced from official government listings — useful when you need to report an incident in person or by phone.",
    tips: [
      "Search by your state or union territory to find the nearest cell.",
      "Keep the national helpline (1930) handy as your first call in an active fraud situation.",
    ],
  },
  {
    icon: LogIn,
    title: "Accounts & Chat History",
    content:
      "Create a free account to unlock the AI chatbot and have your conversations saved automatically, so you can pick up where you left off. Guest visitors can browse law summaries, the glossary, cyber cell listings, and the scam checker without logging in.",
    tips: [
      "Use 'Sign Up' in the header to create a free account, or 'Login' if you already have one.",
      "Your past chat sessions are listed in the sidebar once you're logged in.",
      "Keep your account credentials secure and log out on shared devices.",
    ],
  },
  {
    icon: LifeBuoy,
    title: "General Tips for Effective Use",
    content:
      "CyberMozhi is designed to be an empowering resource. Here's how to make the most of it:",
    tips: [
      "In an active emergency (ongoing fraud, threats, harassment), call 1930 first — the chatbot is for guidance, not emergency response.",
      "Start with the tool most relevant to your need: chatbot for guidance, scam checker for a suspicious message, law summaries for legal detail, glossary for terminology.",
      "Cross-reference: if the chatbot mentions a law, look it up in Law Summaries; if it uses an unfamiliar term, check the Glossary.",
      "The platform is actively evolving — check back for new features and expanded content.",
    ],
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://vichu-portfolio.netlify.app/",
    icon: SquareArrowOutUpRight,
    label: "Portfolio",
  },
  { href: "https://github.com/vishwavichu67", icon: Github, label: "GitHub" },
  {
    href: "https://www.instagram.com/vi.s.h.w.a_/?igsh=MnltMW11cmp1NTJw",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/urlvishwa",
    icon: Linkedin,
    label: "LinkedIn",
  },
  { href: "mailto:vishwaceo67@gmail.com", icon: Mail, label: "Email" },
];

export function GuideContent() {
  const sections = GUIDE_SECTIONS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-spy: highlight the section currently in view in the sticky TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  // Back-to-top button visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Ambient floating background blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute top-[-8%] left-[-8%] h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-float-up-down"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-6%] h-80 w-80 rounded-full bg-accent/15 blur-3xl animate-float-left-right"
          style={{ animationDuration: "10s" }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="mb-10 text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out">
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="absolute inset-0 rounded-full bg-primary/25 blur-xl animate-logo-pulse" />
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg rotate-3">
            <Rocket className="w-10 h-10 text-primary-foreground -rotate-3" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
          Site Guide
        </h1>

        <p className="mt-3 text-md sm:text-lg text-foreground/70 max-w-2xl mx-auto">
          Learn how to effectively use CyberMozhi to navigate the world of
          cyber laws and cybersecurity.
        </p>
      </header>

      {/* ── Mobile pill nav ────────────────────────────────────────────── */}
      <div className="lg:hidden w-full max-w-4xl mb-6 -mx-1 px-1 overflow-x-auto">
        <div className="flex gap-2 w-max pb-2">
          {sections.map((s, i) => (
            <button
              key={s.title}
              onClick={() => scrollToSection(i)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                activeIndex === i
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* ── Desktop sticky TOC ───────────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
              On this page
            </p>
            {sections.map((s, i) => (
              <button
                key={s.title}
                onClick={() => scrollToSection(i)}
                className={cn(
                  "relative w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  activeIndex === i
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {activeIndex === i && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
                )}
                <s.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Sections ─────────────────────────────────────────────────── */}
        <div className="space-y-8 min-w-0">
          {sections.map((section, index) => (
            <div
              key={section.title}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              data-index={index}
              className="scroll-mt-24"
            >
              <Card
                className="group relative overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ease-out hover:-translate-y-1 rounded-2xl border-border/60 animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                {/* accent edge */}
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary to-accent opacity-70 group-hover:w-1.5 transition-all duration-300" />

                <CardHeader className="flex flex-row items-start gap-4 p-6 pb-4">
                  <div className="relative flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-background border border-border text-[10px] font-bold text-muted-foreground flex items-center justify-center">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <CardTitle className="text-xl font-headline text-foreground group-hover:text-primary transition-colors duration-300 pt-1.5">
                    {section.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    {section.content}
                  </p>

                  {section.tips && section.tips.length > 0 && (
                    <div className="bg-muted/40 rounded-xl p-4 border border-border/50">
                      <h3 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        Key Tips
                      </h3>
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li
                            key={tipIndex}
                            className="flex items-start gap-2 text-sm text-foreground/70"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* ── Meet the Creator ─────────────────────────────────────── */}
          <section className="group relative w-full mt-4 p-6 sm:p-8 rounded-2xl shadow-xl border border-accent/20 bg-gradient-to-br from-accent/5 via-card to-primary/5 overflow-hidden animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out">
            <div
              aria-hidden
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
            />

            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent blur-md opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-logo-pulse" />
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-primary to-accent p-[3px]">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                    <UserCircle className="w-12 h-12 sm:w-14 sm:h-14 text-accent" />
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 mb-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Creator
                </div>
                <h2 className="text-2xl sm:text-3xl font-headline font-bold text-accent">
                  Meet the Creator
                </h2>
                <p className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-1">
                  Vishwa
                </p>
              </div>
            </div>

            <p className="relative text-foreground/75 text-center sm:text-left leading-relaxed mb-6 text-md">
              Driven by passion to build CyberMozhi as a{" "}
              <strong className="font-semibold text-primary">
                public service platform
              </strong>{" "}
              for spreading cyber law awareness and digital safety — not just
              a project, but a{" "}
              <strong className="font-semibold text-accent">purpose</strong>.
            </p>

            <div className="relative flex flex-col items-center sm:items-start">
              <span className="text-md font-medium text-foreground/70 mb-3">
                Connect with Vishwa:
              </span>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <Button
                    key={s.label}
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full text-foreground/70 hover:text-primary-foreground hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:border-transparent transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Link
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                    >
                      <s.icon className="h-5 w-5" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Disclaimer ───────────────────────────────────────────── */}
          <section className="relative w-full mt-4 p-6 rounded-2xl shadow-lg border border-destructive/30 bg-destructive/5 animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-destructive/20 blur-md" />
                <div className="relative h-12 w-12 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-headline font-semibold text-destructive">
                  Important Disclaimer
                </h2>
                <p className="text-foreground/70 mt-2 leading-relaxed text-sm">
                  The information provided on CyberMozhi is for general
                  informational and educational purposes only, and does not
                  constitute legal advice. While we strive to keep the
                  information up-to-date and correct, we make no
                  representations or warranties of any kind, express or
                  implied, about the completeness, accuracy, reliability,
                  suitability, or availability with respect to the website or
                  the information, products, services, or related graphics
                  contained on the website for any purpose. Any reliance you
                  place on such information is therefore strictly at your own
                  risk.
                </p>
                <p className="text-foreground/70 mt-3 leading-relaxed text-sm">
                  For specific legal advice or concerns, please consult with a
                  qualified legal professional.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Back to top ──────────────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300",
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
}