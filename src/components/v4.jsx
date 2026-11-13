/* ==========================================================================
   4안 전용 컴포넌트 — 1안 + 레퍼런스: mobius.framer.website
   카드 덱 인트로, 스크롤로 채워지는 굵은 문장, 서비스 알약 띠,
   사진이 들어간 거대 숫자 스택, 대형 로고 푸터
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { Arrow, Link } from "./primitives";
import { mouse, onFrame } from "../lib/pointer";
import { plain, ScrollFill } from "./v2";
import { photo } from "./v3";

/** 4안 공통 섹션 머리: 굵은 제목 + 회색 번호 (01) — 모든 섹션 같은 패턴 */
export const SectionHead4 = ({ title, no, id }) => (
  <div className="head4" id={id}>
    <h2 className="head4__title">{title}</h2>
    <span className="head4__no">({String(no).padStart(2, "0")})</span>
  </div>
);

/** 부채꼴로 겹친 사진 카드 — 2.6초마다 맨 앞 카드가 맨 뒤로 */
function Deck({ seeds }) {
  const [order, setOrder] = useState(() => seeds.map((_, i) => i));
  const wrap = useRef(null);
  useEffect(() => {
    const id = setInterval(() => setOrder(o => [...o.slice(1), o[0]]), 2600);
    return () => clearInterval(id);
  }, []);
  // 마우스 위치에 따라 덱 전체가 살짝 기울어짐
  useEffect(() => {
    let rx = 0, ry = 0;
    return onFrame(() => {
      const el = wrap.current;
      if (!el) return;
      const vx = mouse.x < 0 ? 0 : mouse.x / window.innerWidth - 0.5;
      const vy = mouse.y < 0 ? 0 : mouse.y / window.innerHeight - 0.5;
      rx += (vy * -8 - rx) * 0.08; ry += (vx * 10 - ry) * 0.08;
      el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
  }, []);
  const n = seeds.length;
  return (
    <div className="deck" ref={wrap}>
      {seeds.map((seed, i) => {
        const pos = order.indexOf(i);          // 0 = 맨 앞
        const rot = [0, -7, 6, -12, 11][pos] ?? 0;
        const dx = [0, -46, 40, -80, 76][pos] ?? 0;
        return (
          <div key={seed} className="deck__card"
            style={{ zIndex: n - pos, transform: `translate(${dx}px, ${pos * 6}px) rotate(${rot}deg) scale(${1 - pos * 0.035})` }}>
            <img src={photo(seed, 900, 1100)} alt="" />
          </div>
        );
      })}
    </div>
  );
}

export function Intro4({ site, extras }) {
  const seeds = ["mf-deck-1", "mf-deck-2", "mf-deck-3", "mf-deck-4", "mf-deck-5"];
  return (
    <section className="intro4">
      <p className="intro4__text"><b>{site.brand.name}®</b> — {extras.about4}</p>
      {extras.introCtas && (
        <div className="intro6__ctas">
          {extras.introCtas.map(c => (
            <Link key={c.label} className={`pill4${c.ghost ? " pill4--ghost" : ""}`} href={c.href}><span>{c.label}</span><Arrow /></Link>
          ))}
        </div>
      )}
      <Deck seeds={seeds} />
      <div className="intro4__logo" aria-hidden="true">{site.brand.name}®</div>
    </section>
  );
}

/** 굵은 산세리프 문장 — 스크롤에 따라 단어가 채워짐 */
export function Statement4({ lines }) {
  return (
    <section className="statement4">
      <ScrollFill className="statement4__text" text={plain(lines)} />
    </section>
  );
}

/** 서비스 알약 두 줄 — 스크롤에 따라 서로 반대 방향으로 미끄러짐 */
export function Services4({ cases, extras }) {
  const ref = useRef(null);
  const all = [...new Set([...cases.items.flatMap(c => c.scope), ...extras.services4])];
  const half = Math.ceil(all.length / 2);
  const rows = [all.slice(0, half), all.slice(half)];
  useEffect(() => {
    const el = ref.current;
    const tracks = [...el.querySelectorAll(".pills__track")];
    return onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = (vh - r.top) / (vh + r.height); // 0 → 1
      tracks.forEach((t, i) => { t.style.transform = `translateX(${(i % 2 ? -1 : 1) * (p - 0.5) * 40}%)`; });
    });
  }, []);
  return (
    <section className="services4" ref={ref}>
      <SectionHead4 title={extras.servicesTitle} no={3} />
      <div className="pills">
        {rows.map((row, i) => (
          <div className="pills__row" key={i}>
            <div className="pills__track">{[...row, ...row].map((s, k) => <span className="pill" key={k}>{s}</span>)}</div>
          </div>
        ))}
      </div>
      <p className="services4__note">{extras.servicesNote}</p>
    </section>
  );
}

