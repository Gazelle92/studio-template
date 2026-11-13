import { useCallback, useEffect, useState } from "react";

/** 3안: 스크롤하면 아래에서 위로 올라오는 포인트 텍스트 */
const RISE_SELECTORS = [
  ".intro3__title", ".intro3__kicker", ".showreel3__cap", ".morph-head",
  ".card__meta", ".card__title", ".card__scope", ".case-archive--wide",
  ".rec-tile .text", ".rec-tile .rec-row__detail", ".recognitions--tiles .label",
  ".about-link", ".footer-top", ".footer-main > *",
].join(",");

/**
 * 텍스트를 단어 단위 <span class="rw">로 나눔.
 * - 굵기 출렁이는 제목(.morph__w)은 이미 단어로 나뉘어 있어 그대로 사용
 * - 스크램블되는 요소([data-original-text], [data-re])는 글자를 직접 바꾸므로 통째로 한 단어처럼 취급
 */
function splitWords(el) {
  if (el.classList.contains("rise--words")) return; // 이미 나눈 요소는 건너뜀 (개발 모드 이중 실행 대비)
  let units = [...el.querySelectorAll(".morph__w")];
  if (!units.length && !el.matches("[data-original-text]")) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.textContent.trim() && !n.parentElement.closest("[data-original-text], [data-re], svg, .rw")
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(part); return; }
        const w = document.createElement("span");
        w.className = "rw";
        w.textContent = part;
        frag.append(w);
      });
      n.replaceWith(frag);
    });
    el.querySelectorAll("[data-original-text], [data-re]").forEach(x => x.classList.add("rw"));
    units = [...el.querySelectorAll(".rw")];
  }
  units.forEach((u, i) => { u.classList.add("rw"); u.style.setProperty("--wi", Math.min(i, 18)); });
  if (units.length) el.classList.add("rise--words");
}

