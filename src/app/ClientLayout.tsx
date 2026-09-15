
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isChatPage = pathname === '/chat';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <Header />

        <main
          className={cn(
            'flex-1 min-h-0 w-full flex flex-col',
            isChatPage
              ? 'overflow-hidden'
              : 'items-center overflow-y-auto'
          )}
        >
          {isChatPage ? (
            children
          ) : (
            <div className="container mx-auto px-4 py-8 w-full">
              {children}
            </div>
          )}
        </main>

        {!isChatPage && <Footer />}

        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}