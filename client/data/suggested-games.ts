export type GameSuggest = {
  key: string;
  title: string; // lo que ve el usuario (incluye expansión)
  category: string; // ej. "Estrategia"
  publisher: string; // "Devir"
  players?: string;
  duration?: string;
  difficulty?: string;
  hero: string; // URL pública (CORS OK)
  pricePerDay?: number;
  deposit?: number;
  description?: string;
};

// URLs con CORS (Wikimedia). Puedes cambiarlas cuando quieras.
export const devirCatan: GameSuggest[] = [
  {
    key: "catan-base",
    title: "Catan (base)",
    category: "Estrategia",
    publisher: "Devir",
    players: "3-4 jugadores",
    duration: "60-90 min",
    difficulty: "Media",
    hero: "https://upload.wikimedia.org/wikipedia/commons/9/9f/%22Katanas_iece%C4%BCot%C4%81ji%22_kaste.jpg",
    pricePerDay: 250,
    deposit: 1000,
  },
  {
    key: "catan-navegantes",
    title: "Catan: Navegantes",
    category: "Estrategia",
    publisher: "Devir",
    players: "3-4 jugadores",
    duration: "60-90 min",
    difficulty: "Media",
    hero: "https://upload.wikimedia.org/wikipedia/commons/2/26/Settlers_of_Catan_-_3142784165.jpg",
    pricePerDay: 240,
    deposit: 900,
  },
  {
    key: "catan-ciudades",
    title: "Catan: Ciudades y Caballeros",
    category: "Estrategia",
    publisher: "Devir",
    players: "3-4 jugadores",
    duration: "60-90 min",
    difficulty: "Media",
    hero: "https://upload.wikimedia.org/wikipedia/commons/6/60/Settlers_of_Catan_2016-01-23_17-30-47.jpg",
    pricePerDay: 270,
    deposit: 1100,
  },
  {
    key: "catan-mercaderes",
    title: "Catan: Mercaderes y Bárbaros",
    category: "Estrategia",
    publisher: "Devir",
    players: "2-4 jugadores",
    duration: "45-75 min",
    difficulty: "Media",
    hero: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Settlers_of_Catan_completed.jpg",
    pricePerDay: 230,
    deposit: 900,
  },
  {
    key: "catan-piratas",
    title: "Catan: Piratas y Exploradores",
    category: "Estrategia",
    publisher: "Devir",
    players: "3-4 jugadores",
    duration: "60-90 min",
    difficulty: "Media",
    hero: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Postavka_za_igru.JPG",
    pricePerDay: 260,
    deposit: 1000,
  },
];

export const ALL_SUGGESTS: GameSuggest[] = [...devirCatan];

export function suggestGames(q: string, limit = 6): GameSuggest[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return ALL_SUGGESTS.filter(
    (g) =>
      g.title.toLowerCase().includes(s) ||
      g.publisher.toLowerCase().includes(s),
  ).slice(0, limit);
}
