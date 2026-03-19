
import { lawSummaries, type LawSummary } from '@/data/law-summaries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, AlertTriangle, Gavel, ShieldOff, BookMarked, Landmark, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function LawSummaryCard({ summaryItem, delay = 0 }: { summaryItem: LawSummary, delay?: number }) {
  return (
    <Card
      id={summaryItem.id}
      className="w-full shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out transform hover:scale-105 hover:-rotate-x-1 rounded-lg overflow-hidden flex flex-col h-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <summaryItem.icon className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
          <div>
            <CardTitle className="text-xl font-headline text-primary">{summaryItem.title}</CardTitle>
            <CardDescription className="text-sm text-foreground/70 mt-1">
              {summaryItem.act} {summaryItem.section && `- ${summaryItem.section}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{summaryItem.summary}</p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm font-medium text-primary hover:text-accent py-2 text-left transition-colors duration-200">
              Read More Details
            </AccordionTrigger>
            <AccordionContent className="text-sm text-foreground/70 pt-2 pb-0 leading-relaxed whitespace-pre-line">
              {summaryItem.details}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {summaryItem.penalty && (
        <CardFooter className="p-6 bg-muted/30 border-t mt-auto">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm font-medium text-destructive">
              <span className="font-semibold">Penalty/Note:</span> {summaryItem.penalty}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

interface LawCategory {
  title: string;
  filter: (summary: LawSummary) => boolean;
  icon?: React.ElementType;
}

export default function LawSummariesPage() {
  const categories: LawCategory[] = [
    {
      title: 'Information Technology Act, 2000',
      filter: (s) => s.category === 'IT Act, 2000' || (s.act.includes("IT Act") && !s.category),
      icon: FileText,
    },
    {
      title: 'Indian Penal Code (IPC) - Tech Extensions',
      filter: (s) => s.category === 'Indian Penal Code (IPC)' || (s.act.includes("IPC") && !s.category),
      icon: Gavel,
    },
    {
      title: 'Data Protection & Privacy',
      filter: (s) => s.category === 'Data Protection & Privacy',
      icon: ShieldOff,
    },
    {
      title: 'Other Key Acts & Policies',
      filter: (s) => s.category === 'Other Key Acts & Policies',
      icon: BookMarked,
    },
    {
      title: 'Financial & Transaction Regulations',
      filter: (s) => s.category === 'Financial & Transaction Regulations',
      icon: Landmark,
    },
    {
      title: 'General & Consumer Rights',
      filter: (s) => s.category === 'General & Consumer Rights',
      icon: UsersRound,
    },
    {
      title: 'Special Cybercrime Focus Areas',
      filter: (s) => s.category === 'Special Cybercrime Focus Areas',
      icon: AlertTriangle,
    },
  ];

  const uncategorizedFilter = (s: LawSummary) => !categories.some(cat => cat.filter(s) && s.category === cat.title.split(" (")[0]);


  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-10 text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out">
        <Gavel className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">Indian Cyber Law Summaries</h1>
        <p className="mt-2 text-md sm:text-lg text-foreground/70 max-w-2xl mx-auto">
          Understand key sections of Indian cyber laws and related policies. This information is for educational purposes and not legal advice.
        </p>
      </header>

      {categories.map((category, catIndex) => {
        const summaries = lawSummaries.filter(category.filter);
        if (summaries.length === 0) return null;

        return (
          <section
            key={category.title}
            className="w-full max-w-4xl mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out"
            style={{ animationDelay: `${catIndex * 150 + 200}ms` }}
          >
            <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-6 pb-2 border-b-2 border-primary/30 flex items-center gap-2">
              {category.icon && <category.icon className="w-6 h-6 text-primary" />}
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {summaries.map((summary, summaryIndex) => (
                <LawSummaryCard key={summary.id} summaryItem={summary} delay={summaryIndex * 70} />
              ))}
            </div>
          </section>
        );
      })}

      {(() => {
        const uncategorizedSummaries = lawSummaries.filter(uncategorizedFilter);
        if (uncategorizedSummaries.length > 0) {
          console.warn("Uncategorized law summaries found:", uncategorizedSummaries.map(s => s.title + (s.category ? ` (Category: ${s.category})` : ' (No Category)')));
          return (
            <section
              className="w-full max-w-4xl mb-12 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out"
              style={{ animationDelay: `${categories.length * 150 + 200}ms` }}
            >
              <h2 className="text-2xl font-headline font-semibold text-accent mb-6 pb-2 border-b-2 border-accent/30">
                Other Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {uncategorizedSummaries.map((summary, index) => (
                  <LawSummaryCard key={summary.id} summaryItem={summary} delay={index * 70} />
                ))}
              </div>
            </section>
          );
        }
        return null;
      })()}

    </div>
  );
}
