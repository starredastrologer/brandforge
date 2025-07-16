import React from "react";

export default function LinkedInConnect() {
  const handleConnect = () => {
    window.location.href = "/api/linkedin/auth";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Connect your LinkedIn</h2>
      <p className="mb-4 text-gray-700">
        To build your personal brand strategy, we need to analyze your professional profile.
        <br />
        <strong>We will fetch your public profile, experience, and post history via the official LinkedIn API.</strong>
        <br />
        We never store your password and will not post on your behalf.
      </p>
      <button
        onClick={handleConnect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Connect LinkedIn
      </button>
    </div>
  );
} 