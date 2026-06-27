/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  Shield,
  Users,
  TreePine,
  Award,
  Landmark,
  TrendingUp,
  Sparkles,
  Zap,
  RotateCw,
  Cpu,
  Globe,
  Database,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkle
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Campaign, NGOProfile, Opportunity } from "../types";
import HumanCircle3DCanvas from "./HumanCircle3DCanvas";

interface LandingPageProps {
  campaigns: Campaign[];
  ngos: NGOProfile[];
  opportunities: Opportunity[];
  onNavigate: (page: string) => void;
  onJoinAsVolunteer: () => void;
}

// ----------------------------------------------------
// 1. Digital 3D Backdrop Canvas Component (Clean Waves Only)
// ----------------------------------------------------
export function DigitalThreeDBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const targetX = (e.clientX - window.innerWidth / 2) * 0.05;
      const targetY = (e.clientY - window.innerHeight / 2) * 0.05;
      mouseX += (targetX - mouseX) * 0.1;
      mouseY += (targetY - mouseY) * 0.1;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const rows = 26;
    const cols = 26;
    const spacing = 48;
    let count = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      count += 0.02;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x3d = (c - cols / 2) * spacing;
          const z3d = (r - rows / 2) * spacing;
          const distance = Math.sqrt(x3d * x3d + z3d * z3d);
          const y3d = Math.sin(distance * 0.015 - count) * 40 + Math.cos(c * 0.25 + count) * 12;

          const angleX = 0.55 + mouseY * 0.0015;
          const angleY = mouseX * 0.0015;

          let xRot = x3d * Math.cos(angleY) - z3d * Math.sin(angleY);
          let zRot = x3d * Math.sin(angleY) + z3d * Math.cos(angleY);
          let yRot = y3d * Math.cos(angleX) - zRot * Math.sin(angleX);
          let depth = y3d * Math.sin(angleX) + zRot * Math.cos(angleX) + 900;

          const scale = 700 / depth;
          const x2d = width / 2 + xRot * scale;
          const y2d = height / 2 + yRot * scale + 140;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height && depth > 200) {
            const opacity = Math.max(0.01, Math.min(0.55, 1 - depth / 1800));
            ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.7})`;
            ctx.beginPath();
            ctx.arc(x2d, y2d, Math.max(0.5, scale * 1.8), 0, Math.PI * 2);
            ctx.fill();

            if (c < cols - 1) {
              const x3dNext = (c + 1 - cols / 2) * spacing;
              const y3dNext = Math.sin(Math.sqrt(x3dNext * x3dNext + z3d * z3d) * 0.015 - count) * 40 + Math.cos((c + 1) * 0.25 + count) * 12;
              let xRotN = x3dNext * Math.cos(angleY) - z3d * Math.sin(angleY);
              let zRotN = x3dNext * Math.sin(angleY) + z3d * Math.cos(angleY);
              let yRotN = y3dNext * Math.cos(angleX) - zRotN * Math.sin(angleX);
              let depthN = y3dNext * Math.sin(angleX) + zRotN * Math.cos(angleX) + 900;
              const scaleN = 700 / depthN;
              const x2dN = width / 2 + xRotN * scaleN;
              const y2dN = height / 2 + yRotN * scaleN + 140;

              ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.22})`;
              ctx.lineWidth = Math.max(0.2, 0.45 * scale);
              ctx.beginPath();
              ctx.moveTo(x2d, y2d);
              ctx.lineTo(x2dN, y2dN);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-35" id="mesh-canvas-3d" />;
}

