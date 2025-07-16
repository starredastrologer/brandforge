"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    // On success, Supabase will redirect automatically
  };

  // Dark mode toggle (simple for demo)
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark(d => !d);

  return (
    <div className={
      `min-h-screen flex items-center justify-center transition-colors duration-500 ${dark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" : "bg-gradient-to-br from-blue-100 via-white to-purple-100"}`
    }>
      <button
        aria-label="Toggle dark mode"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md shadow hover:scale-110 transition"
        onClick={toggleDark}
        style={{ zIndex: 10 }}
      >
        {dark ? (
          <span role="img" aria-label="Light">🌞</span>
        ) : (
          <span role="img" aria-label="Dark">🌙</span>
        )}
      </button>
      <div className={
        `w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-white/20 ${dark ? "bg-white/10" : "bg-white/60"} flex flex-col gap-6 animate-fade-in`
      }>
        <h1 className="text-3xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 select-none">
          Welcome to BrandForge
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-900 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-900 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg hover:scale-[1.03] active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/40 to-transparent" />
          <span className="text-xs text-gray-500 dark:text-gray-300">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400/40 to-transparent" />
        </div>
        <button
          onClick={handleGoogle}
          className="w-full py-2 rounded-lg font-semibold bg-white text-gray-800 shadow-lg border border-gray-200 hover:scale-[1.03] active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white dark:border-gray-700"
          disabled={loading}
          aria-label="Sign in with Google"
        >
          <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.46 7.82 2.68l5.77-5.77C34.36 3.54 29.64 1.5 24 1.5 14.82 1.5 6.98 7.82 3.68 16.02l6.91 5.36C12.18 15.18 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9.24h12.42c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.6C43.82 37.18 46.1 31.36 46.1 24.5z"/><path fill="#FBBC05" d="M10.59 28.14A14.48 14.48 0 019.5 24c0-1.44.24-2.84.66-4.14l-6.91-5.36A23.94 23.94 0 001.5 24c0 3.82.92 7.42 2.54 10.5l7.18-5.6z"/><path fill="#EA4335" d="M24 46.5c6.48 0 11.92-2.14 15.9-5.82l-7.18-5.6c-2.02 1.36-4.6 2.18-7.72 2.18-6.38 0-11.82-5.68-13.41-13.14l-7.18 5.6C6.98 40.18 14.82 46.5 24 46.5z"/></g></svg>
          {loading ? "Redirecting…" : "Sign in with Google"}
        </button>
        <p className="text-xs text-center text-gray-500 dark:text-gray-300 mt-2 select-none">
          <span className="font-semibold">Note:</span> Google SSO must be enabled in your Supabase Auth settings for this to work.
        </p>
        {error && <p className="mt-2 text-red-600 text-center animate-shake">{error}</p>}
        <p className="text-xs text-center text-gray-500 dark:text-gray-300 mt-4 select-none">
          By signing in, you agree to our <a href="#" className="underline hover:text-blue-600">Terms</a> and <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
        </p>
      </div>
      <style jsx global>{`
        html.dark {
          background: #18181b;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-shake {
          animation: shake 0.3s linear;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
} 