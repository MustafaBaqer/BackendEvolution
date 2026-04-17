"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/75 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/75 transition-colors">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white"
        >
          <TerminalSquare className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          <span>
            Backend
            <span className="text-blue-600 dark:text-blue-500">Evolution</span>
          </span>
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle Theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )
          ) : (
            <div className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
