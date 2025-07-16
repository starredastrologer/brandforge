"use client";
import { useState } from "react";
import { toast } from "sonner";

interface EditableFieldProps {
  value: string;
  label: string;
  onSave: (val: string) => Promise<void>;
}

export default function EditableField({ value, label, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onSave(input);
      setSuccess(true);
      toast.success("Saved!");
      setTimeout(() => setSuccess(false), 1200);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to save");
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-300 mb-1 flex items-center gap-2">
        {label}
        {success && <span className="text-green-500 text-xs">Saved!</span>}
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            className="w-full px-3 py-2 rounded border border-blue-400 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 transition-all duration-200 outline-none shadow-sm"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
            disabled={loading}
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            ) : "Save"}
          </button>
          <button
            onClick={() => { setEditing(false); setInput(value); }}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            disabled={loading}
          >Cancel</button>
        </div>
      ) : (
        <div
          className="text-lg text-gray-800 dark:text-white font-medium whitespace-pre-line cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 rounded px-2 py-1 transition"
          onClick={() => setEditing(true)}
          tabIndex={0}
          onKeyDown={e => { if (e.key === "Enter") setEditing(true); }}
        >
          {value || <span className="italic text-gray-400">Not generated</span>}
        </div>
      )}
    </div>
  );
}
