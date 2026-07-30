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
      {/*
        KEY FIXES vs original:
        1. body always has h-screen overflow-hidden (not conditional) so
           flex children can use h-full reliably on all screen sizes
        2. main uses flex-1 min-h-0 instead of flex-grow (min-h-0 allows
           flex children to shrink — without it, footer gets pushed off screen)
        3. Removed items-center from main on chat page (it breaks full-width layout)
      */}
      <body
        suppressHydrationWarning
        className={cn(
          'h-screen overflow-hidden bg-background font-body antialiased flex flex-col',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className={cn(
              'flex-1 min-h-0 w-full flex flex-col',
              isChatPage
                ? 'overflow-hidden'
                : 'items-center overflow-y-auto'
            )}>
              {isChatPage ? children : (
                <div className="container mx-auto px-4 py-8 w-full">
                  {children}
                </div>
              )}
            </main>
            {!isChatPage && <Footer />}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}