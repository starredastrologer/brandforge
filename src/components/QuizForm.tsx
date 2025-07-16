"use client";
import { useState } from "react";

const questions = [
  {
    label: "What is your profession?",
    name: "profession",
    type: "text",
    placeholder: "e.g. Product Manager, Designer, Developer",
    required: true,
  },
  {
    label: "What are your core values?",
    name: "values",
    type: "text",
    placeholder: "e.g. Creativity, Integrity, Growth",
    required: true,
  },
  {
    label: "Who is your target audience?",
    name: "audience",
    type: "text",
    placeholder: "e.g. Tech recruiters, Startup founders, Clients",
    required: true,
  },
  {
    label: "What tone best fits your brand?",
    name: "tone",
    type: "select",
    options: ["Formal", "Witty", "Casual", "Professional"],
    required: true,
  },
  {
    label: "What are your main career or personal goals?",
    name: "goals",
    type: "text",
    placeholder: "e.g. Land a new job, grow my network, build authority",
    required: true,
  },
  {
    label: "Anything else you'd like the AI to know? (optional)",
    name: "extra",
    type: "textarea",
    placeholder: "Share any context, achievements, or preferences...",
    required: false,
  },
];

export default function QuizForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({});
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[step];
  const total = questions.length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [current.name]: e.target.value });
    setTouched(true);
    setError(null);
  };

  const handleNext = () => {
    if (current.required && !form[current.name]) {
      setError("This field is required.");
      return;
    }
    setStep(s => s + 1);
    setTouched(false);
    setError(null);
  };

  const handlePrev = () => {
    setStep(s => s - 1);
    setTouched(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (current.required && !form[current.name]) {
      setError("This field is required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <form
      onSubmit={step === total - 1 ? handleSubmit : e => { e.preventDefault(); handleNext(); }}
      className="w-full max-w-lg mx-auto p-6 bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-xl flex flex-col gap-8 animate-fade-in"
    >
      <div className="flex items-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-200 dark:bg-gray-700"}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 animate-slide-in">
        <label className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
          {current.label}
        </label>
        {current.type === "text" && (
          <input
            type="text"
            name={current.name}
            placeholder={current.placeholder}
            value={form[current.name] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm"
            autoFocus
          />
        )}
        {current.type === "textarea" && (
          <textarea
            name={current.name}
            placeholder={current.placeholder}
            value={form[current.name] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm min-h-[80px]"
          />
        )}
        {current.type === "select" && (
          <select
            name={current.name}
            value={form[current.name] || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm"
          >
            <option value="" disabled>Select a tone…</option>
            {current.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}
        {error && <p className="text-red-600 text-sm animate-shake mt-1">{error}</p>}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
        >
          Back
        </button>
        {step === total - 1 ? (
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Next
          </button>
        )}
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-slide-in {
          animation: slideIn 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
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
    </form>
  );
}
