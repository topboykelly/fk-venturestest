/* Edit store content here: brand, contact, nav, categories. Products live in catalog.ts. */

export const brand = {
  name: "F.K. Ventures",
  fullName: "F.K. DealsGH Ventures",
  tagline: "Your Wholesale Partner",
  description:
    "Wholesale and retail of bottle drinks and minerals — water, soft drinks, juices and malt for shops across Ghana.",
  copyrightYear: 2026,
};

export const contact = {
  /** International format, digits only (used for wa.me links). */
  whatsapp: "233000000000",
  phone: "+233 00 000 0000",
  email: "hello@fkdealsgh.com",
  location: "Accra, Ghana",
  hours: "Mon – Sat, 8am – 6pm",
  instagram: { handle: "@fkdealsgh", url: "https://instagram.com/fkdealsgh" },
  tiktok: { handle: "@fkdealsgh", url: "https://tiktok.com/@fkdealsgh" },
};

/** Links starting with "#" are sections on the home page; others are routes. */
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Our Story", href: "#story" },
  { label: "Contact", href: "/contact" },
] as const;

export type Category = "water" | "soft-drinks" | "juices" | "malt";

export const categories: { id: Category; label: string }[] = [
  { id: "water", label: "Water" },
  { id: "soft-drinks", label: "Soft Drinks" },
  { id: "juices", label: "Juices" },
  { id: "malt", label: "Malt" },
];

export function categoryLabel(id: Category) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export const promise = {
  title: "Built for wholesale",
  body: "F.K. DealsGH Ventures supplies shops and retailers with reliable stock of bottled drinks and minerals — competitive wholesale pricing, steady supply, and delivery across Accra.",
  points: [
    { value: "Wholesale", label: "Case pricing for retailers" },
    { value: "Retail", label: "Also open for walk-in buyers" },
    { value: "Accra", label: "Based in Ghana" },
  ],
};

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/#products" },
      { label: "Cart", href: "/cart" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "WhatsApp", href: `https://wa.me/${contact.whatsapp}` },
      { label: "Email", href: `mailto:${contact.email}` },
    ],
  },
] as const;
