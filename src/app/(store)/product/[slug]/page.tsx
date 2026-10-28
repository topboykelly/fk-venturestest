import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { Reveal } from "@/components/ui/Section";
import { Accent, SectionHeading } from "@/components/ui/SectionHeading";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { coverPhoto } from "@/lib/product";

const PLACEHOLDER_SLUG = "__none__";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.length ? products.map((p) => ({ slug: p.slug })) : [{ slug: PLACEHOLDER_SLUG }];
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  return {
    title: product.name,
    description: product.description || `${product.name} — wholesale from F.K. Ventures.`,
    openGraph: coverPhoto(product) ? { images: [coverPhoto(product)] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const others = (await getProducts()).filter((p) => p.id !== product.id);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  return (
    <>
      <section className="relative bg-grid pt-24 pb-3 md:pt-32 md:pb-8">
        <div className="container-page">
          <ProductView product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative py-10 md:py-16">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                label="You may also like"
                title={
                  <>
                    Related <Accent>Products</Accent>
                  </>
                }
              />
            </Reveal>
            <Reveal delay={0.1} className="mt-8">
              <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
                {related.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