// ----------------------------------------------------
// 1.5. 3D Circulating People (Dedicated local Cube background)
// ----------------------------------------------------
export function CirculatingPeopleCubeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    let count = 0;

    const circulatingPeople = [
      { name: "Marcus 🌱", role: "Volunteer", radius: 125, speed: 0.009, angle: 0, elevation: -20, color: "#6366f1" },
      { name: "Sophia 🤝", role: "CSR Leader", radius: 150, speed: -0.007, angle: Math.PI / 2, elevation: 30, color: "#a855f7" },
      { name: "SaveForests 🏠", role: "NGO Org", radius: 110, speed: 0.011, angle: Math.PI, elevation: -40, color: "#3b82f6" },
      { name: "Liam 💖", role: "Active Donor", radius: 165, speed: -0.006, angle: Math.PI * 1.5, elevation: 45, color: "#10b981" },
      { name: "Elena 🌸", role: "Volunteer", radius: 135, speed: 0.008, angle: 0.4, elevation: -10, color: "#6366f1" },
      { name: "GreenEarth 🌱", role: "Verified NGO", radius: 120, speed: -0.010, angle: 2.1, elevation: 15, color: "#3b82f6" },
      { name: "Oliver 🌟", role: "Elite Helper", radius: 140, speed: 0.007, angle: 3.8, elevation: -30, color: "#6366f1" },
      { name: "Maya ✨", role: "Stripe Donor", radius: 155, speed: -0.008, angle: 1.2, elevation: 5, color: "#10b981" }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      count += 0.02;

      circulatingPeople.forEach((p) => {
        p.angle += p.speed;

        // Orbit logic
        const x3d = p.radius * Math.cos(p.angle);
        const z3d = p.radius * Math.sin(p.angle);
        const y3d = p.elevation + Math.sin(count * 1.5 + p.angle * 3) * 15;

        // Nice tilted orbital plane
        const angleX = 0.35;
        const angleY = count * 0.12;

        let xRot = x3d * Math.cos(angleY) - z3d * Math.sin(angleY);
        let zRot = x3d * Math.sin(angleY) + z3d * Math.cos(angleY);
        let yRot = y3d * Math.cos(angleX) - zRot * Math.sin(angleX);
        let depth = y3d * Math.sin(angleX) + zRot * Math.cos(angleX) + 380;

        const scale = 280 / depth;
        const x2d = width / 2 + xRot * scale;
        const y2d = height / 2 + yRot * scale;

        // Check if inside boundaries
        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height && depth > 100) {
          const opacity = Math.max(0.15, Math.min(0.85, 1 - depth / 900));

          // A: Faint connection link to center of the orbit system (the cube)
          ctx.strokeStyle = `${p.color}15`;
          ctx.lineWidth = Math.max(0.5, 0.8 * scale);
          ctx.beginPath();
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(width / 2, height / 2);
          ctx.stroke();

          // B: Pulsing halo outer circle
          const ringRadius = Math.max(4, 8 * scale);
          const pulseDelta = Math.sin(count * 4 + p.angle) * 2;
          ctx.strokeStyle = `${p.color}33`;
          ctx.lineWidth = Math.max(0.5, 1 * scale);
          ctx.beginPath();
          ctx.arc(x2d, y2d, ringRadius + pulseDelta, 0, Math.PI * 2);
          ctx.stroke();

          // C: Solid color active outer outline ring
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, 1.5 * scale);
          ctx.beginPath();
          ctx.arc(x2d, y2d, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // D: Inner core
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(2, 3.5 * scale), 0, Math.PI * 2);
          ctx.fill();

          // E: Bright white absolute center particle
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x2d, y2d, Math.max(0.8, 1.2 * scale), 0, Math.PI * 2);
          ctx.fill();

          // F: Futuristic floating text tag HUD setup
          const textOffsetX = Math.max(9, 11 * scale);
          
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.9})`;
          ctx.font = `bold ${Math.max(8, Math.round(9.5 * scale))}px "JetBrains Mono", monospace`;
          ctx.fillText(p.name, x2d + textOffsetX, y2d + 1);

          ctx.fillStyle = `rgba(161, 161, 170, ${opacity * 0.7})`;
          ctx.font = `${Math.max(6.5, Math.round(7.5 * scale))}px "Inter", sans-serif`;
          ctx.fillText(p.role, x2d + textOffsetX, y2d + Math.max(9, 11 * scale));
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" id="cube-circulating-backdrop" />;
}

// ----------------------------------------------------
// 2. Interactive 3D Tilting Card Component (Desktop-Optimized)
// ----------------------------------------------------
interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  key?: React.Key;
}

export function ThreeDCard({ children, className = "", glowColor = "rgba(99,102,241,0.15)" }: ThreeDCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dampened springs for ultra-premium responsive feel
  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 140 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 140 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200
      }}
      className={`group relative rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 shadow-xl transition-all duration-500 hover:border-zinc-700/80 hover:bg-zinc-950/60 ${className}`}
    >
      <div style={{ transform: "translateZ(35px)" }} className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
      
      {/* Interactive back-glow dynamic hover asset */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
}

// ----------------------------------------------------
// 3. Main Landing Page Layout
// ----------------------------------------------------
export default function LandingPage({ campaigns, ngos, opportunities, onNavigate, onJoinAsVolunteer }: LandingPageProps) {
  // Active Persona Tab on the 3D Interactive Cube
  const [activeFace, setActiveFace] = useState<"volunteer" | "ngo" | "donor" | "csr">("volunteer");

  const stats = [
    { label: "Active Volunteers", value: "50K+", icon: Users, color: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]" },
    { label: "Verified NGOs", value: "2.5K+", icon: Shield, color: "text-blue-400 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.08)]" },
    { label: "Events Organized", value: "15K+", icon: Cpu, color: "text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.08)]" },
    { label: "Lives Impacted", value: "1M+", icon: Heart, color: "text-amber-500 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]" },
    { label: "Donations Raised", value: "$5M+", icon: Landmark, color: "text-pink-500 bg-pink-500/10 border border-pink-500/20 shadow-[0_0_20px_rgba(244,63,94,0.08)]" }
  ];

  const benefits = [
    {
      title: "AI Opportunity Match",
      desc: "Our Gemini model screens your skills, availability, and interests to suggest the most impactful local causes.",
      icon: Cpu,
      glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      color: "rgba(99,102,241,0.15)"
    },
    {
      title: "Gamified Recognition",
      desc: "Earn points, level up, unlock high-tier badges (like Community Hero), and download verified digital certificates.",
      icon: Award,
      glow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      color: "rgba(168,85,247,0.15)"
    },
    {
      title: "Stripe Secured Trust",
      desc: "Support campaigns directly via integrated Stripe Checkout. Track real-time funding goals with complete transparency.",
      icon: Heart,
      glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      color: "rgba(16,185,129,0.15)"
    }
  ];

  // Helper calculation for rotating the 3D cube representation
  const getCubeRotation = () => {
    switch (activeFace) {
      case "volunteer": return "rotateY(0deg) rotateX(-12deg) rotateZ(0deg)";
      case "ngo": return "rotateY(-90deg) rotateX(-12deg) rotateZ(0deg)";
      case "donor": return "rotateY(-180deg) rotateX(-12deg) rotateZ(0deg)";
      case "csr": return "rotateY(-270deg) rotateX(-12deg) rotateZ(0deg)";
      default: return "rotateY(0deg) rotateX(-12deg)";
    }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans text-zinc-100 overflow-hidden relative" id="landing-page-root">
      
      {/* Interactive 3D Backdrop wave */}
      <DigitalThreeDBackdrop />

      {/* Decorative background ambient blobs */}
      <div className="absolute top-[8%] left-[4%] w-[420px] h-[420px] bg-indigo-600/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-[42%] right-[4%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[8%] left-[18%] w-[380px] h-[380px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-12 lg:py-24 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-section">
        
        {/* Left text column */}
        <div className="lg:col-span-6 space-y-6 relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <Sparkle className="h-4 w-4 animate-pulse text-emerald-400 fill-emerald-400/20" /> Together, We Create Impact
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-sans"
          >
            Connecting Hearts.<br />
            Empowering Change.<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm font-black">Building a Better Tomorrow.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed mx-auto lg:mx-0 font-sans"
          >
            NGO Connect bridges the gap between passionate volunteers, impactful NGOs, and generous donors to create a stronger, better world together.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start"
          >
            <button
              onClick={onJoinAsVolunteer}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs uppercase tracking-wider font-mono"
            >
              Join as Volunteer <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("opportunities")}
              className="px-8 py-3.5 border border-zinc-800 bg-zinc-900/60 backdrop-blur-md text-zinc-200 font-bold rounded-xl hover:bg-zinc-850 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg text-xs uppercase tracking-wider font-mono"
            >
              Explore Opportunities
            </button>
          </motion.div>

          {/* Stacking circles and "+10K Active Volunteers" badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Trusted by thousands of changemakers</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                  alt="Volunteer 1"
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
                  alt="Volunteer 2"
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60"
                  alt="Volunteer 3"
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60"
                  alt="Volunteer 4"
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  referrerPolicy="no-referrer"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60"
                  alt="Volunteer 5"
                  className="h-8 w-8 rounded-full border-2 border-zinc-950 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs font-mono shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                10K+ Active Volunteers
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column: Interactive 3D Circle Showcase */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative z-20" id="hero-interactive-3d-pane">
          
          {/* Action Tabs to highlight different communities in the 3D Circle */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6 bg-zinc-950/60 border border-zinc-850 p-1.5 rounded-2xl max-w-md backdrop-blur-md">
            {(["volunteer", "ngo", "donor", "csr"] as const).map((face) => (
              <button
                key={face}
                onClick={() => setActiveFace(face)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border ${
                  activeFace === face
                    ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-white"
                }`}
              >
                {face === "csr" ? "Corporate" : face}
              </button>
            ))}
          </div>

          {/* 3D Scene Viewport with custom HumanCircle3DCanvas */}
          <div className="relative w-full max-w-[580px] lg:max-w-[640px] h-[420px] md:h-[530px] flex items-center justify-center" id="scene-3d-viewport">
            {/* Ambient base glow */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-500/8 via-transparent to-transparent blur-3xl pointer-events-none animate-pulse duration-3000" />
            
            <HumanCircle3DCanvas activeTab={activeFace} />
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="bg-zinc-950/40 border-y border-zinc-800/60 py-12 relative z-10 backdrop-blur-md shadow-2xl animate-fade-in" id="stats-ticker-board">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left justify-center">
                <div className={`p-4.5 rounded-2xl ${st.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{st.value}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">{st.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trusted By Brands section (from screenshot) */}
      <section className="py-12 border-b border-zinc-850/60 relative z-10 bg-zinc-950/20" id="trusted-by-brands">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">Trusted by Leading Organizations Worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-45 grayscale hover:opacity-75 transition-opacity duration-300">
            {/* UNICEF */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m0-4.5A2.5 2.5 0 0118.5 7h-.5a2 2 0 00-2 2v3m1.857 8.584a9 9 0 11-13.714 0" />
              </svg>
              <span>UNICEF</span>
            </div>
            
            {/* World Health Organization */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <span className="text-emerald-400 font-mono text-xs">🩺</span>
              <span>WHO Org</span>
            </div>

            {/* Save the Children */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <span className="text-emerald-400 text-xs font-bold font-mono">👶</span>
              <span>Save the Children</span>
            </div>

            {/* GREENPEACE */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <span className="text-emerald-400 text-xs font-bold font-mono">🌿</span>
              <span>GREENPEACE</span>
            </div>

            {/* care */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <span className="text-emerald-400 text-xs font-bold font-mono">🤝</span>
              <span>care</span>
            </div>

            {/* Red Cross */}
            <div className="flex items-center gap-1.5 select-none cursor-default text-sm font-black text-zinc-300 font-sans tracking-tight">
              <span className="text-rose-500 text-sm font-bold font-mono">✚</span>
              <span>Red Cross</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits / Core Tech utilizing 3D tilting hover cards */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12 relative z-10 font-sans" id="benefits-section">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white">A Premium Social Impact System</h2>
          <p className="text-zinc-400 text-xs md:text-sm">Building accountability, gamified loops, and verified certifications with deep tech integrations.</p>
        </div>

        {/* 3D Tilted grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((bf, idx) => {
            const Icon = bf.icon;
            return (
              <ThreeDCard key={idx} glowColor={bf.color} className="flex flex-col h-full justify-between min-h-[220px]">
                <div className="space-y-4">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{bf.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{bf.desc}</p>
                </div>
              </ThreeDCard>
            );
          })}
        </div>
      </section>

      {/* Fundraising Campaigns Overview */}
      <section className="bg-zinc-950/20 py-20 border-t border-zinc-800/60 relative z-10" id="campaigns-landing-panel">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">Active Campaigns</h2>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">Support verified non-profit fundraising targets with full financial oversight.</p>
            </div>
            <button
              onClick={() => onNavigate("donations")}
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-850 hover:text-white hover:border-zinc-700 transition-all cursor-pointer shadow-lg"
            >
              View All Campaigns
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {campaigns.slice(0, 3).map((camp) => {
              const pct = Math.min(100, Math.floor((camp.currentAmount / camp.goalAmount) * 100));
              return (
                <div key={camp.id} className="glass-panel rounded-3xl overflow-hidden border border-zinc-800/80 shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all flex flex-col justify-between group bg-zinc-950/30">
                  <div className="p-6 space-y-4">
                    {/* NGO Tag */}
                    <div className="flex items-center gap-2">
                      <img src={camp.ngoAvatar} alt={camp.ngoName} className="h-7 w-7 rounded-full object-cover border border-zinc-800" />
                      <span className="text-xs font-semibold text-zinc-400">{camp.ngoName}</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">{camp.title}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed mt-1 line-clamp-3">{camp.description}</p>
                    </div>
                  </div>

                  {/* Funding Bar */}
                  <div className="px-6 pb-6 pt-4 bg-zinc-950/60 border-t border-zinc-800/50 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-zinc-400">
                        <span>Funded</span>
                        <span className="text-white font-mono">{pct}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider">RAISED</p>
                        <p className="text-emerald-400 font-extrabold font-mono">${camp.currentAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 font-mono text-[9px] uppercase font-bold tracking-wider">GOAL</p>
                        <p className="text-white font-mono font-bold">${camp.goalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate("donations")}
                      className="w-full py-2.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
                    >
                      Donate with Stripe <Heart className="h-3.5 w-3.5 fill-white text-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12 relative z-10" id="testimonials">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-white">Approved NGO Stories</h2>
          <p className="text-zinc-400 text-xs md:text-sm">Hear what verified non-profit associations say about our AI matching system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel border border-zinc-800/80 p-8 rounded-3xl shadow-xl space-y-4 hover:border-zinc-700/80 transition-all duration-300 bg-zinc-950/20">
            <p className="text-zinc-300 text-xs md:text-sm italic leading-relaxed">
              "We struggled for months recruiting developers or coordinators to organize local reading workshops. NGO Connect matched us with 12 remote teachers based on their actual skills in under 48 hours! Absolute game changer for our operations."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=100&auto=format&fit=crop&q=60"
                alt="Arthur Pendelton"
                className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Arthur Pendelton</h4>
                <p className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-wider">DIRECTOR, BRIGHT MINDS FOUNDATION</p>
              </div>
            </div>
          </div>

          <div className="glass-panel border border-zinc-800/80 p-8 rounded-3xl shadow-xl space-y-4 hover:border-zinc-700/80 transition-all duration-300 bg-zinc-950/20">
            <p className="text-zinc-300 text-xs md:text-sm italic leading-relaxed">
              "The Stripe subscription integration makes raising funds effortless. Donors see exactly which reforestation site coordinates their funds support, building unparalleled trust and regular support tiers."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&auto=format&fit=crop&q=60"
                alt="Sarah Jenkins"
                className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Sarah Jenkins</h4>
                <p className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-wider">ECO LEAD, GREENEARTH ALLIANCE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-zinc-950 to-[#0A0A0A] border-t border-zinc-800/60 py-20 px-6 relative overflow-hidden" id="cta-landing">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">Ready to bridge the social gap?</h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            Register as a Volunteer to build your resume, list your organization as an NGO to expand local presence, or coordinate corporate CSR programs for employee volunteering tracking.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onJoinAsVolunteer}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Join the Alliance
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
