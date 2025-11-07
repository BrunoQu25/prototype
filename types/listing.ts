export type Condition = "new"|"like_new"|"good"|"fair"|"worn";

export interface PublishedGame {
  id: string;              // uuid
  title: string;
  publisher?: string;
  category: string;        // reuse existing categories
  images: { url: string; type: "hero"|"gallery"; width?: number; height?: number }[];
  rating?: number;         // optional for prototype
  reviews?: number;        // optional
  description: string;
  duration?: string;       // e.g. "60-90 min"
  players?: string;        // e.g. "2-4 jugadores"
  difficulty?: string;
  pricePerDay: number;     // UYU/day
  deposit?: number;        // UYU
  condition: Condition;
  visibility: "public"|"private";
  createdAt: string;
}
