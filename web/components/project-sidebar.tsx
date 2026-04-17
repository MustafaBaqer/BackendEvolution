"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle, GitBranch } from "lucide-react";

export function ProjectSidebar() {
  const pathname = usePathname();

  const phases = [
    { num: 0, title: "The Master Plan", link: "/projects/messaging-evolution" },
    {
      num: 1,
      title: "The Naive WebSocket",
      link: "/projects/messaging-evolution/phase-1-the-naive-ws",
    },
    {
      num: 2,
      title: "Redis Pub/Sub Scaling",
      link: "/projects/messaging-evolution/phase-2-redis-pubsub",
    },
    {
      num: 3,
      title: "gRPC & Microservices",
      link: "/projects/messaging-evolution/phase-3-grpc-microservices",
    },
    {
      num: 4,
      title: "Enterprise Fault Tolerance",
      link: "/projects/messaging-evolution/phase-4-enterprise-scale",
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-24">
        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Case Study
          </h3>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-500" />
            Messaging App
          </h2>
        </div>

        <nav className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pl-4">
          {phases.map((phase) => {
            const isActive = pathname === phase.link;

            return (
              <Link
                key={phase.num}
                href={phase.link}
                className={`group flex items-start flex-col relative outline-none transition-all ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
              >
                <span className="absolute -left-[25px] top-1 bg-white dark:bg-slate-950">
                  {isActive ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-500 bg-white dark:bg-slate-950" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 mt-0.5 group-hover:border-blue-400 transition-colors" />
                  )}
                </span>
                <span
                  className={`text-xs font-semibold mb-1 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500"}`}
                >
                  {phase.num === 0 ? "Overview" : `Phase ${phase.num}`}
                </span>
                <span
                  className={`text-sm font-medium ${isActive ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400"}`}
                >
                  {phase.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
