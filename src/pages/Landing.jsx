import Header from "../components/Header";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Introduction from "../components/Introduction";
import GenerativeArtwork from "../components/GenerativeArtwork";
import Footer from "../components/Footer";

/**
 * The personal landing page. Deliberately not a portfolio: work only appears
 * as three small destinations inside <Introduction />.
 */
function Landing() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Hero />
        <Marquee />
        <Introduction />
        <GenerativeArtwork />
      </main>
      <Footer />
    </>
  );
}

export default Landing;
