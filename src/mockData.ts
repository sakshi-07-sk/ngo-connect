/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NGOProfile, Opportunity, Campaign, Badge, CommunityPost, DiscussionThread, CorporateCSR, VolunteerProfile, Certificate } from "./types";

export const initialBadges: Badge[] = [
  {
    id: "badge_first_vol",
    name: "First Action",
    description: "Completed your first volunteering assignment",
    icon: "Heart",
    category: "volunteer",
    pointsRequired: 100
  },
  {
    id: "badge_eco_warrior",
    name: "Eco Warrior",
    description: "Contributed 15+ hours to environmental causes",
    icon: "TreePine",
    category: "volunteer",
    pointsRequired: 300
  },
  {
    id: "badge_super_donor",
    name: "Super Donor",
    description: "Supported 3 or more charity campaigns",
    icon: "Award",
    category: "donor",
    pointsRequired: 500
  },
  {
    id: "badge_community_hero",
    name: "Community Hero",
    description: "Earned 1,000+ points on the NGO Connect platform",
    icon: "ShieldAlert",
    category: "community",
    pointsRequired: 1000
  },
  {
    id: "badge_blood_hero",
    name: "Life Saver",
    description: "Participated in an emergency disaster or medical response event",
    icon: "Droplets",
    category: "general",
    pointsRequired: 200
  }
];

export const initialNGOs: NGOProfile[] = [
  {
    id: "ngo_green_earth",
    name: "GreenEarth Alliance",
    email: "contact@greenearth.org",
    avatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60",
    bio: "Dedicated to restoring ecosystems, planting urban forests, and fighting climate change through community action and education.",
    location: "San Francisco, CA",
    verified: true,
    registrationNo: "US-NGO-2024-8899",
    website: "https://greenearthalliance.org",
    socials: { twitter: "@greenearth", linkedin: "greenearth-alliance" },
    impactMetrics: {
      activeVolunteers: 450,
      donationsRaised: 125000,
      campaignSuccessRate: 94,
      treesPlanted: 15400,
      mealsDistributed: 0,
      childrenEducated: 0,
      medicalKitsDistributed: 0
    }
  },
  {
    id: "ngo_food_for_all",
    name: "FoodForAll Coalition",
    email: "info@foodforall.org",
    avatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=60",
    bio: "Ending urban hunger by collecting surplus food and distributing hot, nutritious meals to shelter systems and local families.",
    location: "New York, NY",
    verified: true,
    registrationNo: "US-NGO-2022-4412",
    website: "https://foodforall.org",
    socials: { instagram: "@foodforall", twitter: "@foodforall_org" },
    impactMetrics: {
      activeVolunteers: 820,
      donationsRaised: 240000,
      campaignSuccessRate: 98,
      treesPlanted: 0,
      mealsDistributed: 42000,
      childrenEducated: 0,
      medicalKitsDistributed: 0
    }
  },
  {
    id: "ngo_bright_minds",
    name: "Bright Minds Foundation",
    email: "outreach@brightminds.edu",
    avatar: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60",
    bio: "Providing standard tutoring, digital access, and school supplies to kids in underserved school districts.",
    location: "Chicago, IL",
    verified: false, // Pending verification to show approval workflow
    registrationNo: "US-NGO-2025-1102",
    website: "https://brightmindsfoundation.org",
    socials: { linkedin: "bright-minds-foundation" },
    impactMetrics: {
      activeVolunteers: 120,
      donationsRaised: 34000,
      campaignSuccessRate: 85,
      treesPlanted: 0,
      mealsDistributed: 0,
      childrenEducated: 1200,
      medicalKitsDistributed: 0
    }
  },
  {
    id: "ngo_red_cross_local",
    name: "Red Cross Local Network",
    email: "disaster-response@redcrosslocal.org",
    avatar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=60",
    bio: "Coordinating emergency shelter, blood donations, and disaster relief personnel in times of crisis and weather emergencies.",
    location: "Seattle, WA",
    verified: true,
    registrationNo: "US-RED-5544",
    website: "https://redcrosslocalnetwork.org",
    socials: { twitter: "@redcrosslocal" },
    impactMetrics: {
      activeVolunteers: 1200,
      donationsRaised: 980000,
      campaignSuccessRate: 100,
      treesPlanted: 0,
      mealsDistributed: 15000,
      childrenEducated: 0,
      medicalKitsDistributed: 8500
    }
  }
];

