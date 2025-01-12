"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

import Header from "./components/header";
import Profile from "./components/profile";
import RepositoryCard from "./components/repositoryCard";
import ReadmeViewer from "./components/ReadmeViewer";
import ContributionsGraph from "./components/contributionsGraph";
import ActivityFeed from "./components/activityFeed";
import Footer from "./components/footer";

const MOCK_REPOS = [
  {
    name: "react-github-clone",
    description: "A GitHub profile clone built with React and Tailwind CSS",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 128,
    forks: 23,
    updatedAt: "2 days ago",
  },
  {
    name: "next-js-blog",
    description: "A simple blog built with Next.js and MDX",
    language: "JavaScript",
    languageColor: "#f1e05a",
    stars: 89,
    forks: 12,
    updatedAt: "1 week ago",
  },
];

const MOCK_README = `# AI Roadmap Builder

AI Roadmap Builder helps you craft customized learning paths in the world of AI. Explore various technologies, frameworks, and tools through an intuitive interface, just like your favorite repositories.

---

### 🎯 Try the Chatbot
Ready to get started? Interact with our **AI-powered Chatbot** to guide you through the roadmap-building process.

<div align="center">
  <a href="/chatbot" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/GENERATE_ROADMAP-181717?style=for-the-badge&logoColor=white" alt="Generate Roadmap" width="300" height="150"/>
  </a>
</div>

`;

const FILTER_BUTTONS = [
  { label: "Type", value: "All" },
  { label: "Language", value: "Any" },
  { label: "Sort", value: "Last updated" },
];

interface Repository {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

const RepositorySection = ({ repos }: { repos: Repository[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a repository..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-900/40 backdrop-blur-sm
                     border border-slate-700/50 text-slate-100 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20
                     transition-all duration-200"
          />
        </div>

        {FILTER_BUTTONS.map(({ label, value }) => (
          <button
            key={label}
            className="h-10 px-4 rounded-lg text-sm font-medium whitespace-nowrap
                     inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur-sm
                     border border-slate-700/50 text-slate-300 hover:text-slate-100
                     hover:bg-slate-800/40 hover:border-slate-600/50
                     focus:outline-none focus:ring-2 focus:ring-blue-500/20
                     transition-all duration-200"
          >
            {label}: {value}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {repos.map((repo, index) => (
          <div
            key={repo.name}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "forwards",
            }}
          >
            <RepositoryCard {...repo} />
          </div>
        ))}
      </div>
    </div>
  );
};

const OverviewSection = ({ repos }: { repos: Repository[] }) => (
  <div className="space-y-8">
    <div >   
       <ReadmeViewer content={MOCK_README}/>
    </div>
    <ContributionsGraph />
    
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Popular Repositories</h2>
      <div className="space-y-4">
        {repos.slice(0, 3).map((repo, index) => (
          <div
            key={repo.name}
            className="opacity-0 animate-fade-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "forwards",
            }}
          >
            <RepositoryCard {...repo} />
          </div>
        ))}
      </div>
    </div>
    <ActivityFeed />
  </div>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Profile />
          <div className="flex-1">
            {activeTab === "skills" ? (
              <RepositorySection repos={MOCK_REPOS} />
            ) : (
              <OverviewSection repos={MOCK_REPOS} />
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
