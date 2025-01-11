'use client';
import { useState, useEffect } from 'react';

const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 52; i++) {  // Changed from 1 to 52
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(Math.floor(Math.random() * 4));
    }
    data.push(week);
  }
  return data;
};

export default function ContributionsGraph() {
  const [contributionsData, setContributionsData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = generateMockData();
    console.log('Generated data:', data); // Debug log
    setContributionsData(data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('Rendering with data:', contributionsData); // Debug log

  return (
    <div className="mt-8">
      <h2 className="font-semibold text-lg mb-4">Contributions</h2>
      <div className="overflow-x-auto w-full">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(52, minmax(12px, 1fr))`, gap: '4px' }}>
          {contributionsData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${
                    day === 0 ? 'bg-muted' :
                    day === 1 ? 'bg-primary/30' :
                    day === 2 ? 'bg-primary/60' :
                    'bg-primary'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

