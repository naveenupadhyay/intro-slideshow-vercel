import { BarChart3, Rocket, Target, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconName = "BarChart3" | "Rocket" | "Target" | "Users" | "Zap";

export const iconMap: Record<IconName, LucideIcon> = {
  BarChart3,
  Rocket,
  Target,
  Users,
  Zap
};

export const introContent = {
  brand: {
    name: "EleventyfirstParallel AI",
    founder: "Naveen Upadhyay",
    email: "naveen.invincible@gmail.com",
    linkedin: "https://www.linkedin.com/in/naveen-u-76612210/",
    portrait: "/nav.jpg",
    profileVideo: "/profile-intro.mp4"
  },
  intro: {
    finalCtaLabel: "View LinkedIn",
    sequences: [
      {
        eyebrow: "Here is what I can do for you",
        headline: "Be the AI-ready CTO your company needs.",
        subline: "Build your next product like a Founder CTO would.",
        bullets: ["10x team productivity with AI automation.", "Be scrappy. Creatively navigate within your constraints."]
      },
      {
        eyebrow: "Founder CTO energy",
        headline: "Roll up my sleeves or build a rockstar team.",
        subline: "Create clarity, generate energy, and deliver success.",
        bullets: ["Look after your company's time and money as my own.", "Show up on time, see around corners, and tell you the truth."]
      },
      {
        eyebrow: "Your priorities become mine",
        headline: "Walk with you through fundraise, market, and startup growing pains.",
        subline: "Turn your priorities into my priorities.",
        bullets: ["Recruit, hire, and onboard your eventual full-time replacement.", "Stay close to the work until the company has the leadership muscle it needs."]
      },
      {
        eyebrow: "Naveen Upadhyay",
        headline: "CTO-level help that feels accountable from day one.",
        subline: "Product, technology, AI automation, team buildout, GTM, and fundraise support.",
        bullets: ["Direct founder-level operating support.", "India product engineering capacity when you need execution behind the advice."]
      }
    ],
    finalHeadline: "HERE IS WHAT I CAN DO FOR YOU.",
    finalSubheadline: "Be your AI-ready CTO partner. Build the product. Protect time and money. Help you sell, raise, hire, and scale.",
    metrics: [
      { value: "CTO", label: "AI-ready leadership" },
      { value: "10x", label: "team productivity mindset" },
      { value: "Build", label: "product like a founder" },
      { value: "Hire", label: "and onboard replacement" }
    ],
    pipeline: [
      { label: "Clarity", icon: "Target" },
      { label: "Energy", icon: "Zap" },
      { label: "Delivery", icon: "Rocket" },
      { label: "GTM", icon: "Users" },
      { label: "Fundraise", icon: "BarChart3" }
    ] as Array<{ label: string; icon: IconName }>
  }
};
