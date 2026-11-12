import { useEffect } from "react";

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
import Header, { Clock } from "./components/Header";
import Cases from "./components/Cases";
import CasesGrid from "./components/CasesGrid";
import { AboutTeaser, Footer, Hero, Recognitions, Showreel, Statement } from "./components/Sections";
import { CasesIndex, CursorReadout, Hero2, ProgressBar, Statement2 } from "./components/v2";
import { GridOverlay, Hero3, Intro3, MorphTitle, Showreel3 } from "./components/v3";
import VariantSwitcher from "./components/VariantSwitcher";
import Effects3 from "./components/v3fx";
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
};

/**
 * 시안 구성
 *  1안 Original : 원본 구조 그대로
 *  2안 joshgrafik 스타일 : 큰 그로테스크, 글자 등장, 스크롤 채움 문장, 진행 바, 좌표, 인덱스 표
 *  3안 TBWA\HAKUHODO 스타일 : 그리드 선, 키네틱 타이포, 슬릿 이미지, 굵기 출렁이는 제목
 */
export default function App({ site = SITE }) {
  const variant = getVariant();
  const extras = { ...DEFAULT_EXTRAS, ...(site.extras || {}) };
  useRise(variant === "3");

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
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
