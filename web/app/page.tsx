"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Server, Database, Mail, CheckCircle } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function Home() {
  const [isCopied, setIsCopied] = useState(false);

  const handleEmailClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const user = "support";
    const domain = "codevestra.com";
    const targetEmail = `${user}@${domain}`;

    try {
      // 1. Copy to Clipboard (Secure & Native)
      await navigator.clipboard.writeText(targetEmail);

      // 2. UI Feedback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);

      // 3. Trigger Mail Client
      window.location.href = `mailto:${targetEmail}`;
    } catch (err) {
      console.error("Clipboard operation failed", err);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          System Architecture, <br />
          <span className="text-blue-600 dark:text-blue-500">
            From Junior to CTO.
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          I build high-performance distributed systems. Here, I document the
          evolution of backend architecture—taking raw, naive code and scaling
          it to enterprise-grade fault tolerance.
        </p>
      </section>

      {/* Projects Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Project 1 */}
        <Link
          href="/projects/gps-evolution"
          className="group block p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-blue-500/50 hover:shadow-2xl transition-all"
        >
          <Database className="w-10 h-10 text-blue-600 dark:text-blue-500 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            GPS Fleet Tracking Engine
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Processing 1M+ coordinates per second using Redis and C++ for
            ultra-low latency.
          </p>
          <span className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
            Read Case Study <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </Link>

        {/* Project 2: The Messaging Monolith (Upgraded) */}
        <div className="relative p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 opacity-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" />
          <Server className="w-10 h-10 text-slate-500 dark:text-slate-400 mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            The Messaging Monolith
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 relative z-10 leading-relaxed">
            Architecting a real-time gRPC communication layer. Replacing legacy
            REST pipelines with a distributed C++ and Redis engine to sustain
            millions of concurrent streams with zero data loss.
          </p>
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
            Research in Progress
          </span>
        </div>
      </section>

      {/* Social & Contact Section (Glassmorphism + Secure Email) */}
      <section className="mt-12 pt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Absolute Clarity. Total Control.
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Connect for enterprise-grade architecture discussions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/MustafaBaqer"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5" />
            </Link>

            <Link
              href="https://linkedin.com/in/mostafabaghi"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5" />
            </Link>

            <a
              href="#"
              onClick={handleEmailClick}
              className={`group flex items-center gap-2 px-5 py-3 rounded-xl text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                isCopied
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Mail className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">
                {isCopied ? "Email Copied!" : "Secure Contact"}
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
