import { AnnouncementBanner } from "@/components/announcement-banner";
import { CodingAgents } from "@/components/coding-agents";
import { CoreWorkflow } from "@/components/core-workflow";
import { DownloadStrip } from "@/components/download-strip";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Newsletter } from "@/components/newsletter";
import { ScaleIt } from "@/components/scale-it";
import { Testimonials } from "@/components/testimonials";
import { HatchStrip } from "@/components/ui/hatch-strip";

export default function Home() {
  return (
    <>
      <AnnouncementBanner />
      <Navbar />
      <main className="containers isolate flex flex-1 flex-col">
        <div className="flex w-full flex-1 flex-col border-x border-border">
          <div className="isolate">
            <Hero />
            <HatchStrip />
            <DownloadStrip />
            <HatchStrip />
            <CoreWorkflow />
            <ScaleIt />
            <HatchStrip />
            <CodingAgents />
            <HatchStrip />
            <Testimonials />
            <HatchStrip />
            <Faq />
            <Newsletter />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
