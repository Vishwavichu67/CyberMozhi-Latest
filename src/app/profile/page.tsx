
'use client';

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCog, AlertCircle, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  age: z.string().refine(val => val === '' || (/^\d+$/.test(val) && parseInt(val, 10) > 0 && parseInt(val, 10) < 120), {
    message: "Please enter a valid age.",
  }).optional().transform(val => val ? Number(val) : null),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]).optional(),
  preferredLanguage: z.enum(["Tamil", "English", "Both", "Not specified"]).optional(),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed", "Prefer not to say"]).optional(),
  state: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      age: null,
      gender: 'Prefer not to say',
      preferredLanguage: 'Not specified',
      maritalStatus: 'Prefer not to say',
      state: '',
      city: '',
    },
  });

  // Effect to redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);
  
  // Effect to fetch user data
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setIsFetching(true);
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            form.reset({
              displayName: data.displayName || user.displayName || '',
              age: data.age || null,
              gender: data.gender || 'Prefer not to say',
              preferredLanguage: data.preferredLanguage || 'Not specified',
              maritalStatus: data.maritalStatus || 'Prefer not to say',
              state: data.state || '',
              city: data.city || '',
            });
          } else {
            // Pre-fill with Auth data if no Firestore doc exists yet
            form.reset({
              displayName: user.displayName || user.email?.split('@')[0] || '',
              age: null,
              gender: 'Prefer not to say',
              preferredLanguage: 'Not specified',
              maritalStatus: 'Prefer not to say',
              state: '',
              city: '',
            });
          }
        } catch (err: any) {
          console.error("Error fetching user profile:", err);
          let errorMessage = "Could not load your profile data.";
           if (err.code === 'permission-denied') {
              errorMessage = "Permission Denied: Could not read your profile. Please check your Firestore security rules. They should allow a user to read their own document (e.g., 'allow read: if request.auth.uid == userId;').";
          }
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Loading Error",
            description: errorMessage,
          });
        } finally {
            setIsFetching(false);
        }
      };

      fetchProfile();
    }
  }, [user, toast, form]);


  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setIsSaving(true);
    setError(null);
    if (!user) {
      setError("You must be logged in to update your profile.");
      setIsSaving(false);
      return;
    }

    try {
      // The user object from useAuth() is the current authenticated user
      await updateProfile(user, {
        displayName: data.displayName,
      });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: data.displayName,
        email: user.email,
        age: data.age,
        gender: data.gender,
        preferredLanguage: data.preferredLanguage,
        maritalStatus: data.maritalStatus,
        state: data.state,
        city: data.city,
      }, { merge: true });

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      let errorMessage = "Failed to update profile. Please try again.";
      if (err.code === 'permission-denied') {
          errorMessage = "Permission Denied: Could not save your profile. Please check your Firestore security rules. They should allow a user to write to their own document (e.g., 'allow write: if request.auth.uid == userId;').";
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: errorMessage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !user || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-12 animate-in fade-in-0 zoom-in-95 duration-500 ease-out">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <UserCog className="w-10 h-10 text-primary" />
            <div>
              <CardTitle className="text-2xl font-headline">Your Profile</CardTitle>
              <CardDescription>This information helps personalize your experience.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user.email || 'No email found'} disabled className="bg-muted/50"/>
                  <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                </div>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                         <Input type="number" placeholder="Your age" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value)} min="1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tamil">Tamil</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                          <SelectItem value="Not specified">Not specified</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tamil Nadu" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Chennai" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {error && (
                <div className="flex items-center p-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full sm:w-auto text-base py-3 transition-all hover:shadow-lg" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-5 w-5" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
