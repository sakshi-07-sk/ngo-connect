import React, { useRef, useEffect } from "react";

interface HumanCircle3DCanvasProps {
  activeTab?: "volunteer" | "ngo" | "donor" | "csr";
}

interface Member {
  name: string;
  role: "volunteer" | "ngo" | "donor" | "csr";
  roleLabel: string;
  color: string;
  angleOffset: number;
  shirtColor: string;
  pantsColor: string;
  hairColor: string;
  skinColor: string;
  type: "volunteer" | "student" | "doctor" | "teacher" | "elderly" | "child" | "corporate";
  gender: "m" | "f";
  heightScale: number;
  accessoryColor?: string;
}

interface Particle {
  x3d: number;
  y3d: number; // height (up is negative)
  z3d: number;
  size: number;
  speed: number;
  phase: number;
  phaseSpeed: number;
  color: string;
}

export default function HumanCircle3DCanvas({ activeTab = "volunteer" }: HumanCircle3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    let mouseX = 0;
    let mouseY = 0;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const targetX = (e.clientX - rect.left - rect.width / 2) * 0.05;
      const targetY = (e.clientY - rect.top - rect.height / 2) * 0.05;
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let count = 0;

    // Define 20 highly diverse community members standing in a perfect circle holding hands
    const members: Member[] = [
      { name: "Marcus 🌱", role: "volunteer", roleLabel: "Eco Leader", color: "#10b981", angleOffset: (0 / 20) * Math.PI * 2, shirtColor: "#059669", pantsColor: "#374151", hairColor: "#1f2937", skinColor: "#f87171", type: "volunteer", gender: "m", heightScale: 1.0 },
      { name: "Sophia 🤝", role: "csr", roleLabel: "CSR VP", color: "#a855f7", angleOffset: (1 / 20) * Math.PI * 2, shirtColor: "#7e22ce", pantsColor: "#1e1b4b", hairColor: "#b45309", skinColor: "#fed7aa", type: "corporate", gender: "f", heightScale: 0.98, accessoryColor: "#c084fc" },
      { name: "Dr. Julian 🩺", role: "ngo", roleLabel: "Medical Lead", color: "#3b82f6", angleOffset: (2 / 20) * Math.PI * 2, shirtColor: "#1d4ed8", pantsColor: "#4b5563", hairColor: "#4b5563", skinColor: "#ffedd5", type: "doctor", gender: "m", heightScale: 1.03 },
      { name: "Elena 🌸", role: "volunteer", roleLabel: "Teacher", color: "#10b981", angleOffset: (3 / 20) * Math.PI * 2, shirtColor: "#10b981", pantsColor: "#334155", hairColor: "#ca8a04", skinColor: "#fbcfe8", type: "teacher", gender: "f", heightScale: 0.96 },
      { name: "Leo 🎒", role: "volunteer", roleLabel: "Youth Vol", color: "#10b981", angleOffset: (4 / 20) * Math.PI * 2, shirtColor: "#f59e0b", pantsColor: "#1e293b", hairColor: "#78350f", skinColor: "#fcd34d", type: "child", gender: "m", heightScale: 0.72 },
      { name: "Mr. Charles 👴", role: "donor", roleLabel: "Angel Investor", color: "#f43f5e", angleOffset: (5 / 20) * Math.PI * 2, shirtColor: "#be123c", pantsColor: "#0f172a", hairColor: "#e4e4e7", skinColor: "#ffedd5", type: "elderly", gender: "m", heightScale: 0.94 },
      { name: "Aria ✨", role: "ngo", roleLabel: "Food Bank Dir", color: "#3b82f6", angleOffset: (6 / 20) * Math.PI * 2, shirtColor: "#2563eb", pantsColor: "#1f2937", hairColor: "#111827", skinColor: "#f59e0b", type: "volunteer", gender: "f", heightScale: 0.97 },
      { name: "Lucas 🏢", role: "csr", roleLabel: "CSR Analyst", color: "#a855f7", angleOffset: (7 / 20) * Math.PI * 2, shirtColor: "#6b21a8", pantsColor: "#0f172a", hairColor: "#1f2937", skinColor: "#ffedd5", type: "corporate", gender: "m", heightScale: 1.02, accessoryColor: "#3b82f6" },
      { name: "Zoe 🎨", role: "volunteer", roleLabel: "Student Vol", color: "#10b981", angleOffset: (8 / 20) * Math.PI * 2, shirtColor: "#ec4899", pantsColor: "#374151", hairColor: "#db2777", skinColor: "#fef08a", type: "child", gender: "f", heightScale: 0.70 },
      { name: "Grace 💖", role: "donor", roleLabel: "Philanthropist", color: "#f43f5e", angleOffset: (9 / 20) * Math.PI * 2, shirtColor: "#e11d48", pantsColor: "#111827", hairColor: "#78350f", skinColor: "#ffedd5", type: "volunteer", gender: "f", heightScale: 1.0 },
      { name: "Dr. Sarah 🩺", role: "ngo", roleLabel: "Surgeon NGO", color: "#3b82f6", angleOffset: (10 / 20) * Math.PI * 2, shirtColor: "#1e3a8a", pantsColor: "#475569", hairColor: "#000000", skinColor: "#fed7aa", type: "doctor", gender: "f", heightScale: 0.99 },
      { name: "James 🎒", role: "volunteer", roleLabel: "College Guide", color: "#10b981", angleOffset: (11 / 20) * Math.PI * 2, shirtColor: "#047857", pantsColor: "#334155", hairColor: "#1f2937", skinColor: "#fbcfe8", type: "student", gender: "m", heightScale: 1.02 },
      { name: "Mr. Arthur 💼", role: "csr", roleLabel: "VP Relations", color: "#a855f7", angleOffset: (12 / 20) * Math.PI * 2, shirtColor: "#581c87", pantsColor: "#090d16", hairColor: "#71717a", skinColor: "#fed7aa", type: "corporate", gender: "m", heightScale: 1.01, accessoryColor: "#10b981" },
      { name: "Lily 🌸", role: "volunteer", roleLabel: "Green Activist", color: "#10b981", angleOffset: (13 / 20) * Math.PI * 2, shirtColor: "#0d9488", pantsColor: "#312e81", hairColor: "#b45309", skinColor: "#ffedd5", type: "student", gender: "f", heightScale: 0.95 },
      { name: "Emma 💎", role: "donor", roleLabel: "Elite Donor", color: "#f43f5e", angleOffset: (14 / 20) * Math.PI * 2, shirtColor: "#be123c", pantsColor: "#1e1b4b", hairColor: "#d97706", skinColor: "#fed7aa", type: "corporate", gender: "f", heightScale: 0.97, accessoryColor: "#f43f5e" },
      { name: "Oliver 🌟", role: "donor", roleLabel: "Tech Founder", color: "#f43f5e", angleOffset: (15 / 20) * Math.PI * 2, shirtColor: "#e11d48", pantsColor: "#111827", hairColor: "#000000", skinColor: "#ffedd5", type: "corporate", gender: "m", heightScale: 1.04 },
      { name: "Chloe 🦊", role: "ngo", roleLabel: "Eco NGO Org", color: "#3b82f6", angleOffset: (16 / 20) * Math.PI * 2, shirtColor: "#2563eb", pantsColor: "#3f3f46", hairColor: "#ea580c", skinColor: "#fef08a", type: "teacher", gender: "f", heightScale: 0.98 },
      { name: "Liam 💖", role: "donor", roleLabel: "Benefactor", color: "#f43f5e", angleOffset: (17 / 20) * Math.PI * 2, shirtColor: "#9f1239", pantsColor: "#18181b", hairColor: "#451a03", skinColor: "#fed7aa", type: "volunteer", gender: "m", heightScale: 1.01 },
      { name: "Nisha 🌿", role: "ngo", roleLabel: "Community Dev", color: "#3b82f6", angleOffset: (18 / 20) * Math.PI * 2, shirtColor: "#0284c7", pantsColor: "#1e293b", hairColor: "#18181b", skinColor: "#fcd34d", type: "volunteer", gender: "f", heightScale: 0.97 },
      { name: "Owen 🏢", role: "csr", roleLabel: "Impact Manager", color: "#a855f7", angleOffset: (19 / 20) * Math.PI * 2, shirtColor: "#4c1d95", pantsColor: "#111827", hairColor: "#1f2937", skinColor: "#ffedd5", type: "corporate", gender: "m", heightScale: 1.0, accessoryColor: "#f43f5e" }
    ];

    // Initialize floating glowing 3D particles spreading upward from centerpiece
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x3d: (Math.random() - 0.5) * 120,
        y3d: -Math.random() * 180, // initial spread upwards
        z3d: (Math.random() - 0.5) * 120,
        size: Math.random() * 2.5 + 0.8,
        speed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.02 + 0.01,
        color: i % 3 === 0 ? "#10b981" : i % 3 === 1 ? "#3b82f6" : "#a855f7"
      });
    }

    const drawCharacter = (
      pCtx: CanvasRenderingContext2D,
      member: Member,
      x: number,
      y: number,
      s: number,
      isHighlighted: boolean,
      bounce: number,
      isReflection: boolean
    ) => {
      pCtx.save();
      
      // If reflection, flip vertically and apply alpha scaling down
      if (isReflection) {
        pCtx.translate(x, y);
        pCtx.scale(1, -0.75); // compress reflection slightly for dynamic look
        pCtx.translate(-x, -y);
        pCtx.globalAlpha = 0.22 * Math.max(0, 1 - Math.abs(bounce) * 0.1);
      }

      const bodyS = s * member.heightScale;

      // 1. Leg Shading and Geometry
      pCtx.lineWidth = 3.2 * bodyS;
      pCtx.lineCap = "round";

      // Left Leg
      const legGradL = pCtx.createLinearGradient(x - 4 * bodyS, y - 12 * bodyS, x - 2 * bodyS, y);
      legGradL.addColorStop(0, member.pantsColor);
      legGradL.addColorStop(1, "#020617");
      pCtx.strokeStyle = legGradL;
      pCtx.beginPath();
      pCtx.moveTo(x - 3.2 * bodyS, y - 11 * bodyS);
      pCtx.lineTo(x - 3.2 * bodyS, y);
      pCtx.stroke();

      // Right Leg
      const legGradR = pCtx.createLinearGradient(x + 2 * bodyS, y - 12 * bodyS, x + 4 * bodyS, y);
      legGradR.addColorStop(0, member.pantsColor);
      legGradR.addColorStop(1, "#020617");
      pCtx.strokeStyle = legGradR;
      pCtx.beginPath();
      pCtx.moveTo(x + 3.2 * bodyS, y - 11 * bodyS);
      pCtx.lineTo(x + 3.2 * bodyS, y);
      pCtx.stroke();

      // Shoes
      pCtx.fillStyle = isReflection ? "transparent" : "#1e293b";
      pCtx.beginPath();
      pCtx.arc(x - 3.2 * bodyS, y, 1.8 * bodyS, 0, Math.PI * 2);
      pCtx.arc(x + 3.2 * bodyS, y, 1.8 * bodyS, 0, Math.PI * 2);
      pCtx.fill();

      // 2. Torso (Shirt / Hoodie / Suit Jacket)
      const shirtHeight = 15 * bodyS;
      const shirtY = y - 26 * bodyS;
      
      pCtx.beginPath();
      pCtx.moveTo(x - 6.5 * bodyS, y - 11 * bodyS);
      pCtx.lineTo(x - 6.5 * bodyS, shirtY + 4 * bodyS);
      pCtx.quadraticCurveTo(x - 6 * bodyS, shirtY, x, shirtY);
      pCtx.quadraticCurveTo(x + 6 * bodyS, shirtY, x + 6.5 * bodyS, shirtY + 4 * bodyS);
      pCtx.lineTo(x + 6.5 * bodyS, y - 11 * bodyS);
      pCtx.closePath();

      // 3D Shading for Torso
      const torsoGrad = pCtx.createLinearGradient(x - 6 * bodyS, shirtY, x + 6 * bodyS, y - 11 * bodyS);
      torsoGrad.addColorStop(0, member.shirtColor);
      torsoGrad.addColorStop(0.3, member.shirtColor);
      torsoGrad.addColorStop(0.7, lightenColor(member.shirtColor, 20));
      torsoGrad.addColorStop(1, darkenColor(member.shirtColor, 35));
      pCtx.fillStyle = torsoGrad;
      pCtx.fill();

      // Clothing Details based on Type
      if (member.type === "doctor") {
        // Lab coat overlay (White lapels)
        pCtx.fillStyle = "#f8fafc";
        pCtx.beginPath();
        pCtx.moveTo(x - 6.5 * bodyS, shirtY + 4 * bodyS);
        pCtx.lineTo(x - 2 * bodyS, shirtY + 2 * bodyS);
        pCtx.lineTo(x - 1 * bodyS, y - 12 * bodyS);
        pCtx.lineTo(x - 6.5 * bodyS, y - 11 * bodyS);
        pCtx.closePath();
        pCtx.fill();

        pCtx.beginPath();
        pCtx.moveTo(x + 6.5 * bodyS, shirtY + 4 * bodyS);
        pCtx.lineTo(x + 2 * bodyS, shirtY + 2 * bodyS);
        pCtx.lineTo(x + 1 * bodyS, y - 12 * bodyS);
        pCtx.lineTo(x + 6.5 * bodyS, y - 11 * bodyS);
        pCtx.closePath();
        pCtx.fill();

        // Stethoscope around neck
        pCtx.strokeStyle = "#94a3b8";
        pCtx.lineWidth = 1.2 * bodyS;
        pCtx.beginPath();
        pCtx.arc(x, shirtY + 3 * bodyS, 3 * bodyS, 0, Math.PI, false);
        pCtx.stroke();
      } else if (member.type === "corporate") {
        // White collar inner
        pCtx.fillStyle = "#ffffff";
        pCtx.beginPath();
        pCtx.moveTo(x - 2.5 * bodyS, shirtY + 1 * bodyS);
        pCtx.lineTo(x + 2.5 * bodyS, shirtY + 1 * bodyS);
        pCtx.lineTo(x, shirtY + 5 * bodyS);
        pCtx.closePath();
        pCtx.fill();

        // Smart neck tie
        pCtx.fillStyle = member.accessoryColor || "#3b82f6";
        pCtx.beginPath();
        pCtx.moveTo(x - 0.8 * bodyS, shirtY + 4 * bodyS);
        pCtx.lineTo(x + 0.8 * bodyS, shirtY + 4 * bodyS);
        pCtx.lineTo(x + 1.2 * bodyS, shirtY + 11 * bodyS);
        pCtx.lineTo(x, shirtY + 13 * bodyS);
        pCtx.lineTo(x - 1.2 * bodyS, shirtY + 11 * bodyS);
        pCtx.closePath();
        pCtx.fill();
      } else if (member.type === "volunteer") {
        // Eco Green Sash
        pCtx.fillStyle = "rgba(16, 185, 129, 0.75)";
        pCtx.beginPath();
        pCtx.moveTo(x - 5.5 * bodyS, shirtY + 3 * bodyS);
        pCtx.lineTo(x - 4 * bodyS, shirtY + 2 * bodyS);
        pCtx.lineTo(x + 5.5 * bodyS, y - 12 * bodyS);
        pCtx.lineTo(x + 4 * bodyS, y - 11 * bodyS);
        pCtx.closePath();
        pCtx.fill();

        // Small leaf emblem on chest
        pCtx.fillStyle = "#34d399";
        pCtx.beginPath();
        pCtx.ellipse(x - 2 * bodyS, shirtY + 7 * bodyS, 1.2 * bodyS, 0.6 * bodyS, Math.PI / 4, 0, Math.PI * 2);
        pCtx.fill();
      } else if (member.type === "student") {
        // Backpack shoulder straps
        pCtx.strokeStyle = "#1e293b";
        pCtx.lineWidth = 1.6 * bodyS;
        pCtx.beginPath();
        pCtx.moveTo(x - 5 * bodyS, shirtY + 3 * bodyS);
        pCtx.lineTo(x - 3.5 * bodyS, y - 11 * bodyS);
        pCtx.moveTo(x + 5 * bodyS, shirtY + 3 * bodyS);
        pCtx.lineTo(x + 3.5 * bodyS, y - 11 * bodyS);
        pCtx.stroke();
      } else if (member.type === "elderly") {
        // Retro sweater patterns
        pCtx.strokeStyle = "rgba(255,255,255,0.18)";
        pCtx.lineWidth = 1 * bodyS;
        pCtx.beginPath();
        pCtx.moveTo(x - 6 * bodyS, shirtY + 8 * bodyS);
        pCtx.lineTo(x + 6 * bodyS, shirtY + 8 * bodyS);
        pCtx.moveTo(x - 6 * bodyS, shirtY + 12 * bodyS);
        pCtx.lineTo(x + 6 * bodyS, shirtY + 12 * bodyS);
        pCtx.stroke();
      }

      // 3. Neck
      const neckY = shirtY - 1 * bodyS;
      pCtx.fillStyle = member.skinColor;
      pCtx.fillRect(x - 1.8 * bodyS, neckY - 2.5 * bodyS, 3.6 * bodyS, 3 * bodyS);

      // 4. Head with 3D Pixar Spherical Shading
      const headRadius = 4.2 * bodyS;
      const headY = neckY - headRadius;
      
      const skinGrad = pCtx.createRadialGradient(x - 1.2 * bodyS, headY - 1.2 * bodyS, 0, x, headY, headRadius);
      skinGrad.addColorStop(0, lightenColor(member.skinColor, 35));
      skinGrad.addColorStop(0.5, member.skinColor);
      skinGrad.addColorStop(1, darkenColor(member.skinColor, 25));
      pCtx.fillStyle = skinGrad;
      pCtx.beginPath();
      pCtx.arc(x, headY, headRadius, 0, Math.PI * 2);
      pCtx.fill();

      // Friendly Face details (Eyes and optimistic smile - skipped in reflection)
      if (!isReflection) {
        // Soft eyes
        pCtx.fillStyle = "#1e293b";
        pCtx.beginPath();
        pCtx.arc(x - 1.5 * bodyS, headY - 0.5 * bodyS, 0.5 * bodyS, 0, Math.PI * 2);
        pCtx.arc(x + 1.5 * bodyS, headY - 0.5 * bodyS, 0.5 * bodyS, 0, Math.PI * 2);
        pCtx.fill();

        // Optimistic cute smile
        pCtx.strokeStyle = "#475569";
        pCtx.lineWidth = 0.8 * bodyS;
        pCtx.beginPath();
        pCtx.arc(x, headY + 1.2 * bodyS, 1.2 * bodyS, 0.15 * Math.PI, 0.85 * Math.PI, false);
        pCtx.stroke();

        // Extra details: Glasses for elderly / corporate/ teacher
        if (member.type === "elderly" || member.type === "teacher") {
          pCtx.strokeStyle = "#cbd5e1";
          pCtx.lineWidth = 0.6 * bodyS;
          pCtx.beginPath();
          pCtx.arc(x - 1.6 * bodyS, headY - 0.5 * bodyS, 1.1 * bodyS, 0, Math.PI * 2);
          pCtx.arc(x + 1.6 * bodyS, headY - 0.5 * bodyS, 1.1 * bodyS, 0, Math.PI * 2);
          pCtx.moveTo(x - 0.5 * bodyS, headY - 0.5 * bodyS);
          pCtx.lineTo(x + 0.5 * bodyS, headY - 0.5 * bodyS);
          pCtx.stroke();
        }
      }

      // 5. Hair (Custom hairstyles for different community members)
      pCtx.fillStyle = member.hairColor;
      if (member.gender === "f") {
        // Feminine hair style (rounded top + flows)
        pCtx.beginPath();
        pCtx.arc(x, headY - 1 * bodyS, 4.4 * bodyS, Math.PI, 0); // hair top cap
        pCtx.fill();

        // Hair strands/curls on side
        pCtx.beginPath();
        pCtx.roundRect(x - 4.5 * bodyS, headY - 1 * bodyS, 1.4 * bodyS, 7.5 * bodyS, 1 * bodyS);
        pCtx.roundRect(x + 3.1 * bodyS, headY - 1 * bodyS, 1.4 * bodyS, 7.5 * bodyS, 1 * bodyS);
        pCtx.fill();
        
        // Ponytail / Long hair backing details
        pCtx.beginPath();
        pCtx.ellipse(x, headY + 2 * bodyS, 4.5 * bodyS, 5.5 * bodyS, 0, 0, Math.PI);
        pCtx.fill();
      } else {
        // Masculine hair style
        pCtx.beginPath();
        pCtx.arc(x, headY - 1.2 * bodyS, 4.4 * bodyS, Math.PI * 1.05, Math.PI * 1.95);
        pCtx.ellipse(x, headY - 2.5 * bodyS, 4 * bodyS, 2.5 * bodyS, 0, 0, Math.PI * 2);
        pCtx.fill();

        // Hair sideburns
        pCtx.fillRect(x - 4.4 * bodyS, headY - 1.5 * bodyS, 1.1 * bodyS, 3 * bodyS);
        pCtx.fillRect(x + 3.3 * bodyS, headY - 1.5 * bodyS, 1.1 * bodyS, 3 * bodyS);
      }

      pCtx.restore();
    };

    // Helper functions for 3D gradient colors
    const lightenColor = (hex: string, percent: number): string => {
      hex = hex.replace(/^\s*#|\s*$/g, "");
      if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
      let r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
      r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
      g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
      b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };

    const darkenColor = (hex: string, percent: number): string => {
      hex = hex.replace(/^\s*#|\s*$/g, "");
      if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
      let r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);
      r = Math.max(0, Math.floor(r * (1 - percent / 100)));
      g = Math.max(0, Math.floor(g * (1 - percent / 100)));
      b = Math.max(0, Math.floor(b * (1 - percent / 100)));
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      count += 0.012; // slow cinematic rotation speed

      // 1. Camera System: Subtle cinematic floating & parallax zoom
      const zoomFactor = 1.0 + Math.sin(count * 0.15) * 0.015; // gentle slow zoom breathing
      const floatX = Math.sin(count * 0.35) * 6; // slow floating lissajous motion
      const floatY = Math.cos(count * 0.28) * 4;

      const centerX = width / 2 + floatX;
      const centerY = height / 2 + 10 + floatY;
      const R = Math.min(width, height) * 0.30 * zoomFactor; // perfect scale circle radius

      // Perspective tilt angles (30 degree pitch look-down angle + mouse control)
      const angleX = 0.96 + mouseY * 0.0035; 
      const angleY = count * 0.12 + mouseX * 0.0035; // slow continuous horizontal turn

      // 2. Draw Floor Reflection Base Grid
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      const isCanvasLight = document.documentElement.classList.contains("light-theme");

      // Dark futuristic glossy floor base shadow
      const baseShadowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, R * 1.6);
      if (isCanvasLight) {
        baseShadowGrad.addColorStop(0, "rgba(15, 23, 42, 0.12)");
        baseShadowGrad.addColorStop(0.5, "rgba(15, 23, 42, 0.04)");
        baseShadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        baseShadowGrad.addColorStop(0, "rgba(5, 8, 22, 0.75)");
        baseShadowGrad.addColorStop(0.5, "rgba(3, 4, 12, 0.42)");
        baseShadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = baseShadowGrad;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, R * 1.7, R * 1.7 * Math.sin(angleX), 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing central floor neon energy core
      const centralGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, R * 0.7);
      centralGlow.addColorStop(0, "rgba(34, 197, 94, 0.32)"); // Emerald Green Core glow
      centralGlow.addColorStop(0.4, "rgba(59, 130, 246, 0.12)"); // transition to Electric Blue
      centralGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = centralGlow;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, R * 0.75, R * 0.75 * Math.sin(angleX), 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Concentric Holographic Light Waves (Pulsing outwards from centerpiece)
      for (let i = 0; i < 4; i++) {
        const rippleR = ((count * 45 + i * R * 0.45) % (R * 1.4)) + 15;
        const maxRippleRadius = R * 1.4;
        const progress = rippleR / maxRippleRadius;
        const opacity = Math.max(0, (1 - progress) * 0.35);

        // Mix electric blue and emerald green based on pulse wave distance
        ctx.strokeStyle = i % 2 === 0 
          ? `rgba(34, 197, 94, ${opacity})` 
          : `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, rippleR, rippleR * Math.sin(angleX), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Volumetric Upward Neon Light Beam from centerpiece
      const lightBeamHeight = 160;
      const lightBeam = ctx.createLinearGradient(centerX, centerY - lightBeamHeight, centerX, centerY + 10);
      lightBeam.addColorStop(0, "rgba(34, 197, 94, 0)");
      lightBeam.addColorStop(0.5, "rgba(34, 197, 94, 0.08)");
      lightBeam.addColorStop(0.85, "rgba(59, 130, 246, 0.16)");
      lightBeam.addColorStop(1, "rgba(34, 197, 94, 0.28)");
      ctx.fillStyle = lightBeam;
      ctx.beginPath();
      ctx.moveTo(centerX - R * 0.16, centerY);
      ctx.bezierCurveTo(centerX - R * 0.1, centerY - lightBeamHeight * 0.6, centerX - R * 0.06, centerY - lightBeamHeight, centerX, centerY - lightBeamHeight);
      ctx.bezierCurveTo(centerX + R * 0.06, centerY - lightBeamHeight, centerX + R * 0.1, centerY - lightBeamHeight * 0.6, centerX + R * 0.16, centerY);
      ctx.closePath();
      ctx.fill();

      // 5. Draw Rotating Concentric Holographic Core Rings
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, R * 0.4, R * 0.4 * Math.sin(angleX), 0, count * 0.8, count * 0.8 + Math.PI * 1.6);
      ctx.stroke();

      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)"; // violet accent ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, R * 0.25, R * 0.25 * Math.sin(angleX), 0, -count * 1.1, -count * 1.1 + Math.PI * 1.5);
      ctx.stroke();

      // 6. Draw floating 3D glowing centerpiece logo forming a glass-like heart
      const centerHeartY = centerY - 14 * Math.sin(angleX) + Math.sin(count * 2.0) * 8; // floating up and down
      const logoScale = R * 0.18;
      
      ctx.save();
      ctx.translate(centerX, centerHeartY);
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 24;
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Draw stylized intertwined figures forming a glowing glass-like heart
      ctx.beginPath();
      // Left shoulder/wing
      ctx.moveTo(-logoScale * 0.08, logoScale * 0.72);
      ctx.bezierCurveTo(-logoScale * 1.12, logoScale * 0.12, -logoScale * 1.12, -logoScale * 0.82, -logoScale * 0.52, -logoScale * 1.02);
      ctx.bezierCurveTo(-logoScale * 0.12, -logoScale * 1.12, -logoScale * 0.06, -logoScale * 0.72, 0, -logoScale * 0.52);
      // Right shoulder/wing
      ctx.bezierCurveTo(logoScale * 0.06, -logoScale * 0.72, logoScale * 0.12, -logoScale * 1.12, logoScale * 0.52, -logoScale * 1.02);
      ctx.bezierCurveTo(logoScale * 1.12, -logoScale * 0.82, logoScale * 1.12, logoScale * 0.12, logoScale * 0.08, logoScale * 0.72);
      // Bottom joint
      ctx.lineTo(0, logoScale * 0.98);
      ctx.closePath();
      ctx.stroke();

      // Glowing heart glass filling
      ctx.shadowBlur = 0;
      const logoFill = ctx.createRadialGradient(0, 0, 0, 0, 0, logoScale);
      logoFill.addColorStop(0, "rgba(16, 185, 129, 0.28)");
      logoFill.addColorStop(0.6, "rgba(59, 130, 246, 0.06)");
      logoFill.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = logoFill;
      ctx.fill();

      // Left and right heads of the stylized community figures forming the heart
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(-logoScale * 0.42, -logoScale * 0.52, logoScale * 0.19, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(logoScale * 0.42, -logoScale * 0.52, logoScale * 0.19, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 7. Render Floating 3D Glowing Particle System (Depth sorted)
      particles.forEach((p) => {
        // Drift particles slowly upwards
        p.y3d -= p.speed;
        p.phase += p.phaseSpeed;

        // Reset particle if it drifts too high
        if (p.y3d < -190) {
          p.y3d = 0;
          p.x3d = (Math.random() - 0.5) * 110;
          p.z3d = (Math.random() - 0.5) * 110;
        }

        // Horizontal sway trajectory
        const swayX = p.x3d + Math.sin(p.phase) * 12;
        const swayZ = p.z3d + Math.cos(p.phase) * 12;

        // 3D projection
        const pRotY = p.y3d * Math.cos(angleX) - swayZ * Math.sin(angleX);
        const pDepth = p.y3d * Math.sin(angleX) + swayZ * Math.cos(angleX) + 600;
        
        const pScale = 500 / pDepth;
        const px2d = centerX + swayX * pScale;
        const py2d = centerY + pRotY * pScale;

        // Draw glowing particle point
        const pProgress = Math.abs(p.y3d) / 190; // opacity fade out near top
        const pAlpha = (1 - pProgress) * 0.72;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(px2d, py2d, p.size * pScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0; // restore
      });

      // 8. Projected 3D coordinates for all 20 human characters
      interface ProjectedMember {
        member: Member;
        x2d: number;
        y2d: number;
        scale: number;
        isHighlighted: boolean;
        depth: number;
        bounce: number;
      }

      const projected: ProjectedMember[] = [];

      members.forEach((m, idx) => {
        // Rotation position
        const finalAngle = m.angleOffset + angleY;

        // Gentle organic breathing wave (staggered phases so movement looks lively)
        const breatheWave = count * 1.8 + idx * 0.45;
        const bounce = Math.sin(breatheWave) * 2.4;

        // Compute 3D coordinates on circle
        const x3d = R * Math.cos(finalAngle);
        const z3d = R * Math.sin(finalAngle);
        const y3d = bounce; // slight vertical movement

        // Rotation tilt matrix transformation
        const xRot = x3d;
        const zRot = z3d;
        const yRot = y3d * Math.cos(angleX) - zRot * Math.sin(angleX);
        const depth = y3d * Math.sin(angleX) + zRot * Math.cos(angleX) + 600;

        // Projecting to 2D screen coordinate space
        const scale = 500 / depth;
        const x2d = centerX + xRot * scale;
        const y2d = centerY + yRot * scale;

        const isHighlighted = m.role === activeTab;

        projected.push({
          member: m,
          x2d,
          y2d,
          scale,
          isHighlighted,
          depth,
          bounce
        });
      });

      // Sort projected characters Back-to-Front (highest depth first) to render overlap occlusion perfectly
      projected.sort((a, b) => b.depth - a.depth);

      // 9. Render Flipped Glossy Floor Reflections first
      projected.forEach(({ member, x2d, y2d, scale, isHighlighted, bounce }) => {
        drawCharacter(ctx, member, x2d, y2d, scale, isHighlighted, bounce, true);
      });

      // 10. Draw Connecting Sleeves ("Holding Hands" link curves)
      // Connect neighbor-to-neighbor in order
      for (let i = 0; i < members.length; i++) {
        const currentIdx = i;
        const nextIdx = (i + 1) % members.length;

        // Midpoint angle representing joined hands
        const angleA = members[currentIdx].angleOffset + angleY;
        const angleB = members[nextIdx].angleOffset + angleY;

        // Handle modular angle wrap
        let diff = angleB - angleA;
        if (diff < -Math.PI) diff += Math.PI * 2;
        if (diff > Math.PI) diff -= Math.PI * 2;
        const midAngle = angleA + diff * 0.5;

        // Arm radial curvature
        const armR = R * 1.015;

        // Compute 3D midpoint of hand clasping
        const mx3d = armR * Math.cos(midAngle);
        const mz3d = armR * Math.sin(midAngle);
        
        // Hand elevation is slightly lower than chest (approx -16.5 height units)
        const breatheA = count * 1.8 + currentIdx * 0.45;
        const breatheB = count * 1.8 + nextIdx * 0.45;
        const midBounce = (Math.sin(breatheA) + Math.sin(breatheB)) * 1.2;
        const my3d = midBounce - 17.5; 

        // Projecting hand midpoint to 2D
        const mRotX = mx3d;
        const mRotY = my3d * Math.cos(angleX) - mz3d * Math.sin(angleX);
        const mDepth = my3d * Math.sin(angleX) + mz3d * Math.cos(angleX) + 600;
        const mScale = 500 / mDepth;

        const mx2d = centerX + mRotX * mScale;
        const my2d = centerY + mRotY * mScale;

        // Find current and next character 2D projected shoulder/body origins
        const curProj = projected.find((p) => p.member.angleOffset === members[currentIdx].angleOffset);
        const nextProj = projected.find((p) => p.member.angleOffset === members[nextIdx].angleOffset);

        if (curProj && nextProj) {
          const sAvg = (curProj.scale + nextProj.scale) / 2;

          // Draw holding hands arms curves
          // Shoulders are at y - 22 * scale
          const curShoulderX = curProj.x2d;
          const curShoulderY = curProj.y2d - 21.5 * curProj.scale * curProj.member.heightScale;
          const nextShoulderX = nextProj.x2d;
          const nextShoulderY = nextProj.y2d - 21.5 * nextProj.scale * nextProj.member.heightScale;

          // Sleeves & arm rendering
          ctx.strokeStyle = "rgba(113, 113, 122, 0.35)"; // subtle gray arm link
          ctx.lineWidth = 2.2 * sAvg;
          ctx.beginPath();
          ctx.moveTo(curShoulderX, curShoulderY);
          ctx.quadraticCurveTo(mx2d, my2d, nextShoulderX, nextShoulderY);
          ctx.stroke();

          // Highlight hand clasps with warm skin tone dots
          ctx.fillStyle = "#fed7aa";
          ctx.beginPath();
          ctx.arc(mx2d, my2d, 2.0 * mScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 11. Draw Main Upright Characters (sorted back-to-front)
      projected.forEach(({ member, x2d, y2d, scale, isHighlighted, bounce }) => {
        // Highlighting glowing pedestal indicator on floor below active roles
        if (isHighlighted) {
          ctx.shadowBlur = 16;
          ctx.shadowColor = member.color;
          ctx.strokeStyle = member.color;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.ellipse(x2d, y2d, 15 * scale, 5.0 * scale * Math.sin(angleX), 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0; // reset shadow for performance
        }

        // Draw upright body
        drawCharacter(ctx, member, x2d, y2d, scale, isHighlighted, bounce, false);

        // Active highlighted member floating text HUD card
        if (isHighlighted) {
          ctx.save();
          ctx.shadowBlur = isCanvasLight ? 3 : 6;
          ctx.shadowColor = isCanvasLight ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.8)";
          
          // Outer glow HUD border badge
          ctx.fillStyle = isCanvasLight ? "rgba(255, 255, 255, 0.96)" : "rgba(10, 10, 12, 0.92)";
          ctx.strokeStyle = member.color;
          ctx.lineWidth = 1.4;
          
          const labelText = member.name;
          const labelRole = member.roleLabel;
          
          const textW1 = ctx.measureText(labelText).width;
          const textW2 = ctx.measureText(labelRole).width;
          const labelWidth = Math.max(105, Math.max(textW1, textW2) + 26);
          
          const sAdjusted = scale * 1.05;
          const lx = x2d - labelWidth / 2;
          const ly = y2d - 58 * sAdjusted;
          const labelHeight = 28 * sAdjusted;

          ctx.beginPath();
          ctx.roundRect(lx, ly, labelWidth, labelHeight, 8 * sAdjusted);
          ctx.fill();
          ctx.stroke();

          // Render active member name and sub-role details
          ctx.shadowBlur = 0;
          ctx.fillStyle = isCanvasLight ? "#0f172a" : "#ffffff";
          ctx.font = `bold ${Math.max(9, Math.round(11 * sAdjusted))}px "Inter", sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(labelText, x2d, ly + 11 * sAdjusted);

          ctx.fillStyle = member.color;
          ctx.font = `bold ${Math.max(7, Math.round(8 * sAdjusted))}px "JetBrains Mono", monospace`;
          ctx.fillText(labelRole, x2d, ly + 21 * sAdjusted);
          ctx.textAlign = "left"; // restore

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-auto z-10 cursor-pointer"
      id="circular-group-people-3d"
    />
  );
}
