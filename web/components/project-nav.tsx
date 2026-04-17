"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  GitBranch,
} from "lucide-react";
import { useEffect, useRef } from "react";

const phases = [
  { num: 0, title: "The Master Plan", link: "/projects/gps-evolution" },
  {
    num: 1,
    title: "The Naive HTTP Polling",
    link: "/projects/gps-evolution/phase-1-the-naive-http-polling",
  },
  {
    num: 2,
    title: "The Naive WebSocket",
    link: "/projects/gps-evolution/phase-2-the-naive-ws",
  },
  {
    num: 3,
    title: "Redis Streams Scaling",
    link: "/projects/gps-evolution/phase-3-redis-streams-scaling",
  },
  // {
  //   num: 4,
  //   title: "gRPC & Microservices",
  //   link: "/projects/gps-evolution/phase-4-grpc-microservices",
  // },
  // {
  //   num: 5,
  //   title: "Enterprise Fault Tolerance",
  //   link: "/projects/gps-evolution/phase-5-enterprise-fault-tolerance",
  // },
];

export function ProjectTopNav() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [pathname]);

  return (
    <div className="mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-500" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          GPS Fleet Tracking Evolution
        </h2>
      </div>

      <nav
        className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar snap-x"
        style={{ scrollbarWidth: "none" }}
      >
        {phases.map((phase, index) => {
          const isActive = pathname === phase.link;
          const isPassed = phases.findIndex((p) => p.link === pathname) > index;

          return (
            <Link
              key={phase.num}
              href={phase.link}
              ref={isActive ? activeRef : null}
              className={`group flex shrink-0 items-center gap-2.5 px-3 py-2 rounded-lg border transition-all snap-center
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10"
                }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <span
                  className={`text-[10px] font-bold ${isActive ? "text-blue-600" : "text-slate-500"}`}
                >
                  {phase.num}
                </span>
              )}
              <span
                className={`text-sm font-semibold ${isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-600 dark:text-slate-300"}`}
              >
                {phase.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function ProjectPagination() {
  const pathname = usePathname();
  const currentIndex = phases.findIndex((p) => p.link === pathname);

  const prev = currentIndex > 0 ? phases[currentIndex - 1] : null;
  const next =
    currentIndex < phases.length - 1 ? phases[currentIndex + 1] : null;

  if (currentIndex === -1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-20 pt-8 border-t border-slate-200 dark:border-white/10">
      {prev ? (
        <Link
          href={prev.link}
          className="flex items-center gap-3 px-6 py-4 w-full sm:w-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all backdrop-blur-md group"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Previous
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {prev.title}
            </div>
          </div>
        </Link>
      ) : (
        <div className="w-full sm:w-auto" />
      )}

      {next && (
        <Link
          href={next.link}
          className="flex items-center gap-3 px-6 py-4 w-full sm:w-auto rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all backdrop-blur-md group text-right"
        >
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Next Phase
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {next.title}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
