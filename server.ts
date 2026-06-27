/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Seed initial mock data
import {
  initialNGOs,
  initialOpportunities,
  initialCampaigns,
  initialCommunityPosts,
  initialDiscussionThreads,
  initialCSRCompany,
  initialVolunteer,
  initialBadges
} from "./src/mockData.js";

import { NGOProfile, Opportunity, Campaign, CommunityPost, DiscussionThread, Donation, Certificate } from "./src/types.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// Shared In-Memory State
const dbState = {
  ngos: [...initialNGOs],
  opportunities: [...initialOpportunities],
  campaigns: [...initialCampaigns],
  posts: [...initialCommunityPosts],
  threads: [...initialDiscussionThreads],
  donations: [] as Donation[],
  volunteer: { ...initialVolunteer },
  csr: { ...initialCSRCompany },
  certificates: [...initialVolunteer.certificates]
};

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      throw new Error("GEMINI_API_KEY environment variable is not configured or is placeholder.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// Core REST API Routes
// ----------------------------------------------------

// GET: All active state
app.get("/api/state", (req: Request, res: Response) => {
  res.json({
    ngos: dbState.ngos,
    opportunities: dbState.opportunities,
    campaigns: dbState.campaigns,
    posts: dbState.posts,
    threads: dbState.threads,
    volunteer: dbState.volunteer,
    csr: dbState.csr,
    donations: dbState.donations,
    certificates: dbState.certificates
  });
});

// POST: Add new opportunity (NGO Feature)
app.post("/api/opportunities", (req: Request, res: Response) => {
  const { ngoId, title, description, skillsRequired, interests, location, date, duration, hoursGained, capacity, isEmergency } = req.body;
  const ngo = dbState.ngos.find(n => n.id === ngoId) || dbState.ngos[0];

  const newOpp: Opportunity = {
    id: `opp_${Date.now()}`,
    ngoId: ngo.id,
    ngoName: ngo.name,
    ngoAvatar: ngo.avatar,
    title: title || "New Volunteering Event",
    description: description || "Join us to support local community action.",
    skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : ["Physical fitness"],
    interests: Array.isArray(interests) ? interests : ["General"],
    location: location || "San Francisco, CA",
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
    date: date || new Date().toISOString().split("T")[0],
    duration: duration || "3 Hours",
    hoursGained: Number(hoursGained) || 3,
    capacity: Number(capacity) || 20,
    applicantsCount: 0,
    status: "open",
    isEmergency: !!isEmergency
  };

  dbState.opportunities.unshift(newOpp);
  res.status(201).json({ success: true, opportunity: newOpp });
});

// POST: Apply for opportunity (Volunteer RSVP & QR)
app.post("/api/opportunities/:id/apply", (req: Request, res: Response) => {
  const { id } = req.params;
  const opp = dbState.opportunities.find(o => o.id === id);

  if (!opp) {
    return res.status(404).json({ error: "Opportunity not found" });
  }

  if (opp.applicantsCount >= opp.capacity) {
    return res.status(400).json({ error: "Opportunity capacity full" });
  }

  // Update opportunity stats
  opp.applicantsCount += 1;

  // Add points to volunteer and log participation
  dbState.volunteer.points += 50;
  dbState.volunteer.totalHours += opp.hoursGained;

  // Add badge if 1st activity
  if (dbState.volunteer.totalHours >= opp.hoursGained && !dbState.volunteer.badges.some(b => b.id === "badge_first_vol")) {
    const firstVolBadge = initialBadges.find(b => b.id === "badge_first_vol");
    if (firstVolBadge) {
      dbState.volunteer.badges.push({ ...firstVolBadge, dateEarned: new Date().toISOString().split("T")[0] });
    }
  }

  // Add a Certificate if hours are updated significantly
  const newCert: Certificate = {
    id: `cert_${Date.now()}`,
    title: `${opp.title} Appreciation`,
    ngoName: opp.ngoName,
    date: new Date().toISOString().split("T")[0],
    hours: opp.hoursGained,
    credentialCode: `CERT-NGO-${Math.floor(1000 + Math.random() * 9000)}-${opp.ngoId.substring(4, 8).toUpperCase()}`,
    recipientName: dbState.volunteer.name
  };
  dbState.certificates.unshift(newCert);
  dbState.volunteer.certificates = [...dbState.certificates];

  res.json({
    success: true,
    message: "Application registered successfully! Points earned: 50. QR Ticket generated.",
    opportunity: opp,
    volunteer: dbState.volunteer,
    certificate: newCert
  });
});

// POST: Create campaign
app.post("/api/campaigns", (req: Request, res: Response) => {
  const { ngoId, title, description, goalAmount, deadline, category } = req.body;
  const ngo = dbState.ngos.find(n => n.id === ngoId) || dbState.ngos[0];

  const newCampaign: Campaign = {
    id: `camp_${Date.now()}`,
    ngoId: ngo.id,
    ngoName: ngo.name,
    ngoAvatar: ngo.avatar,
    title: title || "New Campaign Drive",
    description: description || "Support our local efforts through donating today.",
    goalAmount: Number(goalAmount) || 10000,
    currentAmount: 0,
    deadline: deadline || "2026-12-31",
    status: "active",
    category: category || "Environment"
  };

  dbState.campaigns.unshift(newCampaign);
  res.status(201).json({ success: true, campaign: newCampaign });
});

// POST: Support NGO Campaign / Stripe Donation Simulator
app.post("/api/campaigns/:id/donate", (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount, donorName, donorEmail, isRecurring, isAnonymous } = req.body;
  const camp = dbState.campaigns.find(c => c.id === id);

  if (!camp) {
    return res.status(404).json({ error: "Campaign not found" });
  }

  const donationAmount = Number(amount);
  if (isNaN(donationAmount) || donationAmount <= 0) {
    return res.status(400).json({ error: "Invalid donation amount" });
  }

  // Update campaign
  camp.currentAmount += donationAmount;
  if (camp.currentAmount >= camp.goalAmount) {
    camp.status = "completed";
  }

  // Log donation
  const newDonation: Donation = {
    id: `don_${Date.now()}`,
    campaignId: camp.id,
    campaignTitle: camp.title,
    ngoName: camp.ngoName,
    donorName: isAnonymous ? "Anonymous Benefactor" : (donorName || "Jane Doe"),
    donorEmail: isAnonymous ? "" : (donorEmail || "jane.doe@gmail.com"),
    amount: donationAmount,
    date: new Date().toISOString().split("T")[0],
    isRecurring: !!isRecurring,
    isAnonymous: !!isAnonymous,
    status: "success"
  };

  dbState.donations.unshift(newDonation);

  // Update NGO statistics
  const ngo = dbState.ngos.find(n => n.id === camp.ngoId);
  if (ngo) {
    ngo.impactMetrics.donationsRaised += donationAmount;
  }

  // Award gamified points for donating
  dbState.volunteer.points += Math.floor(donationAmount * 2);
  
  // Look for donor badges
  if (dbState.donations.length >= 3 && !dbState.volunteer.badges.some(b => b.id === "badge_super_donor")) {
    const superDonorBadge = initialBadges.find(b => b.id === "badge_super_donor");
    if (superDonorBadge) {
      dbState.volunteer.badges.push({ ...superDonorBadge, dateEarned: new Date().toISOString().split("T")[0] });
    }
  }

  res.json({
    success: true,
    stripeSessionId: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
    donation: newDonation,
    campaign: camp,
    pointsEarned: Math.floor(donationAmount * 2),
    volunteer: dbState.volunteer
  });
});

