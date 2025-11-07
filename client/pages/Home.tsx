import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { games, categories } from "@/data/games";
import { loadListings } from "@/state/listings";
import Layout from "@/components/Layout";
import Carousel from "@/components/Carousel";
import { useMemo, useState, useEffect } from "react";

const isUrlImage = (s: string) =>
  typeof s === "string" && /^https?:\/\//.test(s);

const formatUYU = (n: number) =>
  new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
    maximumFractionDigits: 0,
  }).format(n);

// Comparación insensible a acentos/mayúsculas
const sameCat = (a: string, b: string) =>
  a.localeCompare(b, "es", { sensitivity: "base" }) === 0;

// Promos del carrusel grande (informativas, no críticas)
const promos = [
  {
    id: "envio",
    icon: "🚚",
    title: "Entrega en el día",
    subtitle: "Montevideo y alrededores según zona",
    bg: "from-amber-100 to-amber-200",
    bullets: ["Seguimiento en tiempo real", "Franjas horarias flexibles"],
  },
  {
    id: "reglas",
    icon: "📘",
    title: "Ayuda con reglas",
    subtitle: "Resuelve dudas del juego en segundos",
    bg: "from-violet-100 to-violet-200",
    bullets: ["Guías rápidas", "Videos cómo jugar"],
  },
  {
    id: "nuevo-azul",
    icon: "🟦",
    title: "Nuevo ingreso: Azul",
    subtitle: "¡Probalo ya!",
    bg: "from-indigo-100 to-indigo-200",
    bullets: ["Ideal para 2-4 jugadores", "≤45 min por partida"],
    ctaText: "Ver Azul",
    ctaTo: "/product/6", // id=6 en tus datos
  },
];

