import { useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Clock,
  Users,
  ChevronRight,
  Star,
} from "lucide-react";
import { useState } from "react";
import { games } from "@/data/games";
import Layout from "@/components/Layout";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const game = games.find((g) => g.id === parseInt(id || "1"));

  if (!game) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-game-brown text-lg">Juego no encontrado</p>
          <Link
            to="/"
            className="text-game-rust mt-4 inline-block hover:underline"
          >
            Volver a inicio
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-3 sm:px-6 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-game-brown text-opacity-70 mb-4 sm:mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-game-brown">
            Inicio
          </Link>
          <span>›</span>
          <span>Categoría</span>
          <span>›</span>
          <span className="text-game-brown font-semibold">{game.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Product Image */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-gradient-to-br from-game-gold to-amber-200 rounded-3xl p-12 aspect-square flex items-center justify-center shadow-xl border-4 border-game-gold border-opacity-30 animate-float">
              <span className="text-9xl">{game.image}</span>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <div className="inline-block px-4 py-2 bg-game-rust bg-opacity-10 border border-game-rust rounded-full text-sm font-semibold text-game-rust mb-4">
                {game.category}
              </div>
              <h1 className="text-4xl font-bold text-game-brown mb-3">
                {game.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(game.rating)
                          ? "fill-game-gold text-game-gold"
                          : "text-game-brown text-opacity-20"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-lg text-game-brown">
                  {game.rating}
                </span>
                <span className="text-sm text-game-brown text-opacity-50">
                  ({game.reviews} reseñas)
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-game-brown mb-3">
                Descripción
              </h2>
              <p className="text-game-brown text-opacity-75 leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Rules */}
            <div className="bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
              <h3 className="text-lg font-bold text-game-brown mb-4">Reglas</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-game-brown">
                  <Clock className="w-5 h-5 text-game-rust flex-shrink-0" />
                  <span>{game.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-game-brown">
                  <Users className="w-5 h-5 text-game-rust flex-shrink-0" />
                  <span>{game.players}</span>
                </div>
                <div className="flex items-center gap-3 text-game-brown">
                  <span className="text-lg">📊</span>
                  <span>Dificultad: {game.difficulty}</span>
                </div>
              </div>

              {/* View Rules Button */}
              <Link
                to={`/product/${game.id}/rules`}
                className="w-full mt-4 px-4 py-3 bg-game-navy text-white rounded-xl font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
              >
                <span>📜</span>
                Ver Reglas Completas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Price and Action Buttons */}
            <div className="bg-gradient-to-r from-game-rust to-orange-600 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  ${game.price}
                </span>
                <span className="text-white text-opacity-90">/día</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 border-2 ${
                    isWishlisted
                      ? "bg-white text-game-rust border-white"
                      : "bg-transparent text-white border-white hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  <span className="hidden sm:inline">
                    {isWishlisted ? "En" : "Agregar a"} Lista
                  </span>
                </button>
                <button className="py-3 rounded-xl font-bold bg-white text-game-rust hover:bg-opacity-90 transition flex items-center justify-center gap-2 border-2 border-white">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">Alquilar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-game-brown mb-6 flex items-center gap-2">
            <span className="text-4xl">💬</span>
            Reseñas
          </h2>
          <Link
            to={`/product/${game.id}/reviews`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-game-rust text-white rounded-xl font-bold hover:bg-opacity-90 transition"
          >
            Ver todas las reseñas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Layout>
  );
}
