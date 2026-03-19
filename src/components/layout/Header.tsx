
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Gavel, BookOpen, Menu, LogIn, LogOut, Rocket, Loader2, UserCog, Home, FileSignature } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from './ThemeToggle';


const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'AI Chatbot', icon: MessageCircle },
  { href: '/law-summaries', label: 'Law Summaries', icon: Gavel },
  { href: '/glossary', label: 'Cyber Glossary', icon: BookOpen },
  { href: '/guide', label: 'Site Guide', icon: Rocket },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'Could not log you out. Please try again.',
      });
    }
  };

  const NavLink = ({ href, label, icon: Icon, isMobile = false }: { href: string, label: string, icon: React.ElementType, isMobile?: boolean }) => (
    <Link
      href={href}
      onClick={() => {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }}
      className={cn(
        "group flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-out",
        isMobile ? "px-3 py-2 rounded-md" : "",
        pathname === href
          ? "text-primary" + (isMobile ? " bg-primary/10" : "")
          : "text-foreground/70 hover:text-primary",
        "focus:outline-none rounded-md"
      )}
      aria-current={pathname === href ? "page" : undefined}
    >
      <Icon className={cn(
          "h-5 w-5 transition-transform duration-200 ease-out",
          pathname !== href ? "group-hover:scale-110" : ""
      )} />
      <span>{label}</span>
    </Link>
  );

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.split(' ').filter(Boolean);
      if (parts.length > 1) {
          return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '');
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      const emailPart = email.split('@')[0];
      return emailPart.slice(0, 2).toUpperCase();
    }
    return 'U';
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="CyberMozhi Logo"
              width={56}
              height={56}
              className="transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-full"
            />
          </Link>
        </div>
        
        <nav className="hidden md:flex flex-1 items-center justify-center gap-x-8">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {authLoading ? (
            <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
              <Loader2 className="h-5 w-5 animate-spin" />
            </Button>
          ) : isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {getInitials(user.displayName, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/profile">
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="hidden md:block">
                <Button asChild variant="default" size="sm" className="transition-shadow hover:shadow-md">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                    </Link>
                </Button>
             </div>
          )}
        
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-0 bg-background flex flex-col">
                <SheetHeader className="p-4 border-b">
                   <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                   <Link
                      href="/"
                      className="group flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                     <Image
                        src="/logo.png"
                        alt="CyberMozhi Logo"
                        width={48}
                        height={48} 
                        className="transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-full"
                      />
                  </Link>
                </SheetHeader>

                <nav className="flex-grow p-4 space-y-2">
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isMobile={true} />
                  ))}
                </nav>

                 <div className="p-4 border-t mt-auto">
                  {authLoading ? (
                       <div className="flex items-center justify-center p-2">
                         <Loader2 className="h-6 w-6 animate-spin" />
                       </div>
                  ): isLoggedIn && user ? (
                     <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-3">
                           <Avatar className="h-10 w-10">
                             <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                               {getInitials(user.displayName, user.email)}
                             </AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <p className="text-sm font-medium leading-none truncate">
                              {user.displayName || user.email?.split('@')[0]}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                       <Button asChild variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                         <Link href="/profile">
                           <UserCog className="mr-2 h-4 w-4" /> Profile
                         </Link>
                       </Button>
                      <Button onClick={handleLogout} variant="destructive" className="w-full transition-shadow hover:shadow-md">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <Button asChild variant="default" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
