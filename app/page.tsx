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
import axios from "axios";
import { Language } from "@mui/icons-material";

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

interface Resource {
  title: string;
  url: string;
}

interface RoadmapSection {
  title: string;
  content: string;
  dayRange: string;
  focusArea: string;
  topics: string[];
  resources: Resource[];
  completed: boolean;
}

interface Repository {
  _id?: string;
  userId?: string;
  name: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt: string;
  markdownContent?: string;
  sections?: RoadmapSection[];
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  progress?: number; // Calculated percentage of completed sections
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
    <div>
      <ReadmeViewer content={MOCK_README} />
    </div>
    <ContributionsGraph />

    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Popular Roadmaps</h2>
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
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } // Define interface for API response
    interface ApiRepo {
      _id?: string;
      name: string;
      title?: string;
      description: string;
      language?: string;
      languageColor?: string;
      stars?: number;
      forks?: number;
      lastUpdated?: string;
      sections?: RoadmapSection[];
    }

    // Helper function to calculate progress from sections
    const calculateProgress = (sections?: RoadmapSection[]): number => {
      if (!sections || sections.length === 0) return 0;
      const completedSections = sections.filter(
        (section) => section.completed
      ).length;
      return Math.round((completedSections / sections.length) * 100);
    };

    // Fetch repository data
    const fetchRepos = async () => {
      try {
        const response = await axios.get("/api/markdownToJson");
        const data: ApiRepo[] = response.data;
        const formattedRepos = data.map((repo) => ({
          _id: repo._id || `repo-${Math.random().toString(36).substr(2, 9)}`,
          name: repo.name,
          title: repo.title || repo.name,
          description: repo.description,
          language: repo.language || "Unknown",
          languageColor: repo.languageColor || "#888888",
          stars: repo.stars || 0,
          forks: repo.forks || 0,
          updatedAt: repo.lastUpdated || new Date().toISOString(),
          sections: repo.sections || [],
          progress: calculateProgress(repo.sections),
        }));
        setRepos(formattedRepos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
        // Set some default repos if API fails
        setRepos([
          {
            _id: "repo-1",
            name: "AI-Roadmap",
            title: "AI Roadmap - Complete Learning Path",
            description:
              "A customizable roadmap for AI learning with comprehensive sections and resources",
            language: "TypeScript",
            languageColor: "#3178c6",
            stars: 42,
            forks: 12,
            updatedAt: new Date().toISOString(),
            progress: 65,
          },
          {
            _id: "repo-2",
            name: "ML-Fundamentals",
            title: "Machine Learning Fundamentals",
            description:
              "Essential concepts in machine learning from beginner to advanced",
            language: "Python",
            languageColor: "#3572A5",
            stars: 38,
            forks: 8,
            updatedAt: new Date().toISOString(),
            progress: 30,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [status, router]);

  if (status === "loading" || loading) {
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
              <RepositorySection repos={repos} />
            ) : (
              <OverviewSection repos={repos} />
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
