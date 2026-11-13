/* ==========================================================================
   4안 공통 등장(reveal) 규칙 — 모든 섹션이 같은 모션 언어를 씀
   이징·시간은 variants.css의 --ease4 / --dur4 로 통일

   words   : 거의 모든 텍스트 → 단어마다 아래에서 밀려 올라옴 (마스크)
   up      : 스크램블되는 글자·버튼·입력칸 → 살짝 아래에서 페이드업
   img     : 이미지·영상 → 아래에서 위로 열리며 살짝 줌아웃
   stagger : 목록(케이스 행, 수상 행, 알약 줄) → 순서대로 시차 등장
   parallax: 쇼릴 → 스크롤에 따라 살짝 늦게 움직임
   ========================================================================== */
import { useEffect } from "react";
import { onFrame } from "../lib/pointer";

const RULES = {
  // 거의 모든 텍스트: 단어마다 아래에서 밀려 올라옴
  words: [
    ".head4__title", ".head4__no", ".intro4__text", ".intro4__logo", ".statement4__text",
    ".showreel__cap > *", ".case__title-sm", ".services4__note",
    ".stat4__label", ".stat4__text", ".rec-row .text", ".rec-row__detail", ".about-link .text",
    ".footer-top > *", ".footer-main .brand", ".footer-main .cta > span", ".footer-main .navA > *", ".footer-main .navB > *",
    ".footer-main .blurb", ".footer4__social > *",
    // 6안
    ".tpl6__name", ".tpl6__note", ".step6__title", ".step6__ko", ".step6__text", ".proc6__lead",
    ".price6__name", ".price6__desc", ".price6__note", ".faq6__qt",
  ],
  // 글자가 바뀌는(스크램블) 요소·버튼·입력칸은 통째로 페이드업
  up: [".case__no", ".case__type", ".case__list.scope", ".pill4:not(.sticky6)", ".case-archive", ".footer4__form",
    ".tpl6__no", ".tpl6__mood", ".tpl6__fit", ".tpl6__price", ".tpl6__left", ".tpl6__go", ".step6__no", ".step6__points", ".step6__visual", ".price6__price", ".price6__items"],
  img: [".showreel__media"],
  stagger: [".pills__row", ".faq6-list > .faq6", ".proc6__nav > li"],
};
const PARALLAX = [[".showreel__media", -0.06]];

/**
 * 텍스트를 단어 마스크 구조로: <span class="w4"><span class="w4__i">단어</span></span>
 * - <b> 같은 안쪽 태그는 유지하고 글자 노드만 나눔
 * - 스크램블되는 요소([data-original-text], [data-re])는 글자를 직접 바꾸므로 건드리지 않음
 */
function splitToWords(el) {
  if (el.dataset.split4) return;
  el.dataset.split4 = "1";
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.textContent.trim() && !n.parentElement.closest("[data-original-text], [data-re], .w4, svg")
      ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let i = 0;
  nodes.forEach(node => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(part); return; }
      const w = document.createElement("span");
      w.className = "w4";
      const inner = document.createElement("span");
      inner.className = "w4__i";
      inner.textContent = part;
      inner.style.setProperty("--wi", String(Math.min(i++, 16)));
      w.append(inner);
      frag.append(w);
    });
    node.replaceWith(frag);
  });
}

export function useReveal4(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const marked = [];
    const mark = (sel, kind) => document.querySelectorAll(sel).forEach(el => {
      if (el.dataset.r4) return;
      el.dataset.r4 = kind;
      if (kind === "words") splitToWords(el);
      marked.push(el);
    });
    RULES.words.forEach(s => mark(s, "words"));
    RULES.up.forEach(s => mark(s, "up"));
    RULES.img.forEach(s => mark(s, "img"));
    RULES.stagger.forEach(s => {
      document.querySelectorAll(s).forEach((el, i) => {
        if (el.dataset.r4) return;
        el.dataset.r4 = "stagger";
        el.style.setProperty("--d", `${(i % 6) * 70}ms`);
        marked.push(el);
      });
    });

    // img는 clip-path로 가려져 있어 자기 자신은 화면 진입이 감지되지 않음 → 부모를 대신 관찰
    const proxy = new Map();
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      (proxy.get(e.target) || [e.target]).forEach(t => t.classList.add("in4"));
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    // 이미 표시된 요소까지 전부 관찰 (개발 모드에서 effect가 두 번 실행돼도 동작하도록)
    document.querySelectorAll("[data-r4]:not(.in4)").forEach(el => {
      if (el.dataset.r4 === "img") {
        const p = el.parentElement;
        proxy.set(p, [...(proxy.get(p) || []), el]);
        io.observe(p);
      } else io.observe(el);
    });

    // 패럴랙스 (같은 계수 규칙)
    const par = PARALLAX.flatMap(([sel, k]) => [...document.querySelectorAll(sel)].map(el => ({ el, k })));
    const stop = onFrame(() => {
      const vh = window.innerHeight;
      par.forEach(({ el, k }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const c = r.top + r.height / 2 - vh / 2;
        el.style.translate = `0 ${(c * k).toFixed(1)}px`;
      });
    });
    return () => { io.disconnect(); stop(); };
  }, [enabled]);
}