// POST: Add story / update to community feed
app.post("/api/posts", (req: Request, res: Response) => {
  const { content, authorRole, image } = req.body;

  const newPost: CommunityPost = {
    id: `post_${Date.now()}`,
    authorId: authorRole === "ngo" ? "ngo_green_earth" : "user_sarah_connor",
    authorName: authorRole === "ngo" ? "GreenEarth Alliance" : dbState.volunteer.name,
    authorAvatar: authorRole === "ngo" 
      ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60"
      : dbState.volunteer.avatar,
    authorRole: authorRole || "volunteer",
    content: content || "Celebrating active community initiatives!",
    image: image || undefined,
    likes: 1,
    likedByUser: true,
    comments: [],
    createdAt: new Date().toISOString()
  };

  dbState.posts.unshift(newPost);
  dbState.volunteer.points += 20; // 20 points for social check-in

  res.status(201).json({ success: true, post: newPost, volunteer: dbState.volunteer });
});

// POST: Like post
app.post("/api/posts/:id/like", (req: Request, res: Response) => {
  const { id } = req.params;
  const post = dbState.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (post.likedByUser) {
    post.likes = Math.max(0, post.likes - 1);
    post.likedByUser = false;
  } else {
    post.likes += 1;
    post.likedByUser = true;
  }
  res.json({ success: true, likes: post.likes, likedByUser: post.likedByUser });
});

