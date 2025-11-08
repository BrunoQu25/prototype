import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  FileText,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Target,
  Brain,
} from "lucide-react";
import AIChat from "@/components/AIChat";
import { games } from "@/data/games";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
export default function GameRules() {
  const { id } = useParams<{ id: string }>();
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
            Sobre tu juego
          </span>
        </div>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-game-brown mb-2">
            Sobre tu juego
          </h1>
          <p className="text-game-brown text-opacity-60">{game.title}</p>
        </div>
        {/* Game Rules Info */}
        <div className="bg-game-cream mb-10 rounded-2xl p-6 border-2 border-game-brown border-opacity-10">
          <h3 className="text-lg font-bold text-game-brown mb-4">
            Información del Juego
          </h3>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
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
              <h3 className="text-lg font-bold text-game-brown mb-2">
                Video Explicativo
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  src={game.rules.video} // e.g. https://www.youtube.com/embed?listType=search&list=...
                  title={`Cómo jugar ${game.title}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            {/* Right: Transcription & Notes */}
            {/* Transcription Section */}
            <div>
              <h3 className="text-lg font-bold text-game-brown mb-2">
                Transcripción del video
              </h3>
            </div>
            {/* Consultant Card */}
            <div className="bg-white rounded-2xl p-6 border-4 border-game-gold border-opacity-50 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-game-gold to-amber-400 flex items-center justify-center text-2xl shadow-md">
                  👤
                </div>
                <div>
                  <p className="font-bold text-game-brown">Consultor</p>
                  <p className="text-sm text-game-brown text-opacity-60">
                    Explicación de reglas
                  </p>
                </div>
              </div>
              <div className="bg-game-cream rounded-xl p-4 text-game-brown text-opacity-85 leading-relaxed">
                <p className="mb-3">{game.rules.text}</p>
                <p className="text-sm italic text-game-brown text-opacity-60">
                  Haz preguntas en la sección de comentarios si algo no es
                  claro.
                </p>
              </div>
            </div>
            {/* Cheat Sheet: Conceptos clave (after transcription) */}
            <CheatSheet title={game.title} />
            {/* AI Chat Section */}
            <div>
              <AIChat />
            </div>
            {/* Manual completo */}
            <div>
              <h3 className="text-lg font-bold text-game-brown mb-2">Manual completo</h3>
              <p className="text-game-brown text-opacity-80 mb-3">
                Consulta el manual completo del juego en formato PDF.
              </p>
              <Button asChild variant="secondary">
                <a
                  href="/rules/mock-game-rules.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir manual completo en PDF de ${game.title}`}
                  title="Ver manual completo (PDF)"
                >
                  <FileText /> Ver manual completo (PDF)
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
function CheatSheet({ title }: { title: string }) {
  const key = title.toLowerCase();
  let basicos: string[] = [];
  let avanzados: string[] = [];
  let pro: string[] = [];
  switch (true) {
    case /catan/.test(key):
      basicos = [
        "Objetivo: llegar a 10 puntos",
        "Produce recursos con tiradas adyacentes",
        "Comercio 4:1 / puertos 3:1 o 2:1",
      ];
      avanzados = [
        "Ladrón (7): bloquea y roba recursos",
        "Planifica rutas para carretera más larga",
        "Gestiona probabilidades (más 6/8 que 2/12)",
      ];
      pro = [
        "Expande hacia puertos clave temprano",
        "Diversifica números para producir estable",
      ];
      break;
    case /ticket to ride|ticket/.test(key):
      basicos = [
        "Roba cartas de color o billetes",
        "Reclama rutas con un solo color",
        "Completa billetes para puntuar alto",
      ];
      avanzados = [
        "Bloquea trayectos críticos del rival",
        "Prioriza rutas largas + comodines",
        "Gestiona mano para dobles rutas",
      ];
      pro = [
        "Conecta centros antes de expandirte",
        "Guarda comodines para momentos clave",
      ];
      break;
    case /pandemic/.test(key):
      basicos = [
        "Rol distinto: usa tu habilidad",
        "Trata cubos y evita brotes",
        "Junta cartas para descubrir curas",
      ];
      avanzados = [
        "Coordina intercambios en ciudad exacta",
        "Calcula ritmo del mazo de infección",
        "Cadena acciones para turnos potentes",
      ];
      pro = [
        "Planifica alrededor de epidemias",
        "Prioriza ciudades con 3 cubos",
      ];
      break;
    case /carcassonne/.test(key):
      basicos = [
        "Coloca losetas con bordes coincidentes",
        "Coloca meeples y recupéralos al puntuar",
        "Ciudades/caminos/claustros puntúan al cerrar",
      ];
      avanzados = [
        "Granjas puntúan al final (dominio)",
        "Fuerza cierres que beneficien más a otros",
        "Divide mayorías con conexiones laterales",
      ];
      pro = [
        "Une granjas en el último momento",
        "Evita quedarte sin meeples",
      ];
      break;
    case /splendor/.test(key):
      basicos = [
        "Toma 3 gemas distintas o 2 iguales",
        "Compra desarrollos para descuento fijo",
        "Atrae nobles para puntos extra",
      ];
      avanzados = [
        "Reserva carta y toma oro (comodín)",
        "Curva de descuentos > cartas caras",
        "Controla tempo negando cartas clave",
      ];
      pro = [
        "Construye descuentos en 2 colores",
        "Ajusta a nobles disponibles",
      ];
      break;
    case /azul/.test(key):
      basicos = [
        "Toma todas las fichas de un color de una fábrica",
        "Coloca en patrón; excedentes penalizan",
        "Puntúa por colocar en el muro",
      ];
      avanzados = [
        "Maximiza adyacencias y bonos de fila/columna",
        "Controla basura al suelo del rival",
        "Completa set de color para bonus",
      ];
      pro = [
        "Evita sobrecargar la línea de suelo",
        "Calcula órdenes para no desperdiciar",
      ];
      break;
    default:
      basicos = [
        "Objetivo y condiciones de victoria",
        "Turno: acciones básicas del jugador",
        "Cómo se puntúa al final",
      ];
      avanzados = [
        "Consejo estratégico común",
        "Error frecuente a evitar",
        "Sugerencia de planificación",
      ];
      pro = [
        "Optimiza recursos clave",
        "Aprovecha ventanas de oportunidad",
      ];
  }
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-game-brown mb-2"> Conceptos clave
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card Básicos */}
        <div className="relative rounded-2xl border-4 border-game-gold/40 bg-white shadow-md p-4">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-game-gold to-amber-400 rounded-t-xl" />
          <div className="flex items-center gap-2 mb-2 text-game-brown">
            <Lightbulb className="w-5 h-5 text-game-gold" />
            <span className="text-sm font-semibold uppercase tracking-wide">Básicos</span>
          </div>
          <ul className="space-y-1 text-sm text-game-brown">
            {basicos.slice(0, 3).map((txt, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-game-gold mt-0.5" />
                <span>{txt}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Card Avanzados */}
        <div className="relative rounded-2xl border-4 border-game-brown/20 bg-white shadow-md p-4">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-t-xl" />
          <div className="flex items-center gap-2 mb-2 text-game-brown">
            <Brain className="w-5 h-5 text-game-brown" />
            <span className="text-sm font-semibold uppercase tracking-wide">Avanzados</span>
          </div>
          <ul className="space-y-1 text-sm text-game-brown">
            {avanzados.slice(0, 3).map((txt, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-game-gold mt-0.5" />
                <span>{txt}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Card Pro Tips / Objetivo */}
        <div className="relative rounded-2xl border-4 border-game-gold/30 bg-white shadow-md p-4">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-game-gold to-green-300 rounded-t-xl" />
          <div className="flex items-center gap-2 mb-2 text-game-brown">
            <Target className="w-5 h-5 text-game-gold" />
            <span className="text-sm font-semibold uppercase tracking-wide">Pro Tips</span>
          </div>
          <ul className="space-y-1 text-sm text-game-brown">
            {(pro.length ? pro : avanzados.slice(0, 2)).map((txt, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-game-gold mt-0.5" />
                <span>{txt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}