import { Link } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { games, categories } from "@/data/games";
import Layout from "@/components/Layout";
import Carousel from "@/components/Carousel";

export default function Home() {
  const featuredGames = games.slice(0, 3);
  const recentlyAdded = games.slice(3, 6);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="px-3 sm:px-6 pt-4 sm:pt-8 pb-8 sm:pb-12">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-game-brown mb-3 animate-bounce-slow">
            ¿Qué jugamos hoy?
          </h1>
          <p className="text-game-brown text-opacity-70 text-lg">
            Explora nuestra colección de juegos de mesa para la noche perfecta
          </p>
        </div>

        {/* Featured Games - Carousel */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
            <span className="text-3xl">✨</span>
            Destacados
          </h2>
          <Carousel>
            {featuredGames.map((game) => (
              <Link key={game.id} to={`/product/${game.id}`} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-game-gold border-opacity-50 cursor-pointer h-full">
                  {/* Game Image Area */}
                  <div className="bg-gradient-to-br from-game-gold to-amber-200 h-48 flex items-center justify-center text-8xl animate-float">
                    {game.image}
                  </div>

                  {/* Game Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-game-brown mb-2 line-clamp-2">
                      {game.title}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(game.rating) ? "fill-game-gold text-game-gold" : "text-game-brown text-opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-game-brown">{game.rating}</span>
                      <span className="text-xs text-game-brown text-opacity-50">({game.reviews})</span>
                    </div>

                    {/* Category Badge */}
                    <div className="inline-block px-3 py-1 bg-game-rust bg-opacity-10 border border-game-rust rounded-full text-xs font-semibold text-game-rust mb-3">
                      {game.category}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-game-brown text-opacity-70 line-clamp-2 mb-3">
                      {game.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-game-brown border-opacity-10">
                      <span className="font-bold text-lg text-game-rust">${game.price}/día</span>
                      <ChevronRight className="w-5 h-5 text-game-gold" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>

        {/* Recently Added - Grid with 3 columns */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
            <span className="text-3xl">🆕</span>
            Recién Agregado
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyAdded.map((game) => (
              <Link key={game.id} to={`/product/${game.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border-2 border-game-sage border-opacity-30 cursor-pointer h-full">
                  {/* Game Image Area - Smaller */}
                  <div className="bg-gradient-to-br from-game-sage to-green-200 h-32 flex items-center justify-center text-6xl animate-float">
                    {game.image}
                  </div>

                  {/* Game Info - Compact */}
                  <div className="p-3">
                    <h3 className="font-bold text-base text-game-brown mb-1 line-clamp-1">
                      {game.title}
                    </h3>

                    {/* Rating - Smaller */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(game.rating) ? "fill-game-gold text-game-gold" : "text-game-brown text-opacity-20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-game-brown">{game.rating}</span>
                    </div>

                    {/* Category Badge - Smaller */}
                    <div className="inline-block px-2 py-0.5 bg-game-sage bg-opacity-10 border border-game-sage rounded-full text-xs font-semibold text-game-sage mb-2">
                      {game.category}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-game-brown border-opacity-10">
                      <span className="font-bold text-sm text-game-rust">${game.price}/día</span>
                      <ChevronRight className="w-4 h-4 text-game-sage" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-game-brown mb-6 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Categorías
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-game-brown border-opacity-10 hover:border-game-rust hover:border-opacity-50 group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <p className="font-bold text-game-brown text-center text-sm sm:text-base">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
