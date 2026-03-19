
'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/'); // Redirect to home page after successful login
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to login. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 animate-in fade-in-0 zoom-in-95 duration-500 ease-out">
      <Card className="w-full max-w-md shadow-xl glassmorphic">
        <CardHeader className="text-center">
          <LogIn className="w-12 h-12 text-primary mx-auto mb-3 animate-in fade-in-0 scale-75 duration-700 ease-out delay-100" />
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>Sign in to your CyberMozhi account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" passHref>
                  <span className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</span>
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="text-base pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {error && (
              <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md animate-in fade-in-0 duration-300">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full text-base py-3 transition-all hover:shadow-lg" disabled={isLoading || !email || !password}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
