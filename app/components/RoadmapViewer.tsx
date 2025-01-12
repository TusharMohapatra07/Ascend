'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';

interface RoadmapViewerProps {
  content: string;
  timeline: string;
  aspirations: string[];
}

export default function RoadmapViewer({ content, timeline, aspirations }: RoadmapViewerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto bg-[#161b22] rounded-lg border border-[#30363d] shadow-xl p-8"
    >
      <div className="mb-6 p-4 bg-[#0d1117] rounded-lg border border-[#30363d]">
        <h2 className="text-xl font-bold text-[#c9d1d9] mb-2">Roadmap Details</h2>
        <p className="text-[#8b949e]">Timeline: {timeline}</p>
        <div className="mt-2">
          <p className="text-[#8b949e]">Goals:</p>
          <ul className="list-disc list-inside">
            {aspirations.map((aspiration, index) => (
              <li key={index} className="text-[#8b949e]">{aspiration}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
