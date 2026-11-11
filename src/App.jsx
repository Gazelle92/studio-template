import { useEffect } from "react";
import SITE from "./content";
import Header, { Clock } from "./components/Header";
import Cases from "./components/Cases";
import { AboutTeaser, Footer, Hero, Recognitions, Showreel, Statement } from "./components/Sections";
import { initLenis } from "./lib/scroll";

export default function App({ site = SITE }) {
  useEffect(() => {
    document.title = site.meta.title;
    initLenis();
  }, [site]);

  return (
    <div className="page" id="top">
      <Header site={site} />
      <Clock clock={site.clock} />
      <main>
        <Hero site={site} />
        <Showreel showreel={site.showreel} />
        <Cases cases={site.cases} />
        <Statement lines={site.statement.lines} />
        <Recognitions data={site.recognitions} />
        <AboutTeaser about={site.about} />
      </main>
      <Footer site={site} />
    </div>
  );
}