function useRise(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const els = [...document.querySelectorAll(RISE_SELECTORS)];
    els.forEach(el => {
      el.classList.add("rise");
      splitWords(el);
      // 같은 줄(형제)끼리는 살짝 시차
      const sibs = [...el.parentElement.children].filter(c => c.matches(RISE_SELECTORS));
      el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 6) * 70}ms`);
    });
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
}
import SITE from "./content";
import SITE5 from "./content5";
import SITE6 from "./content6";
import { Demo6, Faq6, Pricing6, Process6, StickyCta6, Templates6, Why6 } from "./components/v6";
import Header, { Clock } from "./components/Header";
import Cases from "./components/Cases";
import CasesGrid from "./components/CasesGrid";
import { AboutTeaser, Footer, Hero, Recognitions, Showreel, Statement } from "./components/Sections";
import { CasesIndex, CursorReadout, Hero2, ProgressBar, Statement2 } from "./components/v2";
import { GridOverlay, Hero3, Intro3, MorphTitle, Showreel3 } from "./components/v3";
import VariantSwitcher from "./components/VariantSwitcher";
import Effects3 from "./components/v3fx";
import { Cursor5, useWave5, FooterExtra4, Intro4, SectionHead4, Services4, Stats4, Statement4 } from "./components/v4";
import { useReveal4 } from "./components/fx4";
import { initLenis } from "./lib/scroll";
import { getVariant } from "./variant";

/** 2·3안에서 쓰는 추가 문구 (content.js에 extras로 넣으면 덮어씀) */
const DEFAULT_EXTRAS = {
  kicker: "(studio — since 2023)",
  services: "Web design, development & branding",
  statementLabel: "What we do",
  workLabel: "Selected work",
  kinetic: ["MONOFORM", "IT'S", "Re-form"],
  since: "Since 2023",
  coords: "37.5665°N, 126.9780°E",
  // 4안
  about4: "a design studio shaping brands and digital experiences through motion, clarity, and timeless craft. Based online, working globally.",
  servicesTitle: "Our Services",
  statsTitle: "In Numbers",
  servicesNote: "If you're looking for clarity in design, let's build it together.",
  services4: ["Visual Identity", "Typography & Color System", "Motion Design", "Campaign Concept", "Style Frames", "Tone & Narrative", "Guidelines", "Packaging"],
  stats4: [
    { n: 25, label: "International Awards", text: "Recognized by global juries for clarity, craft and concept.", cta: "Our Awards", seed: "mf-stat-1", href: "#" },
    { n: 42, label: "Clients Worldwide", text: "Built on relationships, not transactions — teams who value dialogue and trust.", cta: "Our Clients", seed: "mf-stat-2", href: "#" },
    { n: 83, label: "Completed Projects", text: "Ideas shaped, stories refined and systems brought to life.", cta: "Our Work", seed: "mf-stat-3", href: "#cases" },
  ],
};

/**
 * 시안 구성
 *  1안 Original : 원본 구조 그대로
 *  2안 joshgrafik 스타일 : 큰 그로테스크, 글자 등장, 스크롤 채움 문장, 진행 바, 좌표, 인덱스 표
 *  3안 TBWA\HAKUHODO 스타일 : 그리드 선, 키네틱 타이포, 슬릿 이미지, 굵기 출렁이는 제목
 */
export default function App({ site: baseSite = SITE }) {
  const variant = getVariant();
  // 5안 = 4안 디자인 + mono-form 내용
  const site = variant === "5" ? SITE5 : variant === "6" ? SITE6 : baseSite;
  const look = variant === "5" || variant === "6" ? "4" : variant;
  const mono = variant === "5" || variant === "6";   // mono-form 내용(5·6안) 공통 스타일·커서·물결
  const [demo, setDemo] = useState(null);
  const closeDemo = useCallback(() => setDemo(null), []);
  const extras = { ...DEFAULT_EXTRAS, ...(site.extras || {}) };
  useRise(variant === "3");
  useReveal4(look === "4");
  useWave5(mono);

  useEffect(() => {
    document.documentElement.dataset.variant = look;
    document.documentElement.dataset.content = mono ? "5" : "";
    document.documentElement.dataset.page = variant === "6" ? "6" : "";
    document.title = site.meta.title;
    initLenis();
  }, [site, variant]);

  if (variant === "2") {
    return (
      <div className="page" id="top">
        <ProgressBar />
        <Header site={site} />
        <Clock clock={site.clock} />
        <main>
          <Hero2 site={site} extras={extras} />
          <Showreel showreel={site.showreel} />
          <Statement2 lines={site.statement.lines} extras={extras} />
          <CasesIndex cases={site.cases} extras={extras} />
          <Recognitions data={site.recognitions} />
          <AboutTeaser about={site.about} />
        </main>
        <Footer site={site} giant />
        <CursorReadout />
        <VariantSwitcher current={variant} />
      </div>
    );
  }

  if (variant === "3") {
    return (
      <div className="page" id="top">
        <GridOverlay />
        <Header site={site} />
        <main>
          <Hero3 site={site} extras={extras} />
          <Intro3 site={site} extras={extras} />
          <Showreel3 showreel={site.showreel} />
          <div className="dark3">
            <CasesGrid cases={site.cases} slit morph />
          </div>
          <Statement lines={site.statement.lines} layout="marquee" />
          <Recognitions data={site.recognitions} layout="tiles"
            heading={<div className="morph-head morph-head--pad"><MorphTitle text={site.recognitions.label} /></div>} />
          <AboutTeaser about={site.about} />
        </main>
        <Footer site={site} />
        <Effects3 />
        <VariantSwitcher current={variant} />
      </div>
    );
  }

  if (variant === "6") {
    // 6안: 템플릿 판매 홈 — 무엇을 파는지 → 왜 다른지 → 누가 만드는지 → 어떻게 사는지 → 문의
    return (
      <div className="page" id="top">
        <Header site={site} />
        <main>
          <Intro4 site={site} extras={extras} />
          <Statement4 lines={site.statement.lines} />
          <Templates6 data={site.templates} onOpen={setDemo} />
          <section className="sec4"><SectionHead4 title={extras.statsTitle} no={2} /></section>
          <Stats4 extras={extras} />
          <Why6 data={site.why} no={3} />
          <Process6 data={site.process} no={4} />
          <Pricing6 data={site.pricing} ctaHref={site.stickyCta.href} no={5} />
          <section className="sec4"><SectionHead4 title={site.cases.title} no={6} id="cases-head" /></section>
          <Cases cases={site.cases} />
          <section className="sec4"><SectionHead4 title={site.recognitions.label} no={7} /></section>
          <Recognitions data={site.recognitions} />
          <Faq6 data={site.faq} no={8} />
          <AboutTeaser about={site.about} />
        </main>
        <Footer site={site} giant extra={<FooterExtra4 site={site} />} />
        <StickyCta6 cta={site.stickyCta} />
        <Demo6 item={demo} onClose={closeDemo} ctaHref={site.stickyCta.href} />
        <Cursor5 />
        <VariantSwitcher current={variant} />
      </div>
    );
  }

  if (look === "4") {
    // 모든 섹션: SectionHead4(굵은 제목 + 번호) → 내용, 같은 등장·hover 규칙 (fx4.js)
    return (
      <div className="page" id="top">
        <Header site={site} />
        <main>
          <Intro4 site={site} extras={extras} />
          <Statement4 lines={site.statement.lines} />
          <section className="sec4"><SectionHead4 title="Showreel" no={1} /></section>
          <Showreel showreel={site.showreel} />
          <section className="sec4"><SectionHead4 title={site.cases.title} no={2} id="cases-head" /></section>
          <Cases cases={site.cases} />
          <Services4 cases={site.cases} extras={extras} />
          <section className="sec4"><SectionHead4 title={extras.statsTitle} no={4} /></section>
          <Stats4 extras={extras} />
          <section className="sec4"><SectionHead4 title={site.recognitions.label} no={5} /></section>
          <Recognitions data={site.recognitions} />
          <AboutTeaser about={site.about} />
        </main>
        <Footer site={site} giant extra={<FooterExtra4 site={site} />} />
        {variant === "5" && <Cursor5 />}
        <VariantSwitcher current={variant} />
      </div>
    );
  }

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
      <VariantSwitcher current={variant} />
    </div>
  );
}
