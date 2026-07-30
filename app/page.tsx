import { SiteNav } from "@/components/site-nav";
import { HeroFullBleed } from "@/components/hero/HeroFullBleed";
import { VenturesSection } from "@/components/ventures-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <SiteNav />
      <HeroFullBleed />
      <VenturesSection />
      <ContactSection />
    </>
  );
}
