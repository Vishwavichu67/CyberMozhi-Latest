
"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  MessageCircle,
  BookOpen,
  UserPlus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ScanSearch,
  Shield,
  Rocket,
  BrainCircuit,
  Trophy,
  RefreshCw,
  ChevronRight,
  Scale,
  PhoneCall,
} from "lucide-react";
import { lawSummaries, type LawSummary } from "@/data/law-summaries";
import { glossaryTerms, type GlossaryTerm } from "@/data/glossary-terms";
import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// ── Emergency helplines ──────────────────────────────────────────────────────
const EMERGENCY_CONTACTS = [
  { number: "1930", label: "Cyber Crime" },
  { number: "181", label: "Women Helpline" },
  { number: "1098", label: "Child Helpline" },
  { number: "112", label: "Emergency" },
];

// ── Feature access cards ─────────────────────────────────────────────────────
const featureCards = [
  {
    icon: MessageCircle,
    title: "AI Chatbot",
    description:
      "Bilingual Tamil & English answers to your cyber law questions, instantly.",
    link: "/chat",
  },
  {
    icon: Scale,
    title: "Law Summaries",
    description:
      "Plain-language summaries of the IT Act 2000 and related IPC sections.",
    link: "/law-summaries",
  },
  {
    icon: BookOpen,
    title: "Cyber Glossary",
    description:
      "100+ cybersecurity and legal terms explained without the jargon.",
    link: "/glossary",
  },
  {
    icon: ScanSearch,
    title: "Scam Checker",
    description:
      "Paste a message or link and check whether it looks like a scam.",
    link: "/scam-checker",
  },
  {
    icon: Shield,
    title: "Cyber Cells",
    description:
      "Find the nearest Cyber Crime Cell in any of India's 36 states & UTs.",
    link: "/cyber-cells",
  },
  {
    icon: Rocket,
    title: "Site Guide",
    description:
      "New here? A quick walkthrough of everything CyberMozhi offers.",
    link: "/guide",
  },
];

// ── Quick Quiz — 5 random questions each session ─────────────────────────────
const ALL_QUIZ_QUESTIONS = [
  {
    q: "What does 'Phishing' mean?",
    options: [
      "Catching fish online",
      "Tricking users into revealing personal info",
      "A type of firewall",
      "Encrypting data",
    ],
    correct: 1,
    tip: "Phishing uses fake emails/messages to steal passwords and bank details.",
  },
  {
    q: "Which IT Act section covers Identity Theft?",
    options: ["Section 43", "Section 66A", "Section 66C", "Section 72"],
    correct: 2,
    tip: "Section 66C punishes fraudulent use of someone's electronic signature or password.",
  },
  {
    q: "What is the national cyber crime helpline number?",
    options: ["100", "1930", "1800", "112"],
    correct: 1,
    tip: "Dial 1930 to report cyber crimes and freeze fraudulent transactions immediately.",
  },
  {
    q: "What is 'Ransomware'?",
    options: [
      "A legal term for ransom",
      "Malware that locks your files for payment",
      "A safe backup tool",
      "A type of antivirus",
    ],
    correct: 1,
    tip: "Ransomware encrypts your files and demands payment — never pay the ransom.",
  },
  {
    q: "Where do you officially report cyber crimes in India?",
    options: [
      "police.india.gov.in",
      "cybercrime.gov.in",
      "ncrb.gov.in",
      "mha.nic.in",
    ],
    correct: 1,
    tip: "cybercrime.gov.in is the National Cyber Crime Reporting Portal by MHA.",
  },
  {
    q: "What does Two-Factor Authentication protect against?",
    options: [
      "Slow internet",
      "Unauthorised account access",
      "Data corruption",
      "Spam emails",
    ],
    correct: 1,
    tip: "2FA adds a second verification step making it harder for attackers to access accounts.",
  },
  {
    q: "OTP fraud falls under which IT Act section?",
    options: ["Section 65", "Section 66D", "Section 69", "Section 43A"],
    correct: 1,
    tip: "Section 66D covers cheating by impersonation using computer resources.",
  },
  {
    q: "What should you do FIRST if you lose money to online fraud?",
    options: [
      "Wait and see",
      "Call 1930 immediately",
      "Post on social media",
      "Reset passwords only",
    ],
    correct: 1,
    tip: "Call 1930 immediately — rapid response can freeze the fraudulent transaction.",
  },
  {
    q: "What is 'Sextortion'?",
    options: [
      "A type of encryption",
      "Blackmail using intimate images",
      "A phishing variant",
      "Safe messaging",
    ],
    correct: 1,
    tip: "Sextortion is blackmail using intimate content — report immediately, do not pay.",
  },
  {
    q: "Which act governs personal data protection in India (2023)?",
    options: [
      "IT Act 2000",
      "IPC 1860",
      "DPDP Act 2023",
      "RTI Act 2005",
    ],
    correct: 2,
    tip: "The Digital Personal Data Protection Act 2023 gives Indians rights over their personal data.",
  },
];

