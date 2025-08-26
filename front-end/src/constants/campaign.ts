export const CAMPAIGN_TITLE = "Muralverse: Urban Canvas Community Street Art Revival";
export const CAMPAIGN_SUBTITLE =
  "Transforming urban spaces through community-driven street art murals that celebrate local culture and bring neighborhoods together";

export const CAMPAIGN_GOAL_USD = 15000;
export const CAMPAIGN_DURATION_DAYS = 90;
export const CAMPAIGN_BENEFICIARY = "Downtown Arts Collective";

// Street Art Theme Colors
export const THEME_COLORS = {
  primary: "#00D4FF",      // Electric blue
  secondary: "#FF6B35",    // Vibrant orange
  accent: "#39FF14",       // Neon green
  darkAccent: "#6A0DAD",   // Deep purple
  white: "#FFFFFF",
  black: "#000000",
  gray: "#2D3748",
  lightGray: "#E2E8F0"
};

// Campaign-specific metadata
export const CAMPAIGN_FEATURES = {
  artistVotingEnabled: true,
  muralGalleryIntegration: true,
  communityEngagementTracking: true,
  neighborhoodInputCollection: true
};

// Campaign milestones
export const CAMPAIGN_MILESTONES = [
  { week: "1-2", phase: "Community Design Voting", description: "Community members vote on mural designs" },
  { week: "3-6", phase: "Artist Selection Process", description: "Selecting artists based on community votes" },
  { week: "7-10", phase: "Mural Creation Phase", description: "Artists create murals across downtown" },
  { week: "11-12", phase: "Community Celebration Events", description: "Unveiling events and community workshops" }
];

// Funding breakdown
export const FUNDING_BREAKDOWN = [
  { category: "Artist Fees and Stipends", percentage: 40, amount: 6000 },
  { category: "Paint and Materials", percentage: 30, amount: 4500 },
  { category: "Wall Preparation and Permits", percentage: 20, amount: 3000 },
  { category: "Community Events and Workshops", percentage: 10, amount: 1500 }
];
