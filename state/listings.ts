import { z } from "zod";

export const STORAGE_KEY = "th_listings_v1";

export type PublishedGame = z.infer<typeof PublishedGameSchema>;

const ImageSchema = z.object({
  url: z.string().min(1),
  type: z.union([z.literal("hero"), z.literal("gallery")]),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const PublishedGameSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "El título es obligatorio"),
  publisher: z.string().optional(),
  category: z.string().min(1, "La categoría es obligatoria"),
  images: z.array(ImageSchema).min(1, "Se requiere al menos una imagen"),
  rating: z.number().optional(),
  reviews: z.number().optional(),
  description: z.string().min(1, "La descripción es obligatoria"),
  duration: z.string().optional(),
  players: z.string().optional(),
  difficulty: z.string().optional(),
  pricePerDay: z.number().positive("El precio por día debe ser mayor a 0"),
  deposit: z.number().min(0, "El depósito no puede ser negativo").optional(),
  condition: z.union([
    z.literal("new"),
    z.literal("like_new"),
    z.literal("good"),
    z.literal("fair"),
    z.literal("worn"),
  ]),
  visibility: z.union([z.literal("public"), z.literal("private")]),
  createdAt: z.string(),
});

export function loadListings(): PublishedGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Best-effort validate each entry
    const out: PublishedGame[] = [];
    for (const item of parsed) {
      const res = PublishedGameSchema.safeParse(item);
      if (res.success) out.push(res.data);
    }
    return out;
  } catch {
    return [];
  }
}

export function saveListings(list: PublishedGame[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error guardando en localStorage", e);
    throw e;
  }
}

export function addListing(item: PublishedGame): void {
  const current = loadListings();
  const res = PublishedGameSchema.safeParse(item);
  if (!res.success) {
    throw new Error(res.error.issues.map((i) => i.message).join(", "));
  }
  current.push(res.data);
  saveListings(current);
}

export function updateListing(id: string, patch: Partial<PublishedGame>): void {
  const current = loadListings();
  const idx = current.findIndex((g) => g.id === id);
  if (idx === -1) return;
  const merged = { ...current[idx], ...patch };
  const res = PublishedGameSchema.safeParse(merged);
  if (!res.success) {
    throw new Error(res.error.issues.map((i) => i.message).join(", "));
  }
  current[idx] = res.data;
  saveListings(current);
}

export function importListings(items: PublishedGame[]): number {
  const ok: PublishedGame[] = [];
  for (const it of items) {
    const v = PublishedGameSchema.safeParse(it);
    if (v.success) ok.push(v.data);
  }
  const existing = loadListings();
  const byId = new Map(existing.map((x) => [x.id, x]));
  for (const it of ok) byId.set(it.id, it);
  const merged = Array.from(byId.values());
  saveListings(merged);
  return merged.length;
}

export function exportListings(): string {
  const list = loadListings();
  return JSON.stringify(list, null, 2);
}

export function clearListings(): void {
  localStorage.removeItem(STORAGE_KEY);
}