function QuickQuizSection() {
  const [questions] = useState(() => {
    const shuffled = [...ALL_QUIZ_QUESTIONS].sort(
      () => Math.random() - 0.5
    );
    return shuffled.slice(0, 5);
  });

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null) return;

      setSelected(idx);

      if (idx === q.correct) {
        setScore((s) => s + 1);
      }
    },
    [selected, q.correct]
  );

  const handleNext = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }, [current, questions.length]);

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Trophy className="h-4 w-4 text-primary" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-foreground font-headline">
            Quick Quiz
          </h3>
          <p className="text-xs text-muted-foreground">
            5 questions · under 2 min
          </p>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        {!finished ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">
                Q{current + 1} of {questions.length}
              </span>

              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-5 rounded-full transition-colors ${
                      i < current
                        ? "bg-green-500"
                        : i === current
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm font-semibold text-foreground mb-3">
              {q.q}
            </p>

            <div className="space-y-1.5 mb-3">
              {q.options.map((opt, i) => {
                let cls =
                  "border-border text-foreground hover:border-primary/50 hover:bg-muted/30 cursor-pointer";

                if (selected !== null) {
                  if (i === q.correct) {
                    cls =
                      "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 cursor-default";
                  } else if (i === selected) {
                    cls =
                      "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 cursor-default";
                  } else {
                    cls =
                      "border-border text-muted-foreground opacity-50 cursor-default";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="bg-muted/50 rounded-lg px-3 py-2 text-xs text-muted-foreground mb-3">
                💡 {q.tip}
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={selected === null}
              size="sm"
              className="w-full gap-2 mt-auto"
            >
              {current < questions.length - 1 ? (
                <>
                  Next <ChevronRight className="h-4 w-4" />
                </>
              ) : (
                "See Results"
              )}
            </Button>
          </>
        ) : (
          <div className="text-center py-2 m-auto">
            <div className="text-4xl mb-2">
              {pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📚"}
            </div>

            <p className="text-xl font-bold text-foreground mb-1">
              {score}/{questions.length} Correct
            </p>

            <p className="text-xs text-muted-foreground mb-4">
              {pct >= 80
                ? "Excellent! You're cyber-safety savvy."
                : pct >= 60
                ? "Good effort! Keep learning."
                : "Keep practising — it matters!"}
            </p>

            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Try Again
              </Button>

              <Button asChild size="sm" className="gap-2">
                <Link href="/chat">
                  Ask AI <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  const [termOfTheDay, setTermOfTheDay] =
    useState<GlossaryTerm | null>(null);

  const [lawOfTheDay, setLawOfTheDay] =
    useState<LawSummary | null>(null);

  const [isDailyContentLoaded, setIsDailyContentLoaded] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() -
        new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );

    const termIndex = dayOfYear % glossaryTerms.length;
    const lawIndex = dayOfYear % lawSummaries.length;

    setTermOfTheDay(glossaryTerms[termIndex]);
    setLawOfTheDay(lawSummaries[lawIndex]);
    setIsDailyContentLoaded(true);
  }, []);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          Loading Your CyberMozhi Experience...
        </p>
      </div>
    );
  }

  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.email?.split("@")[0];

  return (
    <div className="flex flex-col items-center space-y-10 md:space-y-14">
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative w-full py-14 sm:py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out overflow-hidden">
        <ShieldCheck
          className="absolute -top-5 -left-5 h-24 w-24 text-primary/10 animate-float-up-down opacity-70"
          style={{ animationDuration: "5s" }}
        />

        <Sparkles
          className="absolute -bottom-6 -right-6 h-28 w-28 text-accent/10 animate-float-left-right opacity-60"
          style={{ animationDuration: "6s" }}
        />

        <div className="container px-4 md:px-6 relative z-10">
          {/* ── SEO-optimized H1 ──────────────────────────────────────── */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-primary">
            CyberMozhi: India's Cyber Law &amp; Digital Safety AI Assistant
          </h1>

          <p className="mt-4 text-md sm:text-lg text-foreground/80 max-w-2xl mx-auto">
            {isLoggedIn
              ? `Welcome back, ${firstName}! Continue your journey to digital safety and legal awareness.`
              : "Bilingual Tamil & English guidance on Indian cyber law, online scams, and digital safety — powered by AI."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/chat">
                Open Chatbot <MessageCircle className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/scam-checker">
                Check a Scam <ScanSearch className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stat cards */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { value: "43+", label: "Laws" },
              { value: "100+", label: "Terms" },
              { value: "36", label: "Cyber Cells" },
              { value: "24/7", label: "AI" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card/70 backdrop-blur rounded-xl py-3 px-2 border border-border/60"
              >
                <p className="text-xl sm:text-2xl font-bold text-primary font-headline">
                  {stat.value}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Emergency Contacts Bar ────────────────────────────────────── */}
      <section className="w-full container px-4 md:px-6 -mt-4 md:-mt-8">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
          <div className="flex items-center gap-2 text-destructive font-semibold text-sm shrink-0">
            <PhoneCall className="h-4 w-4" />
            Emergency Helplines:
          </div>

          {EMERGENCY_CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-destructive transition-colors"
            >
              <span className="font-bold text-destructive">
                {c.number}
              </span>

              <span className="text-muted-foreground">
                {c.label}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Feature Access Cards ──────────────────────────────────────── */}
      <section className="w-full container px-4 md:px-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out">
        <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-center text-primary mb-8">
          Explore CyberMozhi's Cybersecurity Tools
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feature, index) => (
            <Link
              href={feature.link}
              key={feature.title}
              className="group"
            >
              <Card
                className="h-full flex flex-col shadow-md hover:shadow-xl transition-all duration-300 ease-out transform hover:-translate-y-1 rounded-xl overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-lg font-headline font-semibold text-foreground mb-1.5">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-foreground/70 leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Open <ArrowRight className="ml-1.5 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Today's Learning — 3 column ───────────────────────────────── */}
      <section className="w-full container px-4 md:px-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out">
        <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-center text-primary mb-8">
          Today's Learning
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {!isDailyContentLoaded ? (
            <>
              <Card className="shadow-md rounded-xl p-4">
                <Skeleton className="h-40 w-full" />
              </Card>

              <Card className="shadow-md rounded-xl p-4">
                <Skeleton className="h-40 w-full" />
              </Card>

              <Card className="shadow-md rounded-xl p-4">
                <Skeleton className="h-40 w-full" />
              </Card>
            </>
          ) : (
            <>
              {lawOfTheDay && (
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-xl flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2.5 text-base font-headline text-primary">
                      <Scale className="w-5 h-5" />
                      Law of the Day
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-foreground text-sm">
                      {lawOfTheDay.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1">
                      {lawOfTheDay.act} · {lawOfTheDay.section}
                    </p>

                    <p className="text-xs text-foreground/80 mt-2 line-clamp-3 flex-grow">
                      {lawOfTheDay.summary}
                    </p>

                    <Button
                      asChild
                      variant="link"
                      className="text-primary p-0 h-auto hover:text-accent text-xs mt-3 justify-start"
                    >
                      <Link href={`/law-summaries#${lawOfTheDay.id}`}>
                        Read Full Summary{" "}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {termOfTheDay && (
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-xl flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2.5 text-base font-headline text-accent">
                      <BrainCircuit className="w-5 h-5" />
                      Term of the Day
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow flex flex-col">
                    <h3 className="font-semibold text-foreground text-sm">
                      {termOfTheDay.term}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1">
                      {termOfTheDay.category}
                    </p>

                    <p className="text-xs text-foreground/80 mt-2 line-clamp-3 flex-grow">
                      {termOfTheDay.definition.split(" Example: ")[0]}
                    </p>

                    <Button
                      asChild
                      variant="link"
                      className="text-accent p-0 h-auto hover:text-primary text-xs mt-3 justify-start"
                    >
                      <Link href={`/glossary#${termOfTheDay.id}`}>
                        Learn More{" "}
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <QuickQuizSection />
            </>
          )}
        </div>
      </section>

      {/* ── Guest CTA ──────────────────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="w-full container px-4 md:px-6">
          <div className="bg-accent/10 rounded-xl shadow-lg text-center py-12 md:py-16 px-4">
            <UserPlus className="w-12 h-12 text-accent mx-auto mb-5" />

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-accent mb-3 font-headline">
              Unlock Full Access — It's Free
            </h2>

            <p className="max-w-xl mx-auto text-md text-foreground/80 mb-8">
              Create a free account for personalized AI guidance, saved chats,
              and the complete CyberMozhi experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/signup">
                  Create Free Account{" "}
                  <UserPlus className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-accent text-accent hover:bg-accent/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/login">
                  Login <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Slogan Footer ──────────────────────────────────────────────── */}
      <footer className="py-6 text-center">
        <p className="text-lg sm:text-xl font-semibold text-primary">
          CyberMozhi: Speak Law. Speak Secure. Speak Smart. 💬⚖️🌐
        </p>
      </footer>
    </div>
  );
}