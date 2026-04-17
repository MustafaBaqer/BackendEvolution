"use client";

import Giscus from "@giscus/react";

export function Comments() {
  return (
    <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 w-full">
      <Giscus
        id="comments"
        repo="MustafaBaqer/BackendEvolution"
        repoId="R_kgDOSCqwwA"
        category="General"
        categoryId="DIC_kwDOSCqwwM4C62Mh"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