export const initialOpportunities: Opportunity[] = [
  {
    id: "opp_1",
    ngoId: "ngo_green_earth",
    ngoName: "GreenEarth Alliance",
    ngoAvatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60",
    title: "Urban Reforestation & Tree Planting",
    description: "Join us this Saturday to plant over 150 native shade trees in central parks. We provide tools, seeds, and training! This effort directly combats urban heat island effects. Perfect for families, students, and green enthusiasts.",
    skillsRequired: ["No special skills", "Physical fitness", "Teamwork"],
    interests: ["Environment", "Community Development"],
    location: "Golden Gate Park, San Francisco, CA",
    latitude: 37.7694,
    longitude: -122.4862,
    date: "2026-07-04",
    duration: "4 Hours (9:00 AM - 1:00 PM)",
    hoursGained: 4,
    capacity: 50,
    applicantsCount: 32,
    status: "open",
    isEmergency: false
  },
  {
    id: "opp_2",
    ngoId: "ngo_food_for_all",
    ngoName: "FoodForAll Coalition",
    ngoAvatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=60",
    title: "Shelter Food Prep & Distribution",
    description: "Help chop, cook, and pack hundreds of fresh meals for homeless shelter networks. Shifts are structured in 3-hour blocks under the guidance of our professional head chef. Food safety gloves and aprons are provided.",
    skillsRequired: ["Basic Cooking", "Cleanliness", "Active listening"],
    interests: ["Hunger Relief", "Social Services"],
    location: "Bowery Mission, New York, NY",
    latitude: 40.7223,
    longitude: -73.9928,
    date: "2026-06-30",
    duration: "3 Hours (11:00 AM - 2:00 PM)",
    hoursGained: 3,
    capacity: 15,
    applicantsCount: 11,
    status: "open",
    isEmergency: false
  },
  {
    id: "opp_3",
    ngoId: "ngo_bright_minds",
    ngoName: "Bright Minds Foundation",
    ngoAvatar: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60",
    title: "Online Math & Reading Tutoring",
    description: "Provide personalized academic support to middle school students via Zoom. Tutoring takes place twice a week. Curriculum material and teaching slides will be provided by Bright Minds facilitators.",
    skillsRequired: ["Teaching", "Patience", "High school math", "English literacy"],
    interests: ["Education", "Youth Empowerment"],
    location: "Remote / Online",
    latitude: 41.8781,
    longitude: -87.6298,
    date: "2026-07-10",
    duration: "2 Hours (4:00 PM - 6:00 PM)",
    hoursGained: 2,
    capacity: 25,
    applicantsCount: 18,
    status: "open",
    isEmergency: false
  },
  {
    id: "opp_4_emergency",
    ngoId: "ngo_red_cross_local",
    ngoName: "Red Cross Local Network",
    ngoAvatar: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=60",
    title: "EMERGENCY: Disaster Relief Supplies Packing",
    description: "CRITICAL: Urgent volunteer mobilization needed to prepare flood-response survival kits (food, flashlights, hygiene items, bottled water) following recent local storm damage. Quick-response teams required immediately.",
    skillsRequired: ["Fast Packing", "Ability to lift 20 lbs", "Crisis coordination"],
    interests: ["Disaster Relief", "First Aid"],
    location: "Red Cross Seattle Depot, WA",
    latitude: 47.6062,
    longitude: -122.3321,
    date: "2026-06-25",
    duration: "6 Hours (8:00 AM - 2:00 PM)",
    hoursGained: 6,
    capacity: 100,
    applicantsCount: 45,
    status: "open",
    isEmergency: true
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: "camp_1",
    ngoId: "ngo_green_earth",
    ngoName: "GreenEarth Alliance",
    ngoAvatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60",
    title: "Help Us Plant 10,000 Urban Trees",
    description: "Urban canopy protects cities from record-shattering summer temperatures. Every $10 donated purchases, plants, and provides irrigation for one young sapling tree in concrete-heavy city neighborhoods.",
    goalAmount: 100000,
    currentAmount: 76500,
    deadline: "2026-08-31",
    status: "active",
    category: "Environment"
  },
  {
    id: "camp_2",
    ngoId: "ngo_food_for_all",
    ngoName: "FoodForAll Coalition",
    ngoAvatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=60",
    title: "The Zero-Hunger Food Van Campaign",
    description: "We are purchasing a custom insulated logistics vehicle to safely rescue and store fresh surplus buffet food from corporate cafeterias and events, delivering it immediately to shelters.",
    goalAmount: 60000,
    currentAmount: 48900,
    deadline: "2026-07-25",
    status: "active",
    category: "Hunger"
  },
  {
    id: "camp_3",
    ngoId: "ngo_bright_minds",
    ngoName: "Bright Minds Foundation",
    ngoAvatar: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=150&auto=format&fit=crop&q=60",
    title: "Digital Access: School Laptops & Internet",
    description: "Bridging the homework gap. We purchase refurbished Chromebooks and 1-year wireless hotspots for students who have no computers at home, ensuring equal footing in public education.",
    goalAmount: 30000,
    currentAmount: 12500,
    deadline: "2026-09-15",
    status: "active",
    category: "Education"
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: "post_1",
    authorId: "user_sarah_connor",
    authorName: "Sarah Connor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60",
    authorRole: "volunteer",
    content: "Yesterday was my first tree-planting session with GreenEarth Alliance! 🌳 Honestly, it was so therapeutic to touch the soil and work side-by-side with amazing neighbors. Met so many fellow students too! Looking forward to the next one! #VolunteerPower #GoGreen",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&auto=format&fit=crop&q=60",
    likes: 24,
    likedByUser: false,
    comments: [
      {
        id: "c_1",
        authorName: "GreenEarth Alliance",
        authorAvatar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=60",
        content: "Thank you for joining us Sarah! You did amazing carrying those saplings! See you soon!",
        date: "2026-06-23T14:22:00Z"
      }
    ],
    createdAt: "2026-06-23T10:15:00Z"
  },
  {
    id: "post_2",
    authorId: "ngo_food_for_all",
    authorName: "FoodForAll Coalition",
    authorAvatar: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=60",
    authorRole: "ngo",
    content: "A huge shoutout to our corporate partner, Apex Systems! Today, 45 of their employees took over our Bowery kitchen and prepared exactly 1,200 nutritious hot meals for shelters across Lower Manhattan. 🥘 That is what real community partnership looks like! 🙌",
    likes: 56,
    likedByUser: false,
    comments: [],
    createdAt: "2026-06-22T16:45:00Z"
  }
];

