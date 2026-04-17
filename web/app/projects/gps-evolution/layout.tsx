import {
  ProjectTopNav,
  ProjectPagination,
} from "../../../components/project-nav";
import { Comments } from "../../../components/comments";

export const metadata = {
  title: "GPS Fleet Tracking Evolution",
  description: "Case study on scaling a Node.js real-time messaging system from a naive WebSocket monolith to an enterprise-grade Redis Streams & gRPC architecture.",
  keywords: ["Node.js", "Redis Streams", "WebSocket", "gRPC", "System Scaling", "Fleet Tracking", "Microservices"],
  openGraph: {
    title: "GPS Fleet Tracking Evolution | Backend Evolution",
    description: "Case study on scaling a Node.js real-time messaging system from a naive WebSocket monolith to an enterprise-grade architecture.",
    type: "article",
    publishedTime: "2026-04-17T00:00:00.000Z",
    authors: ["Seyed Mostafa Baghi"],
    tags: ["Architecture", "Scalability", "Node.js"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GPS Fleet Tracking Evolution",
    description: "Scaling a Node.js messaging system to 1,000,000+ points per second.",
  }
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "GPS Fleet Tracking Evolution: Naive WebSocket to gRPC",
    "description": "Case study on scaling a Node.js real-time messaging system from a naive WebSocket monolith to an enterprise-grade gRPC microservices architecture.",
    "author": {
      "@type": "Person",
      "name": "Seyed Mostafa Baghi",
      "url": "https://backendevolution.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Backend Evolution",
      "logo": {
        "@type": "ImageObject",
        "url": "https://backendevolution.com/logo.png" // Ensure you add a logo
      }
    },
    "proficiencyLevel": "Expert",
    "about": {
      "@type": "Thing",
      "name": "System Architecture"
    },
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "keywords": "Node.js, Redis Streams, WebSocket, High-Performance Systems, System Architecture"
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-4 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProjectTopNav />

      <article className="w-full min-w-0">{children}</article>

      <ProjectPagination />

      <Comments />
    </div>
  );
}