export default function Home() {
  const featuredGames = games.slice(0, 3);
  const recentlyAdded = games.slice(3, 6);
  const [filtro, setFiltro] = useState<string | null>(null);

  // Dinámicos desde localStorage
  const dynamicListings = useMemo(() => {
    try {
      return loadListings().filter((x) => x.visibility === "public");
    } catch {
      return [];
    }
  }, []);

  const mappedDyn = useMemo(
    () =>
      dynamicListings.map((d) => ({
        id: `dyn_${d.id}`,
        title: d.title,
        category: d.category,
        image:
          d.images.find((im) => im.type === "hero")?.url ||
          d.images[0]?.url ||
          "",
        rating: d.rating ?? 5,
        reviews: d.reviews ?? 0,
        description: d.description,
        duration: d.duration || "-",
        players: d.players || "-",
        difficulty: d.difficulty || "-",
        price: d.pricePerDay,
      })),
    [dynamicListings],
  );

  const allGames = useMemo(() => [...games, ...mappedDyn], [mappedDyn]);

  // Opcional: sincronizar con la URL (?categoria=)
  // import { useSearchParams } from "react-router-dom";
  // const [params, setParams] = useSearchParams();
  // useEffect(() => { setFiltro(params.get("categoria")); }, []);
  // useEffect(() => {
  //   if (filtro) { params.set("categoria", filtro); setParams(params, { replace: true }); }
  //   else { params.delete("categoria"); setParams(params, { replace: true }); }
  // }, [filtro]);

  const juegosFiltrados = useMemo(
    () =>
      filtro ? allGames.filter((g) => sameCat(g.category, filtro)) : allGames,
    [allGames, filtro],
  );

  useEffect(() => {
    if (filtro) {
      document.getElementById("resultados")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [filtro]);

  return (
    <Layout>
      <section className="px-3 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-12">
        {!filtro && (
          <>
            {/* Hero Section */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                Alquiler de juegos de mesa en Uruguay. Reservá y recibí en tu
                casa. Explora nuestra colección para la mejor experiencia de
                juego
              </p>
            </div>

            {/* Promo Carousel grande */}
            <div className="mb-8 sm:mb-10">
              <Carousel>
                {promos.map((p) => (
                  <div
                    key={p.id}
                    className="flex-shrink-0 w-[92%] sm:w-[72%] px-2"
                  >
                    <div
                      className={`relative h-full rounded-2xl overflow-hidden border border-game-brown/10 bg-gradient-to-br ${p.bg}`}
                    >
                      <div className="p-6 sm:p-8">
                        <div className="flex items-start gap-4 sm:gap-6">
                          <div className="flex-none w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white/30 grid place-items-center">
                            <span className="text-2xl sm:text-3xl leading-none">
                              {p.icon}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-game-brown">
                              {p.title}
                            </h3>
                            <p className="text-game-brown/80 mt-1 sm:mt-2">
                              {p.subtitle}
                            </p>

                            {p.bullets && (
                              <ul className="mt-3 sm:mt-4 text-sm sm:text-base text-game-brown/80 list-disc list-inside">
                                {p.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            )}

                            {p.ctaTo && p.ctaText && (
                              <Link
                                to={p.ctaTo}
                                className="inline-block mt-4 sm:mt-5 px-4 py-2 rounded-lg bg-game-brown text-white hover:opacity-90"
                              >
                                {p.ctaText}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Featured Games - Carousel */}
            <div className="mb-10"></div>
            {/* Featured Games - Carousel */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
                Destacados
              </h2>
              <Carousel>
                {featuredGames.map((game) => (
                  <Link
                    key={game.id}
                    to={`/product/${game.id}`}
                    className="flex-shrink-0 w-1/3 px-1.5 sm:px-2 min-w-0"
                  >
                    <div className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-2xl transition-all transform hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-game-gold border-opacity-50 cursor-pointer h-full flex flex-col">
                      {/* Game Image Area */}
                      <div className="bg-gradient-to-br from-game-gold to-amber-200 h-24 sm:h-48 flex items-center justify-center text-4xl sm:text-8xl flex-shrink-0">
                        {isUrlImage(game.image) ? (
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <span className="text-4xl sm:text-8xl">
                            {game.image}
                          </span>
                        )}
                      </div>

                      {/* Game Info */}
                      <div className="p-2 sm:p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-xs sm:text-lg text-game-brown mb-1 sm:mb-2 line-clamp-2 flex-grow">
                          {game.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 mb-1.5 sm:mb-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 sm:w-3 sm:h-3 ${
                                  i < Math.floor(game.rating)
                                    ? "fill-game-gold text-game-gold"
                                    : "text-game-brown text-opacity-20"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-game-brown hidden sm:inline">
                            {game.rating}
                          </span>
                          <span className="text-xs text-game-brown text-opacity-50 hidden sm:inline">
                            ({game.reviews})
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-game-rust text-white rounded-full text-xs font-semibold mb-1.5 sm:mb-3 w-fit">
                          {game.category}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-game-brown border-opacity-10 mt-auto">
                          <span className="font-bold text-xs sm:text-base text-game-rust">
                            {formatUYU(game.price)}{" "}
                            <span className="font-normal">por día</span>
                          </span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-game-gold" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </Carousel>
            </div>

            {/* Recently Added - Carousel (compact cards like Featured) */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
                Recién Agregado
              </h2>
              <Carousel>
                {recentlyAdded.map((game) => (
                  <Link
                    key={game.id}
                    to={`/product/${game.id}`}
                    className="flex-shrink-0 w-1/3 sm:w-1/4 px-1.5 sm:px-2 min-w-0"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-game-sage border-opacity-30 cursor-pointer h-full flex flex-col">
                      {/* Game Image Area - Compact */}
                      <div className="bg-gradient-to-br from-game-sage to-green-200 h-28 flex items-center justify-center text-6xl flex-shrink-0">
                        {isUrlImage(game.image) ? (
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.visibility = "hidden";
                            }}
                          />
                        ) : (
                          <span className="text-6xl">{game.image}</span>
                        )}
                      </div>

                      {/* Game Info - Compact */}
                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="font-bold text-base text-game-brown mb-1 line-clamp-1">
                          {game.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 mb-1.5 sm:mb-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-2 h-2 sm:w-3 sm:h-3 ${
                                  i < Math.floor(game.rating)
                                    ? "fill-game-gold text-game-gold"
                                    : "text-game-brown text-opacity-20"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-game-brown hidden sm:inline">
                            {game.rating}
                          </span>
                          <span className="text-xs text-game-brown text-opacity-50 hidden sm:inline">
                            ({game.reviews})
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="inline-block px-2 py-0.5 bg-game-sage text-white rounded-full text-xs font-semibold mb-2 w-fit">
                          {game.category}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-game-brown border-opacity-10 mt-auto">
                          <span className="font-bold text-sm text-game-rust">
                            {formatUYU(game.price)}{" "}
                            <span className="font-normal">por día</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-game-sage" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </Carousel>
            </div>
          </>
        )}

        {/* Categories - Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
            Categorías
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setFiltro((prev) =>
                    prev === category.name ? null : category.name,
                  )
                }
                aria-pressed={filtro === category.name}
                className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition
                  ${
                    filtro === category.name
                      ? "bg-game-gold text-white border-game-gold"
                      : "bg-white text-game-brown border-game-brown/10 hover:border-game-brown/30"
                  }`}
              >
                <div className="text-2xl sm:text-3xl flex-shrink-0">
                  {category.icon}
                </div>
                <p className="font-bold text-left text-sm sm:text-base truncate">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Resultados por categoría */}
        {filtro && (
          <section id="resultados" className="px-3 sm:px-6 pt-4 sm:pt-6 pb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-game-brown">
                {filtro} — {juegosFiltrados.length} resultado
                {juegosFiltrados.length !== 1 ? "s" : ""}
              </h2>
              <button
                type="button"
                onClick={() => setFiltro(null)}
                className="text-sm underline text-game-brown hover:opacity-80"
              >
                Quitar filtro
              </button>
            </div>

            {juegosFiltrados.length === 0 ? (
              <p className="text-game-brown/70">
                No hay juegos en esta categoría.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {juegosFiltrados.map((game) => (
                  <Link
                    key={game.id}
                    to={`/product/${game.id}`}
                    className="group rounded-xl overflow-hidden border border-game-brown/10 bg-white hover:shadow-card transition flex flex-col"
                  >
                    <div className="aspect-[4/3] w-full bg-gradient-to-br from-game-gold/10 to-game-brown/10 flex items-center justify-center">
                      {isUrlImage(game.image) ? (
                        <img
                          src={game.image}
                          alt={game.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.visibility = "hidden";
                          }}
                        />
                      ) : (
                        <span className="text-6xl">{game.image}</span>
                      )}
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col gap-1">
                      <h3 className="font-bold text-game-brown line-clamp-2">
                        {game.title}
                      </h3>
                      <p className="text-xs text-game-brown/70">
                        {game.category}
                      </p>
                      <div className="mt-2 text-game-brown font-semibold">
                        {formatUYU(game.price)}{" "}
                        <span className="font-normal">por día</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </Layout>
  );
}
