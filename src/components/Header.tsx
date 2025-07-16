"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/AuthProvider";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) router.push("/dashboard");
    else router.push("/");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const initials = user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-gray-900/80 shadow-sm fixed top-0 left-0 z-40 backdrop-blur">
      {/* Logo */}
      <button
        aria-label="Go to home"
        onClick={handleLogoClick}
        className="flex items-center gap-2 group"
      >
        {/* Simple SVG logo */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#6366F1"/>
          <path d="M10 22L16 10L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="16" cy="19" r="1.5" fill="white"/>
        </svg>
        <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight group-hover:text-indigo-600 transition">BrandForge</span>
      </button>
      {/* Profile section */}
      <div className="relative">
        {user ? (
          <button
            className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => setDropdown(d => !d)}
            aria-label="Open profile menu"
          >
            {initials}
          </button>
        ) : (
          <Link href="/login" className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition">Sign In</Link>
        )}
        {/* Dropdown menu */}
        {user && dropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
            <button
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => { setDropdown(false); router.push("/profile"); }}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={() => { setDropdown(false); router.push("/dashboard"); }}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 