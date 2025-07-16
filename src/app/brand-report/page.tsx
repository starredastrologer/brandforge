"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditableField from "@/components/EditableField";
import { useRouter } from "next/navigation";
import { Copy, Pencil } from "lucide-react";
import { toast } from "sonner";

const fields = [
  { key: "elevator_pitch", label: "Elevator Pitch" },
  { key: "mission_statement", label: "Mission Statement" },
  { key: "tagline", label: "Tagline" },
  { key: "linkedin_headline", label: "LinkedIn Headline" },
  { key: "linkedin_summary", label: "LinkedIn Summary" },
  { key: "bio_formal", label: "Formal Bio" },
  { key: "bio_casual", label: "Casual Bio" },
];

export default function BrandReportPage() {
  const { user } = useUser();
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false); // TODO: Replace with real payment status
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    supabase
      .from("brand_outputs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOutput(data);
        setLoading(false);
      });
  }, [user]);

  const handleFieldSave = async (key: string, val: string) => {
    if (!output) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase
      .from("brand_outputs")
      .update({ [key]: val })
      .eq("id", output.id);
    if (error) setError(error.message);
    else setOutput({ ...output, [key]: val });
    setLoading(false);
  };

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500 py-8 px-4 md:px-0">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              &larr; Back to Dashboard
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 select-none flex-1">
              Your AI-Generated Brand Report
            </h2>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              <p className="text-lg text-gray-700 dark:text-gray-200">Loading your brand report…</p>
            </div>
          ) : error ? (
            <div className="mb-4 text-red-600 text-center animate-shake">{error}</div>
          ) : output ? (
            <>
              {!isPaid && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-yellow-100 to-pink-100 dark:from-yellow-900 dark:to-pink-900 text-center shadow-lg">
                  <div className="text-lg font-bold mb-2 text-yellow-700 dark:text-yellow-200">Upgrade to unlock editing & website export!</div>
                  <div className="text-gray-700 dark:text-gray-200 mb-2">You are on the free tier. Upgrade to access premium features.</div>
                  <button className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    Upgrade Now
                  </button>
                </div>
              )}
              <div className="flex flex-col gap-8">
                {fields.map(f => (
                  <div key={f.key} className="bg-white/80 dark:bg-gray-900/70 rounded-xl shadow p-6 flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">{f.label}</span>
                      <button
                        onClick={() => handleCopy(f.label, output[f.key] || "")}
                        className="ml-1 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                        title={`Copy ${f.label}`}
                      >
                        <Copy className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <EditableField
                        value={output[f.key] || ""}
                        label={""}
                        onSave={val => handleFieldSave(f.key, val)}
                      />
                      <span className="ml-1 text-gray-400 cursor-pointer" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-300">No brand report found. Complete the quiz to generate your brand!</div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 