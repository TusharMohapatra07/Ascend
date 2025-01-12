'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface SaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  content: string;
}

const SaveDialog: React.FC<SaveDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  content
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name);
    setName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
                <h2 className="text-lg font-semibold text-[#c9d1d9]">Download Roadmap PDF</h2>
                <button onClick={onClose} className="text-[#8b949e] hover:text-[#c9d1d9]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#8b949e] mb-2">
                    PDF Name:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a name for your PDF"
                    className="w-full bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] 
                             rounded-lg p-3 focus:outline-none focus:ring-2 
                             focus:ring-[#1f6feb] border border-[#30363d]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-[#c9d1d9] 
                             bg-[#21262d] rounded-lg hover:bg-[#30363d] 
                             border border-[#30363d] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg
                             bg-[#238636] hover:bg-[#2ea043] border border-[#238636]
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SaveDialog;
