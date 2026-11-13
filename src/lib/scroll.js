import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis = null;

/** 원본 사이트와 동일한 Lenis 설정 (버전도 원본과 같은 1.1.20으로 고정 — package.json) */
export function initLenis() {
  if (lenis || typeof window === "undefined") return lenis;
  // 새로고침하면 항상 맨 위에서 시작 (브라우저가 이전 스크롤 위치를 복원하지 않게)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  lenis = new Lenis({
    smooth: true,          // 원본 코드에 있는 값 (1.1.x에서는 무시됨)
    lerp: 0.12,
    wheelMultiplier: 1.2,
    infinite: false,
    easing: t => --t * t * t + 1,
  });
  const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToHash(hash) {
  if (!hash || hash.length < 2) return false;
  const target = document.querySelector(hash);
  if (!target) return false;
  if (lenis) lenis.scrollTo(target, { offset: -60 });
  else target.scrollIntoView({ behavior: "smooth" });
  return true;
}
