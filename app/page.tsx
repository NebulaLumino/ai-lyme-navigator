"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result || data.text || JSON.stringify(data));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">AI Lyme Navigator</h1>
            <p className="text-xs text-gray-400">Stages, testing, treatment & PTLD guidance</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-lime-500/15 text-lime-400 border border-lime-500/20 font-medium">lime</span>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Your Guide Through Lyme Disease</h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
            Enter your symptoms, timeline, test results, or treatment history. The AI will help identify possible disease stages, explain testing options (ELISA, Western Blot, PCR, tick testing), and guide you through evidence-based treatment approaches.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="input">
              Symptoms, Testing & History
            </label>
            <textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Examples:\n• Day 5 after tick bite: small red spot at site, no bullseye, mild fatigue\n• 3 weeks: expanding red rash 8cm, fever 100.4°F, joint aches\n• 2 months: ELISA positive, Western Blot pending, memory fog, insomnia\n• 6 months: treated with doxy 3 weeks, still fatigued, migrating joint pain, EM rash reappeared`}
              className="w-full min-h-[140px] rounded-xl bg-gray-800/60 border border-white/10 text-white placeholder-gray-500 px-4 py-3 text-sm resize-y focus:outline-none focus:border-lime-500/50 focus:ring-1 focus:ring-lime-500/20 transition-colors"
              disabled={loading}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-600 disabled:bg-lime-500/30 disabled:text-gray-500 text-gray-900 font-semibold text-sm transition-colors cursor-pointer"
            >
              {loading ? "Navigating..." : "Navigate Lyme"}
            </button>
            {input && (
              <button
                type="button"
                onClick={() => { setInput(""); setResult(""); setError(""); }}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="rounded-xl bg-red-900/20 border border-red-800/40 px-4 py-3 text-sm text-red-400">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="rounded-xl bg-gray-800/50 border border-white/10 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-lime-400"></div>
              <span className="text-sm font-medium text-gray-200">Lyme Navigation</span>
            </div>
            <div className="px-5 py-4 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {result}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-lime-900/10 border border-lime-700/20 px-4 py-3 text-xs text-lime-200/70 leading-relaxed">
          <strong>⚠️ Medical Disclaimer:</strong> Lyme disease requires prompt medical evaluation and treatment by a qualified healthcare provider — often an infectious disease specialist or a Lyme-literate doctor (LLMD). This tool provides educational guidance only and is not a substitute for professional medical care. Do not delay seeking treatment.
        </div>
      </main>
    </div>
  );
}
