'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Header from "./components/header";
import Profile from "./components/profile";
import RepositoryCard from "./components/repositoryCard";
import ReadmeViewer from "./components/ReadmeViewer";
import ContributionsGraph from "./components/contributionsGraph";
import ActivityFeed from "./components/activityFeed";
import Footer from "./components/footer";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

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

const MOCK_README = `# Project Title\n\nA brief description...`;

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
    return <div>Loading...</div>;
  }

  const displayedRepos = MOCK_REPOS;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Profile />
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {activeTab === "skills" ? (
              <div className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find a repository..."
                      className="input-search pl-10 w-full"
                    />
                  </div>
                  <button className="button-secondary">Type: All</button>
                  <button className="button-secondary">Language: All</button>
                  <button className="button-secondary">Sort: Last updated</button>
                </div>
                <motion.div
                  className="grid grid-cols-1 gap-4"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {displayedRepos.map((repo) => (
                    <motion.div
                      key={repo.name}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <RepositoryCard {...repo} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="space-y-8">
                <ContributionsGraph />
                <ReadmeViewer content={MOCK_README} />
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Popular Repositories</h2>
                  <motion.div
                    className="space-y-4"
                    variants={{
                      hidden: { opacity: 0 },
                      show: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                        },
                      }
                    }}
                    initial="hidden"
                    animate="show"
                  >
                    {displayedRepos.slice(0, 3).map((repo) => (
                      <motion.div
                        key={repo.name}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <RepositoryCard {...repo} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
                <ActivityFeed />
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
