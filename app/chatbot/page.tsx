"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Loader2, ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';
import EditDialog from '../components/EditDialog';
import SaveDialog from '../components/SaveDialog';

const ReadmeViewer = dynamic(() => import('../components/ReadmeViewer'), {
  ssr: false
});

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface RoadmapVersion {
  content: string;
  timestamp: Date;
  prompt?: string;
}

const ChatBot: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [roadmap, setRoadmap] = useState<{
    content: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [versions, setVersions] = useState<RoadmapVersion[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-pulse text-[#8b949e]">Loading...</div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        const newVersion: RoadmapVersion = {
          content: data.markdown,
          timestamp: new Date(),
          prompt: input
        };
        setVersions([newVersion]);
        setCurrentVersionIndex(0);
        setRoadmap({
          content: data.markdown
        });
      }
    } catch (err) {
      setError(
        `Failed to generate roadmap: ${
          err instanceof Error ? err.message : "Please try again."
        }`
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEditSubmit = async (editPrompt: string) => {
    try {
      const response = await fetch("/api/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: roadmap?.content,
          userPrompt: editPrompt
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
      } else {
        const newVersion: RoadmapVersion = {
          content: data.response,
          timestamp: new Date(),
          prompt: editPrompt
        };
        setVersions([...versions, newVersion]);
        setCurrentVersionIndex(versions.length);
        setRoadmap({ content: data.response });
      }
    } catch (err) {
      setError(`Failed to edit roadmap: ${err instanceof Error ? err.message : "Please try again."}`);
    }
    setIsDialogOpen(false);
  };

  const handleVersionChange = (index: number) => {
    setCurrentVersionIndex(index);
    setRoadmap({ content: versions[index].content });
  };

  const handleSavePDF = (name: string) => {
    if (roadmap?.content) {
      const pdf = generatePDF(roadmap.content, name);
      pdf.save(`${name.toLowerCase().replace(/\s+/g, '-')}-roadmap.pdf`);
      setIsSaveDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] overflow-auto">
      <AnimatePresence mode="wait">
        {roadmap ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto p-4 space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoadmap(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-[#c9d1d9] rounded-lg bg-[#21262d] hover:bg-[#30363d]
                           border border-[#30363d] transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Chat
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={currentVersionIndex}
                  onChange={(e) => handleVersionChange(Number(e.target.value))}
                  className="bg-[#21262d] text-[#c9d1d9] border border-[#30363d] 
                           rounded-lg px-3 py-2 text-sm"
                >
                  {versions.map((version, index) => (
                    <option key={version.timestamp.toISOString()} value={index}>
                      Version {index + 1} - {version.timestamp.toLocaleString()}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           rounded-lg border transition-colors duration-200
                           text-[#c9d1d9] bg-[#21262d] border-[#30363d] hover:bg-[#30363d]`}
                >
                  Edit Roadmap
                </button>
                <button
                  onClick={() => setIsSaveDialogOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                           text-white rounded-lg bg-[#238636] hover:bg-[#2ea043]
                           border border-[#238636] transition-colors duration-200"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <ReadmeViewer content={roadmap.content} />
            </div>

            <EditDialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleEditSubmit}
              currentContent={roadmap.content}
              isLoading={isTyping}
            />

            <SaveDialog
              isOpen={isSaveDialogOpen}
              onClose={() => setIsSaveDialogOpen(false)}
              onSave={handleSavePDF}
              content={roadmap?.content || ''}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto p-4"
          >
            <div className="bg-[#161b22] rounded-lg border border-[#30363d] shadow-xl overflow-hidden">
              <div className="p-6 border-b border-[#30363d]">
                <div className="flex items-center justify-center gap-4">
                  <Bot className="w-8 h-8 text-[#58a6ff]" />
                  <h1 className="text-2xl font-bold text-[#c9d1d9]">
                    AI Roadmap Generator
                  </h1>
                </div>
              </div>

              <div className="p-6 h-[60vh] flex flex-col">
                <div className="flex-1 overflow-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-[#238636] text-white"
                            : "bg-[#21262d] text-[#c9d1d9]"
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Describe your learning goals and timeline..."
                    className="w-full h-32 bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] 
                                                 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 
                                                 focus:ring-[#1f6feb] border border-[#30363d]"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isTyping || !input.trim()}
                    className="absolute bottom-4 right-4 bg-[#238636] text-white rounded-lg 
                                                 px-6 py-2 flex items-center gap-2 hover:bg-[#2ea043] 
                                                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTyping ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
