import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/hero/Hero";
import { LandingPreviewOverlay } from "@/components/shared/LandingPreviewOverlay";
import { Footer } from "@/components/layout/Footer";

export default async function Home() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <>
      <Navbar session={session} />
      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <LandingPreviewOverlay />
      </main>
      <Footer />
    </>
  );
}
