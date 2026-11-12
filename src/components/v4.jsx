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
        <input type="email" required placeholder={sent ? "Thanks — we'll be in touch" : "Your email here"} disabled={sent} />
        <button type="submit" aria-label="Subscribe"><Arrow /></button>
      </form>
      <div className="footer4__social">
        <span>Social</span>
        {site.nav.find(n => n.children)?.children.map(c => <Link key={c.label} href={c.href}>{c.label}</Link>)}
      </div>
    </div>
  );
}
