
'use client';

import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isLoggedIn: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  const value = { user, loading, isLoggedIn };
  
  return (
    <AuthContext.Provider value={value}>
      {loading ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
