"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, Loader2 } from 'lucide-react';
import RoadmapViewer from '../components/RoadmapViewer';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [roadmap, setRoadmap] = useState<{
        content: string;
        timeline: string;
        aspirations: string[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsTyping(true);
        setError(null);

        try {
            const response = await fetch('/api/generate', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });

            const data = await response.json();

            if (data.error) {
                setError(data.message);
            } else {
                setRoadmap({
                    content: data.markdown,
                    timeline: data.timeline,
                    aspirations: data.aspirations
                });
            }
        } catch (err) {
            setError(`Failed to generate roadmap: ${err instanceof Error ? err.message : 'Please try again.'}`);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] p-4">
            {roadmap ? (
                <RoadmapViewer {...roadmap} />
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl bg-[#161b22] rounded-lg border border-[#30363d] shadow-xl"
                >
                    {/* Main content area */}
                    <div className="h-[70vh] p-6">
                        <div className="flex flex-col space-y-4 mb-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-[#238636] text-white' : 'bg-[#21262d] text-[#c9d1d9]'}`}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-center justify-center h-full">
                            <Bot className="w-16 h-16 text-[#58a6ff] mb-6" />
                            <h2 className="text-2xl font-bold text-[#c9d1d9] mb-4">
                                GitHub Copilot Chat
                            </h2>
                            <div className="w-full max-w-2xl">
                                <motion.textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask me anything about your code..."
                                    className="w-full h-32 bg-[#0d1117] text-[#c9d1d9] placeholder-[#8b949e] rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#1f6feb] border border-[#30363d]"
                                    whileFocus={{ scale: 1.01 }}
                                />
                                <div className="flex justify-end mt-4">
                                    <motion.button 
                                        onClick={handleSend}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#238636] text-white rounded-lg px-6 py-2 flex items-center gap-2 hover:bg-[#2ea043] transition-colors"
                                        disabled={isTyping}
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
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
            
            {error && (
                <div className="text-red-500 text-center mt-4">
                    {error}
                </div>
            )}
        </div>
    );
}
