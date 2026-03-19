
"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MessageCircle,
  FileText,
  BookOpen,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Lightbulb,
  ScrollText,
  FileLock,
  KeyRound,
  FileSignature,
  UserCircle2,
  ShieldCheck,
  Network as NetworkIcon,
  ClipboardCheck,
  Scale,
  BrainCircuit
} from "lucide-react";
import { lawSummaries, type LawSummary } from "@/data/law-summaries";
import { glossaryTerms, type GlossaryTerm } from "@/data/glossary-terms";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const sampleTopics = [
  { name: "Phishing Attacks", icon: UserPlus, description: "Learn to identify and avoid deceptive emails and messages.", link: "/glossary#1" },
  { name: "Ransomware Threats", icon: FileLock, description: "Understand how ransomware works and how to protect your data.", link: "/glossary#10" },
  { name: "IT Act: Section 66C", icon: KeyRound, description: "Identity theft and its legal consequences under Indian law.", link: "/law-summaries#3" },
  { name: "Digital Signatures", icon: FileSignature, description: "The role and legality of digital signatures in India.", link: "/glossary#33" },
];

const coreFeatures = [
  {
    icon: MessageCircle,
    title: "AI Chatbot Assistant",
    description: "Get instant, bilingual (Tamil & English) answers to your cyber law and security questions. Understand complex terms and mitigation techniques.",
    link: "/chat",
    linkText: "Ask AI Now",
  },
  {
    icon: FileText,
    title: "Indian Cyber Law Summaries",
    description: "Explore concise summaries of key sections from the Indian IT Act 2000 and relevant IPC sections. Know your rights and legal remedies.",
    link: "/law-summaries",
    linkText: "Explore Laws",
  },
  {
    icon: BookOpen,
    title: "Cybersecurity Glossary",
    description: "Demystify complex cybersecurity and legal jargon with our layman-friendly glossary. Enhance your digital literacy.",
    link: "/glossary",
    linkText: "Browse Glossary",
  },
];


