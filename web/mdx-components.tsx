import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-gray-100 mt-12 mb-4 border-b border-slate-200 dark:border-gray-800 pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-8 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg md:text-xl font-bold text-slate-800 dark:text-gray-200 mt-8 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 inline-block"></span>
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="text-slate-700 dark:text-gray-300 leading-relaxed mb-6 text-lg">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 text-slate-700 dark:text-gray-300 mb-6 space-y-2 text-lg">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 text-slate-700 dark:text-gray-300 mb-6 space-y-3 text-lg marker:text-blue-600 dark:marker:text-blue-500 marker:font-bold">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="leading-relaxed pl-1">
        {children}
      </li>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;

      return (
        <code
          className={
            isInline
              ? "bg-slate-100 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-700/50"
              : ""
          }
          {...props}
        >
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => <pre {...props}>{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="my-10 pl-6 pr-4 py-5 border-l-4 border-[#6200EA] bg-[#6200EA]/5 dark:bg-[#6200EA]/10 rounded-r-2xl italic text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
        <div className="relative z-10">
          {children}
        </div>
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-8 w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
        <table className="w-full text-left border-collapse text-sm md:text-base whitespace-nowrap">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-slate-100/60 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80">
        {children}
      </thead>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-slate-200/60 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="py-4 px-6 font-bold text-slate-900 dark:text-white tracking-wide">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="py-4 px-6 text-slate-700 dark:text-slate-300 align-middle">
        {children}
      </td>
    ),
    ...components,
  };
}
