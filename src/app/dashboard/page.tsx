"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useUser();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleDelete = async (profileId: string) => {
    setShowConfirm({ open: true, id: profileId });
  };
  const confirmDelete = async () => {
    if (!showConfirm.id) return;
    setDeletingId(showConfirm.id);
    setError(null);
    try {
      await supabase.from("brand_outputs").delete().eq("brand_profile_id", showConfirm.id);
      await supabase.from("brand_profiles").delete().eq("id", showConfirm.id);
      setProfiles(profiles.filter(p => p.id !== showConfirm.id));
      setOutputs(outputs.filter(o => o.brand_profile_id !== showConfirm.id));
      toast.success("Profile deleted.");
    } catch (err: any) {
      setError(err.message || "Failed to delete profile.");
      toast.error(err.message || "Failed to delete profile.");
    } finally {
      setDeletingId(null);
      setShowConfirm({ open: false, id: null });
    }
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    Promise.all([
      supabase.from("brand_profiles").select("*" ).eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("brand_outputs").select("*" ).eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("user_payments").select("*" ).eq("user_id", user.id).order("created_at", { ascending: false })
    ]).then(([profilesRes, outputsRes, paymentsRes]) => {
      if (profilesRes.error) setError(profilesRes.error.message);
      else setProfiles(profilesRes.data || []);
      if (outputsRes.error) setError(outputsRes.error.message);
      else setOutputs(outputsRes.data || []);
      if (paymentsRes.error) setError(paymentsRes.error.message);
      else setIsPaid(!!paymentsRes.data?.find((p: any) => p.status === "success"));
      setLoading(false);
    });
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500 py-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 select-none">
              Your Brand Profiles
            </h2>
            <Link href="/brand-quiz">
              <button className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">
                + New Profile
              </button>
            </Link>
          </div>
          {error && <div className="mb-4 text-red-600 text-center animate-shake">{error}</div>}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              <p className="text-lg text-gray-700 dark:text-gray-200">Loading your profiles…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profiles.length === 0 && (
                <div className="col-span-2 text-center text-gray-500 dark:text-gray-300">No profiles found. Create your first brand profile!</div>
              )}
              {profiles.map(profile => {
                const output = outputs.find(o => o.brand_profile_id === profile.id);
                return (
                  <div key={profile.id} className="bg-white/80 dark:bg-gray-900/70 rounded-xl shadow p-6 flex flex-col gap-2 relative">
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 font-bold shadow hover:bg-red-200 dark:hover:bg-red-800 transition"
                      disabled={deletingId === profile.id}
                      title="Delete profile"
                    >
                      {deletingId === profile.id ? "Deleting..." : "Delete"}
                    </button>
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1">Profession</div>
                    <div className="text-lg text-gray-800 dark:text-white font-medium">{profile.profession}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">Created: {new Date(profile.created_at).toLocaleDateString()}</div>
                    <div className="text-xs mt-1">
                      Payment Status: {isPaid ? <span className="text-green-600 font-bold">Paid</span> : <span className="text-yellow-600 font-bold">Free</span>}
                    </div>
                    <div className="mt-2">
                      {output ? (
                        <Link href="/brand-report">
                          <span className="inline-block px-4 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold hover:underline cursor-pointer" title="View report">View Report</span>
                        </Link>
                      ) : (
                        <span className="inline-block px-4 py-1 rounded bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs font-semibold">No Report</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!isPaid && (
            <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-yellow-100 to-pink-100 dark:from-yellow-900 dark:to-pink-900 text-center shadow-lg">
              <div className="text-lg font-bold mb-2 text-yellow-700 dark:text-yellow-200">Upgrade to unlock editing & website export!</div>
              <div className="text-gray-700 dark:text-gray-200 mb-4">You are on the free tier. Upgrade to access premium features.</div>
              <button className="px-6 py-2 rounded-lg font-bold bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-lg font-bold mb-4">Delete Profile?</div>
            <div className="text-gray-700 dark:text-gray-200 mb-6 text-center">Are you sure you want to delete this profile? This cannot be undone.</div>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-lg font-bold bg-red-600 text-white shadow hover:bg-red-700 transition"
                disabled={deletingId === showConfirm.id}
              >
                {deletingId === showConfirm.id ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowConfirm({ open: false, id: null })}
                className="px-6 py-2 rounded-lg font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                disabled={deletingId === showConfirm.id}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
} 