export default function HomePage() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  
  const [termOfTheDay, setTermOfTheDay] = useState<GlossaryTerm | null>(null);
  const [lawOfTheDay, setLawOfTheDay] = useState<LawSummary | null>(null);
  const [isDailyContentLoaded, setIsDailyContentLoaded] = useState(false);

  useEffect(() => {
    // This logic now runs only on the client, after hydration
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    
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
        <p className="mt-4 text-lg text-muted-foreground">Loading Your CyberMozhi Experience...</p>
      </div>
    );
  }

  // Common "Of the Day" section
  const OfTheDaySection = () => (
    <section className="w-full container px-4 md:px-6 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '400ms' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {!isDailyContentLoaded ? (
          <>
            <Card className="shadow-lg rounded-lg flex flex-col p-4"><Skeleton className="h-32 w-full" /></Card>
            <Card className="shadow-lg rounded-lg flex flex-col p-4"><Skeleton className="h-32 w-full" /></Card>
          </>
        ) : (
          <>
            {lawOfTheDay && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:-rotate-y-1 rounded-lg flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-headline text-primary">
                      <Scale className="w-7 h-7" />
                      Law of the Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="font-semibold text-foreground">{lawOfTheDay.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{lawOfTheDay.act} - {lawOfTheDay.section}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{lawOfTheDay.summary}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button asChild variant="link" className="text-primary p-0 h-auto hover:text-accent text-sm">
                      <Link href={`/law-summaries#${lawOfTheDay.id}`}>
                        Read Full Summary <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
            )}
            {termOfTheDay && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-y-1 rounded-lg flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl font-headline text-accent">
                      <BrainCircuit className="w-7 h-7" />
                      Term of the Day
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="font-semibold text-foreground">{termOfTheDay.term}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{termOfTheDay.category}</p>
                    <p className="text-sm text-foreground/80 mt-2 line-clamp-3">{termOfTheDay.definition.split(' Example: ')[0]}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button asChild variant="link" className="text-accent p-0 h-auto hover:text-primary text-sm">
                      <Link href={`/glossary#${termOfTheDay.id}`}>
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
            )}
          </>
        )}
      </div>
    </section>
  );

  // Guest User View
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center space-y-12 md:space-y-16">
        {/* Hero Section for Guests */}
        <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out overflow-hidden">
          
          <ShieldCheck className="absolute -top-5 -left-5 h-24 w-24 text-primary/10 animate-float-up-down opacity-70" style={{ animationDuration: '5s', animationDelay: '0.2s' }} />
          <NetworkIcon className="absolute -bottom-8 -right-8 h-32 w-32 text-accent/10 animate-float-left-right opacity-60" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />

          <div className="container px-4 md:px-6 relative z-10">
            <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-6 animate-pulse delay-300" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-primary font-headline">
              Welcome to CyberMozhi! வணக்கம்!
            </h1>
            <p className="mt-4 text-md sm:text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
              Your AI-powered bilingual (Tamil & English) assistant for understanding Indian cyber laws, online threats, cybersecurity best practices, and legal remedies.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out" style={{ animationDelay: '200ms' }}>
                <Link href="/chat">
                  Try AI Chatbot (Limited Access) <MessageCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out" style={{ animationDelay: '300ms' }}>
                <Link href="/law-summaries">
                  Explore Cyber Laws <FileText className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What You Can Learn Section */}
        <OfTheDaySection />
        
        {/* Core Features Section for Guests */}
        <section className="w-full py-12 md:py-16 bg-background animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '600ms' }}>
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-center text-primary mb-12 font-headline">
              Explore Our Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="flex flex-col shadow-lg hover:shadow-xl transition-transform duration-300 ease-out transform hover:scale-105 hover:rotate-y-1 rounded-lg overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
                  style={{ animationDelay: `${index * 100 + 700}ms` }}
                >
                  <CardHeader className="bg-primary/5 p-6">
                    <div className="flex items-center gap-4">
                      <feature.icon className="w-10 h-10 text-primary" />
                      <CardTitle className="text-xl font-headline text-primary">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <CardDescription className="text-foreground/70 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    <Button asChild variant="link" className="text-primary p-0 h-auto hover:text-accent transition-colors duration-200">
                      <Link href={feature.link}>
                        {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Unlock Full Potential Section */}
        <section className="w-full py-12 md:py-20 bg-accent/10 rounded-xl shadow-lg text-center animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '800ms' }}>
          <div className="container px-4 md:px-6">
            <LogIn className="w-12 h-12 text-accent mx-auto mb-6 animate-pulse delay-500" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-accent mb-4 font-headline">
              Unlock CyberMozhi's Full Potential
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-md sm:text-lg text-foreground/80">
              Create a free account or login to get personalized advice from our AI and an enhanced user experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out" style={{ animationDelay: '900ms' }}>
                <Link href="/signup">
                  Create Free Account <UserPlus className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 border-accent text-accent hover:bg-accent/20 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out" style={{ animationDelay: '1000ms' }}>
                <Link href="/login">
                  Login to Your Account <LogIn className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Logged-in User View
  return (
    <div className="flex flex-col items-center space-y-12">
      {/* Personalized Greeting */}
      <section className="w-full py-10 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl shadow-md animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out">
        <div className="container px-4 md:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold text-primary">
            Vanakkam, {user?.displayName || user?.email?.split('@')[0]}!
          </h1>
          <p className="mt-3 text-md sm:text-lg text-foreground/80">
            Welcome back to CyberMozhi. Let's continue your journey to digital safety and legal awareness.
          </p>
        </div>
      </section>

      {/* Of the Day section for logged-in users */}
      <OfTheDaySection />

      {/* Quick Access to Core Features */}
      <section className="w-full container px-4 md:px-6 py-10 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '200ms' }}>
         <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-center text-primary mb-12">
            Quick Access to Resources
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card
                key={feature.title}
                className="flex flex-col shadow-lg hover:shadow-xl transition-transform duration-300 ease-out transform hover:scale-105 hover:rotate-y-1 rounded-lg overflow-hidden animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
                style={{ animationDelay: `${index * 100 + 300}ms` }}
              >
                <CardHeader className="bg-primary/5 p-6">
                  <div className="flex items-center gap-4">
                    <feature.icon className="w-10 h-10 text-primary" />
                    <CardTitle className="text-xl font-headline text-primary">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <CardDescription className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button asChild className="w-full transition-shadow hover:shadow-md">
                    <Link href={feature.link}>
                      {feature.linkText} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
      </section>


      {/* Full AI Chatbot Access Section */}
      <section className="w-full py-12 md:py-16 bg-accent/10 rounded-xl shadow-lg animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '400ms' }}>
        <div className="container px-4 md:px-6 text-center">
          <MessageCircle className="w-12 h-12 text-accent mx-auto mb-6 animate-pulse delay-700" />
          <h2 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-accent">
            Your AI Legal & Cyber Guide Awaits
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-md sm:text-lg text-foreground/80">
            Leverage the full power of CyberMozhi's bilingual AI. Get detailed explanations on cyber laws, IT Act sections, penalties, attack mitigation, and guidance on filing complaints.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              <Link href="/chat">
                Chat with CyberMozhi AI <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Slogan */}
      <footer className="py-10 text-center animate-in fade-in-0 duration-700 ease-out" style={{ animationDelay: '500ms' }}>
        <p className="text-lg sm:text-xl font-semibold text-primary">CyberMozhi: Speak Law. Speak Secure. Speak Smart. 💬⚖️🌐</p>
      </footer>
    </div>
  );
}
