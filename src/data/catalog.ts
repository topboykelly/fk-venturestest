import type { Category } from "./store";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  badge?: "new" | "bestseller" | "limited";
};

export const products: Product[] = [
  {
    id: "belaqua-750",
    slug: "bel-aqua-750ml",
    name: "Bel-Aqua 750ml",
    price: 35,
    category: "water",
    image: "/images/belaqua750ml.jpg",
    description: "Purified drinking water in a 750ml bottle. Sold wholesale by the case.",
    badge: "bestseller",
  },
  {
    id: "belaqua-500",
    slug: "bel-aqua-500ml",
    name: "Bel-Aqua 500ml",
    price: 32,
    category: "water",
    image: "/images/belaqua500.jpg",
    description: "Convenient 500ml Bel-Aqua bottles for everyday wholesale supply.",
  },
  {
    id: "bel-cola",
    slug: "bel-cola",
    name: "Bel-Cola",
    price: 44,
    category: "soft-drinks",
    image: "/images/Bel-Cola.jpg",
    description: "Classic Bel-Cola soft drink — a shop staple at wholesale rates.",
    badge: "bestseller",
  },
  {
    id: "belaqua-active",
    slug: "bel-aqua-active",
    name: "Bel-Aqua Active",
    price: 45,
    category: "water",
    image: "/images/belaqua.jpg",
    description: "Bel-Aqua Active mineral water for active lifestyles.",
    badge: "new",
  },
  {
    id: "belaqua-4l",
    slug: "bel-aqua-4l",
    name: "Bel-Aqua 4L",
    price: 15,
    category: "water",
    image: "/images/belaqua.jpg",
    description: "Large 4L Bel-Aqua for home and office wholesale orders.",
  },
  {
    id: "pukka",
    slug: "pukka",
    name: "Pukka",
    price: 45,
    category: "soft-drinks",
    image: "/images/pukka.jpg",
    description: "Pukka soft drink — bold flavour at wholesale pricing.",
  },
  {
    id: "seven-star",
    slug: "seven-star",
    name: "Seven Star",
    price: 40,
    category: "soft-drinks",
    image: "/images/sevenstar.jpg",
    description: "Seven Star beverage packs ready for retail shelves.",
  },
  {
    id: "squeeze",
    slug: "squeeze",
    name: "Squeeze (Apple, Orange, Grapes)",
    price: 40,
    category: "juices",
    image: "/images/squeeze.jpg",
    description: "Squeeze juice drinks in apple, orange and grape flavours.",
  },
  {
    id: "tropical",
    slug: "tropical",
    name: "Tropical",
    price: 40,
    category: "juices",
    image: "/images/tropical.jpg",
    description: "Tropical fruit drink — sunny flavours for wholesale and retail.",
  },
  {
    id: "bel-breeze",
    slug: "bel-breeze",
    name: "Bel Breeze",
    price: 40,
    category: "soft-drinks",
    image: "/images/breeze.jpg",
    description: "Bel Breeze soft drink cases for steady shop restocking.",
  },
  {
    id: "bel-chocomalt-b",
    slug: "bel-chocomalt-b",
    name: "Bel Chocomalt (B)",
    price: 65,
    category: "malt",
    image: "/images/belmalt.jpg",
    description: "Bel Chocomalt large pack — chocolate malt drink wholesale.",
    badge: "limited",
  },
  {
    id: "bel-chocomalt-s",
    slug: "bel-chocomalt-s",
    name: "Bel Chocomalt (S)",
    price: 50,
    category: "malt",
    image: "/images/belmalt.jpg",
    description: "Bel Chocomalt small pack for compact retail displays.",
  },
];
