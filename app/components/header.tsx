'use client';
import { DarkMode, LightMode, Person, Search } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "next-themes"

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { setTheme, theme } = useTheme()

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b border-border"
      >
        <div className="flex items-center justify-between max-w-[1280px] mx-auto px-4 h-16">
          <Link href="/" className="text-xl font-bold">
            My Portfolio
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-muted/50 transition-colors duration-200"
            >
              {theme === "dark" ? 
                <LightMode className="w-5 h-5" /> : 
                <DarkMode className="w-5 h-5" />
              }
            </button>
            <Image
              src="/137442734.jpeg"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-border"
            />
          </div>
        </div>

        <nav className="flex gap-4 px-4 py-2">
          <button
            onClick={() => onTabChange('projects')}
            className={`px-4 py-2 rounded-md ${activeTab === 'projects' ? 'bg-primary text-white' : 'text-text hover:bg-muted/50'}`}
          >
            Skills
          </button>
          <button
            onClick={() => onTabChange('about')}
            className={`px-4 py-2 rounded-md ${activeTab === 'about' ? 'bg-primary text-white' : 'text-text hover:bg-muted/50'}`}
          >
            Overview
          </button>
        </nav>
      </motion.header>
    </div>
  );
}