// POST: Comment on post
app.post("/api/posts/:id/comments", (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const post = dbState.posts.find(p => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const newComment = {
    id: `comm_${Date.now()}`,
    authorName: dbState.volunteer.name,
    authorAvatar: dbState.volunteer.avatar,
    content: content || "Supportive comment!",
    date: new Date().toISOString()
  };

  post.comments.push(newComment);
  res.status(201).json({ success: true, comment: newComment, post });
});

// POST: Start discussion thread
app.post("/api/threads", (req: Request, res: Response) => {
  const { title, content, tags } = req.body;

  const newThread: DiscussionThread = {
    id: `thread_${Date.now()}`,
    title: title || "New Topic Discussion",
    content: content || "Let's share feedback about volunteering experiences.",
    authorName: dbState.volunteer.name,
    authorAvatar: dbState.volunteer.avatar,
    tags: Array.isArray(tags) ? tags : ["General"],
    replies: [],
    likes: 1,
    createdAt: new Date().toISOString()
  };

  dbState.threads.unshift(newThread);
  res.status(201).json({ success: true, thread: newThread });
});

// POST: Reply to discussion thread
app.post("/api/threads/:id/replies", (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const thread = dbState.threads.find(t => t.id === id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });

  const newReply = {
    id: `rep_${Date.now()}`,
    authorName: dbState.volunteer.name,
    authorAvatar: dbState.volunteer.avatar,
    content: content || "Sharing local tips!",
    date: new Date().toISOString(),
    likes: 0
  };

  thread.replies.push(newReply);
  res.status(201).json({ success: true, reply: newReply, thread });
});

// POST: NGO Approvals (Admin Workflow)
app.post("/api/ngos/:id/verify", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'approve' | 'reject'
  const ngo = dbState.ngos.find(n => n.id === id);

  if (!ngo) {
    return res.status(404).json({ error: "NGO not found" });
  }

  ngo.verified = (status === "approve");
  res.json({ success: true, ngo });
});

// ----------------------------------------------------
// AI-Powered Gemini SDK Routes
// ----------------------------------------------------

// Chatbot: Discovery, guidelines, and matching help
app.post("/api/gemini/chatbot", async (req: Request, res: Response) => {
  const { messages, userProfile } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages payload." });
  }

  const lastMessage = messages[messages.length - 1]?.text || "Hello!";

  try {
    const ai = getGeminiClient();
    
    // Construct system instructions
    const systemInstruction = `You are "NGO Connect AI", a supportive, professional, and knowledgeable chatbot representing the NGO Connect platform. 
    Your mission is to guide volunteers to discover opportunities, assist donors in supporting fundraising campaigns, explain impact statistics, and provide answers to NGO-related questions.
    Available NGOs on platform: ${JSON.stringify(dbState.ngos.map(n => ({ id: n.id, name: n.name, bio: n.bio, location: n.location })))}
    Active Campaigns: ${JSON.stringify(dbState.campaigns.map(c => ({ id: c.id, title: c.title, goal: c.goalAmount, current: c.currentAmount })))}
    Available Opportunities: ${JSON.stringify(dbState.opportunities.map(o => ({ id: o.id, title: o.title, skills: o.skillsRequired, date: o.date, location: o.location, hours: o.hoursGained })))}
    Volunteer User Profile: ${JSON.stringify(userProfile || dbState.volunteer)}
    
    Keep responses friendly, uplifting, inspiring, and concise. Format with bullet points where necessary. If suggested, point to specific active opportunities or campaigns by name!`;

    const chatSession = ai.chats.create({
      model: "gemini-3.5-flash",
      config: { systemInstruction }
    });

    // We can simulate historical state by looping over prior messages except the last one
    for (let i = 0; i < messages.length - 1; i++) {
      await chatSession.sendMessage({ message: messages[i].text });
    }

    const response = await chatSession.sendMessage({ message: lastMessage });
    res.json({ success: true, text: response.text });

  } catch (error: any) {
    console.error("Gemini Chatbot Error: ", error);
    
    // Fallback heuristic if API key is not configured
    let fallbackText = "I'm NGO Connect AI Assistant! I'd love to help you. ";
    const promptLower = lastMessage.toLowerCase();
    
    if (promptLower.includes("volunteer") || promptLower.includes("opportunity") || promptLower.includes("event")) {
      fallbackText += `Based on your skills, I highly recommend checking out:
- **"${dbState.opportunities[0]?.title}"** at ${dbState.opportunities[0]?.location} (Gives ${dbState.opportunities[0]?.hoursGained} hours)
- **"${dbState.opportunities[1]?.title}"** for physical team collaboration.
Simply click 'Apply' on the Opportunity page to register instantly!`;
    } else if (promptLower.includes("donate") || promptLower.includes("campaign") || promptLower.includes("fund")) {
      fallbackText += `We have active campaigns that need your support:
- **"${dbState.campaigns[0]?.title}"** by ${dbState.campaigns[0]?.ngoName} (Goal: $${dbState.campaigns[0]?.goalAmount})
- **"${dbState.campaigns[1]?.title}"** by ${dbState.campaigns[1]?.ngoName}.
You can make one-time or recurring contributions using our secure Stripe billing widget.`;
    } else {
      fallbackText += `I'm here to match you with amazing local volunteer events, generate a Social Impact Resume, or walk you through making anonymous donations. Ask me anything about our verified NGOs, or check out our interactive analytics board for real-time impact!`;
    }

    res.json({ success: true, text: fallbackText, isHeuristic: true });
  }
});

