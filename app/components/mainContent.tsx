'use client';
import { motion } from 'framer-motion';
import RepositoryCard from './repositoryCard';
import { Search } from 'lucide-react';
import { useLayoutEffect, useState } from 'react';

const MOCK_REPOS = [
  {
    name: 'react-github-clone',
    description: 'A GitHub profile clone built with React and Tailwind CSS',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 128,
    forks: 23,
    updatedAt: '2 days ago'
  },
  {
    name: 'next-js-blog',
    description: 'A simple blog built with Next.js and MDX',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 89,
    forks: 12,
    updatedAt: '1 week ago'
  },
  // Add more mock repositories as needed
];

interface MainContentProps {
  activeTab: string;
}

export default function MainContent({ activeTab }: MainContentProps) {
  const [isClient, setIsClient] = useState(false)

  useLayoutEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <motion.main 
      className="flex-1 min-w-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >     
      <div className="py-4">
        {activeTab === 'Repositories' && (
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
              className="space-y-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              animate="show"
            >
              {MOCK_REPOS.map((repo) => (
                <motion.div
                  key={repo.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <RepositoryCard {...repo} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </motion.main>
  );
}

