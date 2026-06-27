/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2, ArrowRight } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatbotProps {
  userProfile: any;
}

export default function Chatbot({ userProfile }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! I am your NGO Connect AI Assistant. 🌟 I can help you find nearby volunteer opportunities matching your skills, explain campaign impact, or help draft your Social Impact Resume. What are you looking to do today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    if (!textToSend) setInputText("");

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userProfile
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: "bot",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || "Failed chat API");
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: "bot",
          text: "I experienced a minor networking hiccup connecting to the core model. However, I can still guide you: you can browse local campaigns, apply for ecological reforestation, or download community credentials anytime!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Find tree planting events",
    "How can I donate with Stripe?",
    "Generate my social impact resume",
    "Show verified NGOs"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="ai-chatbot-wrapper">
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer"
        id="chatbot-toggle-button"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
 
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="absolute bottom-16 right-0 flex h-[520px] w-80 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl md:w-96 text-zinc-100"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3.5 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <Sparkles className="h-4.5 w-4.5 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide">NGO Connect AI</h4>
                  <p className="text-[10px] text-emerald-100 font-mono">POWERED BY GEMINI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto bg-zinc-900/40 p-4 space-y-4"
              id="chatbot-messages-container"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full text-white ${msg.sender === "user" ? "bg-indigo-600" : "bg-emerald-600"}`}>
                      {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div>
                      <div
                        className={`rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-none whitespace-pre-line"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="mt-1 block text-[9px] text-zinc-500 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 shadow-md">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                      <span className="text-xs text-zinc-400">Typing insights...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length < 3 && (
              <div className="bg-zinc-900/60 border-t border-zinc-850 px-4 pb-2 pt-1 flex flex-wrap gap-1.5" id="chatbot-suggestions">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s)}
                    className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[10px] font-medium text-zinc-300 hover:border-emerald-500 hover:text-white transition-all cursor-pointer"
                  >
                    {s} <ArrowRight className="h-2.5 w-2.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Footer */}
            <div className="border-t border-zinc-800/80 p-3 bg-zinc-950 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask NGO Connect AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:bg-zinc-900 focus:outline-none transition-all placeholder-zinc-500"
                id="chatbot-input-field"
              />
              <button
                onClick={() => handleSend()}
                className="rounded-xl bg-emerald-600 p-2 text-white hover:bg-emerald-500 cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
