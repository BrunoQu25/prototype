import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { foodBundles } from "@/data/foodBundles";

export default function RentalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [selectedBundles, setSelectedBundles] = useState<string[]>([]);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const selectedFoodBundles = useMemo(
    () => foodBundles.filter((bundle) => selectedBundles.includes(bundle.id)),
    [foodBundles, selectedBundles],
  );
  const foodSelectionTotal = selectedFoodBundles.reduce(
    (sum, bundle) => sum + bundle.price,
    0,
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-UY", {
      style: "currency",
      currency: "UYU",
      minimumFractionDigits: 0,
    }).format(price);

  const toggleBundle = (bundleId: string) => {
    setSelectedBundles((prev) =>
      prev.includes(bundleId)
        ? prev.filter((id) => id !== bundleId)
        : [...prev, bundleId],
    );
  };

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
      state: {
        startDate,
        endDate,
        foodBundles: foodBundles.filter((bundle) =>
          selectedBundles.includes(bundle.id),
        ),
      },
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
          <div className="space-y-3">
            <div className="rounded-2xl border border-game-brown/20 p-4 bg-amber-50 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-game-brown">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-game-brown">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full rounded-2xl border border-game-brown/20 bg-white px-4 py-3 text-game-brown shadow-inner focus:border-game-rust focus:ring-2 focus:ring-game-rust/30"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <p className="text-xs text-game-brown/70">
                  Seleccioná un rango completo para continuar.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setError("");
                  }}
                  className="text-xs font-semibold text-game-rust underline decoration-dotted underline-offset-4 hover:text-game-brown"
                >
                  Reiniciar fechas
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="rounded-2xl border-2 border-game-brown/10 bg-amber-50/60 p-5 space-y-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-game-brown">
                Snacks y combos para el retiro
              </h2>
              <p className="text-sm text-game-brown/80">
                Coordinamos pedidos con La Pasiva, Il Mondo, Tienda Inglesa,
                Disco y Devoto para que lleguen con tu juego, sellados y con
                seguimiento por e-mail.
              </p>
            </div>
            {selectedFoodBundles.length > 0 ? (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2">
                  {selectedFoodBundles.map((bundle) => (
                    <span
                      key={bundle.id}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-game-brown shadow"
                    >
                      {bundle.name}
                      <button
                        type="button"
                        aria-label={`Quitar ${bundle.name}`}
                        className="text-game-rust text-xs font-bold"
                        onClick={() => toggleBundle(bundle.id)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold text-game-rust">
                  Total gastronómico: {formatPrice(foodSelectionTotal)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-game-brown/70 border border-dashed border-game-brown/30 rounded-xl px-4 py-3 bg-white">
                Aún no seleccionaste combos gastronómicos. Elegí opciones de
                chivitos, pizzas, wraps frescos o picadas para recibirlos con el
                juego.
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-game-brown/70">
                Promo gamer del mes: envío bonificado y descuentos aplicados
                según catálogos vigentes.
              </p>
              <button
                type="button"
                onClick={() => setIsFoodModalOpen(true)}
                className="w-full sm:w-auto rounded-2xl bg-game-rust px-4 py-2 text-sm font-semibold text-white shadow hover:bg-game-brown transition"
              >
                Elegir combos gastronómicos
              </button>
            </div>
          </div>

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
      {isFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFoodModalOpen(false)}
          />
          <div className="relative w-full sm:w-[640px] px-4 sm:px-0">
            <div className="relative bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border-2 border-game-brown/10 max-h-[90vh] overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-game-brown">
                    Elegí tus combos gastronómicos
                  </h3>
                  <p className="text-sm text-game-brown/70">
                    Catálogo de restaurantes y supermercados uruguayos. Todo se
                    entrega con empaques térmicos junto al juego.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFoodModalOpen(false)}
                  className="text-game-brown text-2xl leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 space-y-4 overflow-y-auto pr-1 max-h-[60vh]">
                {foodBundles.map((bundle) => {
                  const checked = selectedBundles.includes(bundle.id);
                  return (
                    <label
                      key={bundle.id}
                      className={`flex flex-col gap-2 rounded-2xl border p-4 transition ${
                        checked
                          ? "border-game-rust bg-amber-50 shadow"
                          : "border-game-brown/20 bg-white"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <p className="text-base font-semibold text-game-brown">
                            {bundle.name}
                          </p>
                          <p className="text-sm text-game-brown/70">
                            {bundle.vendor} • {bundle.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-bold text-game-rust">
                            {formatPrice(bundle.price)}
                          </p>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBundle(bundle.id)}
                            className="h-5 w-5 rounded border-game-brown/40 text-game-rust focus:ring-game-rust/40"
                          />
                        </div>
                      </div>
                      <ul className="list-disc list-inside text-sm text-game-brown/80 space-y-1">
                        {bundle.items.map((item) => (
                          <li key={`${bundle.id}-${item}`}>{item}</li>
                        ))}
                      </ul>
                      <p className="text-xs font-semibold text-game-rust">
                        {bundle.promo}
                      </p>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-game-brown/80">
                  {selectedFoodBundles.length > 0
                    ? `${selectedFoodBundles.length} combo${
                        selectedFoodBundles.length > 1 ? "s" : ""
                      } seleccionados • ${formatPrice(foodSelectionTotal)}`
                    : "Seleccioná uno o más combos para coordinar con tu retiro."}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBundles([])}
                    className="px-4 py-2 rounded-2xl border border-game-brown text-game-brown text-sm font-semibold"
                  >
                    Limpiar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFoodModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-game-rust text-white text-sm font-semibold"
                  >
                    Listo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Sección de video: cómo jugar */}
    </Layout>
  );
}
