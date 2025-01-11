import { StarIcon, GitForkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface RepositoryCardProps {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
}

export default function RepositoryCard({
  name,
  description,
  language,
  languageColor,
  stars,
  forks,
  updatedAt
}: RepositoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="repository-card"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold">
            <a href="#" className="text-primary hover:underline">{name}</a>
          </h3>
          {description && (
            <p className="mt-1 text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        <button className="button-secondary flex items-center gap-1">
          <StarIcon className="w-4 h-4" />
          Star
        </button>
      </div>
      
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        {language && (
          <span className="flex items-center gap-1">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: languageColor }}
            />
            {language}
          </span>
        )}
        {stars > 0 && (
          <a href="#" className="flex items-center gap-1 hover:text-foreground">
            <StarIcon className="w-4 h-4" />
            {stars}
          </a>
        )}
        {forks > 0 && (
          <a href="#" className="flex items-center gap-1 hover:text-foreground">
            <GitForkIcon className="w-4 h-4" />
            {forks}
          </a>
        )}
        <span>Updated {updatedAt}</span>
      </div>
    </motion.div>
  );
}
