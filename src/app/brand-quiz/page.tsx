"use client";
import QuizForm from "@/components/QuizForm";
import { useUser } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

export default function BrandQuizPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Save quiz answers to brand_profiles
      const { data: profile, error: insertError } = await supabase.from("brand_profiles").insert({
        user_id: user?.id,
        ...data,
        created_at: new Date().toISOString(),
      }).select().single();
      if (insertError) throw insertError;
      // 2. Get the user's access token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      // 3. Call the AI brand generation API with the token
      const res = await fetch("/api/generate-brand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          user_id: user?.id,
          brand_profile_id: profile.id,
          ...data,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "AI generation failed");
      toast.success("Brand report generated!");
      // 4. Redirect to brand report
      router.push("/brand-report");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500 py-8">
        <div className="w-full max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 select-none">
            Brand Discovery Quiz
          </h2>
          {error && <div className="mb-4 text-red-600 text-center animate-shake">{error}</div>}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              <p className="text-lg text-gray-700 dark:text-gray-200">Generating your brand report…</p>
            </div>
          ) : (
            <QuizForm onSubmit={handleSubmit} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 