/** 왼쪽 작은 숫자: 화면에 들어오면 아래에서 위로 밀려 올라옴 */
function MaskNum({ value }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => ref.current.classList.toggle("is-in", e.isIntersecting), { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div className="stat4p__num" ref={ref}><span>{value}</span></div>;
}

/**
 * 원본(Möbius)과 같은 방식:
 * - 오른쪽 거대 숫자는 화면에 고정(sticky)된 채, 십의 자리·일의 자리 숫자 띠가
 *   스크롤 위치에 맞춰 위아래로 부드럽게 굴러감 (25 → 42 → 83)
 * - 숫자 안의 사진도 구간에 따라 교차 페이드
 * - 캔버스 1장에 그림: 숫자 모양을 마스크로 만들고 그 안에만 사진을 칠함 (경계선 없음)
 * - 왼쪽은 구간마다 설명 패널이 지나가고, 작은 숫자가 아래에서 올라옴
 */
export function Stats4({ extras }) {
  const stats = extras.stats4;
  const n = stats.length;
  const ref = useRef(null);
  const right = useRef(null);
  const canvas = useRef(null);
  const digits = v => [Math.floor(v / 10) % 10, v % 10];

  useEffect(() => {
    const el = ref.current, box = right.current, cv = canvas.current;
    const ctx = cv.getContext("2d");
    const mask = document.createElement("canvas");
    const mctx = mask.getContext("2d");
    const imgs = stats.map(s => { const im = new Image(); im.src = photo(s.seed, 1400, 1000); return im; });
    const FONT = "900 {px}px Inter, Helvetica, Arial, sans-serif";
    let W = 0, H = 0, dpr = 1, fs = 0, colW = 0;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.round(box.clientWidth * dpr); H = Math.round(box.clientHeight * dpr);
      cv.width = mask.width = W; cv.height = mask.height = H;
      fs = Math.min(window.innerWidth * 0.32, window.innerHeight * 0.72) * dpr;
      mctx.font = FONT.replace("{px}", fs);
      colW = Math.max(...Array.from({ length: 10 }, (_, d) => mctx.measureText(String(d)).width));
    };
    resize();
    document.fonts?.load(`900 100px Inter`).then(resize);
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const cur = digits(stats[0].n).slice();
    const smooth = t => t * t * (3 - 2 * t);
    const stop = onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2 || !W) return;
      // f: 0(첫 패널) → n-1(마지막 패널)
      const f = Math.min(n - 1, Math.max(0, -r.top / vh));
      const i = Math.min(n - 2, Math.floor(f));
      // 패널 가운데 구간에서만 숫자가 바뀌고, 나머지는 멈춰 있음
      const t = smooth(Math.min(1, Math.max(0, (f - i - 0.2) / 0.6)));
      const a = digits(stats[i].n), b = digits(stats[i + 1]?.n ?? stats[i].n);
      [0, 1].forEach(k => { cur[k] += (a[k] + (b[k] - a[k]) * t - cur[k]) * 0.14; });

      // ---- 1) 숫자 마스크 ----
      const gap = -0.04 * fs;
      const x0 = W - (colW * 2 + gap) - 0.05 * fs;
      const y0 = (H - fs) / 2;
      mctx.clearRect(0, 0, W, H);
      mctx.font = FONT.replace("{px}", fs);
      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.fillStyle = "#000";
      [0, 1].forEach(k => {
        const cx = x0 + k * (colW + gap);
        const v = cur[k];
        mctx.save();
        mctx.beginPath();
        mctx.rect(cx - fs * 0.3, y0, colW + fs * 0.6, fs);   // 위아래만 잘라 한 칸만 보이게
        mctx.clip();
        const base = Math.floor(v);
        for (let d = base - 1; d <= base + 1; d++) {
          if (d < 0 || d > 9) continue;
          mctx.fillText(String(d), cx + colW / 2, y0 + (d - v) * fs + fs * 0.54);
        }
        mctx.restore();
      });

      // ---- 2) 사진(교차 페이드) 칠하고 숫자 모양으로 잘라내기 ----
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#111";            // 사진을 못 불러와도 숫자는 검게 보이도록
      ctx.fillRect(0, 0, W, H);
      imgs.forEach((im, k) => {
        const alpha = Math.max(0, 1 - Math.abs(f - k));
        if (!alpha || !im.complete || !im.naturalWidth) return;
        const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight);
        const dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
        ctx.globalAlpha = alpha;
        ctx.drawImage(im, (W - dw) / 2, (H - dh) / 2, dw, dh);
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(mask, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    });
    return () => { stop(); ro.disconnect(); };
  }, [stats]);

  return (
    <section className="stats4" ref={ref}>
      <div className="stats4__panels">
        {stats.map((s, i) => (
          <div className="stat4p" key={i}>
            <MaskNum value={s.n} />
            <div className="stat4__label">{s.label}</div>
            <p className="stat4__text">{s.text}</p>
            <Link className="pill4" href={s.href || "#"}><span>{s.cta}</span><Arrow /></Link>
          </div>
        ))}
      </div>
      <div className="stats4__right" ref={right}>
        <canvas ref={canvas} className="odo-canvas" role="img" aria-label={stats.map(s => s.n).join(", ")} />
      </div>
    </section>
  );
}

