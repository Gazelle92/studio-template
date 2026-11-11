/* ==========================================================================
   Text scramble — 원본 사이트와 동일한 타이밍 값
   ========================================================================== */
export const SCRAMBLE_CONFIG = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>/?`~",
  // 케이스 행 hover 시 큰 타이틀: 글자가 왼→오로 나타나며 각 글자 60ms 동안 20ms 간격으로 랜덤
  reveal: { duration: 400, charScrambleDuration: 20, charTotalLifetime: 60 },
  // 화면 진입 시: 첫 글자만 보이고, 나머지는 400ms에 걸쳐 순차 등장, 각 글자 20회(400ms) 랜덤
  scroll: { duration: 400, cycles: 20, delay: 100 },
  // hover 재스크램블: 전체가 랜덤으로 바뀌고 200ms~400ms 사이에 왼→오 순서로 확정, 20ms 간격
  rescramble: { duration: 400, charTotalLifetime: 20 },
};

const C = SCRAMBLE_CONFIG;
const rnd = () => C.chars.charAt(Math.floor(Math.random() * C.chars.length));

const original = el => {
  if (!el.dataset.originalText) el.dataset.originalText = el.textContent;
  return el.dataset.originalText;
};

/** 실행 중인 효과를 즉시 멈추고 원문 복원 */
export function killScramble(el) {
  if (!el) return;
  cancelAnimationFrame(el._scrRaf);
  clearInterval(el._scrInterval);
  clearTimeout(el._scrSafety);
  el._scrRaf = el._scrInterval = el._scrSafety = null;
  if (el.dataset.originalText) el.textContent = el.dataset.originalText;
  el.style.whiteSpace = "";
}

/** 프레임 기반 실행기: fn(elapsedMs) 가 [문자열, 끝났는지] 반환
 *  안전장치: 탭이 백그라운드라 프레임이 멈춰도 일정 시간 뒤 원문으로 확정 (글자가 반쯤 멈춰 보이는 문제 방지) */
function runFrames(el, fn, maxMs = 1200) {
  const t0 = performance.now();
  el._scrSafety = setTimeout(() => killScramble(el), maxMs);
  const frame = now => {
    const [text, done] = fn(now - t0);
    el.textContent = text;
    if (!done) el._scrRaf = requestAnimationFrame(frame);
    else { el._scrRaf = null; clearTimeout(el._scrSafety); }
  };
  el._scrRaf = requestAnimationFrame(frame);
}

/** REVEAL — 케이스 큰 타이틀 */
export function scrambleReveal(el) {
  const text = original(el);
  killScramble(el);
  const chars = [...text];
  const n = chars.length;
  const { duration, charScrambleDuration, charTotalLifetime } = C.reveal;
  const stagger = n > 1 ? (duration - charTotalLifetime) / (n - 1) : 0;
  const cache = new Array(n).fill("");
  const lastSlot = new Array(n).fill(-1);
  el.style.whiteSpace = "nowrap";
  el.textContent = "";
  runFrames(el, t => {
    let done = true;
    for (let i = 0; i < n; i++) {
      const local = t - i * stagger;
      if (local < 0) { cache[i] = ""; done = false; }
      else if (local < charTotalLifetime) {
        const slot = Math.floor(local / charScrambleDuration);
        if (slot !== lastSlot[i]) { cache[i] = rnd(); lastSlot[i] = slot; }
        done = false;
      } else cache[i] = chars[i];
    }
    if (done) el.style.whiteSpace = "";
    return [cache.join(""), done];
  });
}

/** SCROLL — 뷰포트 진입 */
export function scrambleViewport(el) {
  const text = original(el);
  killScramble(el);
  const chars = [...text];
  const n = chars.length;
  const { duration, cycles } = C.scroll;
  const interval = duration / (cycles + 1);
  const scrambleSpan = interval * (cycles + 1);
  const cache = chars.map((c, i) => (i === 0 || c === " " ? c : ""));
  const lastSlot = new Array(n).fill(-1);
  runFrames(el, t => {
    let done = true;
    for (let i = 1; i < n; i++) {
      if (chars[i] === " ") continue;
      const delay = (i / (n - 1)) * duration;
      const local = t - delay;
      if (local < 0) { done = false; continue; }
      if (local < scrambleSpan) {
        const slot = Math.floor(local / interval);
        if (slot !== lastSlot[i]) { cache[i] = rnd(); lastSlot[i] = slot; }
        done = false;
      } else cache[i] = chars[i];
    }
    return [cache.join(""), done];
  });
}

/** RESCRAMBLE — hover (내비, 케이스 행 텍스트) */
export function scrambleRe(el) {
  const text = original(el);
  killScramble(el);
  const chars = [...text];
  const n = chars.length;
  const { duration, charTotalLifetime } = C.rescramble;
  const firstEnd = duration / 2;
  const stagger = n > 1 ? (duration - firstEnd) / (n - 1) : 0;
  const ends = chars.map((_, i) => firstEnd + i * stagger);
  const t0 = performance.now();
  el.textContent = chars.map(rnd).join("");
  el._scrInterval = setInterval(() => {
    const t = performance.now() - t0;
    el.textContent = chars.map((c, i) => (t >= ends[i] ? c : rnd())).join("");
    if (t >= duration + 10) { clearInterval(el._scrInterval); el.textContent = text; }
  }, charTotalLifetime);
}
