
"use client";

import { useState, useMemo } from 'react';
import { glossaryTerms, type GlossaryTerm } from '@/data/glossary-terms';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function GlossaryItemCard({ termItem, delay = 0 }: { termItem: GlossaryTerm, delay?: number }) {
  const parts = termItem.definition.split(' Example: ');
  const mainDefinition = parts[0];
  const example = parts.length > 1 ? parts.slice(1).join(' Example: ') : null;

  return (
    <Card
      id={termItem.id}
      className="shadow-md hover:shadow-lg transition-transform duration-300 ease-out transform hover:scale-105 hover:-rotate-y-1 rounded-lg overflow-hidden flex flex-col h-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="bg-accent/10 p-4">
        <div className="flex items-center gap-3">
          <termItem.icon className="w-7 h-7 text-accent flex-shrink-0" />
          <CardTitle className="text-lg font-headline text-accent">{termItem.term}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-foreground/80 leading-relaxed">
          {mainDefinition}
          {example && (
            <span className="block mt-2">
              <strong className="text-primary font-semibold">Example:</strong> {example}
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(glossaryTerms.map(term => term.category));
    return ["All", ...Array.from(uniqueCategories)];
  }, []);
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesCategory = activeCategory === "All" || term.category === activeCategory;
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-8 sm:mb-10 text-center animate-in fade-in-0 slide-in-from-top-12 duration-700 ease-out">
        <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary">Cyber Glossary</h1>
        <p className="mt-2 text-md sm:text-lg text-foreground/70 max-w-2xl mx-auto">
          A comprehensive list of cybersecurity and cyber law terms, explained in simple language.
        </p>
      </header>

      <div className="w-full max-w-5xl animate-in fade-in-0 slide-in-from-bottom-8 duration-700 ease-out" style={{ animationDelay: '200ms' }}>
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full shadow-sm"
              aria-label="Search glossary terms"
            />
          </div>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
            <TabsList className="inline-flex h-auto flex-wrap items-center justify-center rounded-md bg-muted p-1 text-muted-foreground sm:h-10 sm:flex-nowrap">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-1.5">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTerms.map((term, index) => (
              <GlossaryItemCard key={term.id} termItem={term} delay={index * 50} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in-0 duration-500 ease-out">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">No terms found.</p>
            <p className="text-muted-foreground mt-1">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
