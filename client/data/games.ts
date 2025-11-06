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
];

export const categories = [
  { id: 1, name: "Estrategia", icon: "♟️" },
  { id: 2, name: "Cooperativo", icon: "🤝" },
  { id: 3, name: "Familiar", icon: "👨‍👩‍👧‍👦" },
  { id: 4, name: "Fiesta", icon: "🎉" },
];
