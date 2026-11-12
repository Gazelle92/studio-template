/* ==========================================================================
   3안 인터랙션 모음 (Effects3 하나만 렌더하면 전부 동작)
   1. 커스텀 커서        : 마우스를 부드럽게 따라오는 원, 카드 위에선 VIEW / 쇼릴 위에선 PLAY
   2. 마그네틱 버튼      : 버튼 근처에 가면 커서 쪽으로 끌려옴
   3. 히어로 패럴랙스    : 키네틱 줄·사선이 마우스 위치에 따라 움직임
   4. 스크롤 속도 반응   : 빠르게 스크롤하면 마키·키네틱 속도↑, 위로 스크롤하면 역방향, 카드 기울어짐
   5. 그리드 열 하이라이트: 마우스가 있는 그리드 열이 노랗게 빛남
   6. 수상 타일 틸트     : 마우스 위치에 따라 3D로 기울어짐
   7. intro3 고정 진행도 : 고정된 동안 제목이 살짝 작아지고 노란 글자가 기울어짐
   ========================================================================== */
import { useEffect, useRef } from "react";
import { mouse, onFrame } from "../lib/pointer";

const HAS_HOVER = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const lerp = (a, b, t) => a + (b - a) * t;

/** 스크롤 속도 (px/frame, 부드럽게) */
export const scrollFx = { vel: 0 };
let lastY = typeof window !== "undefined" ? window.scrollY : 0;

/** 커서가 바뀌는 대상 */
const CURSOR_LABELS = [
  [".card", "VIEW"],
  [".showreel3 .slit-canvas", "PLAY"],
  [".hero3", "SCROLL"],
  [".rec-tile", ""],
  ["a, button", ""],
];

export default function Effects3() {
  const dot = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    // ---------- 커서 라벨 지정 ----------
    CURSOR_LABELS.forEach(([sel, text]) =>
      document.querySelectorAll(sel).forEach(el => { if (!el.dataset.cursor) el.dataset.cursor = text || "link"; }));

    const cursor = { x: -100, y: -100, s: 1 };
    const magnets = [...document.querySelectorAll(".hero3__pill, .pill3, .footer-main .cta, .nav__item, .case-archive--wide .arrow, .about-link .arrow")]
      .map(el => ({ el, x: 0, y: 0 }));
    const kinRows = [...document.querySelectorAll(".kin__row")];
    const slash = document.querySelector(".hero3__slash");
    const kinEl = document.querySelector(".kin");
    const cardMedia = [...document.querySelectorAll(".card__media")];
    const cols = [...document.querySelectorAll(".v3-grid span")];
    const tiles = [...document.querySelectorAll(".rec-tile")];
    const pin = document.querySelector(".intro3-pin");
    const pinTitle = document.querySelector(".intro3__title");
    const pinBack = document.querySelector(".intro3__back");
    const anims = () => [...document.querySelectorAll(".marquee__list, .kin__track, .intro3__line span")]
      .flatMap(el => el.getAnimations ? el.getAnimations() : []);
    let rate = 1;
    let activeCol = -1;

    return onFrame(() => {
      const vw = window.innerWidth, vh = window.innerHeight;

      // ---------- 스크롤 속도 ----------
      const y = window.scrollY;
      scrollFx.vel = lerp(scrollFx.vel, y - lastY, 0.15);
      lastY = y;
      const v = scrollFx.vel;

      // 마키·키네틱: 속도↑, 위로 스크롤하면 역방향
      const target = (v < -0.5 ? -1 : 1) * (1 + Math.min(Math.abs(v) * 0.12, 5));
      rate = lerp(rate, target, 0.08);
      anims().forEach(a => { a.playbackRate = rate; });

      // 카드 이미지: 스크롤 속도만큼 살짝 기울어짐
      const skew = Math.max(-6, Math.min(6, v * 0.25));
      cardMedia.forEach(m => { m.style.transform = `skewY(${skew.toFixed(2)}deg)`; });

      // ---------- 히어로 패럴랙스 ----------
      const mx = mouse.x < 0 ? 0 : mouse.x / vw - 0.5;
      const my = mouse.y < 0 ? 0 : mouse.y / vh - 0.5;
      kinRows.forEach((r, i) => { r.style.translate = `${(i % 2 ? 1 : -1) * mx * 80}px ${my * 14 * (i - 1.5)}px`; });
      if (slash) slash.style.rotate = `${mx * 10}deg`;
      if (kinEl) kinEl.style.transform = `skewX(${Math.max(-12, Math.min(12, v * -0.4)).toFixed(2)}deg)`;

      // ---------- intro3 고정 진행도 ----------
      if (pin && pinTitle) {
        const r = pin.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
        pinTitle.style.scale = String(1 - p * 0.12);
        pinTitle.style.translate = `0 ${-p * 40}px`;
        if (pinBack) pinBack.style.rotate = `${-p * 6}deg`;
      }

      if (!HAS_HOVER) return;

      // ---------- 커스텀 커서 ----------
      const over = document.elementFromPoint(mouse.x, mouse.y)?.closest("[data-cursor]");
      const kind = over ? over.dataset.cursor : "";
      const big = kind && kind !== "link";
      cursor.x = lerp(cursor.x, mouse.x, 0.22);
      cursor.y = lerp(cursor.y, mouse.y, 0.22);
      cursor.s = lerp(cursor.s, big ? 6 : kind === "link" ? 2.4 : 1, 0.18);
      dot.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%) scale(${cursor.s})`;
      label.current.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`;
      dot.current.classList.toggle("is-big", !!big);
      label.current.textContent = big ? kind : "";
      label.current.style.opacity = big ? "1" : "0";

      // ---------- 마그네틱 ----------
      magnets.forEach(m => {
        const r = m.el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = mouse.x - cx, dy = mouse.y - cy;
        const near = Math.hypot(dx, dy) < Math.max(r.width, r.height) * 0.9 + 40;
        m.x = lerp(m.x, near ? dx * 0.3 : 0, 0.15);
        m.y = lerp(m.y, near ? dy * 0.3 : 0, 0.15);
        m.el.style.translate = `${m.x.toFixed(1)}px ${m.y.toFixed(1)}px`;
      });

      // ---------- 그리드 열 하이라이트 ----------
      let col = -1;
      cols.forEach((c, i) => { const r = c.getBoundingClientRect(); if (mouse.x >= r.left && mouse.x <= r.right) col = i; });
      if (col !== activeCol) {
        cols.forEach((c, i) => c.classList.toggle("is-on", i === col));
        activeCol = col;
      }

      // ---------- 수상 타일 3D 틸트 ----------
      tiles.forEach(t => {
        const r = t.getBoundingClientRect();
        const inside = mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
        const tx = inside ? ((mouse.y - r.top) / r.height - 0.5) * -14 : 0;
        const ty = inside ? ((mouse.x - r.left) / r.width - 0.5) * 14 : 0;
        const cur = t._tilt || { x: 0, y: 0 };
        cur.x = lerp(cur.x, tx, 0.15); cur.y = lerp(cur.y, ty, 0.15);
        t._tilt = cur;
        t.style.transform = `perspective(700px) rotateX(${cur.x.toFixed(2)}deg) rotateY(${cur.y.toFixed(2)}deg)`;
      });
    });
  }, []);

  if (!HAS_HOVER) return null;
  return (
    <>
      <div className="cursor3" ref={dot} aria-hidden="true" />
      <div className="cursor3__label" ref={label} aria-hidden="true" />
    </>
  );
}
