"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
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

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing your request. This is a demo response that showcases the modern interface.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-[#161b22]/80 backdrop-blur-xl rounded-2xl border border-[#30363d]/50 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#30363d]/50 bg-[#161b22]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58a6ff]/10 rounded-xl">
              <Bot className="w-6 h-6 text-[#58a6ff]" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#c9d1d9]">AI Assistant</h1>
              <div className="flex items-center gap-1.5 text-xs text-[#58a6ff]">
                <span className="flex w-2 h-2 rounded-full bg-[#238636] animate-pulse"/>
                <span className="text-[#8b949e]">Online and ready to help</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[60vh] p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-start gap-4 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] shadow-lg shadow-[#1f6feb]/20' 
                      : 'bg-gradient-to-br from-[#21262d] to-[#30363d] shadow-lg shadow-[#21262d]/20'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <div className={`flex-1 max-w-[75%] ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className={`inline-block rounded-2xl px-6 py-3 shadow-lg ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#1f6feb] to-[#1f6feb]/90 text-white shadow-[#1f6feb]/20' 
                        : 'bg-gradient-to-r from-[#21262d] to-[#21262d]/90 text-[#c9d1d9] shadow-[#21262d]/20'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                  <div className="text-xs text-[#8b949e] mt-2 mx-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[#8b949e] text-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              AI is typing...
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-[#30363d]/50 bg-[#161b22]/90">
          <div className="flex gap-3">
            <motion.input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-[#0d1117]/50 backdrop-blur-sm text-[#c9d1d9] placeholder-[#8b949e] rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/50 border border-[#30363d]/50 shadow-inner"
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button 
              onClick={handleSend}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#1f6feb] to-[#58a6ff] text-white rounded-xl px-6 py-3 shadow-lg shadow-[#1f6feb]/20 hover:shadow-xl hover:shadow-[#1f6feb]/30 transition-shadow focus:outline-none focus:ring-2 focus:ring-[#1f6feb]/50"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}