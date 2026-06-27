/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "volunteer" | "donor" | "community" | "general";
  dateEarned?: string;
  pointsRequired?: number;
}

export interface Certificate {
  id: string;
  title: string;
  ngoName: string;
  date: string;
  hours: number;
  credentialCode: string;
  recipientName: string;
}

export interface VolunteerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skills: string[];
  interests: string[];
  languages: string[];
  availability: string[]; // e.g. ["Weekends", "Evenings", "Flexible"]
  location: string;
  totalHours: number;
  points: number;
  badges: Badge[];
  certificates: Certificate[];
}

export interface NGOProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  verified: boolean;
  registrationNo: string;
  website: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  impactMetrics: {
    activeVolunteers: number;
    donationsRaised: number;
    campaignSuccessRate: number;
    treesPlanted: number;
    mealsDistributed: number;
    childrenEducated: number;
    medicalKitsDistributed: number;
  };
}

export interface Opportunity {
  id: string;
  ngoId: string;
  ngoName: string;
  ngoAvatar: string;
  title: string;
  description: string;
  skillsRequired: string[];
  interests: string[];
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  duration: string;
  hoursGained: number;
  capacity: number;
  applicantsCount: number;
  status: "open" | "closed";
  isEmergency?: boolean;
}

export interface Campaign {
  id: string;
  ngoId: string;
  ngoName: string;
  ngoAvatar: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  deadline: string;
  status: "active" | "completed";
  category: "Education" | "Environment" | "Disaster Relief" | "Health" | "Hunger";
}

export interface Donation {
  id: string;
  campaignId: string;
  campaignTitle: string;
  ngoName: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  date: string;
  isRecurring: boolean;
  isAnonymous: boolean;
  status: "success" | "pending";
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: "volunteer" | "ngo" | "donor" | "csr";
  content: string;
  image?: string;
  likes: number;
  likedByUser?: boolean;
  comments: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    date: string;
  }>;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  tags: string[];
  replies: Array<{
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    date: string;
    likes: number;
  }>;
  likes: number;
  createdAt: string;
}

export interface CorporateCSR {
  id: string;
  companyName: string;
  email: string;
  logo: string;
  bio: string;
  budgetAllocated: number;
  budgetSpent: number;
  employeesEnrolled: number;
  volunteerHoursContributed: number;
  supportedNGOs: string[]; // NGO names
  impactReports: Array<{
    id: string;
    title: string;
    date: string;
    content: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