export const initialDiscussionThreads: DiscussionThread[] = [
  {
    id: "thread_1",
    title: "Tips for first-time disaster relief volunteers?",
    content: "I just signed up for the emergency kit preparation shift with the Red Cross Local Network this Thursday. I've never volunteered in a crisis context before. Does anyone have advice on what to wear, expect, or carry with me?",
    authorName: "Marcus Brody",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
    tags: ["Disaster Relief", "First Timer", "Advice"],
    likes: 12,
    replies: [
      {
        id: "rep_1",
        authorName: "Elena Rostova",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60",
        content: "Wear comfortable, closed-toe shoes (sneakers or hiking boots) because you will be standing and lifting boxes. Don't worry about tools; they provide gloves and train everyone on the packing sequence. Just bring water and a positive attitude!",
        date: "2026-06-24T08:30:00Z",
        likes: 5
      }
    ],
    createdAt: "2026-06-23T22:00:00Z"
  },
  {
    id: "thread_2",
    title: "Tutoring remote: Keeping students engaged?",
    content: "I tutor middle school algebra remote through Bright Minds. Some students struggle to stay focused over Zoom after a long day of school. Any interactive virtual whiteboard games or tips to make it less dry?",
    authorName: "Siddharth Mehta",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60",
    tags: ["Tutoring", "Remote", "Engagement"],
    likes: 8,
    replies: [],
    createdAt: "2026-06-24T05:12:00Z"
  }
];

export const initialCSRCompany: CorporateCSR = {
  id: "csr_apex",
  companyName: "Apex Digital Solutions",
  email: "csr@apexdigital.com",
  logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=60",
  bio: "Apex is a global tech consulting agency committed to allocating 2% of annual net profit and 1,000 employees hours to education, zero-hunger, and tree-planting programs.",
  budgetAllocated: 150000,
  budgetSpent: 95000,
  employeesEnrolled: 340,
  volunteerHoursContributed: 680,
  supportedNGOs: ["FoodForAll Coalition", "GreenEarth Alliance"],
  impactReports: [
    {
      id: "rep_apex_1",
      title: "Annual Q1 Social Responsibility Summary",
      date: "2026-04-15",
      content: "Apex employees successfully completed 680 hours of service, planting 1,200 saplings and cooking 2,500 meals, leading to a carbon reduction contribution of ~12 tons."
    }
  ]
};

export const initialVolunteer: VolunteerProfile = {
  id: "vol_current",
  name: "Jane Doe",
  email: "jane.doe@gmail.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
  bio: "Software developer passionate about climate preservation and education. Eager to tutor kids and help plant local community forests.",
  skills: ["React", "Teaching", "Teamwork", "Public Speaking"],
  interests: ["Environment", "Education", "Hunger Relief"],
  languages: ["English", "Spanish"],
  availability: ["Weekends", "Evenings"],
  location: "San Francisco, CA",
  totalHours: 14,
  points: 450,
  badges: [
    {
      id: "badge_first_vol",
      name: "First Action",
      description: "Completed your first volunteering assignment",
      icon: "Heart",
      category: "volunteer",
      dateEarned: "2026-05-12"
    }
  ],
  certificates: [
    {
      id: "cert_01",
      title: "Coastal Clean-up Leader Certificate",
      ngoName: "GreenEarth Alliance",
      date: "2026-05-20",
      hours: 6,
      credentialCode: "CERT-GE-7781-99",
      recipientName: "Jane Doe"
    }
  ]
};
