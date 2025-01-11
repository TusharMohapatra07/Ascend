'use client';
import { motion } from 'framer-motion';
import { GitCommitIcon} from 'lucide-react';

const activities = [
  {
    type: 'commit',
    icon: GitCommitIcon,
    message: 'Committed to main',
    repo: 'example-repo',
    time: '2 days ago'
  },
  // Add more mock activities
];

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 repository-card"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-md hover:bg-muted transition-colors"
          >
            <activity.icon className="w-5 h-5 text-accent mt-1" />
            <div className="flex-1">
              <p className="text-sm">
                <span className="text-accent hover:underline cursor-pointer">johndoe</span>
                {' '}{activity.message}{' '}
                <span className="text-accent hover:underline cursor-pointer">{activity.repo}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
