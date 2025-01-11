'use client'

import { useState, useEffect } from "react";
import Header from "./components/header";
import Profile from "./components/profile";
import MainContent from "./components/mainContent";
import ActivityFeed from "./components/activityFeed";
import ContributionsGraph from "./components/contributionsGraph";
import Footer from "./components/footer";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeTab, setActiveTab] = useState("Repositories");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          <Profile />
          <div className="flex-1">
            <ContributionsGraph />
            <MainContent activeTab={activeTab} />
            <ActivityFeed />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
