/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Search, Plus, Sparkles, Tag, Send, X } from "lucide-react";
import { DiscussionThread } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface DiscussionForumProps {
  threads: DiscussionThread[];
  onAddThread: (title: string, content: string, tags: string[]) => Promise<void>;
  onUpvoteThread: (threadId: string) => Promise<void>;
  onReplyThread: (threadId: string, text: string) => Promise<void>;
}

export default function DiscussionForum({ threads, onAddThread, onUpvoteThread, onReplyThread }: DiscussionForumProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [activeThread, setActiveThread] = useState<DiscussionThread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);

  // New question states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  const filteredThreads = threads.filter((th) => {
    const matchesSearch = th.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          th.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "All" || th.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const parsedTags = newTags.split(",").map(t => t.trim()).filter(Boolean);
      await onAddThread(newTitle, newContent, parsedTags.length ? parsedTags : ["General"]);
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setShowAskModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    try {
      await onReplyThread(activeThread.id, replyText);
      // Update local preview state
      const updatedThread = threads.find(t => t.id === activeThread.id);
      if (updatedThread) {
        setActiveThread(updatedThread);
      }
      setReplyText("");
    } catch (err) {
      console.error(err);
    }
  };

  const tagsList = ["All", "Legal", "Environment", "Volunteering", "Taxation", "Operations"];

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="discussion-forum-root">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-white tracking-tight">Alliance Forums & Q&A</h1>
          <p className="text-zinc-400 text-xs">Share logistics tips, volunteer guidelines, taxation protocols, or general coordination strategies.</p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" /> Ask New Question
        </button>
      </div>

      {/* Search & Tag Filter Row */}
      <div className="glass-panel p-5 rounded-3xl border border-zinc-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search discussion thread..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-850 bg-zinc-900/60 focus:border-emerald-500 text-xs text-white outline-none transition-all placeholder-zinc-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" id="forum-filter-tags">
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedTag === tag
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-zinc-900/60 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Forum List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: threads list */}
        <div className="lg:col-span-8 space-y-4">
          {filteredThreads.map((th) => (
            <div
              key={th.id}
              onClick={() => setActiveThread(th)}
              className={`glass-panel p-5 rounded-3xl border cursor-pointer transition-all hover:border-emerald-500/50 ${
                activeThread?.id === th.id ? "border-emerald-500/50 shadow-lg bg-emerald-950/10" : "border-zinc-800/80 shadow-md"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-1">
                      {th.tags.map((tg, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase font-mono tracking-wide">
                          <Tag className="h-2 w-2" /> {tg}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-black text-white leading-snug hover:text-emerald-400">{th.title}</h3>
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 font-mono font-medium shrink-0">{new Date(th.createdAt).toLocaleDateString()}</span>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{th.content}</p>

                {/* Foot indicators */}
                <div className="flex justify-between items-center text-[10px] font-bold font-mono text-zinc-400 border-t border-zinc-800/60 pt-3">
                  <span className="text-zinc-500 font-medium font-sans">Started by: {th.authorName}</span>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteThread(th.id);
                      }}
                      className="flex items-center gap-1 text-zinc-400 hover:text-emerald-400 cursor-pointer"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{th.likes} Upvotes</span>
                    </button>

                    <span className="flex items-center gap-1 text-zinc-500"><MessageSquare className="h-3.5 w-3.5" /> {th.replies.length} Replies</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: active thread reply tray */}
        <div className="lg:col-span-4 h-fit">
          <AnimatePresence mode="wait">
            {activeThread ? (
              <motion.div
                key={activeThread.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-5"
                id="active-thread-panel"
              >
                <div className="flex justify-between items-start pb-4 border-b border-zinc-800/60">
                  <div className="space-y-1">
                    <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold tracking-widest uppercase font-mono">SELECTED Q&A THREAD</span>
                    <h4 className="text-xs font-black text-white leading-snug">{activeThread.title}</h4>
                  </div>
                  <button onClick={() => setActiveThread(null)} className="rounded-full p-1 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-zinc-300 text-xs leading-relaxed">{activeThread.content}</p>

                {/* Replies container */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1" id="active-replies">
                  {activeThread.replies.length === 0 ? (
                    <p className="text-zinc-500 text-[10px] italic py-2 text-center">No replies posted. Be the first to coordinate answers!</p>
                  ) : (
                    activeThread.replies.map((rep) => (
                      <div key={rep.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-2xl space-y-1 text-[10px]">
                        <div className="flex justify-between text-[9px] text-zinc-500 font-bold font-mono">
                          <span>{rep.authorName} ({rep.role})</span>
                          <span>{rep.timestamp}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-sans">{rep.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleReplySubmit} className="flex gap-2 items-center border-t border-zinc-800/60 pt-3">
                  <input
                    type="text"
                    placeholder="Contribute your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs text-white outline-none focus:border-emerald-500/80 placeholder-zinc-500 transition-all"
                  />
                  <button type="submit" className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </motion.div>
            ) : (
              <div className="bg-zinc-950/40 border border-dashed border-zinc-800 rounded-3xl p-8 text-center text-zinc-500 space-y-3">
                <MessageSquare className="h-8 w-8 mx-auto stroke-[1.5] text-zinc-600" />
                <h4 className="text-xs font-bold text-zinc-400">No Thread Selected</h4>
                <p className="text-[10px] leading-relaxed">Select a discussion thread from the left list to review detailed Q&A, coordinate logistics, or leave replies.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950/95 rounded-3xl max-w-md w-full p-6 border border-zinc-800/80 shadow-2xl relative space-y-4 text-zinc-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white">Ask New Forum Question</h3>
                <button onClick={() => setShowAskModal(false)} className="rounded-full p-1 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white"><X className="h-4.5 w-4.5" /></button>
              </div>

              <form onSubmit={handleAsk} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Question Title / Topic</label>
                  <input required placeholder="e.g. Best corporate licensing rules under 501(c)(3)?" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 outline-none text-white focus:border-emerald-500 placeholder-zinc-600 transition-all" />
                </div>
                
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Explain details</label>
                  <textarea required placeholder="Describe legal guidelines, physical locations, or coordination bottlenecks..." value={newContent} onChange={e => setNewContent(e.target.value)} className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 outline-none h-24 resize-none text-white focus:border-emerald-500 placeholder-zinc-600 transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Tags (Comma separated)</label>
                  <input placeholder="Legal, Operations, Environment" value={newTags} onChange={e => setNewTags(e.target.value)} className="w-full p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 outline-none text-white focus:border-emerald-500 placeholder-zinc-600 transition-all" />
                </div>

                <button type="submit" className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold uppercase rounded-xl cursor-pointer shadow-lg shadow-emerald-500/10 transition-all">
                  Publish Forum Question Thread
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
