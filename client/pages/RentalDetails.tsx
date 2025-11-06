import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { games } from "@/data/games";
import Layout from "@/components/Layout";

export default function RentalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate) {
      setError("Seleccione fecha de inicio y fecha de fin");
      return;
    }
    const s = new Date(startDate);
    const eD = new Date(endDate);
    if (eD <= s) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Navigate to delivery/payment step with dates in state
    navigate(`/product/${id}/rental/delivery`, {
      state: { startDate, endDate },
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-game-brown mb-4">
          Detalles del alquiler
        </h1>
        <form
          onSubmit={submit}
          className="space-y-4 bg-white p-6 rounded-2xl shadow-md border-2 border-game-brown border-opacity-10"
        >
          <div>
            <label className="block text-sm font-semibold text-game-brown mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-game-brown border-opacity-10 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-game-brown mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-game-brown border-opacity-10 px-3 py-2"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-game-brown text-game-brown"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-game-rust text-white font-semibold"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
      {/* Sección de video: cómo jugar */}
      {games[id]?.rules?.video ? (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Video: cómo jugar</h3>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src={games[id].rules.video}
              title={`Cómo jugar ${games[id].title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        <a
          className="mt-8 inline-block underline"
          href={`https://www.youtube.com/results?search_query=c%C3%B3mo+jugar+${encodeURIComponent(games[id]?.title || "")}`}
          target="_blank"
          rel="noreferrer"
        >
          Ver en YouTube cómo jugar {games[id]?.title}
        </a>
      )}
    </Layout>
  );
}
