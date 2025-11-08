import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  Star,
  MessageSquare,
} from "lucide-react";
import { useState, useMemo } from "react";
import { games } from "@/data/games";
import type { Game } from "@/data/games";
import { loadListings } from "@/state/listings";
import Layout from "@/components/Layout";

type DisplayGame = Omit<Game, "id"> & {
  id: string | number;
  source: "catalog" | "listing";
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const catalogGames = useMemo<DisplayGame[]>(
    () => games.map((g) => ({ ...g, source: "catalog" as const })),
    [],
  );

  const visibleListings = useMemo(() => {
    try {
      return loadListings().filter((x) => x.visibility === "public");
    } catch {
      return [];
    }
  }, []);

  const listingGames = useMemo<DisplayGame[]>(
    () =>
      visibleListings.map((listing) => {
        const heroImage =
          listing.images.find((img) => img.type === "hero")?.url ??
          listing.images[0]?.url ??
          "";
        return {
          id: `dyn_${listing.id}`,
          title: listing.title,
          category: listing.category,
          image: heroImage || "https://placehold.co/600x600?text=Juego",
          rating: listing.rating ?? 5,
          reviews: listing.reviews ?? 0,
          description: listing.description,
          duration: listing.duration ?? "-",
          players: listing.players ?? "-",
          difficulty: listing.difficulty ?? "-",
          price: listing.pricePerDay,
          rules: {
            video: "",
            text: "Este juego fue publicado por la comunidad. Consulta al propietario para instrucciones detalladas.",
          },
          reviews_list: [],
          source: "listing" as const,
        };
      }),
    [visibleListings],
  );

  const allGames = useMemo(
    () => [...catalogGames, ...listingGames],
    [catalogGames, listingGames],
  );

  const game = useMemo(
    () =>
      id
        ? allGames.find((g) => String(g.id) === id)
        : allGames.length > 0
          ? allGames[0]
          : null,
    [id, allGames],
  );
  const navigate = useNavigate();

  // Availability state for inline date picker
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [availability, setAvailability] = useState<boolean | null>(null);

  if (!game) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-game-brown text-lg">Juego no encontrado</p>
          <Link to="/" className="underline text-game-brown">
            Volver al inicio
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
  <div className="sm:px-6 sm:py-8 pb-36">
      {/* Hero + absolute full-width overlay card */}
      <section className="relative">
          <div className="w-full h-[50vh] sm:h-[60vh] bg-gray-100 overflow-hidden">
            <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
          </div>

          {/* Breadcrumb overlay on image */}
          <div className="absolute top-4 left-4 z-20 bg-white/70 backdrop-blur-sm rounded-md px-3 py-2 flex items-center gap-2 shadow-sm">
            <button onClick={() => navigate(-1)} className="p-1 rounded-md hover:bg-game-cream transition" aria-label="Volver" title="Volver">
              <ChevronLeft className="w-5 h-5 text-game-brown" />
            </button>
            <Link to="/" className="text-sm text-game-brown hover:text-game-brown">Inicio</Link>
            <span className="text-sm text-game-brown">›</span>
            <span className="text-sm font-semibold text-game-brown truncate max-w-[55vw]">{game.title}</span>
          </div>
      </section>

    <div className="relative -mt-36 sm:-mt-44 z-10">
      <div className="rounded-t-3xl sm:rounded-3xl p-6 shadow-xl bg-game-cream">
              {/* Header */}
              <div>
                <div className="inline-block px-4 py-2 bg-game-rust bg-opacity-10 border border-game-rust rounded-full text-sm font-semibold text-white mb-4">
                  {game.category}
                </div>
                <h1 className="text-4xl font-bold text-game-brown mb-3">{game.title}</h1>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(game.rating) ? "fill-game-gold text-game-gold" : "text-game-brown text-opacity-20"}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg text-game-brown">{game.rating}</span>
                  <span className="text-sm text-game-brown text-opacity-50">({game.reviews} reseñas)</span>
                </div>
              </div>

              {/* Owner */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-game-brown mb-3">Propietario</h2>
                {(() => {
                  const ownerName = game.reviews_list?.[0]?.name ?? "Carla S";
                  const initials = ownerName.split(" ").map((s) => s[0]).slice(0, 2).join("");
                  const ownerLocation = "Montevideo";
                  const responseTime = "Responde cada 15 minutos";
                  const ownerRating = 4.9;
                  return (
                    <div className="bg-white rounded-2xl p-4 border-2 border-game-brown border-opacity-10 shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-lg font-bold text-white shadow-md">{initials}</div>
                        <div>
                          <p className="font-bold text-game-brown">{ownerName}</p>
                          <p className="text-sm text-game-brown text-opacity-60">{ownerLocation} · {responseTime}</p>
                          <div className="flex items-center gap-1 mt-1"><Star className="w-4 h-4 text-game-gold" /><span className="text-sm font-semibold text-game-brown">{ownerRating}</span></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-3 py-1 border rounded-md bg-transparent text-game-brown hover:bg-game-brown hover:text-white transition text-sm">View profile</button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-game-brown mb-3">Descripción</h2>
                <p className="text-game-brown text-opacity-75 leading-relaxed">{game.description}</p>
              </div>

              {/* Rules */}
              <div className="mt-6 bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
                <h3 className="text-lg font-bold text-game-brown mb-4">Sobre el juego</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-game-brown"><Clock className="w-5 h-5 text-game-rust flex-shrink-0" /><span>{game.duration}</span></div>
                  <div className="flex items-center gap-3 text-game-brown"><Users className="w-5 h-5 text-game-rust flex-shrink-0" /><span>{game.players}</span></div>
                  <div className="flex items-center gap-3 text-game-brown"><span className="text-lg">📊</span><span>Dificultad: {game.difficulty}</span></div>
                </div>
                <Link to={`/product/${game.id}/rules`} className="w-full mt-4 px-4 py-3 bg-game-navy text-white rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"><span>📜</span>Ver Más<ChevronRight className="w-4 h-4" /></Link>
              </div>

              {/* Availability */}
              <div id="availability" className="mt-6 bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
                <h3 className="text-lg font-bold text-game-brown mb-3">Verificar disponibilidad</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col"><label className="text-sm text-game-brown">Fecha inicio</label><input type="date" value={selectedStart ?? ""} onChange={(e) => { setSelectedStart(e.target.value || null); setAvailability(null); }} className="mt-1 px-3 py-2 rounded-md border" /></div>
                  <div className="flex flex-col"><label className="text-sm text-game-brown">Fecha fin</label><input type="date" value={selectedEnd ?? ""} onChange={(e) => { setSelectedEnd(e.target.value || null); setAvailability(null); }} className="mt-1 px-3 py-2 rounded-md border" /></div>
                  <div className="flex items-end"><button type="button" onClick={() => {
                    if (!selectedStart || !selectedEnd) { setAvailability(false); return; }
                    const s = new Date(selectedStart); const e = new Date(selectedEnd);
                    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) { setAvailability(false); return; }
                    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
                    if (diff > 30) { setAvailability(false); return; }
                    setAvailability(true);
                  }} className="px-4 py-2 rounded-lg bg-game-rust text-white">Comprobar</button></div>
                </div>
                {availability === true && <p className="mt-3 text-sm text-game-rust font-semibold">Disponible para las fechas seleccionadas</p>}
                {availability === false && <p className="mt-3 text-sm text-red-600 font-semibold">Fechas inválidas o no disponibles</p>}
              </div>

              {/* Reviews inside card */}
              <div className="mt-6">
                <h2 className="text-3xl font-bold text-game-brown mb-6 flex items-center gap-2"><span className="text-4xl">💬</span>Reseñas</h2>
                
                {/* Reviews list */}
                <div className="space-y-4 mb-6">
                  {game.reviews_list && game.reviews_list.slice(0, 3).map((review, idx) => {
                    const initials = review.name.split(" ").map((s) => s[0]).slice(0, 2).join("");
                    return (
                      <div key={idx} className="bg-white rounded-xl p-4 border-2 border-game-brown border-opacity-10 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-bold text-game-brown">{review.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-game-gold text-game-gold" />
                                <span className="text-sm font-semibold text-game-brown">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-game-brown text-opacity-75 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link to={`/product/${game.id}/reviews`} className="inline-flex items-center gap-2 px-6 py-3 bg-game-rust text-white rounded-xl font-bold hover:bg-opacity-90 transition">Ver todas las reseñas <ChevronRight className="w-4 h-4" /></Link>
              </div>
            </div>
        </div>
        
      </div>

      {/* Fixed buy bar visible while on ProductDetail */}
      <div className="fixed left-1/2 bottom-4 z-50 -translate-x-1/2 w-full max-w-3xl px-3 sm:px-6">
        <div className="bg-gradient-to-r from-game-rust to-orange-600 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-white text-sm">Precio</div>
              <div className="text-white font-bold text-xl">${game.price} <span className="text-sm font-normal">/día</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsWishlisted(!isWishlisted)} className={`px-4 py-2 rounded-lg font-bold transition flex items-center justify-center gap-2 border-2 ${isWishlisted ? "bg-white text-game-rust border-white" : "bg-transparent text-white border-white hover:bg-white hover:bg-opacity-10"}`}>
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>

            {availability === true && selectedStart && selectedEnd ? (
              <Link to={`/product/${game.id}/rental`} state={{ start: selectedStart, end: selectedEnd }} className="px-4 py-2 rounded-lg bg-white text-game-rust font-bold border-2 border-white">Alquilar</Link>
            ) : (
              <button type="button" onClick={() => { document.getElementById("availability")?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="px-4 py-2 rounded-lg bg-white text-game-rust font-bold border-2 border-white">Verificar disponibilidad</button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
