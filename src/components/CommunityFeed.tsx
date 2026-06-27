/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { MessageCircle, Heart, Share2, Sparkles, Plus, Image, Send, ArrowRight, X } from "lucide-react";
import { CommunityPost } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CommunityFeedProps {
  posts: CommunityPost[];
  onAddPost: (postText: string) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onCommentPost: (postId: string, commentText: string) => Promise<void>;
}

export default function CommunityFeed({ posts, onAddPost, onLikePost, onCommentPost }: CommunityFeedProps) {
  const [newPostText, setNewPostText] = useState("");
  const [activeCommentsPost, setActiveCommentsPost] = useState<CommunityPost | null>(null);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    setPosting(true);
    try {
      await onAddPost(newPostText);
      setNewPostText("");
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentsPost) return;

    try {
      await onCommentPost(activeCommentsPost.id, commentText);
      // Locally append to keep UI accurate
      const updatedPost = posts.find(p => p.id === activeCommentsPost.id);
      if (updatedPost) {
        setActiveCommentsPost(updatedPost);
      }
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100" id="community-feed-root">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-xl space-y-1">
        <h1 className="text-xl font-black text-white tracking-tight">Alliance Community Stories</h1>
        <p className="text-zinc-400 text-xs">Share event galleries, volunteer highlights, milestone celebrations, and non-profit insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Feed stories */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Share New Post card */}
          <div className="glass-panel rounded-3xl border border-zinc-800/80 p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">Publish Impact Gallery</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                placeholder="What community achievement are we celebrating today?"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full text-xs p-3.5 bg-zinc-900/60 hover:bg-zinc-900/80 focus:bg-zinc-900 rounded-2xl border border-zinc-800 outline-none h-20 resize-none transition-all text-white placeholder-zinc-500"
              />

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => alert("Photo galleries upload simulated.")}
                  className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:bg-zinc-900/60 text-[10px] font-bold text-zinc-300 flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Image className="h-4 w-4 text-zinc-500" /> Add photo
                </button>
                
                <button
                  type="submit"
                  disabled={posting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  Post Story <Plus className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6" id="stories-feed-container">
            {posts.map((post) => (
              <div key={post.id} className="glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl space-y-4">
                
                {/* Author Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} alt={post.authorName} className="h-10 w-10 rounded-full object-cover border border-zinc-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{post.authorName}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium capitalize font-mono">{post.authorRole}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Body Text */}
                <p className="text-zinc-300 text-xs leading-relaxed">{post.content}</p>

                {/* Optional Media */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-inner">
                    <img src={post.image} alt="Shared event" className="w-full max-h-72 object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}

                {/* Interactivity Line */}
                <div className="flex items-center gap-6 border-t border-zinc-800/60 pt-3.5 text-xs text-zinc-400 font-semibold">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Heart className={`h-4 w-4 ${post.likes > 5 ? "fill-rose-500 text-rose-500" : "text-zinc-500"}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentsPost(post)}
                    className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 text-zinc-500" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Stories of the week */}
        <div className="lg:col-span-4 glass-panel border border-zinc-800/80 rounded-3xl p-6 shadow-xl h-fit space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wide">
            <Sparkles className="h-4 w-4 text-yellow-400" /> Impact Spotlights
          </div>
          
          <div className="space-y-4">
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-emerald-400">REFORESTATION DRIVE</span>
              <h4 className="text-xs font-bold text-white">GreenEarth complete site 12 B</h4>
              <p className="text-[10px] text-zinc-400">Over 2,500 saplings planted in under 3 weeks. Incredible effort.</p>
            </div>

            <div className="p-3.5 bg-zinc-900/60 border border-zinc-850 rounded-2xl space-y-1">
              <span className="text-[9px] font-bold text-blue-400">DISASTER SUPPORT</span>
              <h4 className="text-xs font-bold text-white">Shelter Supplies Delivered</h4>
              <p className="text-[10px] text-zinc-400">Red Cross teams coordinate distribution of over 45 emergency shelter packets.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Comment Tray Overlay */}
      <AnimatePresence>
        {activeCommentsPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950/95 rounded-3xl max-w-md w-full p-6 border border-zinc-800/80 shadow-2xl relative space-y-5 text-zinc-100"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-zinc-400 uppercase font-mono tracking-wider">Commentary Stream</h3>
                <button onClick={() => setActiveCommentsPost(null)} className="rounded-full p-1 hover:bg-zinc-900 cursor-pointer text-zinc-400 hover:text-white">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Feed Preview */}
              <div className="p-3 border border-zinc-800 bg-zinc-900/60 rounded-xl">
                <h4 className="text-xs font-bold text-white">{activeCommentsPost.authorName}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2">{activeCommentsPost.content}</p>
              </div>

              {/* Comments list */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-2" id="comment-list">
                {activeCommentsPost.comments.length === 0 ? (
                  <p className="text-zinc-500 text-[10px] italic py-2 text-center">Be the first to share your encouragement!</p>
                ) : (
                  activeCommentsPost.comments.map((comm) => (
                    <div key={comm.id} className="p-3 border border-zinc-850 rounded-xl bg-zinc-900/20 space-y-1">
                      <div className="flex justify-between font-mono text-[9px] text-zinc-500 font-bold">
                        <span>{comm.authorName}</span>
                        <span>{new Date(comm.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] text-zinc-300 leading-normal">{comm.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2 items-center border-t border-zinc-800/60 pt-3">
                <input
                  type="text"
                  placeholder="Share a thoughtful response..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-white outline-none focus:border-emerald-500/80 placeholder-zinc-500 transition-all"
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 cursor-pointer transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
