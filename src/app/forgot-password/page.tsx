
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MailQuestion, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Password reset email sent to ${email}. Please check your inbox (and spam folder).`);
      toast({
        title: 'Email Sent',
        description: `Password reset instructions sent to ${email}.`,
      });
      setEmail(''); // Clear the input field on success
    } catch (err: any) {
      console.error('Password reset error:', err);
      let errorMessage = 'Failed to send password reset email. Please try again.';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
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
          <MailQuestion className="w-12 h-12 text-primary mx-auto mb-3 animate-in fade-in-0 scale-75 duration-700 ease-out delay-100" />
          <CardTitle>Forgot Password?</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4 md:space-y-6">
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
            {error && (
              <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md animate-in fade-in-0 duration-300">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center p-3 text-sm text-green-600 bg-green-500/10 border border-green-500/30 rounded-md animate-in fade-in-0 duration-300">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            <Button type="submit" className="w-full text-base py-3 transition-all hover:shadow-lg" disabled={isLoading || !email}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <MailQuestion className="mr-2 h-5 w-5" />
              )}
              Send Reset Link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
