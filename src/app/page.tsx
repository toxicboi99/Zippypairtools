import { CategorySections } from "@/frontend/components/sections/category-sections";
import { HeroSection } from "@/frontend/components/sections/hero-section";
import { PopularToolsSection } from "@/frontend/components/sections/popular-tools-section";
import { SearchToolsSection } from "@/frontend/components/sections/search-tools-section";
import { siteConfig } from "@/frontend/constants/site";
import { categories } from "@/frontend/constants/tools";

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
