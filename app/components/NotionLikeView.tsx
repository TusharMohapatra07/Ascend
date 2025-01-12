'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Section {
  title: string;
  data: Array<{
    [key: string]: string;
  }>;
}

interface NotionLikeViewProps {
  sections: Section[];
}

const NotionLikeView: React.FC<NotionLikeViewProps> = ({ sections }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.title} className="border border-[#30363d] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full px-4 py-3 bg-[#161b22] flex items-center justify-between hover:bg-[#1c2129] transition-colors"
          >
            <div className="flex items-center gap-2">
              {expandedSections[section.title] ? (
                <ChevronDown className="w-4 h-4 text-[#8b949e]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#8b949e]" />
              )}
              <span className="text-[#c9d1d9] font-medium">{section.title}</span>
            </div>
          </button>
          
          <AnimatePresence>
            {expandedSections[section.title] && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3 border-t border-[#30363d] bg-[#0d1117]">
                  {section.data.map((item, index) => (
                    <div 
                      key={index}
                      className="pl-6 py-2 hover:bg-[#161b22] rounded-lg transition-colors"
                    >
                      {Object.entries(item).map(([key, value]) => (
                        <div key={key} className="text-[#8b949e]">
                          <span className="text-[#c9d1d9]">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default NotionLikeView;