/** 푸터 위쪽: 이메일 구독 + 소셜 */
export function FooterExtra4({ site }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="footer4">
      <form className="footer4__form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
        <input type="email" required placeholder={sent ? (site.footer.subscribe?.thanks || "Thanks — we'll be in touch") : (site.footer.subscribe?.placeholder || "Your email here")} disabled={sent} />
        <button type="submit" aria-label="Subscribe"><Arrow /></button>
      </form>
      <div className="footer4__social">
        <span>Social</span>
        {site.nav.find(n => n.children)?.children.map(c => <Link key={c.label} href={c.href}>{c.label}</Link>)}
      </div>
    </div>
  );
}

/**
 * 5안 커스텀 커서 — 3안 커서를 흑백으로, 더 빠르게 따라옴
 *  - 기본: 작은 원 (배경과 반전색)
 *  - 링크·버튼 위: 커짐
 *  - 쇼릴 위: 큰 원 + PLAY
 *  - 호버 이미지가 뜨는 줄(케이스·Work With) 위: 원이 작아져 이미지를 가리지 않음
 */
const CURSOR5 = [
  [".showreel__media", "PLAY"],
  [".case, .rec-row", "img"],
  ["a, button, input, .pill4", "link"],
];
const CURSOR5_FOLLOW = 0.42;   // 3안은 0.22 → 숫자가 클수록 빠르게 따라옴 (1이면 즉시)
const CURSOR5_SCALE = 0.3;

