import { useParams, Link } from "react-router-dom";
import { ChevronRight, Volume2, Send } from "lucide-react";
import { useState } from "react";
import { games } from "@/data/games";
import Layout from "@/components/Layout";

export default function GameRules() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState("");
  const game = games.find((g) => g.id === parseInt(id || "1"));

  if (!game) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-game-brown text-lg">Juego no encontrado</p>
          <Link to="/" className="text-game-rust mt-4 inline-block hover:underline">
            Volver a inicio
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-game-brown text-opacity-70 mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-game-brown whitespace-nowrap">
            Inicio
          </Link>
          <span>›</span>
          <Link to={`/product/${id}`} className="hover:text-game-brown whitespace-nowrap">
            {game.title}
          </Link>
          <span>›</span>
          <span className="text-game-brown font-semibold whitespace-nowrap">Sobre tu juego</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-game-brown mb-2">Sobre tu juego</h1>
          <p className="text-game-brown text-opacity-60">{game.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Rules Section */}
          <div className="space-y-6">
            {/* Rules Title */}
            <div>
              <h2 className="text-2xl font-bold text-game-brown mb-4 flex items-center gap-2">
                <span className="text-3xl">📜</span>
                Reglas
              </h2>
            </div>

            {/* Video Explicativo */}
            <div>
              <h3 className="text-lg font-bold text-game-brown mb-3">Video Explicativo</h3>
              <div className="bg-gradient-to-br from-game-navy to-blue-900 rounded-2xl p-8 aspect-video flex items-center justify-center border-4 border-game-navy border-opacity-30 hover:shadow-lg transition">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">▶</span>
                  </div>
                  <p className="text-white text-opacity-90 font-semibold">Video del juego</p>
                </div>
              </div>
            </div>

            {/* Game Rules Info */}
            <div className="bg-game-cream rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
              <h3 className="text-lg font-bold text-game-brown mb-4">Información del Juego</h3>
              <div className="space-y-3 text-game-brown">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">⏱️</span>
                  <div>
                    <p className="font-semibold">Duración</p>
                    <p className="text-sm text-opacity-70">{game.duration}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">👥</span>
                  <div>
                    <p className="font-semibold">Jugadores</p>
                    <p className="text-sm text-opacity-70">{game.players}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📊</span>
                  <div>
                    <p className="font-semibold">Dificultad</p>
                    <p className="text-sm text-opacity-70">{game.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Transcription & Notes */}
          <div className="space-y-6">
            {/* Transcription Section */}
            <div>
              <h2 className="text-2xl font-bold text-game-brown mb-4 flex items-center gap-2">
                <span className="text-3xl">📝</span>
                Transcripción
              </h2>
            </div>

            {/* Consultant Card */}
            <div className="bg-white rounded-2xl p-6 border-4 border-game-gold border-opacity-50 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-2xl shadow-md">
                  👤
                </div>
                <div>
                  <p className="font-bold text-game-brown">Consultor</p>
                  <p className="text-sm text-game-brown text-opacity-60">Explicación de reglas</p>
                </div>
              </div>
              <div className="bg-game-cream rounded-xl p-4 text-game-brown text-opacity-85 leading-relaxed">
                <p className="mb-3">{game.rules.text}</p>
                <p className="text-sm italic text-game-brown text-opacity-60">
                  Haz preguntas en la sección de comentarios si algo no es claro.
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-bold text-game-brown mb-3 flex items-center gap-2">
                <span className="text-2xl">💭</span>
                Mis Notas
              </h3>
              <div className="bg-white rounded-2xl border-2 border-game-brown border-opacity-20 overflow-hidden shadow-md">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Escribe tus notas sobre las reglas..."
                  className="w-full p-4 border-0 outline-none resize-none font-sans text-game-brown placeholder:text-game-brown placeholder:text-opacity-40 bg-white focus:bg-game-cream transition"
                  rows={4}
                />
                <div className="border-t border-game-brown border-opacity-10 p-4 flex gap-2">
                  <button className="flex-1 py-2 px-4 bg-game-brown bg-opacity-10 text-game-brown rounded-lg font-semibold hover:bg-opacity-20 transition text-sm">
                    ❌ Limpiar
                  </button>
                  <button className="flex-1 py-2 px-4 bg-game-rust text-white rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2 text-sm">
                    <Send className="w-4 h-4" />
                    Guardar
                  </button>
                </div>
              </div>
            </div>

            {/* Back to Product */}
            <Link
              to={`/product/${id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-game-sage text-white rounded-xl font-bold hover:bg-opacity-90 transition"
            >
              ← Volver al producto
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
