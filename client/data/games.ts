export interface AvailabilityRange {
  from: string;
  to: string;
}

export interface Game {
  id: number;
  title: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  duration: string;
  players: string;
  difficulty: string;
  price: number;
  availability?: AvailabilityRange[];
  rules: {
    video: string;
    text: string;
  };
  reviews_list: Array<{
    name: string;
    role: string;
    rating: number;
    comment: string;
  }>;
}

export const games: Game[] = [
  {
    id: 1,
    title: "Catan",
    category: "Estrategia",
    image:
      "https://www.mosca.com.uy/media/catalog/product/4/8/4852725-1_1.jpg?height=700&width=700",
    rating: 4.8,
    reviews: 156,
    description:
      "Un juego clásico de construcción y comercio donde los jugadores compiten por recursos en una isla. Perfecto para noches de estrategia familiar.",
    duration: "60-90 min",
    players: "2-4 jugadores",
    difficulty: "Medio",
    price: 45,
    availability: [
      { from: "2025-11-04", to: "2025-11-12" },
      { from: "2025-11-20", to: "2025-11-30" },
      { from: "2025-12-10", to: "2025-12-20" },
    ],
    rules: {
      video:
        "https://www.youtube-nocookie.com/embed?listType=search&list=c%C3%B3mo+jugar+Catan",
      text: "Cada turno, los jugadores colocan asentamientos y carreteras, comercian recursos y construyen ciudades. El primer jugador en alcanzar 10 puntos gana.",
    },
    reviews_list: [
      {
        name: "Raúl",
        role: "Experimentado",
        rating: 5,
        comment:
          "Increíble juego de estrategia. Nunca se vuelve aburrido con las diferentes combinaciones de tablero.",
      },
      {
        name: "María",
        role: "Casual",
        rating: 4,
        comment:
          "Muy divertido, aunque a veces los turnos son largos. Las reglas son fáciles de aprender.",
      },
    ],
  },
  {
    id: 2,
    title: "Ticket to Ride",
    category: "Estrategia",
    image:
      "https://image.cdn1.buscalibre.com/529b8e15b896ab3b4d001c69.RS500x500.jpg",
    rating: 4.6,
    reviews: 203,
    description:
      "Conecta ciudades americanas construyendo rutas de ferrocarril. Un juego accesible pero estratégicamente profundo.",
    duration: "45-60 min",
    players: "2-5 jugadores",
    difficulty: "Fácil",
    price: 50,
    availability: [
      { from: "2025-11-08", to: "2025-11-15" },
      { from: "2025-11-24", to: "2025-12-02" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/GcwS4XdbjOk",
      text: "Los jugadores dibujan cartas de ruta y usan tarjetas de color para reivindicar rutas entre ciudades. Gana quien completa las rutas más valiosas.",
    },
    reviews_list: [
      {
        name: "Carlos",
        role: "Aficionado",
        rating: 5,
        comment:
          "¡Espectacular! El tema de los ferrocarriles está bien implementado.",
      },
    ],
  },
  {
    id: 3,
    title: "Pandemic",
    category: "Cooperativo",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_2X_674534-MLU71367656852_082023-F.webp",
    rating: 4.7,
    reviews: 189,
    description:
      "Un emocionante juego cooperativo donde todos los jugadores trabajan juntos para evitar que enfermedades devasten el mundo.",
    duration: "45-60 min",
    players: "2-4 jugadores",
    difficulty: "Medio",
    price: 48,
    availability: [
      { from: "2025-11-05", to: "2025-11-14" },
      { from: "2025-11-28", to: "2025-12-05" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/C1M-87Xjr5o",
      text: "Los jugadores colaboran para encontrar curas de enfermedades antes de que se propaguen. Todos ganan o pierden juntos.",
    },
    reviews_list: [
      {
        name: "Andrea",
        role: "Entusiasta",
        rating: 5,
        comment: "Perfecto para jugar en grupo. La tensión es increíble.",
      },
    ],
  },
  {
    id: 4,
    title: "Carcassonne",
    category: "Estrategia",
    image:
      "https://f.fcdn.app/imgs/b67574/www.losreyesmagos.com.uy/reymuy/2550/original/catalogo/22323_22323_1/2000-2000/carcassonne-juego-de-mesa-carcassonne-juego-de-mesa.jpg",
    rating: 4.5,
    reviews: 142,
    description:
      "Construye un paisaje medieval colocando fichas. Un juego elegante con reglas simples pero profundidad táctica.",
    duration: "30-45 min",
    players: "2-5 jugadores",
    difficulty: "Fácil",
    price: 35,
    availability: [
      { from: "2025-11-10", to: "2025-11-18" },
      { from: "2025-12-01", to: "2025-12-10" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/zIeyB3ykf1s",
      text: "Cada turno coloca una ficha en el tablero formando ciudades, caminos y monasterios. Los puntos se ganan por completar formaciones.",
    },
    reviews_list: [
      {
        name: "Pablo",
        role: "Casual",
        rating: 4,
        comment: "Muy accesible y entretenido. Ideal para principiantes.",
      },
    ],
  },
  {
    id: 5,
    title: "Splendor",
    category: "Estrategia",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_2X_942518-MLA96179657775_102025-F.webp",
    rating: 4.6,
    reviews: 178,
    description:
      "Sé un mercader de gemas renacentista. Un juego de motor de combos elegante y rápido.",
    duration: "30-45 min",
    players: "2-4 jugadores",
    difficulty: "Fácil",
    price: 40,
    availability: [
      { from: "2025-11-07", to: "2025-11-16" },
      { from: "2025-11-25", to: "2025-12-03" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/5enAMA8zq3E",
      text: "Colecciona gemas y compra desarrollos para aumentar tu motor de producción. El primer jugador en alcanzar 15 puntos gana.",
    },
    reviews_list: [
      {
        name: "Elena",
        role: "Experimentada",
        rating: 5,
        comment: "Mecanísticas hermosas y muy balanceado. Una joya.",
      },
    ],
  },
  {
    id: 6,
    title: "Azul",
    category: "Estrategia",
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/23/Picture_of_Azul_game_box.jpg",
    rating: 4.7,
    reviews: 167,
    description:
      "Un juego de colocación de fichas abstracto con una estética deslumbrante inspirada en azulejos portugueses.",
    duration: "30-45 min",
    players: "2-4 jugadores",
    difficulty: "Fácil",
    price: 38,
    availability: [
      { from: "2025-11-03", to: "2025-11-11" },
      { from: "2025-11-19", to: "2025-11-26" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/qhfPNSNRJZ0",
      text: "Toma fichas de azulejos del centro y colócalas en tu tablero. Completa filas para obtener puntos. El juego es puro, elegante y estratégico.",
    },
    reviews_list: [
      {
        name: "Sofia",
        role: "Aficionada",
        rating: 5,
        comment: "Bellísimo y muy divertido. Perfecto para dos jugadores.",
      },
    ],
  },
  {
    id: 7,
    title: "Codenames",
    category: "Fiesta",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Codenames_board_game.jpg/1200px-Codenames_board_game.jpg",
    rating: 4.6,
    reviews: 512,
    description:
      "Espías rivales compiten por contactar a su equipo mediante pistas ingeniosas. Es un party game rápido que genera risas, deducción y momentos épicos en cada turno.",
    duration: "15-20 min",
    players: "4-8 jugadores",
    difficulty: "Fácil",
    price: 32,
    availability: [
      { from: "2025-11-12", to: "2025-11-20" },
      { from: "2025-12-05", to: "2025-12-12" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/YhMBBnMHw_g",
      text: "Divide la mesa en dos equipos y nombra a un jefe que solo conoce el mapa secreto. En tu turno dices una palabra clave y un número para guiar a tus agentes hacia las cartas correctas. El equipo que conecte todos sus agentes antes que el rival gana, pero un error puede activar al asesino y terminar la partida al instante.",
    },
    reviews_list: [
      {
        name: "Lucía",
        role: "Casual",
        rating: 5,
        comment:
          "Siempre termina en carcajadas, incluso con gente que no juega mucho. Las pistas creativas hacen que cada partida sea distinta.",
      },
      {
        name: "Ernesto",
        role: "Jugón",
        rating: 4,
        comment:
          "Como party es brillante, pero necesita grupos grandes para lucirse. A dos jugadores se siente forzado.",
      },
      {
        name: "Valeria",
        role: "Anfitriona",
        rating: 5,
        comment:
          "Ideal para romper el hielo en reuniones. Las reglas se explican en un minuto y engancha inmediatamente.",
      },
    ],
  },
  {
    id: 8,
    title: "Dixit",
    category: "Fiesta",
    image: "https://upload.wikimedia.org/wikipedia/en/7/7b/Dixitgame.jpg",
    rating: 4.5,
    reviews: 284,
    description:
      "Cartas oníricas invitan a contar historias y leer entre líneas lo que piensan tus amigos. Es perfecto para grupos creativos que buscan momentos emotivos y risas cómplices.",
    duration: "30-40 min",
    players: "3-6 jugadores",
    difficulty: "Fácil",
    price: 37,
    availability: [
      { from: "2025-11-06", to: "2025-11-13" },
      { from: "2025-11-29", to: "2025-12-06" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/COSMzT6QSp0",
      text: "En cada ronda un narrador elige una carta y da una pista sutil sobre ella. El resto selecciona cartas de su mano que encajen con la pista y luego todos votan cuál creen que era la original. El narrador debe evitar ser demasiado obvio o demasiado críptico para sumar puntos.",
    },
    reviews_list: [
      {
        name: "Renata",
        role: "Creativa",
        rating: 5,
        comment:
          "Las ilustraciones son hermosas y disparan conversaciones larguísimas. Es el favorito de mi grupo de arte.",
      },
      {
        name: "Miguel",
        role: "Casual",
        rating: 4,
        comment:
          "Funciona genial con familia, aunque cuando alguien es demasiado literal puede romper el ritmo.",
      },
      {
        name: "Isabel",
        role: "Principiante",
        rating: 4,
        comment:
          "Aprenderlo fue sencillo y las pistas misteriosas me encantan. A veces cuesta encontrar cartas que encajen.",
      },
    ],
  },
  {
    id: 9,
    title: "Sushi Go!",
    category: "Familiar",
    image:
      "https://cf.geekdo-images.com/Fn3PSPZVxa3YurlorITQ1Q__itemrep/img/XEFhq_xryUgTUJpNGF4tQH_5WRs=/fit-in/246x300/filters:strip_icc()/pic1900075.jpg",
    rating: 4.4,
    reviews: 198,
    description:
      "Un draft frenético de cartas donde preparas el menú perfecto de sushi. Ligero, adorable y con la dosis justa de decisiones tácticas.",
    duration: "15-20 min",
    players: "2-5 jugadores",
    difficulty: "Fácil",
    price: 28,
    availability: [
      { from: "2025-11-04", to: "2025-11-09" },
      { from: "2025-11-15", to: "2025-11-22" },
      { from: "2025-12-03", to: "2025-12-09" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/mYxE6SIBXGU",
      text: "Cada ronda eliges una carta de tu mano y pasas el resto al jugador vecino. Se puntúan los sets completados al final de la ronda y tras tres rondas gana quien tenga más puntos. Recordar qué cartas ya salieron es clave para anticipar la mejor jugada.",
    },
    reviews_list: [
      {
        name: "Diego",
        role: "Casual",
        rating: 5,
        comment:
          "La velocidad de cada turno mantiene a todos atentos. Es el filler ideal entre juegos largos.",
      },
      {
        name: "Lola",
        role: "Familiar",
        rating: 4,
        comment:
          "Mis hijos aprendieron en cinco minutos y ahora quieren jugar antes de la cena. Las cartas son súper resistentes.",
      },
      {
        name: "Javier",
        role: "Competitivo",
        rating: 4,
        comment:
          "Tiene más estrategia de la que parece, aunque a veces dependes demasiado de lo que te pasan.",
      },
    ],
  },
  {
    id: 10,
    title: "Kingdomino",
    category: "Familiar",
    image:
      "https://cf.geekdo-images.com/6jvhqNHdFTTe_OkYrqJdEg__itemheader/img/FkjHoGPOFO4-rqweD0WY4Kl6ZOo=/800x450/filters:quality(30):strip_icc()/pic3327248.jpg",
    rating: 4.3,
    reviews: 167,
    description:
      "Construye un diminuto reino de terrenos conectados con piezas tipo dominó. Es ágil, colorido y competitivo sin dejar de ser familiar.",
    duration: "20-25 min",
    players: "2-4 jugadores",
    difficulty: "Fácil",
    price: 34,
    availability: [
      { from: "2025-11-09", to: "2025-11-17" },
      { from: "2025-11-27", to: "2025-12-04" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/qhbEn6ax-Lc",
      text: "Cada ronda ordenas las losetas según su valor y eliges una para añadirla a tu cuadrícula 5x5 respetando los tipos de terreno. Al tomar una loseta defines el orden de turno de la siguiente ronda, así que hay que equilibrar calidad con iniciativa. Se puntúa multiplicando coronas por el tamaño de cada región.",
    },
    reviews_list: [
      {
        name: "Camila",
        role: "Familiar",
        rating: 5,
        comment:
          "Funciona perfecto con peques, pero los adultos también peleamos cada punto. La variante 7x7 es un desafío.",
      },
      {
        name: "Tomás",
        role: "Casual",
        rating: 4,
        comment:
          "El draft simultáneo mantiene la tensión. Me gustaría que el azar de las coronas fuera un poco más equilibrado.",
      },
      {
        name: "Iván",
        role: "Competitivo",
        rating: 3,
        comment:
          "Muy lindo pero se queda corto para jugadores que buscan profundidad. Ideal como aperitivo.",
      },
    ],
  },
  {
    id: 11,
    title: "Wingspan",
    category: "Estrategia",
    image:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__itemrep/img/DR7181wU4sHT6gn6Q1XccpPxNHg=/fit-in/246x300/filters:strip_icc()/pic4458123.jpg",
    rating: 4.7,
    reviews: 982,
    description:
      "Gestiona un santuario de aves construyendo combos entre hábitats y poderes únicos. Destaca por su producción de lujo y una experiencia relajada pero estratégica.",
    duration: "70-90 min",
    players: "1-5 jugadores",
    difficulty: "Medio",
    price: 58,
    availability: [
      { from: "2025-11-18", to: "2025-11-28" },
      { from: "2025-12-10", to: "2025-12-20" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/chK4VV4UMBs",
      text: "En tu turno eliges una de cuatro acciones: jugar un ave, conseguir comida, poner huevos o robar cartas. Cada ave añade habilidades que se encadenan de izquierda a derecha en el hábitat correspondiente. Tras cuatro rondas y objetivos cambiantes se suman cartas, huevos y bonos para determinar al ganador.",
    },
    reviews_list: [
      {
        name: "Florencia",
        role: "Entusiasta",
        rating: 5,
        comment:
          "El motor de combos es adictivo y la producción enamora a quien se siente a la mesa.",
      },
      {
        name: "Rogelio",
        role: "Jugón",
        rating: 4,
        comment:
          "Excelente solitario y muy buen familiar medio. El setup lleva un rato, eso sí.",
      },
      {
        name: "Gaby",
        role: "Casual",
        rating: 4,
        comment:
          "Me encanta que cada carta incluya datos reales de las aves. La app para llevar puntaje ayuda mucho.",
      },
    ],
  },
  {
    id: 12,
    title: "Terraforming Mars",
    category: "Experto",
    image:
      "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__itemrep/img/IwUOQfhP5c0KcRJBY4X_hi3LpsY=/fit-in/246x300/filters:strip_icc()/pic3536616.jpg",
    rating: 4.8,
    reviews: 1104,
    description:
      "Corporaciones rivales colaboran y compiten por hacer habitable el planeta rojo. Un eurogame profundo con cientos de cartas y caminos estratégicos.",
    duration: "120-150 min",
    players: "1-5 jugadores",
    difficulty: "Difícil",
    price: 65,
    availability: [
      { from: "2025-11-21", to: "2025-12-01" },
      { from: "2025-12-15", to: "2025-12-26" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/wTsVrcuTdso",
      text: "Cada generación juegas proyectos, produces recursos y subes temperatura, oxígeno y océanos. Las cartas otorgan efectos inmediatos, permanentes o acciones que moldean tu motor económico. La partida finaliza cuando los tres parámetros globales se completan y se suman hitos, recompensas y puntos de las cartas.",
    },
    reviews_list: [
      {
        name: "Santiago",
        role: "Jugón",
        rating: 5,
        comment:
          "Una experiencia épica que no me aburre tras decenas de partidas. Las corporaciones asimétricas cambian totalmente el plan.",
      },
      {
        name: "Paula",
        role: "Estratega",
        rating: 4,
        comment:
          "El arte podría ser mejor, pero la profundidad económica lo compensa. Recomiendo usar borradores para reducir el azar.",
      },
      {
        name: "Leandro",
        role: "Competitivo",
        rating: 5,
        comment:
          "Los hitos y premios mantienen la tensión hasta el final. Es mi referencia de euro pesado moderno.",
      },
    ],
  },
  {
    id: 13,
    title: "Root",
    category: "Experto",
    image:
      "https://cf.geekdo-images.com/JUAUWaVUzeBgzirhZNmHHw__itemrep/img/sQgkl-_hydBVvQHAMLt2Zk_3dwI=/fit-in/246x300/filters:strip_icc()/pic4254509.jpg",
    rating: 4.6,
    reviews: 742,
    description:
      "Una guerra asimétrica en el bosque con animales adorables pero letales. Cada facción tiene reglas totalmente distintas que recompensan la maestría.",
    duration: "90-120 min",
    players: "2-4 jugadores",
    difficulty: "Difícil",
    price: 60,
    availability: [
      { from: "2025-11-14", to: "2025-11-23" },
      { from: "2025-12-02", to: "2025-12-11" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/aoP6A3yaEB8",
      text: "En tu turno sigues el flujo particular de tu facción: la Marquesa construye, la Alianza hace revueltas, el Vagabundo comercia y lucha solo. Controlar claros otorga puntos y habilidades. La partida termina cuando alguien alcanza 30 puntos o cumple su carta de dominancia.",
    },
    reviews_list: [
      {
        name: "Nadia",
        role: "Jugona",
        rating: 5,
        comment:
          "La asimetría está increíblemente lograda. Cada partida siento que descubro una táctica nueva.",
      },
      {
        name: "Germán",
        role: "Analítico",
        rating: 4,
        comment:
          "Tiene una curva de aprendizaje pronunciada, pero una vez que todos saben jugar es de lo mejor que hay.",
      },
      {
        name: "Héctor",
        role: "Casual",
        rating: 3,
        comment:
          "El manual intimida y requiere que alguien enseñe con paciencia. Prefiero usar la app digital para practicar.",
      },
    ],
  },
  {
    id: 14,
    title: "Spirit Island",
    category: "Cooperativo",
    image:
      "https://cf.geekdo-images.com/kjCm4ZvPjIZxS-mYgSPy1g__itemrep/img/7AXozbOIxk5MDpn_RNlat4omAcc=/fit-in/246x300/filters:strip_icc()/pic7013651.jpg",
    rating: 4.7,
    reviews: 534,
    description:
      "Encarnas espíritus ancestrales que defienden la isla de colonizadores invasores. Es intenso, táctico y completamente cooperativo.",
    duration: "90-120 min",
    players: "1-4 jugadores",
    difficulty: "Difícil",
    price: 62,
    availability: [
      { from: "2025-11-16", to: "2025-11-25" },
      { from: "2025-12-08", to: "2025-12-17" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/C36Iw2reApc",
      text: "Cada espíritu tiene un tablero propio con poderes rápidos y lentos. En la fase de Espíritu eliges cartas y gestionas energía; luego los invasores se expanden según cartas de exploración, avance y devastación. Ganan los jugadores si eliminan a todos los colonos o alcanzan el nivel de terror máximo antes de ser abrumados.",
    },
    reviews_list: [
      {
        name: "Silvia",
        role: "Cooperativa",
        rating: 5,
        comment:
          "La sensación de defensa desesperada es brutal. Cuando el combo de poderes sale bien se festeja en serio.",
      },
      {
        name: "Andrés",
        role: "Estratega",
        rating: 4,
        comment:
          "El análisis se puede extender pero recompensa la planificación. Las expansiones agregan aún más rejugabilidad.",
      },
      {
        name: "Mauro",
        role: "Casual",
        rating: 4,
        comment:
          "Necesita una persona que lleve el flujo las primeras partidas, pero después todo fluye y se vuelve muy inmersivo.",
      },
    ],
  },
  {
    id: 15,
    title: "The Crew: En busca del Noveno Planeta",
    category: "Cooperativo",
    image:
      "https://cf.geekdo-images.com/98LnQShydr11OBKS46xY-Q__itemrep/img/etVRTXdF6IDsnGKQe77FRFP4H7M=/fit-in/246x300/filters:strip_icc()/pic5687013.jpg",
    rating: 4.6,
    reviews: 321,
    description:
      "Un juego de bazas cooperativo con 50 misiones narrativas en el espacio. Rápido de explicar y tremendamente adictivo.",
    duration: "20-40 min",
    players: "3-5 jugadores",
    difficulty: "Medio",
    price: 25,
    availability: [
      { from: "2025-11-05", to: "2025-11-12" },
      { from: "2025-11-18", to: "2025-11-26" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/mIf1Z6OdqzU",
      text: "Antes de cada misión se reparten tareas específicas que indican quién debe ganar determinadas bazas. En tu turno juegas una carta siguiendo palo cuando sea posible y solo puedes comunicarte mediante un indicador limitado sobre una carta. Cumplir todas las tareas antes de agotar la mano completa la misión.",
    },
    reviews_list: [
      {
        name: "Patricio",
        role: "Competitivo",
        rating: 5,
        comment:
          "La tensión de no poder hablar es fantástica. A los amantes del truco nos rompió la cabeza.",
      },
      {
        name: "Tamara",
        role: "Casual",
        rating: 4,
        comment:
          "Las primeras misiones son muy fáciles pero sirven para enseñar. Luego el reto escala y todos quieren reintentarlo.",
      },
      {
        name: "Leo",
        role: "Principiante",
        rating: 4,
        comment:
          "Nunca había jugado bazas y lo entendí en 5 minutos. Eso sí, a dos jugadores prefiero otros títulos.",
      },
    ],
  },
  {
    id: 16,
    title: "Just One",
    category: "Fiesta",
    image:
      "https://cf.geekdo-images.com/eFW0VitHQRaczifQsyHUDw__itemheader/img/GZZxUB4aoVzhAokVAv8NZvB22QY=/800x450/filters:quality(30):strip_icc()/pic4607990.jpg",
    rating: 4.5,
    reviews: 260,
    description:
      "Un cooperativo ligero en el que todos dan pistas secretas para que un compañero adivine la palabra. Perfecto para jugar con familia o colegas en cualquier reunión.",
    duration: "20 min",
    players: "3-7 jugadores",
    difficulty: "Fácil",
    price: 27,
    availability: [
      { from: "2025-11-07", to: "2025-11-14" },
      { from: "2025-11-30", to: "2025-12-07" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/U4LROBZ-UzY",
      text: "El jugador activo cierra los ojos mientras elige al azar una palabra objetivo. El resto escribe una pista en sus pizarras, pero las que coinciden se descartan antes de ser mostradas. Solo con las pistas restantes el jugador debe adivinar la palabra para sumar puntos al grupo.",
    },
    reviews_list: [
      {
        name: "Ariadna",
        role: "Anfitriona",
        rating: 5,
        comment:
          "Sale siempre a la mesa en fiestas. No hay downtime y cualquiera puede participar.",
      },
      {
        name: "Sergio",
        role: "Casual",
        rating: 4,
        comment:
          "Las rondas vuelan, aunque a veces nos quedamos sin rotuladores si no los limpiamos bien.",
      },
      {
        name: "Beto",
        role: "Principiante",
        rating: 4,
        comment:
          "Las reglas son sencillísimas. Me gusta que todos colaboren y festejen cada acierto.",
      },
    ],
  },
  {
    id: 17,
    title: "Cartographers",
    category: "Roll & Write",
    image:
      "https://cf.geekdo-images.com/bXfsH2aIaL1M_Ky4N6Se6w__itemheader/img/82PT-WwdYiO31hspqgZNPfY1X6Q=/800x450/filters:quality(30):strip_icc()/pic5552179.jpg",
    rating: 4.5,
    reviews: 184,
    description:
      "Dibuja el mapa del reino con formas de tetrominós mientras optimizas objetivos cambiantes. Combina relax creativo con interacción mediante emboscadas.",
    duration: "30-45 min",
    players: "1-99 jugadores",
    difficulty: "Medio",
    price: 33,
    availability: [
      { from: "2025-11-19", to: "2025-11-27" },
      { from: "2025-12-06", to: "2025-12-15" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/ZWamWjeSJ88",
      text: "Cada estación revela cartas de exploración que indican la forma y el tipo de terreno que debes dibujar. Los decretos de puntuación rotan y otorgan puntos diferentes cada estación. Algunas cartas activan monstruos que otros jugadores colocan en tu mapa para restarte puntos si no los rodeas.",
    },
    reviews_list: [
      {
        name: "Lorena",
        role: "Creativa",
        rating: 5,
        comment:
          "Dibujar y colorear el mapa es casi terapéutico. Los objetivos variables lo mantienen fresco.",
      },
      {
        name: "Matías",
        role: "Competitivo",
        rating: 4,
        comment:
          "Tiene más interacción de la que esperaba gracias a los monstruos. A cuatro jugadores es ideal.",
      },
      {
        name: "Eva",
        role: "Casual",
        rating: 4,
        comment:
          "Lo puedo jugar online o en papel sin problemas. Hay un poquito de análisis paralizante si buscas la forma perfecta.",
      },
    ],
  },
  {
    id: 18,
    title: "Jaipur",
    category: "Dos jugadores",
    image:
      "https://cf.geekdo-images.com/_LTujSe_o16nvjDC-J0seA__itemrep/img/gSigdzXaUWvudQ0vJjSbs-mXaRk=/fit-in/246x300/filters:strip_icc()/pic5100947.jpg",
    rating: 4.6,
    reviews: 295,
    description:
      "Compite por ser el mercader más rico del bazar negociando gemas, seda y camellos. Tenso, elegante y diseñado exclusivamente para dos jugadores.",
    duration: "30 min",
    players: "2 jugadores",
    difficulty: "Fácil",
    price: 30,
    availability: [
      { from: "2025-11-01", to: "2025-11-08" },
      { from: "2025-11-20", to: "2025-11-27" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/vvRwNycqKzc",
      text: "En tu turno eliges entre tomar cartas del mercado (con o sin camellos) o vender un tipo de mercancía para obtener fichas de valor decreciente. Los sets grandes otorgan bonificaciones, pero vender tarde puede ser arriesgado. La partida se juega a lo mejor de tres rondas y gana quien acumula más sellos de excelencia.",
    },
    reviews_list: [
      {
        name: "Pilar",
        role: "Pareja",
        rating: 5,
        comment:
          "Perfecto para una noche corta. El balance entre vender pronto o esperar la bonificación es delicioso.",
      },
      {
        name: "Emilio",
        role: "Casual",
        rating: 4,
        comment:
          "Se aprende al vuelo y cabe en cualquier mochila. Tal vez con más variabilidad sería perfecto.",
      },
      {
        name: "Dana",
        role: "Competitiva",
        rating: 4,
        comment:
          "Las rondas son rapidísimas y siempre quedan ganas de revancha. El azar de las cartas ocasionalmente duele.",
      },
    ],
  },
  {
    id: 19,
    title: "Patchwork",
    category: "Dos jugadores",
    image:
      "https://cf.geekdo-images.com/RDOwMRBnIb3Ehl6GyXj9xg__itemrep/img/a_fi-e14YYLdEk5f6fkeNsVIG_4=/fit-in/246x300/filters:strip_icc()/pic8669620.jpg",
    rating: 4.5,
    reviews: 340,
    description:
      "Dos jugadores compiten por coser la colcha más eficiente usando retazos de tela y botones como moneda. Es un puzzle táctico lleno de decisiones apretadas.",
    duration: "30 min",
    players: "2 jugadores",
    difficulty: "Medio",
    price: 29,
    availability: [
      { from: "2025-11-02", to: "2025-11-10" },
      { from: "2025-11-22", to: "2025-11-29" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/KO3hQFHVmoM",
      text: "Las piezas avanzan en un círculo y puedes comprar cualquier retazo dentro de las tres siguientes posiciones pagando botones y tiempo. Moverte en el tablero temporal decide quién juega de nuevo y cuándo se cobran ingresos. Al final se penalizan los huecos libres, así que planificar la geometría es vital.",
    },
    reviews_list: [
      {
        name: "Ana",
        role: "Estratega",
        rating: 5,
        comment:
          "Parece abstracto pero transmite mucha tensión. Siempre quiero optimizar cada espacio.",
      },
      {
        name: "Marcos",
        role: "Casual",
        rating: 4,
        comment:
          "Ideal para viajes, aunque el conteo de botones puede marear la primera vez.",
      },
      {
        name: "Rafa",
        role: "Competitivo",
        rating: 4,
        comment:
          "El tempo lo es todo; si calculas mal el tiempo quedas fuera de la partida. Excelente diseño.",
      },
    ],
  },
  {
    id: 20,
    title: "Dominion",
    category: "Deck-building",
    image:
      "https://cf.geekdo-images.com/j6iQpZ4XkemZP07HNCODBA__itemrep/img/_QiaiFj-LGZoqdatE-wVqNaYWx8=/fit-in/246x300/filters:strip_icc()/pic394356.jpg",
    rating: 4.6,
    reviews: 870,
    description:
      "El clásico que popularizó el deck-building: construye tu mazo de acciones para comprar más cartas y puntos de victoria. Cada partida usa un mercado distinto que cambia las estrategias.",
    duration: "30-45 min",
    players: "2-4 jugadores",
    difficulty: "Medio",
    price: 44,
    availability: [
      { from: "2025-11-11", to: "2025-11-22" },
      { from: "2025-12-01", to: "2025-12-12" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/605C3QSwj3I",
      text: "Comienzas con un mazo básico y, en tu turno, juegas una acción, compras cartas y limpias la mano. Las cartas adquiridas van al descarte y volverán cuando se baraje tu mazo. La partida termina cuando se agota la pila de Provincias o tres pilas cualquiera, y gana quien tenga más puntos en su mazo.",
    },
    reviews_list: [
      {
        name: "Julia",
        role: "Experimentada",
        rating: 5,
        comment:
          "Sigue siendo un referente; la cantidad de combinaciones posibles es enorme.",
      },
      {
        name: "Óscar",
        role: "Competitivo",
        rating: 4,
        comment:
          "Hay algo de solitario multijugador, pero la carrera por las Provincias siempre es emocionante.",
      },
      {
        name: "Carina",
        role: "Casual",
        rating: 4,
        comment:
          "Al principio abruma la iconografía, aunque después fluye muy bien. Excelente puerta de entrada al género.",
      },
    ],
  },
  {
    id: 21,
    title: "Clank!",
    category: "Deck-building",
    image:
      "https://cf.geekdo-images.com/DPjV1iI0ygo5Bl3XLNRiIg__itemrep/img/pdioRYjmiownDyFOmbIy-aC5kfU=/fit-in/246x300/filters:strip_icc()/pic4449526.jpg",
    rating: 4.5,
    reviews: 312,
    description:
      "Combina construcción de mazos con exploración de mazmorras. Entra, roba un tesoro y escapa antes de que el dragón te escuche hacer \"clank\".",
    duration: "45-75 min",
    players: "2-4 jugadores",
    difficulty: "Medio",
    price: 50,
    availability: [
      { from: "2025-11-15", to: "2025-11-25" },
      { from: "2025-12-05", to: "2025-12-14" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/BPFJFYQv5OI",
      text: "Las cartas de tu mazo generan pasos, habilidades y ruido. Cada vez que haces clank agregas cubos a una bolsa, y el dragón los puede sacar para herirte. Debes llegar lo suficientemente profundo para tomar un artefacto valioso y regresar a la superficie antes que los demás para puntuar completo.",
    },
    reviews_list: [
      {
        name: "Nicolás",
        role: "Aventurero",
        rating: 5,
        comment:
          "La sensación de carrera y el empuje de tu suerte son geniales. Siempre terminamos riendo cuando alguien queda atrapado.",
      },
      {
        name: "Marta",
        role: "Casual",
        rating: 4,
        comment:
          "Se explica rápido y la historia del dragón engancha a cualquiera. A veces el azar de la bolsa puede ser cruel.",
      },
      {
        name: "Fede",
        role: "Competitivo",
        rating: 4,
        comment:
          "Me gusta que el deck-building tenga un tablero que importa. Con la expansión submarina mejora aún más.",
      },
    ],
  },
  {
    id: 22,
    title: "Love Letter",
    category: "Fiesta",
    image:
      "https://cf.geekdo-images.com/T1ltXwapFUtghS9A7_tf4g__itemrep/img/SJxpAXjBIPEj9m6hHZYeTbz9wzc=/fit-in/246x300/filters:strip_icc()/pic1401448.jpg",
    rating: 4.3,
    reviews: 410,
    description:
      "Un microjuego de deducción y faroleo donde intentas que tu carta sea la más alta al final de la ronda. Ideal para llevar en el bolsillo y jugar en cualquier lugar.",
    duration: "15-20 min",
    players: "2-6 jugadores",
    difficulty: "Fácil",
    price: 22,
    availability: [
      { from: "2025-11-03", to: "2025-11-09" },
      { from: "2025-11-24", to: "2025-11-30" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/HD6mnIKhd_c",
      text: "Durante tu turno robas una carta y juegas una, activando su efecto al instante. Algunas cartas te protegen, otras eliminan o permiten comparar valores. La ronda termina cuando queda un jugador activo o se agota el mazo y gana quien conserve la carta más alta.",
    },
    reviews_list: [
      {
        name: "Luz",
        role: "Casual",
        rating: 5,
        comment:
          "Pequeño pero picante; nunca viajo sin él. Funciona con cualquier grupo.",
      },
      {
        name: "Ricardo",
        role: "Competitivo",
        rating: 3,
        comment:
          "Divertido pero muy dependiente de la suerte inicial. Lo uso solo como filler rápido.",
      },
      {
        name: "Emilia",
        role: "Principiante",
        rating: 4,
        comment:
          "Gracias a las cartas de referencia pude explicarlo a mis sobrinos en minutos. Las ilustraciones nuevas son encantadoras.",
      },
    ],
  },
  {
    id: 23,
    title: "Cascadia",
    category: "Familiar",
    image:
      "https://cf.geekdo-images.com/MjeJZfulbsM1DSV3DrGJYA__itemrep/img/RjD03wEf_LoX0EF4DhnW6f0xNHU=/fit-in/246x300/filters:strip_icc()/pic5100691.jpg",
    rating: 4.6,
    reviews: 402,
    description:
      "Diseña un hábitat del noroeste pacífico combinando losetas y fichas de fauna. Ofrece un rompecabezas tranquilo con enormes posibilidades de puntuación.",
    duration: "30-45 min",
    players: "1-4 jugadores",
    difficulty: "Medio",
    price: 42,
    availability: [
      { from: "2025-11-13", to: "2025-11-21" },
      { from: "2025-12-04", to: "2025-12-12" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/04-glUbTCpk",
      text: "En cada turno tomas un par formado por loseta y ficha de animal, lo colocas en tu mapa y sigues las restricciones de hábitat. Cada especie puntúa patrones distintos que cambian entre partidas. Al finalizar se suman puntos por fauna, áreas continuas y objetivos de naturaleza.",
    },
    reviews_list: [
      {
        name: "Esteban",
        role: "Familiar",
        rating: 5,
        comment:
          "Es precioso en mesa y muy relajante. Con las cartas avanzadas ofrece buen reto.",
      },
      {
        name: "Carla",
        role: "Casual",
        rating: 4,
        comment:
          "Agradezco que tenga modo solitario oficial. Tal vez las fichas de madera podrían ser más gruesas.",
      },
      {
        name: "Julieta",
        role: "Competitiva",
        rating: 4,
        comment:
          "El draft limitado te obliga a adaptarte, siempre hay decisiones interesantes.",
      },
    ],
  },
  {
    id: 24,
    title: "Sagrada",
    category: "Abstracto",
    image:
      "https://cf.geekdo-images.com/PZt3EAAGV3dFIVuwMR0AEw__itemrep/img/fLGFtsAiZgj3VwTDvgCn2yBIDYw=/fit-in/246x300/filters:strip_icc()/pic3525224.jpg",
    rating: 4.6,
    reviews: 360,
    description:
      "Draft de dados coloridos para construir un vitral inspirado en la Sagrada Familia. Visualmente impactante y con un puzzle elegante.",
    duration: "30-45 min",
    players: "1-4 jugadores",
    difficulty: "Medio",
    price: 45,
    availability: [
      { from: "2025-11-17", to: "2025-11-26" },
      { from: "2025-12-09", to: "2025-12-18" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/IAO5-hDe9lk",
      text: "Se lanzan dados y, por turnos, cada jugador elige uno para colocarlo respetando restricciones de color y valor del patrón. Las herramientas permiten romper reglas puntualmente pagando fichas de favor. Tras diez rondas se puntúan objetivos públicos y privados además de penalizar los huecos vacíos.",
    },
    reviews_list: [
      {
        name: "Claudio",
        role: "Estratega",
        rating: 5,
        comment:
          "La combinación de colores y dados hace que cualquiera se acerque a mirar. Ofrece mucha rejugabilidad con los patrones.",
      },
      {
        name: "Noelia",
        role: "Casual",
        rating: 4,
        comment:
          "Puede castigar si colocas mal un dado temprano, pero eso lo vuelve desafiante. Me encanta el modo solitario.",
      },
      {
        name: "Bruno",
        role: "Competitivo",
        rating: 4,
        comment:
          "Hay azar, pero puedes mitigarlo con las herramientas. Excelente opción para cerrar la noche.",
      },
    ],
  },
  {
    id: 25,
    title: "Calico",
    category: "Abstracto",
    image:
      "https://cf.geekdo-images.com/qGkU6XsF1448F_A4P8TY5Q__itemrep/img/LOHi5NBdVoye0qNl9lixSGn0N8E=/fit-in/246x300/filters:strip_icc()/pic8124431.jpg",
    rating: 4.4,
    reviews: 210,
    description:
      "Diseña la colcha más acogedora combinando colores y patrones para atraer gatos adorables. Un puzzle apretado con decisiones constantes.",
    duration: "30-45 min",
    players: "1-4 jugadores",
    difficulty: "Medio",
    price: 39,
    availability: [
      { from: "2025-11-08", to: "2025-11-16" },
      { from: "2025-11-28", to: "2025-12-06" },
    ],
    rules: {
      video: "https://www.youtube-nocookie.com/embed/SThqhjucaho",
      text: "En cada turno tomas una loseta del mercado y la colocas en tu tablero personal buscando cumplir objetivos impresos y patrones de color. Los gatos otorgan puntos si logras su combinación favorita, mientras que los botones recompensan sets de colores distintos. Cuando todos llenan su colcha se suman los puntos de objetivos, gatos y botones para definir al ganador.",
    },
    reviews_list: [
      {
        name: "Sonia",
        role: "Creativa",
        rating: 5,
        comment:
          "Hermoso y desafiante; parece tierno pero te exprime el cerebro. Los gatitos son un plus.",
      },
      {
        name: "Gustavo",
        role: "Analítico",
        rating: 4,
        comment:
          "El azar del mercado puede doler, aunque siempre hay formas de pivotear. Me gusta mucho a dos jugadores.",
      },
      {
        name: "Lara",
        role: "Casual",
        rating: 4,
        comment:
          "Se explica fácil y la estética enamora a cualquiera. Eso sí, ocupa bastante mesa cuando se juega de a cuatro.",
      },
    ],
  },
];

export const categories = [
  { id: 1, name: "Estrategia", icon: "♟️" },
  { id: 2, name: "Cooperativo", icon: "🤝" },
  { id: 3, name: "Familiar", icon: "👨‍👩‍👧‍👦" },
  { id: 4, name: "Fiesta", icon: "🎉" },
  { id: 5, name: "Experto", icon: "🧠" },
  { id: 6, name: "Roll & Write", icon: "📝" },
  { id: 7, name: "Dos jugadores", icon: "⚔️" },
  { id: 8, name: "Deck-building", icon: "🃏" },
  { id: 9, name: "Abstracto", icon: "🧩" },
];

export const isGameAvailable = (
  game: Game,
  startDate?: string,
  endDate?: string,
): boolean => {
  if (!startDate || !endDate) return true;
  const start = Date.parse(startDate);
  const end = Date.parse(endDate);
  if (Number.isNaN(start) || Number.isNaN(end)) return true;
  if (start > end) return false;
  const ranges = game.availability;
  if (!ranges || ranges.length === 0) return true;
  return ranges.some((range) => {
    const from = Date.parse(range.from);
    const to = Date.parse(range.to);
    if (Number.isNaN(from) || Number.isNaN(to)) return false;
    return from <= start && to >= end;
  });
};
