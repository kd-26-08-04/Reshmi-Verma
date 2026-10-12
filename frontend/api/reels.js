/**
 * Vercel Serverless Function: GET /api/reels
 * Automatically served by Vercel for https://domain.com/api/reels
 */

const REELS_DATA = [
  {
    id: "reel-1",
    title: "Why Most Diets Fail: Metabolic Resistance & Gut Microbiome Repair",
    url: "https://www.instagram.com/reel/DDK9c8pS9U-/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/functional-nutrition.jpg",
    views: "52.4K",
    duration: "0:48",
    topic: "Metabolic Resistance"
  },
  {
    id: "reel-2",
    title: "The BOLT Score Explained: Cellular Oxygenation & CO₂ Tolerance",
    url: "https://www.instagram.com/reel/C76M0Ltzj-1/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reshmi-saree-hero.jpg",
    views: "89.1K",
    duration: "1:04",
    topic: "Breathe Mechanics"
  },
  {
    id: "reel-3",
    title: "Blood Glucose Spikes: 3 Common Breakfast Mistakes You Are Making",
    url: "https://www.instagram.com/reel/C8qW1qJz-vX/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reel-3-food-swaps.jpg",
    views: "61.3K",
    duration: "0:42",
    topic: "Blood Glucose"
  },
  {
    id: "reel-4",
    title: "Gut Mucosal Repair: Addressing Root Leaky Gut & Food Reactivity",
    url: "https://www.instagram.com/reel/DdFEn_gzhbQ/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reel-4-gut-mucosa.jpg",
    views: "44.9K",
    duration: "0:56",
    topic: "Gut Restoration"
  },
  {
    id: "reel-5",
    title: "Autonomic Nervous System Reset: The 3-Minute Vagal Breathing Cue",
    url: "https://www.instagram.com/reel/DdW0ClVTnB7/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/clinic-sanctuary.jpg",
    views: "73.2K",
    duration: "0:51",
    topic: "Oxygen Advantage"
  },
  {
    id: "reel-6",
    title: "Root-Cause Longevity: Why Sustainable Habit Stacking Beats Crash Diets",
    url: "https://www.instagram.com/reel/DcVi6zjzhY9/?utm_source=ig_web_copy_link&stkn=MzRlODBiNWFlZA==",
    image: "/assets/images/reshmi-verma.jpg",
    views: "95.7K",
    duration: "1:00",
    topic: "Longevity & Habits"
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    success: true,
    reels: REELS_DATA
  });
}
