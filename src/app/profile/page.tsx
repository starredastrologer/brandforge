"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/AuthProvider";
import LinkedInConnect from "@/components/LinkedInConnect";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user } = useUser();
  const [linkedin, setLinkedin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("user_linkedin_data")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLinkedin(null);
          setError(error ? error.message : "No LinkedIn data found");
        } else {
          setLinkedin(data);
          setError(null);
        }
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow text-center">Please sign in to view your profile.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      {loading ? (
        <div>Loading LinkedIn data…</div>
      ) : error && !linkedin ? (
        <div>
          <div className="mb-4 text-gray-600">No LinkedIn data found.</div>
          <LinkedInConnect />
        </div>
      ) : linkedin ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
              {linkedin.profile?.localizedFirstName?.[0] || user.email[0].toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-semibold">{linkedin.profile?.localizedFirstName} {linkedin.profile?.localizedLastName}</div>
              <div className="text-gray-600">{linkedin.profile?.headline}</div>
              <div className="text-gray-500 text-sm">{linkedin.email}</div>
            </div>
          </div>
          <div>
            <h2 className="font-bold mb-2">Recent LinkedIn Posts</h2>
            {linkedin.posts?.elements?.length ? (
              <ul className="space-y-2">
                {linkedin.posts.elements.slice(0, 5).map((post: any, i: number) => (
                  <li key={post.id || i} className="p-3 bg-gray-50 rounded border border-gray-100">
                    <div className="text-gray-800 text-sm">
                      {post.specificContent?.com.linkedin.ugc.ShareContent?.shareCommentary?.text || "(No text)"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{post.created?.time && new Date(post.created.time).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No recent posts found.</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
} 