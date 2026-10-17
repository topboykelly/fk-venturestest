import { BrandPromise } from "@/components/BrandPromise";
import { Collection } from "@/components/Collection";
import { ContactSection } from "@/components/ContactSection";
import { Hero } from "@/components/Hero";
import { getProducts } from "@/lib/catalog";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Hero products={products} />
      <Collection products={products} />
      <BrandPromise />
      <ContactSection />
    </>
  );
}
