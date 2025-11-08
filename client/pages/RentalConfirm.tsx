import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Layout from "@/components/Layout";
import { games } from "@/data/games";

export default function RentalConfirm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as any;
  const game = games.find((g) => g.id === parseInt(id || "0"));

  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);
  // --- New booking form state ---
  const [method, setMethod] = useState<"pickup" | "delivery">(
    (state.method as "pickup" | "delivery") ?? "pickup"
  );
  const [address, setAddress] = useState<string>(state.address ?? "");
  const [comment, setComment] = useState<string>(state.comment ?? "");
  const [payment, setPayment] = useState<string>(state.payment ?? "mercado");
  
  // Payment methods management (saved cards + built-in options)
  const [savedMethods, setSavedMethods] = useState<Array<any>>([]);
  // selectedPayment can be 'mercado' | 'cash' | savedMethod.id
  const [selectedPayment, setSelectedPayment] = useState<string>(state.payment ?? "");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  // new card form
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardType, setNewCardType] = useState<"debit" | "credit">("debit");
  // derive dates from incoming state (support both start/startDate keys)
  const startRaw: string | undefined = state.startDate ?? state.start;
  const endRaw: string | undefined = state.endDate ?? state.end;

  const startDate = startRaw ? new Date(startRaw) : undefined;
  const endDate = endRaw ? new Date(endRaw) : undefined;

  const msPerDay = 1000 * 60 * 60 * 24;
  const days = startDate && endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime())
    ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay))
    : 0;

  const pricePerDay = game?.price ?? 0;
  const subtotal = days * pricePerDay;
  const serviceFee = Math.round(subtotal * 0.1); // 10% service
  const total = subtotal + serviceFee;

  // derive a mock owner similar to ProductDetail owner's card
  const ownerName = game?.reviews_list?.[0]?.name ?? "Carla S";
  const initials = ownerName
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  const ownerLocation = "Montevideo";
  const responseTime = "Responde cada 15 minutos";
  const ownerRating = 4.9;

  const confirm = () => {
    // In a real app we would POST the booking including method/address/payment
    // For now simulate success UI then redirect to main
    setShowSuccess(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    // We could pass collected booking data to the simulated backend here
    timerRef.current = window.setTimeout(() => {
      setShowSuccess(false);
      navigate(`/`);
    }, 2200);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Layout>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Close X - back to product detail */}
        <button
          aria-label="Cerrar"
          title="Cerrar"
          onClick={() => navigate(`/product/${id}`)}
          className="absolute right-3 top-3 p-2 rounded-md text-game-brown hover:bg-game-cream"
        >
          <X className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-game-brown mb-4">
          Resumen del pedido
        </h1>
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-game-brown border-opacity-10 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={game?.image}
              alt={game?.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="font-bold text-game-brown">{game?.title}</p>
              <p className="text-sm text-game-brown text-opacity-60">
                {game?.category}
              </p>
            </div>
          </div>

          {/* Booking data module */}
          <div className="space-y-3">
            <h3 className="font-semibold text-game-brown">Detalles del alquiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="text-sm text-game-brown">Inicio: <strong>{startRaw ?? "-"}</strong></div>
              <div className="text-sm text-game-brown">Fin: <strong>{endRaw ?? "-"}</strong></div>
              <div className="text-sm text-game-brown">Días: <strong>{days}</strong></div>
              <div className="text-sm text-game-brown">Precio/día: <strong>${pricePerDay}</strong></div>
              {/* Owner info */}
              <div className="col-span-1 sm:col-span-2">
                <h4 className="font-semibold text-game-brown mt-2">Propietario</h4>
                <div className="bg-white rounded-lg p-3 border border-game-brown border-opacity-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-lg font-bold text-white">{initials}</div>
                    <div>
                      <div className="font-bold text-game-brown">{ownerName}</div>
                      <div className="text-sm text-game-brown text-opacity-60">{ownerLocation}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-game-brown flex items-center gap-1">
                    <svg className="w-4 h-4 text-game-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" />
                    </svg>
                    <span>{ownerRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup / Delivery selection */}
          <div className="pt-4">
            <h3 className="font-semibold text-game-brown mb-2">Modo de retiro</h3>
            <div className="flex gap-3 mb-3">
              <label className={`px-4 py-2 rounded-md border ${method === "pickup" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}>
                <input type="radio" name="method" value="pickup" checked={method === "pickup"} onChange={() => setMethod("pickup")} className="hidden" />
                Pickup
              </label>
              <label className={`px-4 py-2 rounded-md border ${method === "delivery" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}>
                <input type="radio" name="method" value="delivery" checked={method === "delivery"} onChange={() => setMethod("delivery")} className="hidden" />
                Delivery
              </label>
            </div>

            {method === "pickup" && (
              <div>
                <label className="block text-sm font-semibold text-game-brown mb-1">Nota para el anfitrión (coordinación)</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded-md border border-game-brown border-opacity-10 px-3 py-2" placeholder="Ej: Llegaré a las 19:00, dejar en conserjería..." />
              </div>
            )}

            {method === "delivery" && (
              <div>
                <label className="block text-sm font-semibold text-game-brown mb-1">Dirección de envío</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-game-brown border-opacity-10 px-3 py-2" placeholder="Calle, número, piso" />
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="pt-4">
            <h3 className="font-semibold text-game-brown mb-2">Método de pago</h3>

            {/* Selected method display */}
            <div>
              {(!selectedPayment || (selectedPayment.startsWith("card-") && savedMethods.length === 0)) ? (
                // No payment selected or selected card missing -> show add box
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="w-full rounded-md border-2 border-dashed border-game-brown/40 px-4 py-4 flex items-center justify-between text-game-brown hover:border-game-rust"
                >
                  <span className="font-medium">+ Agregar método de pago</span>
                  <span className="text-sm text-game-brown/60"> </span>
                </button>
              ) : (
                // Show only the chosen method summary with a chevron to change
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="w-full rounded-md border px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {selectedPayment === "mercado" && <div className="font-medium">Mercado Pago</div>}
                    {selectedPayment === "cash" && <div className="font-medium">Efectivo</div>}
                    {selectedPayment.startsWith("card-") && (
                      (() => {
                        const m = savedMethods.find((s) => s.id === selectedPayment);
                        if (!m) return <div className="text-sm text-red-600">Método no encontrado</div>;
                        return (
                          <div>
                            <div className="font-medium">{m.brand} •••• {m.last4}</div>
                            <div className="text-xs text-game-brown text-opacity-60">{m.type === "debit" ? "Débito" : "Crédito"}</div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                  <div className="text-game-brown">›</div>
                </button>
              )}
            </div>

            {/* Payment modal */}
            {paymentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={() => setPaymentModalOpen(false)} />
                <div className="relative w-full sm:w-[540px] bg-white rounded-t-xl sm:rounded-xl p-4">
                  <h4 className="text-lg font-semibold mb-3">Seleccionar método de pago</h4>
                  <div className="space-y-2">
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md border ${selectedPayment === "mercado" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}
                      onClick={() => { setSelectedPayment("mercado"); setPaymentModalOpen(false); }}
                    >
                      Mercado Pago
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md border ${selectedPayment === "cash" ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`}
                      onClick={() => { setSelectedPayment("cash"); setPaymentModalOpen(false); }}
                    >
                      Efectivo
                    </button>

                    {savedMethods.map((m) => (
                      <button key={m.id} className={`w-full text-left px-3 py-2 rounded-md border ${selectedPayment === m.id ? "border-game-rust bg-game-rust text-white" : "border-game-brown"}`} onClick={() => { setSelectedPayment(m.id); setPaymentModalOpen(false); }}>
                        {m.brand} •••• {m.last4} <span className="text-xs ml-2 text-game-brown/60">{m.type === "debit" ? "Débito" : "Crédito"}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-3">
                    <h5 className="font-semibold mb-2">Agregar tarjeta</h5>
                    <div className="flex flex-col gap-2">
                      <input value={newCardNumber} onChange={(e) => setNewCardNumber(e.target.value)} placeholder="Número de tarjeta" className="w-full rounded-md border px-3 py-2" />
                      <select value={newCardType} onChange={(e) => setNewCardType(e.target.value as any)} className="w-full rounded-md border px-3 py-2">
                        <option value="debit">Débito</option>
                        <option value="credit">Crédito</option>
                      </select>
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-2 rounded-md border" onClick={() => { setNewCardNumber(""); setNewCardType("debit"); }} type="button">Limpiar</button>
                        <button className="px-3 py-2 rounded-md bg-game-rust text-white" onClick={() => {
                          const digits = newCardNumber.replace(/\D/g, '');
                          if (digits.length < 4) return alert('Ingrese al menos 4 dígitos');
                          const last4 = digits.slice(-4);
                          const id = `card-${Date.now()}`;
                          const brand = 'Tarjeta';
                          const newMethod = { id, brand, last4, type: newCardType };
                          setSavedMethods((s) => [newMethod, ...s]);
                          setSelectedPayment(id);
                          setNewCardNumber("");
                          setNewCardType("debit");
                          setPaymentModalOpen(false);
                        }} type="button">Agregar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Cost breakdown and actions */}
          <div className="pt-4 border-t mt-4 pt-4">
            <h3 className="font-semibold text-game-brown mb-2">Totales</h3>
            <div className="space-y-2 text-sm text-game-brown">
              <div className="flex justify-between"><span>Subtotal ({days} días)</span><strong>${subtotal}</strong></div>
              <div className="flex justify-between"><span>Comisión (10%)</span><strong>${serviceFee}</strong></div>
              <div className="flex justify-between"><span className="font-semibold">Total</span><strong className="font-semibold">${total}</strong></div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-game-brown">Volver</button>
              <button onClick={confirm} className="px-4 py-2 rounded-lg bg-game-rust text-white font-semibold">Confirmar y pagar ${total}</button>
            </div>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-game-sage bg-opacity-95"
        >
          <div className="text-center text-white p-6 rounded-lg">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Reserva confirmada</h2>
            <p className="opacity-90">Gracias — serás redirigido al inicio</p>
          </div>
        </div>
      )}
    </Layout>
  );
}
