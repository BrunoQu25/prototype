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
    case /codenames/.test(key):
      basicos = [
        "Pista: 1 palabra + numero",
        "Evita al asesino",
        "Apunta a palabras de tu equipo",
      ];
      avanzados = [
        "Asociaciones amplias y creativas",
        "Evita falsos amigos del rival",
        "Secuencia pistas para limpiar zonas",
      ];
      pro = [
        "Mapa de riesgo por casillas",
        "Lee la intencion del oponente",
      ];
      break;
    case /wingspan/.test(key):
      basicos = [
        "Juega aves y activa habitats",
        "Gana comida, huevos y cartas",
        "Sigue objetivos de ronda",
      ];
      avanzados = [
        "Combos de activaciones",
        "Equilibra habitats y nidos",
        "Planifica dietas y costos",
      ];
      pro = [
        "Gestion fina de huevos",
        "Aprovecha bonificaciones finales",
      ];
      break;
    case /terraforming mars|terraforming/.test(key):
      basicos = [
        "Sube temp/oxigeno/oceanos",
        "Mejora producciones y proyectos",
        "Hitos y premios suman mucho",
      ];
      avanzados = [
        "Sinergias por etiquetas",
        "Tempo de hitos/premios",
        "Eficiencia por generaciones",
      ];
      pro = [
        "Ciclo de cartas y economia",
        "Timing de combos",
      ];
      break;
    case /^root\b/.test(key):
      basicos = [
        "Conoce tu faccion y objetivo",
        "Controla claros y fabrica",
        "Adapta tu plan al mapa",
      ];
      avanzados = [
        "Presiona economias rivales",
        "Aprovecha crafting y movilidad",
        "Lee el tempo de la mesa",
      ];
      pro = [
        "Evita coaliciones en tu contra",
        "Cierra de forma inesperada",
      ];
      break;
    case /spirit island|spirit/.test(key):
      basicos = [
        "Poderes rapidos/lentos y presencia",
        "Usa Dahan para contraatacar",
        "Defiende y empuja invasores",
      ];
      avanzados = [
        "Combos de miedo y control",
        "Aislamiento y defensa",
        "Planifica segun fases Invader",
      ];
      pro = [
        "Gestion de blight y crecimiento",
        "Sinergiza aspectos/escenarios",
      ];
      break;
    case /the crew|noveno planeta|crew/.test(key):
      basicos = [
        "Cumple tareas en orden",
        "Comunicacion limitada y senales",
        "Gestion de triunfos",
      ];
      avanzados = [
        "Identifica cartas clave",
        "Ordena misiones para facilitar",
        "Senales que no bloqueen",
      ];
      pro = [
        "Lidera con info oculta",
        "Timing de altas/bajas",
      ];
      break;
    case /just one/.test(key):
      basicos = [
        "Escribe una pista unica",
        "Duplicadas se tachan",
        "Acierta la palabra",
      ];
      avanzados = [
        "Pistas laterales/indirectas",
        "Riesgo vs. claridad",
        "Evita asociaciones obvias",
      ];
      pro = [
        "Calibra segun el grupo",
        "Cubre huecos semanticos",
      ];
      break;
    case /cartographers/.test(key):
      basicos = [
        "Dibuja forma + terreno",
        "Monedas y evita monstruos",
        "Puntua objetivos A-D",
      ];
      avanzados = [
        "Optimiza adyacencias y regiones",
        "Gestiona montanas/aldeas",
        "Minimiza huecos",
      ];
      pro = [
        "Sincroniza con objetivos activos",
        "Valora flexibilidad de formas",
      ];
      break;
    case /jaipur/.test(key):
      basicos = [
        "Toma cartas o camellos",
        "Vende sets por fichas",
        "Bonus por 3/4/5",
      ];
      avanzados = [
        "Control de camellos y mercado",
        "Timing de ventas",
        "Negacion de fichas",
      ];
      pro = [
        "Lee el mazo y ritmo",
        "Guarda sets para el momento",
      ];
      break;
    case /patchwork/.test(key):
      basicos = [
        "Compra piezas con botones/tiempo",
        "Evita huecos",
        "Gana ingresos por botones",
      ];
      avanzados = [
        "Orden de turno por tiempo",
        "Planifica piezas pequenas",
        "Prioriza ingresos tempranos",
      ];
      pro = [
        "Fuerza saltos del rival",
        "Ahorra para piezas clave",
      ];
      break;
    case /dominion/.test(key):
      basicos = [
        "Compra Acciones/Tesoros/Victoria",
        "Monta motores de robo + accion",
        "Gestiona tu baraja",
      ];
      avanzados = [
        "Adelgaza (quita Coppers/Curses)",
        "Control de pilas",
        "Consistencia del motor",
      ];
      pro = [
        "Tempo de Provincias",
        "Transicion motor->dinero",
      ];
      break;
    case /clank/.test(key):
      basicos = [
        "Compra cartas y muevete",
        "Controla clank",
        "Coge artefacto y sal",
      ];
      avanzados = [
        "Rutas eficientes",
        "Gestion de clank/curacion",
        "Sinergias de mazo",
      ];
      pro = [
        "Tempo de salida",
        "Oportunismo en mercado",
      ];
      break;
    case /dixit/.test(key):
      basicos = [
        "Da una pista sutil",
        "Elige carta que encaje",
        "Vota la del narrador",
      ];
      avanzados = [
        "Equilibra obvio vs. cripto",
        "Lee gustos del grupo",
        "Evita pistas repetidas",
      ];
      pro = [
        "Construye meta compartida",
        "Gestiona marcadores de puntos",
      ];
      break;
    case /sushi go/.test(key):
      basicos = [
        "Elige 1 y pasa el resto",
        "Sets puntuan al final",
        "Cuenta cartas vistas",
      ];
      avanzados = [
        "Timing de wasabi+sashimi",
        "Dumplings vs. tempura",
        "Gestion de puddings",
      ];
      pro = [
        "Seala picks para forzar",
        "Ajusta segun numero de jugadores",
      ];
      break;
    case /kingdomino/.test(key):
      basicos = [
        "Elige losetas y colocalas",
        "Conecta terrenos iguales",
        "Coronas x tamanio",
      ];
      avanzados = [
        "Orden de turno vs. calidad",
        "Evita quedarte sin hueco 5x5",
        "Bloquea al rival",
      ];
      pro = [
        "Planifica 7x7 variante",
        "Maximiza regiones con coronas",
      ];
      break;
    case /love letter/.test(key):
      basicos = [
        "Roba 1 y juega 1",
        "Efectos eliminan o protegen",
        "Gana la carta mas alta",
      ];
      avanzados = [
        "Cuenta cartas jugadas",
        "Blafo con guardas y baron",
        "Lee la proteccion de doncella",
      ];
      pro = [
        "Presiona con info parcial",
        "Riesgo calculado al final",
      ];
      break;
    case /cascadia/.test(key):
      basicos = [
        "Toma loseta+fauna y colocalas",
        "Respeta habitats",
        "Sigue patrones de fauna",
      ];
      avanzados = [
        "Cadena regiones grandes",
        "Gestiona objetivos variables",
        "Aprovecha naturaleza",
      ];
      pro = [
        "Flexibiliza con tokens",
        "Minimiza penalizaciones",
      ];
      break;
    case /sagrada/.test(key):
      basicos = [
        "Coloca dados por color/valor",
        "Respeta restricciones del patron",
        "Usa herramientas con favor",
      ];
      avanzados = [
        "Reserva espacios para colores",
        "Gestiona secuencia de colocacion",
        "Cumple objetivos publicos/privados",
      ];
      pro = [
        "Mitiga azar con herramientas",
        "Evita huecos al final",
      ];
      break;
    case /calico/.test(key):
      basicos = [
        "Coloca losetas por color/patron",
        "Cumple objetivos de losetas",
        "Atrae gatos y botones",
      ];
      avanzados = [
        "Prioriza colores disputados",
        "Gestiona manos y mercado",
        "Secuencia para combos de gatos",
      ];
      pro = [
        "Plan largo plazo vs. tactico",
        "No bloquees patrones clave",
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