export function Cursor5() {
  const dot = useRef(null);
  const label = useRef(null);
  const fine = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  useEffect(() => {
    if (!fine) return;
    document.documentElement.classList.add("has-cursor5");
    const mark = () => CURSOR5.forEach(([sel, kind]) =>
      document.querySelectorAll(sel).forEach(el => { if (!el.dataset.cursor5) el.dataset.cursor5 = kind; }));
    mark();
    const t = setTimeout(mark, 1500);   // 늦게 그려지는 요소 대비
    const c = { x: -100, y: -100, s: 1 };
    let first = true;
    const off = onFrame(() => {
      if (mouse.x < 0) return;
      if (first) { c.x = mouse.x; c.y = mouse.y; first = false; }
      const kind = document.elementFromPoint(mouse.x, mouse.y)?.closest("[data-cursor5]")?.dataset.cursor5 || "";
      const big = kind && kind !== "link" && kind !== "img";
      const target = big ? 6 : kind === "link" ? 2.6 : kind === "img" ? 0.5 : 1;
      c.x += (mouse.x - c.x) * CURSOR5_FOLLOW;
      c.y += (mouse.y - c.y) * CURSOR5_FOLLOW;
      c.s += (target - c.s) * CURSOR5_SCALE;
      const pos = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      dot.current.style.transform = `${pos} scale(${c.s.toFixed(3)})`;
      dot.current.classList.toggle("is-big", !!big);
      label.current.style.transform = pos;
      label.current.textContent = big ? kind : "";
      label.current.style.opacity = big ? "1" : "0";
    });
    return () => { off(); clearTimeout(t); document.documentElement.classList.remove("has-cursor5"); };
  }, [fine]);
  if (!fine) return null;
  return (
    <>
      <div className="cursor5" ref={dot} aria-hidden="true" />
      <div className="cursor5__label" ref={label} aria-hidden="true" />
    </>
  );
}

/**
 * 5안 리스트 물결 호버 — 마우스가 올라간 줄이 가장 많이, 위아래 줄은 점점 덜 오른쪽으로 밀림
 *  - Work With 목록에 적용 (케이스 목록은 4안처럼 호버한 줄만 살짝 이동)
 *  - 스크롤만 해도(마우스 고정) 줄이 바뀌면 같이 반응하도록 매 프레임 확인
 */
const WAVE5 = [32, 20, 10, 4];   // 호버한 줄, ±1칸, ±2칸, ±3칸 (px)
// 글자색: 호버한 줄은 검정, 멀어질수록 점점 연한 회색 (마지막 값 = 나머지 줄 전부)
const WAVE5_COLORS = ["#000", "#7a7a7a", "#a3a3a3", "#bdbdbd", "#cfcfcf"];
const WAVE5_LISTS = [
  [".rec-list", ".rec-row", ".text", true],   // true = 글자색도 바뀜
];

export function useWave5(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const lists = WAVE5_LISTS.map(([list, row, title, color]) => {
      const el = document.querySelector(list);
      if (!el) return null;
      const rows = [...el.querySelectorAll(row)];
      return { el, rows, titles: rows.map(r => r.querySelector(title)), color, active: -2 };
    }).filter(Boolean);
    const set = (l, idx) => {
      l.titles.forEach((t, i) => {
        const d = idx < 0 ? 99 : Math.abs(i - idx);
        t?.style.setProperty("--wave5", `${WAVE5[d] ?? 0}px`);
        if (l.color) {
          if (idx < 0) t?.style.removeProperty("--wave5c");
          else t?.style.setProperty("--wave5c", WAVE5_COLORS[Math.min(d, WAVE5_COLORS.length - 1)]);
        }
      });
      l.active = idx;
    };
    return onFrame(() => {
      const hit = mouse.x < 0 ? null : document.elementFromPoint(mouse.x, mouse.y);
      lists.forEach(l => {
        const row = hit && l.el.contains(hit) ? l.rows.findIndex(r => r.contains(hit)) : -1;
        if (row !== l.active) set(l, row);
      });
    });
  }, [enabled]);
}
