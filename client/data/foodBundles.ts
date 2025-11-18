export type FoodBundle = {
  id: string;
  vendor: string;
  name: string;
  type: string;
  items: string[];
  price: number;
  promo: string;
};

export const foodBundles: FoodBundle[] = [
  {
    id: "la-pasiva-chivito",
    vendor: "La Pasiva - 18 de Julio",
    name: "Combo Chivito Clásico Gamer",
    type: "Restaurante",
    items: [
      "Chivito al pan con panceta, huevo y oliva extra",
      "Papas fritas estilo caseras",
      "2 cervezas Patricia 473 ml",
    ],
    price: 890,
    promo:
      "15% off sobre la carta habitual + entrega conjunta con tu juego sin costo.",
  },
  {
    id: "il-mondo-faina",
    vendor: "Il Mondo della Pizza",
    name: "Muzza XL + Fainá doble + refresco",
    type: "Restaurante",
    items: [
      "Pizza muzzarella a la piedra tamaño XL",
      "2 porciones de fainá tradicional",
      "Refresco Pepsi 1.5 L",
    ],
    price: 740,
    promo: "Incluye dip de provolone gratinado cortesía gamer de Il Mondo.",
  },
  {
    id: "tienda-inglesa-picada",
    vendor: "Tienda Inglesa Pocitos",
    name: "Picada gamer dulce/salada",
    type: "Supermercado",
    items: [
      "Doritos Tex-Mex 145 g",
      "Queso Colonia feteado 200 g",
      "Maní salado Tienda Inglesa 250 g",
      "Coca-Cola Zero 1.75 L",
    ],
    price: 560,
    promo:
      'Promo "Tienda Inglesa Snacks": 2x1 en alfajores Portezuelo agregados a tu box.',
  },
  {
    id: "disco-fresh-wrap",
    vendor: "Disco Fresh Market",
    name: "Wrap + ensalada + jugo cold-press",
    type: "Supermercado",
    items: [
      "Wrap de pollo grillado con rúcula y parmesano",
      "Ensalada fresca con aderezo de limón",
      "Jugo prensado en frío de naranja y maracuyá 350 ml",
    ],
    price: 490,
    promo: "Entrega refrigerada junto a tu juego.",
  },
  {
    id: "devoto-snacks",
    vendor: "Devoto Express",
    name: "Snack pack nocturno",
    type: "Supermercado",
    items: [
      "Pringles Paprika 158 g",
      "Mini sándwiches de miga (6 unidades)",
      "Brownies de cacao 4 unidades",
      "Cerveza artesanal Volcánica 500 ml",
    ],
    price: 620,
    promo:
      "10% de descuento en tu próxima compra en Devoto Express con tu box gamer.",
  },
];
