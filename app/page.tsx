import { FeaturedSection } from "./components/FeaturedSection";
import { BundleGenerator } from "./components/BundleGenerator";

export default function Home() {
  return (
    <div className="w-full">
      {/* Section 1: Featured Bundles */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <FeaturedSection />
      </section>

      {/* Section 2: Bundle Generator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <BundleGenerator />
      </section>
    </div>
  );
}
