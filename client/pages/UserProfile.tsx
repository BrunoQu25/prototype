import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, ChevronLeft, MapPin, Clock, CheckCircle, Calendar } from "lucide-react";
import Layout from "@/components/Layout";
import { games } from "@/data/games";

type AggregatedReview = {
  gameTitle: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
};

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const game = games.find((g) => g.id === parseInt(id || "1"));
  const navigate = useNavigate();

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

  const ownerName = game.reviews_list?.[0]?.name ?? "Carla S";
  const initials = ownerName
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  const zones = [
    "Malvín, Montevideo",
    "Pocitos, Montevideo",
    "Centro, Montevideo",
    "Cordón, Montevideo",
    "Parque Rodó, Montevideo",
    "Buceo, Montevideo",
  ];
  const hash = Array.from(ownerName).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const zone = zones[hash % zones.length];
  // Igual que en la pantalla de producto
  const responseTime = "Responde cada 15 minutos";
  // Puntaje del propietario consistente con la tarjeta de producto
  const ownerRating = 4.9;
  // Cantidad de alquileres completados (ficticio y estable por usuario)
  const rentalsCompleted = 30 + (hash % 120);

  // Antigüedad como propietario: días -> semanas (si >7), meses (si >4 semanas), años (si >=12 meses)
  const daysAsOwner = 10 + (hash % 900);
  const formatTenure = (days: number) => {
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (months >= 12) return years === 1 ? "1 año" : `${years} años`;
    if (weeks > 4) return months === 1 ? "1 mes" : `${months} meses`;
    if (days > 7) return weeks === 1 ? "1 semana" : `${weeks} semanas`;
    return days === 1 ? "1 día" : `${days} días`;
  };
  const tenureText = formatTenure(daysAsOwner);

  // Aggregate reviews across games that this owner "publica"
  const ownerGameTitles = games
    .filter((g) => (g.reviews_list?.[0]?.name ?? "") === ownerName)
    .map((g) => g.title);

  const aggregated: AggregatedReview[] = games
    .filter((g) => ownerGameTitles.includes(g.title))
    .flatMap((g) =>
      g.reviews_list.map((r) => ({
        gameTitle: g.title,
        name: r.name,
        role: r.role,
        rating: r.rating,
        comment: r.comment,
      })),
    );

  // Transform comments to focus on the experience with the owner and ensure exactly 3 reviews
  const makeOwnerComment = (rating: number) => {
    if (rating >= 5)
      return `Excelente experiencia con ${ownerName}: comunicación rápida, muy puntual y el juego en perfecto estado.`;
    if (rating >= 4)
      return `Muy buena experiencia con ${ownerName}. Coordinamos fácil, respondió a tiempo y todo según lo acordado.`;
    if (rating >= 3)
      return `Experiencia correcta con ${ownerName}. Hubo pequeñas demoras pero resolvió bien y el juego estaba cuidado.`;
    if (rating >= 2)
      return `La coordinación con ${ownerName} fue algo complicada y hubo demoras.`;
    return `Tuve una mala experiencia coordinando con ${ownerName}.`;
  };

  // Variant that selects among multiple templates to ensure varied texts
  const makeOwnerCommentV2 = (rating: number, seed: number) => {
    const great = [
      `Excelente experiencia con ${ownerName}: comunicación rápida, puntualidad impecable y el juego como nuevo.`,
      `Todo perfecto con ${ownerName}. Respondió enseguida, coordinación simple y cero problemas.`,
      `Servicio diez puntos. ${ownerName} fue súper atento y el juego estaba en excelente estado.`,
    ];
    const good = [
      `Muy buena experiencia con ${ownerName}. Coordinamos fácil y cumplió lo acordado.`,
      `${ownerName} respondió a tiempo y la entrega fue ágil. Repetiría.`,
      `Sin complicaciones: buena comunicación y juego cuidado por parte de ${ownerName}.`,
    ];
    const ok = [
      `Experiencia correcta con ${ownerName}. Un poco de demora pero se resolvió bien.`,
      `Todo bien en general. Hubo ajustes de horario, pero ${ownerName} cumplió.`,
      `La coordinación con ${ownerName} fue ok; el juego estaba bien y funcionó.`,
    ];
    const poor = [
      `La coordinación con ${ownerName} fue confusa y hubo demoras.`,
      `Costó coordinar con ${ownerName}; llegó tarde y complicó un poco.`,
      `Experiencia regular: respuestas lentas y cambios de último momento.`,
    ];
    const bad = [
      `Mala experiencia coordinando con ${ownerName}. No repetiría.`,
      `Varios inconvenientes con ${ownerName}: poca comunicación y retrasos.`,
      `No quedé conforme: la coordinación con ${ownerName} fue muy difícil.`,
    ];
    const pick = (arr: string[]) => arr[Math.abs(seed) % arr.length];
    if (rating >= 5) return pick(great);
    if (rating >= 4) return pick(good);
    if (rating >= 3) return pick(ok);
    if (rating >= 2) return pick(poor);
    return pick(bad);
  };

  const base = aggregated.map((r, idx) => ({ ...r, comment: makeOwnerCommentV2(r.rating, idx) }));

  // If there are fewer than 3, add synthetic owner-focused reviews
  const fallbackNames = [
    { name: "María G.", role: "Casual" },
    { name: "Julián P.", role: "Aficionado" },
    { name: "Lucía R.", role: "Familiar" },
    { name: "Sebastián T.", role: "Estratega" },
  ];
  const synth: AggregatedReview[] = [];
  let fi = 0;
  while (base.length + synth.length < 3) {
    const f = fallbackNames[fi % fallbackNames.length];
    const seed = (games.indexOf(game) + fi) % 3;
    const rating = Math.max(3, Math.min(5, Math.round((game.rating || 4.5) + (seed === 0 ? 0 : seed === 1 ? -1 : 1))));
    synth.push({
      gameTitle: game.title,
      name: f.name,
      role: f.role,
      rating,
      comment: makeOwnerCommentV2(rating, base.length + fi),
    });
    fi++;
  }
  const displayed = [...base, ...synth].slice(0, 3);
  const totalReviews = 12 + (hash % 38);
  // Breakdown de estrellas basado en datos agregados o generado según ownerRating
  const countsFromAggregated = [0, 0, 0, 0, 0];
  aggregated.forEach((r) => {
    const idx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    countsFromAggregated[idx] += 1;
  });
  let breakdownCounts = countsFromAggregated.slice();
  let breakdownTotal = breakdownCounts.reduce((a, b) => a + b, 0);
  if (breakdownTotal === 0 && totalReviews > 0) {
    let p5 = 0.9, p4 = 0.08, p3 = 0.02, p2 = 0, p1 = 0;
    if (ownerRating < 4.8 && ownerRating >= 4.5) { p5 = 0.78; p4 = 0.17; p3 = 0.05; }
    else if (ownerRating < 4.5 && ownerRating >= 4.0) { p5 = 0.58; p4 = 0.28; p3 = 0.11; p2 = 0.03; }
    else if (ownerRating < 4.0) { p5 = 0.35; p4 = 0.33; p3 = 0.22; p2 = 0.07; p1 = 0.03; }
    const raw = [p1, p2, p3, p4, p5].map((p) => Math.round(totalReviews * p));
    let diff = totalReviews - raw.reduce((a, b) => a + b, 0);
    const order = [4, 3, 2, 1, 0];
    let oi = 0;
    while (diff !== 0) {
      const k = order[oi % order.length];
      raw[k] += diff > 0 ? 1 : -1;
      diff += diff > 0 ? -1 : 1;
      oi++;
    }
    breakdownCounts = raw;
    breakdownTotal = totalReviews;
  }
  let breakdownPerc = breakdownCounts.map((c) => (breakdownTotal > 0 ? Math.round((c / breakdownTotal) * 100) : 0));
  // Forzar porcentajes solicitados: 5★=90%, 4★=9%, 2★=1% (1★ y 3★=0%)
  breakdownPerc = [0, 1, 0, 9, 90];
  const avgRating =
    displayed.length > 0
      ? Math.round((displayed.reduce((a, r) => a + r.rating, 0) / displayed.length) * 10) / 10
      : 0;

  return (
    <Layout>
      <div className="px-3 sm:px-6 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-game-brown text-opacity-70 mb-4 sm:mb-8 overflow-x-auto">
          <button onClick={() => navigate(-1)} className="p-1 rounded-md hover:bg-game-cream transition" aria-label="Volver" title="Volver">
            <ChevronLeft className="w-5 h-5 text-game-brown" />
          </button>
          <Link to="/" className="text-sm text-game-brown hover:text-game-brown whitespace-nowrap">Inicio</Link>
          <span>›</span>
          <Link to={`/product/${id}`} className="hover:text-game-brown whitespace-nowrap">
            {game.title}
          </Link>
          <span>›</span>
          <span className="text-game-brown font-semibold whitespace-nowrap">Perfil del propietario</span>
        </div>

        {/* Header: Owner summary */}
        <div className="bg-white rounded-2xl p-6 border-2 border-game-brown border-opacity-10 shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-game-brown">{ownerName}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-game-brown text-opacity-70">
                <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" />{zone}</span>
                <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{responseTime}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" />Propietario hace {tenureText}</span>
                <span className="inline-flex items-center gap-1"><CheckCircle className="w-4 h-4" />{rentalsCompleted} alquileres completados</span>
              </div>
            </div>
          </div>

          {/* Rating summary */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-game-brown">{ownerRating}</span>
              <span className="text-xl text-game-brown text-opacity-60">/5</span><span className="text-sm text-game-brown text-opacity-60 ml-2">({totalReviews} reseñas)</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${i < Math.round(ownerRating) ? "fill-game-gold text-game-gold" : "text-game-brown text-opacity-20"}`}
                />
              ))}
            </div>
            </div>
          {/* Breakdown por estrella, estilo Google Maps */}
          <div className="mt-4 space-y-1 w-full sm:w-1/3 md:w-1/4 max-w-[280px]">
            {[5,4,3,2,1].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-10 text-xs text-game-brown text-opacity-60">{s}★</span>
                <div className="flex-1 h-2 bg-game-brown/10 rounded">
                  <div className="h-2 rounded bg-game-gold" style={{ width: `${breakdownPerc[s-1]}%` }} />
                </div>
                <span className="w-10 text-xs text-right text-game-brown text-opacity-60">{breakdownPerc[s-1]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews list, Google Maps style cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-game-brown mb-4">Reseñas</h2>
          <div className="grid grid-cols-1 gap-4">
            {displayed.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border-2 border-game-brown border-opacity-10 hover:border-game-rust hover:border-opacity-30 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-game-brown">{rev.name}</div>
                    <div className="text-xs text-game-brown text-opacity-60">{rev.role} · {rev.gameTitle}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? "fill-game-gold text-game-gold" : "text-game-brown text-opacity-20"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-game-brown text-opacity-80 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
            {displayed.length === 0 && (
              <div className="sm:col-span-2 text-center text-game-brown text-opacity-70">
                Aún no hay reseñas para este propietario.
              </div>
            )}
          </div>
        </div>

        {/* Back button (removed per request) */}
        <div className="hidden">
          <Link
            to={`/product/${id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-game-brown text-game-brown hover:bg-game-brown hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" /> Volver al producto
          </Link>
        </div>
      </div>
    </Layout>
  );
}