// AI Opportunity Matchmaking
app.post("/api/gemini/recommend", async (req: Request, res: Response) => {
  const { volunteer } = req.body;
  const user = volunteer || dbState.volunteer;

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `We have a volunteer looking for optimal placement.
Volunteer:
- Skills: ${JSON.stringify(user.skills)}
- Interests: ${JSON.stringify(user.interests)}
- Location: ${JSON.stringify(user.location)}
- Availability: ${JSON.stringify(user.availability)}

Available opportunities:
${JSON.stringify(dbState.opportunities.map(o => ({ id: o.id, title: o.title, description: o.description, skills: o.skillsRequired, interests: o.interests, location: o.location })))}

Analyze these and return a neat JSON array containing the matching opportunity IDs, a calculated percentage match score, and a personalized sentence explanation for why this opportunity is a great fit.
Format response strictly as a JSON array of objects: [{"opportunityId": "opp_1", "matchScore": 95, "reason": "Explanation"}]. Do not write markdown tags or preambles outside the JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              opportunityId: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              reason: { type: Type.STRING }
            },
            required: ["opportunityId", "matchScore", "reason"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json({ success: true, recommendations: parsed });

  } catch (error) {
    console.error("Gemini Matchmaking Error: ", error);
    
    // Heuristic Fallback Matchmaking
    const fallbacks = dbState.opportunities.map((opp, idx) => {
      let score = 50;
      let reasons: string[] = [];

      // Intersect interests
      const matchedInterests = opp.interests.filter(i => user.interests.includes(i));
      if (matchedInterests.length > 0) {
        score += 25;
        reasons.push(`aligned with your interest in ${matchedInterests.join(", ")}`);
      }

      // Intersect skills
      const matchedSkills = opp.skillsRequired.filter(s => user.skills.some(us => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase() === "no special skills"));
      if (matchedSkills.length > 0) {
        score += 15;
        reasons.push(`utilizes your skills like "${matchedSkills[0]}"`);
      } else if (opp.skillsRequired.includes("No special skills")) {
        score += 10;
        reasons.push("is open to all skill levels with training");
      }

      const matchScore = Math.min(98, score);
      const reason = reasons.length > 0 
        ? `This role is a ${matchScore}% match because it is ${reasons.join(" and ")}.`
        : `An excellent general opportunity in ${opp.location} looking for proactive volunteers.`;

      return {
        opportunityId: opp.id,
        matchScore,
        reason
      };
    });

    res.json({ success: true, recommendations: fallbacks, isHeuristic: true });
  }
});

// AI Social Impact Resume Builder
app.post("/api/gemini/resume", async (req: Request, res: Response) => {
  const { volunteer } = req.body;
  const user = volunteer || dbState.volunteer;

  try {
    const ai = getGeminiClient();

    const prompt = `Generate a gorgeous, high-impact "Volunteer Social Impact Resume" in Markdown for the following user:
Volunteer Profile:
- Name: ${user.name}
- Bio: ${user.bio}
- Total Contributed Hours: ${user.totalHours}
- Skills: ${user.skills.join(", ")}
- Interests: ${user.interests.join(", ")}
- Languages: ${user.languages.join(", ")}
- Verified Impact Certificates: ${JSON.stringify(dbState.certificates)}
- Earned Badges: ${JSON.stringify(user.badges.map(b => b.name))}

Format it beautifully using markdown with professional sections (Profile, Core Competencies, Social Impact Hours, Event Accomplishments, Badges & Certifications, and Future Volunteering Goals). Make it inspiring and completely ready to export!`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ success: true, markdown: response.text });

  } catch (error) {
    console.error("Gemini Resume Error: ", error);
    
    // Heuristic Fallback Resume generator
    const markdown = `# ${user.name}
*Social Impact Portfolio & Volunteer Resume*

---

## 🌟 Professional Profile
${user.bio}

---

## 📊 Impact Metrics
* **Total Certified Hours**: ${user.totalHours} Hours
* **Gamified Karma Points**: ${user.points} XP
* **Causes Supported**: ${user.interests.join(", ")}

---

## 🛠️ Core Competencies & Skills
${user.skills.map(s => `- **${s}**`).join("\n")}

---

## 🏆 Verified Accredited Achievements
${dbState.certificates.map(c => `- **${c.title}** issued by *${c.ngoName}* (${c.hours} Hours credited, Credential Code: \`${c.credentialCode}\`)`).join("\n")}

---

## 🎗️ Earned Badges
${user.badges.map(b => `- **${b.name}**: ${b.description}`).join("\n")}

---
*Automatically compiled via NGO Connect AI Portfolio Assistant on ${new Date().toLocaleDateString()}*`;

    res.json({ success: true, markdown, isHeuristic: true });
  }
});

// AI NGO/Campaign Performance Insights Reports
app.post("/api/gemini/insights", async (req: Request, res: Response) => {
  const { scope, entityId } = req.body; // scope: 'ngo' | 'campaign' | 'platform'

  try {
    const ai = getGeminiClient();

    let context = "";
    if (scope === "ngo") {
      const ngo = dbState.ngos.find(n => n.id === entityId) || dbState.ngos[0];
      const opps = dbState.opportunities.filter(o => o.ngoId === ngo.id);
      context = `NGO: ${ngo.name}, Bio: ${ngo.bio}, Metrics: ${JSON.stringify(ngo.impactMetrics)}, Active listings: ${opps.length}`;
    } else {
      context = `Platform statistics: Total active NGOs: ${dbState.ngos.length}, Active campaigns: ${dbState.campaigns.length}, Total fundraising drives active: $${dbState.campaigns.reduce((a,c)=>a+c.currentAmount,0)}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Provide an executive "AI Social Impact & Revenue Insights Report" for the following:
      ${context}
      
      Generate brief analytics paragraphs covering:
      1. Volunteer Engagement & Retention Rates
      2. Campaign Fundraising Performance
      3. Community Impact Success (e.g., trees planted, meals distributed equivalents)
      4. Recommendations for Strategic Expansion
      
      Format with clean subheadings and bold metrics. Make it look like a startup dashboard intelligence feed.`,
    });

    res.json({ success: true, insights: response.text });

  } catch (error) {
    console.error("Gemini Insights Error: ", error);
    
    // Heuristic Fallback
    const fallbackText = `### 📊 AI Impact Insights Report (Draft Mode)

#### 1. Volunteer Placement Optimization
The current placement metrics indicate an overall campaign occupancy of **78%**. Emergency roles have a **100%** quick-response enrollment within 24 hours of posting.

#### 2. Fundraising Momentum Analytics
Platform fundraisers have collectively raised **$${dbState.campaigns.reduce((acc, curr) => acc + curr.currentAmount, 0).toLocaleString()}**. Financial trends indicate highly recurring donor participation, with **18%** of users contributing on a monthly subscription tier.

#### 3. Tangible Societal Contributions
* **Reforestation Contributions**: ${dbState.ngos[0]?.impactMetrics.treesPlanted || 15400} native saplings planted.
* **Nutrition Security**: ${dbState.ngos[1]?.impactMetrics.mealsDistributed || 42000} hot meal interventions distributed.
* **Education Empowerment**: ${dbState.ngos[2]?.impactMetrics.childrenEducated || 1200} children supplied with online tutored programs.

#### 4. Growth Recommendations
- **Expand Corporate Engagement**: Establish CSR pipelines directly with companies like *Apex Digital Solutions* to boost single-day volunteer takeovers.
- **Boost Micro-Donations**: Gamify check-outs by showing tree equivalents for cart rounded totals (e.g. "$10 = 1 tree planted").`;

    res.json({ success: true, insights: fallbackText, isHeuristic: true });
  }
});


// ----------------------------------------------------
// Mounting Vite / Production static assets serve
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
