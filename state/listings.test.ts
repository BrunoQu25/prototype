import { describe, it, expect, beforeEach } from "vitest";
import { loadListings, saveListings, addListing, updateListing, clearListings, STORAGE_KEY } from "./listings";
import type { PublishedGame } from "@/types/listing";

// Mock localStorage
beforeEach(() => {
  // @ts-ignore
  global.localStorage = {
    store: {} as Record<string,string>,
    getItem(k:string){ return this.store[k] ?? null; },
    setItem(k:string,v:string){ this.store[k] = v; },
    removeItem(k:string){ delete this.store[k]; },
    clear(){ this.store = {}; }
  };
  clearListings();
});

function sample(): PublishedGame {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Catan",
    category: "Estrategia",
    images: [{ url: "data:image/jpeg;base64,AA", type: "hero" }],
    description: "desc",
    pricePerDay: 100,
    condition: "good",
    visibility: "public",
    createdAt: new Date().toISOString(),
  };
}

describe("listings storage", () => {
  it("adds and loads items", () => {
    const item = sample();
    addListing(item);
    const all = loadListings();
    expect(all.length).toBe(1);
    expect(all[0].title).toBe("Catan");
  });

  it("updates item", () => {
    const item = sample();
    addListing(item);
    updateListing(item.id, { title: "Nuevo título" });
    const all = loadListings();
    expect(all[0].title).toBe("Nuevo título");
  });

  it("saveListings writes raw JSON", () => {
    const items = [sample()];
    saveListings(items);
    // @ts-ignore
    const raw = global.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
  });
});
