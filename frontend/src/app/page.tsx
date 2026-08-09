import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { DemoCta } from "@/components/landing/demo-cta";
import { Features } from "@/components/landing/features";
import { Navbar } from "@/components/landing/navbar";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <DemoCta />
      <Footer />
    </main>
  );
}
