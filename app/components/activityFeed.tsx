'use client';
import { Commit } from '@mui/icons-material';

const activities = [
  {
    type: 'commit',
    icon: Commit,
    message: 'Committed to main',
    repo: 'example-repo',
    time: '2 days ago'
  },
  // Add more mock activities
];

export default function ActivityFeed() {
  return (
    <div className="mt-4">
      <h2 className="text-base mb-3 font-semibold text-white">Recent Activity</h2>
      <div className="border border-gray-800 rounded-md bg-black/40">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50"
          >
            <div className="mt-1">
              <activity.icon className="w-4 h-4 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-gray-100 leading-[1.5]">
                <a href="#" className="text-blue-400 hover:underline font-semibold">johndoe</a>
                {' '}{activity.message}{' '}
                <a href="#" className="text-blue-400 hover:underline">{activity.repo}</a>
              </p>
              <p className="text-[12px] text-gray-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
