
'use client';

import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable)}>
      <head>
        <title>CyberMozhi</title>
        <meta name="description" content="Your one-stop cybersecurity knowledge center and virtual legal advisor for Indian netizens." />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-body antialiased flex flex-col",
        isChatPage && "h-screen overflow-hidden"
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className={cn(
              "flex-grow w-full flex flex-col items-center",
               isChatPage ? "flex-1 overflow-hidden" : "container mx-auto px-4 py-8"
            )}>
              {children}
            </main>
            {!isChatPage && <Footer />}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
