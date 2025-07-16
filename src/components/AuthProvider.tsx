"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  // Add other user fields as needed
}

interface LinkedInData {
  profile: any;
  email: string;
  posts: any;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  linkedinData: LinkedInData | null;
  setLinkedinData: (data: LinkedInData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthProvider] onAuthStateChange event:", event, session);
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    // Check for existing user on mount
    supabase.auth.getUser().then(({ data: { user: supaUser } }) => {
      console.log("[AuthProvider] Supabase user on mount:", supaUser);
      if (supaUser) {
        setUser({ id: supaUser.id, email: supaUser.email || "" });
      }
      setLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, linkedinData, setLinkedinData, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
} 