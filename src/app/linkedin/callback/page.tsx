"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/components/AuthProvider";

export default function LinkedInCallbackPage() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!user) {
      setStatus("error");
      setError("You must be signed in to connect LinkedIn.");
      return;
    }
    if (!code) {
      setStatus("error");
      setError("Missing authorization code from LinkedIn.");
      return;
    }

    // Get Supabase access token from localStorage/session (client-side)
    const projectRef = "qxnvputzunmupdnrfvny";
    const supaSession = window.localStorage.getItem(`sb-${projectRef}-auth-token`);
    const supaToken = supaSession ? JSON.parse(supaSession).access_token : null;
    if (!supaToken) {
      setStatus("error");
      setError("Missing Supabase access token. Please sign out and sign in again.");
      return;
    }

    fetch(`/api/linkedin/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || "")}`, {
      headers: {
        Authorization: `Bearer ${supaToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Unknown error");
        }
        return res.json();
      })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/profile"), 1500);
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
  }, [searchParams, user, router]);

  if (status === "loading") return <div className="p-8 text-center">Connecting to LinkedIn...</div>;
  if (status === "error") return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  return <div className="p-8 text-center text-green-600">LinkedIn connected! Redirecting to your profile...</div>;
} 