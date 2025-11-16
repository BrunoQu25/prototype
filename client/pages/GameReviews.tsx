import { useParams, Link } from "react-router-dom";
import { Star, ThumbsUp, ThumbsDown, Plus } from "lucide-react";
import { useState } from "react";
import { games } from "@/data/games";
import Layout from "@/components/Layout";

export default function GameReviews() {
  const { id } = useParams<{ id: string }>();
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [showNewReviewForm, setShowNewReviewForm] = useState(false);
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
          <Link to="/" className="hover:text-game-brown whitespace-nowrap">
            Inicio
          </Link>
          <span>›</span>
          <Link
            to={`/product/${id}`}
            className="hover:text-game-brown whitespace-nowrap"
          >
            {game.title}
          </Link>
          <span>›</span>
          <span className="text-game-brown font-semibold whitespace-nowrap">
            Reseñas
          </span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-game-brown mb-3">
            Cuéntanos Tu Experiencia
          </h1>
          <p className="text-game-brown text-opacity-60 text-lg">
            Reseñas sobre {game.title}
          </p>
        </div>

        {/* Overall Rating Summary */}
        <div className="bg-gradient-to-r from-game-gold to-amber-200 rounded-2xl p-8 mb-12 border-4 border-game-gold border-opacity-30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-game-brown text-opacity-70 text-sm font-semibold mb-2">
                Calificación General
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-game-brown">
                  {game.rating}
                </span>
                <span className="text-2xl text-game-brown text-opacity-70">
                  /5
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < Math.floor(game.rating)
                      ? "fill-game-rust text-game-rust"
                      : "text-game-brown text-opacity-20"
                  }`}
                />
              ))}
            </div>
            <p className="text-game-brown text-opacity-70 font-semibold">
              {game.reviews} reseñas
            </p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-game-brown mb-6">
            Reseñas de Usuarios
          </h2>
          <div className="space-y-6">
            {game.reviews_list.map((review, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-game-brown border-opacity-10 hover:border-game-rust hover:border-opacity-30 transition"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-game-brown">
                      {review.name}
                    </h3>
                    <p className="text-sm text-game-brown text-opacity-60">
                      {review.role}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "fill-game-gold text-game-gold"
                            : "text-game-brown text-opacity-20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-game-brown text-opacity-75 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* Agree/Disagree */}
                <div className="flex items-center gap-3 pt-4 border-t border-game-brown border-opacity-10">
                  <span className="text-sm text-game-brown text-opacity-60">
                    ¿Estás de acuerdo?
                  </span>
                  <button className="p-2 rounded-lg border-2 border-game-sage hover:bg-game-sage hover:text-white transition text-game-sage">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg border-2 border-game-rust hover:bg-game-rust hover:text-white transition text-game-rust">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Review Section */}
        <div className="mb-8">
          {!showNewReviewForm ? (
            <button
              onClick={() => setShowNewReviewForm(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-game-rust to-orange-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Agregar Mi Reseña
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-8 border-4 border-game-rust border-opacity-30">
              <h3 className="text-2xl font-bold text-game-brown mb-6">
                Comparte Tu Experiencia
              </h3>

              {/* Rating Input */}
              <div className="mb-6">
                <label className="block text-game-brown font-semibold mb-3">
                  Tu Calificación
                </label>
                <div className="flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewRating(i + 1)}
                      className="transition transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          i < newRating
                            ? "fill-game-gold text-game-gold"
                            : "text-game-brown text-opacity-20 hover:text-game-gold hover:fill-game-gold"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label className="block text-game-brown font-semibold mb-3">
                  Tu Reseña
                </label>
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Cuéntanos qué te pareció este juego..."
                  className="w-full p-4 border-2 border-game-brown border-opacity-20 rounded-xl outline-none resize-none font-sans text-game-brown placeholder:text-game-brown placeholder:text-opacity-40 focus:border-game-rust focus:bg-game-cream transition"
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewReviewForm(false);
                    setNewReview("");
                    setNewRating(5);
                  }}
                  aria-label="Cancelar"
                  title="Cancelar"
                  className="flex-1 py-3 px-4 bg-white text-game-brown rounded-xl font-bold border-2 border-game-brown hover:bg-game-brown hover:text-white transition"
                >
                  Cancelar
                </button>
                <button className="flex-1 py-3 px-4 bg-game-rust text-white rounded-xl font-bold hover:bg-opacity-90 transition">
                  Publicar Reseña
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
