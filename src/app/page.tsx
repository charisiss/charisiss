import { Hero } from "@/components/hero/Hero";
import { Cursor } from "@/components/layout/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IntroProvider } from "@/components/layout/Preloader";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <IntroProvider>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Work />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Cursor />
    </IntroProvider>
  );
}
