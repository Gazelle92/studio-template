/* ==========================================================================
   원본과 같은 방식의 hover 감지:
   mouseenter 대신 매 프레임 요소 영역과 마우스 좌표를 비교합니다.
   → 마우스를 가만히 두고 스크롤해도 아래로 지나가는 행이 hover 됩니다.
   ========================================================================== */
export const HAS_HOVER =
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const mouse = { x: -1000, y: -1000 };
const tracked = new Set();
const frameCallbacks = new Set();
let running = false;

function loop() {
  tracked.forEach(t => t.check());
  frameCallbacks.forEach(fn => fn());
  requestAnimationFrame(loop);
}

function start() {
  if (running || typeof window === "undefined") return;
  running = true;
  document.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; },
    { passive: true, capture: true });
  // 창을 벗어나면 모두 해제
  window.addEventListener("blur", () => { mouse.x = mouse.y = -1000; });
  document.addEventListener("mouseleave", () => { mouse.x = mouse.y = -1000; });
  requestAnimationFrame(loop);
}

/** 요소 hover 등록. 반환값 = 해제 함수 */
export function registerHover(el, onEnter, onLeave) {
  if (!HAS_HOVER || !el) return () => {};
  start();
  const item = {
    hovered: false,
    check() {
      const r = el.getBoundingClientRect();
      const inside =
        r.bottom >= 0 && r.top <= window.innerHeight &&
        mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
      if (inside && !this.hovered) { this.hovered = true; onEnter(el); }
      else if (!inside && this.hovered) { this.hovered = false; onLeave(el); }
    },
  };
  tracked.add(item);
  return () => { tracked.delete(item); if (item.hovered) onLeave(el); };
}

/** 매 프레임 실행할 콜백 등록 */
export function onFrame(fn) {
  start();
  frameCallbacks.add(fn);
  return () => frameCallbacks.delete(fn);
}
