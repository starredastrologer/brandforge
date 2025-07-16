"use client";
import Link from "next/link";
import { useState } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark(d => !d);

  return (
    <div className={
      `min-h-screen flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${dark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" : "bg-gradient-to-br from-blue-100 via-white to-purple-100"}`
    }>
      {/* Shooting Stars Background */}
      <ShootingStars
        starColor="#9E00FF"
        trailColor="#2EB9DF"
        minSpeed={15}
        maxSpeed={35}
        minDelay={1000}
        maxDelay={3000}
        className="pointer-events-none z-0"
      />
      <ShootingStars
        starColor="#FF0099"
        trailColor="#FFB800"
        minSpeed={10}
        maxSpeed={25}
        minDelay={2000}
        maxDelay={4000}
        className="pointer-events-none z-0"
      />
      <ShootingStars
        starColor="#00FF9E"
        trailColor="#00B8FF"
        minSpeed={20}
        maxSpeed={40}
        minDelay={1500}
        maxDelay={3500}
        className="pointer-events-none z-0"
      />
      {/* Main Content */}
      <button
        aria-label="Toggle dark mode"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md shadow hover:scale-110 transition z-20"
        onClick={toggleDark}
        style={{ zIndex: 10 }}
      >
        {dark ? (
          <span role="img" aria-label="Light">🌞</span>
        ) : (
          <span role="img" aria-label="Dark">🌙</span>
        )}
      </button>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-12 md:py-24 relative z-10">
        <div className="w-full max-w-2xl p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/20 bg-white/60 dark:bg-white/10 flex flex-col items-center gap-8 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold tracking-widest shadow">AI-POWERED PERSONAL BRANDING</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 select-none">
              Craft Your Standout Online Identity
            </h1>
            <p className="text-lg md:text-xl text-center text-gray-700 dark:text-gray-200 max-w-xl">
              BrandForge helps professionals discover, generate, and launch their personal brand with AI. Take the quiz, get a custom brand strategy, and unlock your next career move.
            </p>
          </div>
          <Link href="/login" className="group mt-4">
            <button className="px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2 animate-bounce-once">
              Get Started
              <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </Link>
          <div className="w-full flex justify-center mt-8">
            {/* Modern SVG illustration */}
            <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
              <ellipse cx="110" cy="100" rx="90" ry="15" fill="#a5b4fc" fillOpacity="0.2" />
              <rect x="60" y="20" width="100" height="60" rx="18" fill="#6366f1" fillOpacity="0.15" />
              <rect x="80" y="35" width="60" height="30" rx="10" fill="#6366f1" fillOpacity="0.25" />
              <circle cx="110" cy="50" r="18" fill="#6366f1" fillOpacity="0.4" />
              <circle cx="110" cy="50" r="10" fill="#a5b4fc" fillOpacity="0.7" />
            </svg>
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 text-xs text-gray-500 dark:text-gray-300 select-none relative z-10">
        &copy; {new Date().getFullYear()} BrandForge. Crafted with <span className="text-pink-500">♥</span> for modern professionals.
      </footer>
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
        .animate-bounce-once {
          animation: bounceOnce 0.7s cubic-bezier(.4,0,.2,1) 1;
        }
        @keyframes bounceOnce {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          50% { transform: scale(0.97); }
          70% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
