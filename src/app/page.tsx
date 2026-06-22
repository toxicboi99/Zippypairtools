import { CategorySections } from "@/components/sections/category-sections";
import { HeroSection } from "@/components/sections/hero-section";
import { PopularToolsSection } from "@/components/sections/popular-tools-section";
import { SearchToolsSection } from "@/components/sections/search-tools-section";
import { siteConfig } from "@/constants/site";
import { categories } from "@/constants/tools";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: categories.map((category) => category.title),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroSection />
      <SearchToolsSection />
      <PopularToolsSection />
      <CategorySections />
    </>
  );
}
