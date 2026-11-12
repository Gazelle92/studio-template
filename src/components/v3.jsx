/* ==========================================================================
   3안 전용 컴포넌트 — 레퍼런스: tbwahakuhodo.co.jp
   항상 보이는 그리드 선, 반대 방향으로 흐르는 키네틱 타이포,
   거대한 슬래시(\), 스크롤에 따라 어긋나는 슬릿 이미지, 굵기가 출렁이는 제목
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { Link, Arrow, useVideoTimeout } from "./primitives";
import { mouse } from "../lib/pointer";

/** 실제 사진 placeholder (Lorem Picsum · 무료 사진, seed가 같으면 항상 같은 사진) */
export const photo = (seed, w = 800, h = 1000) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
import { onFrame } from "../lib/pointer";
import { getLenis } from "../lib/scroll";
import { plain } from "./v2";

/** 화면 전체에 12단 그리드 선 */
export const GridOverlay = () => (
  <div className="v3-grid" aria-hidden="true">
    {Array.from({ length: 12 }, (_, i) => <span key={i} />)}
  </div>
);

/** 한 줄 키네틱 타이포 (CSS 무한 이동, 짝수 줄은 반대 방향) */
function KineticRow({ words, reverse, extras }) {
  const unit = (
    <div className="kin__unit">
      <span className="kin__big">{words[0]}</span>
      <span className="kin__micro">{extras.since}<br />{extras.coords}</span>
      <span className="kin__big kin__big--i">{words[1]}</span>
      <span className="kin__stack">{words[2].split("-").map((p, i, a) => <span key={i}>{p}{i < a.length - 1 ? "-" : ""}</span>)}</span>
      <span className="kin__slash">\</span>
    </div>
  );
  return (
    <div className={`kin__row${reverse ? " is-rev" : ""}`}>
      <div className="kin__track">{unit}{unit}{unit}{unit}</div>
    </div>
  );
}

/** 3안 히어로: 전체 화면 + 배경 미디어 + 키네틱 타이포 */
export function Hero3({ site, extras }) {
  const words = extras.kinetic;
  const [failed, setFailed] = useState(false);
  const media = useRef(null);
  useVideoTimeout(media, site.showreel.video, setFailed);
  return (
    <section className="hero3">
      <div className="hero3__media" ref={media}>
        {site.showreel.video && !failed
          ? <video src={site.showreel.video} autoPlay muted loop playsInline onError={() => setFailed(true)} />
          : <div className="hero3__ph" style={{ backgroundImage: `url("${photo("monoform-hero", 1920, 1080)}")` }} />}
      </div>
      <div className="kin">
        {[0, 1, 2, 3].map(i => <KineticRow key={i} words={words} reverse={i % 2 === 1} extras={extras} />)}
      </div>
      <div className="hero3__slash" aria-hidden="true" />
      <button className="hero3__pill" type="button"
        onClick={() => { const t = document.querySelector("#intro3"); const l = getLenis(); l ? l.scrollTo(t) : t.scrollIntoView({ behavior: "smooth" }); }}>
        <span>Scroll</span><span>↓</span>
      </button>
    </section>
  );
}

/** 히어로 다음: 흰 배경 위 큰 문장 + 뒤로 흐르는 노란 문장들 */
export function Intro3({ site, extras }) {
  const back = site.statement.lines.map(l => plain([l]));
  return (
    /* intro3-pin(높이 220vh) 안에서 intro3가 sticky로 화면에 고정 → 다음 섹션이 위로 덮으며 올라옴 */
    <div className="intro3-pin" id="intro3">
    <section className="intro3">
      <div className="intro3__back" aria-hidden="true">
        {/* Y축: 문장 묶음(섹션보다 키 큼)을 두 번 쌓고 위로 -50%까지 이동 → 아래에서 위로 끊김 없이 반복
            X축: 모든 줄이 오른쪽 → 왼쪽으로 흐름 */}
        <div className="intro3__col">
          {[0, 1].map(set => [...back, ...back, ...back].map((t, i) => (
            <div key={`${set}-${i}`} className="intro3__line"><span>{t}　{t}　{t}</span></div>
          )))}
        </div>
      </div>
      <h1 className="intro3__title">{plain(site.hero.lines)}</h1>
      <p className="intro3__kicker">{extras.kicker}</p>
    </section>
    </div>
  );
}

/** 스크롤에 따라 세로 띠(slit)가 엇갈리며 맞춰지는 미디어 */
/**
 * base: 항상 남겨둘 기본 어긋남(px). 카드는 기본으로 slit 상태를 유지.
 * 부모 .card 가 hover(.is-hovered) 되면 0.3초에 걸쳐 정상(정렬)으로, 벗어나면 0.3초에 걸쳐 원래대로.
 */
/**
 * calm: 화면 가운데 이 비율(예: 0.3 = 30%) 안에 이미지 중심이 있으면 완전히 정렬.
 *       그 바깥으로 갈수록 천천히 갈라짐 (끝에 가까울수록 최대).
 */
export function SlitMedia({ src, video, strips = 12, base = 0, wave = false, calm = 0, className = "" }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false); // 영상을 못 불러오면 placeholder로
  const useVideo = video && !failed;
  useVideoTimeout(ref, video, setFailed);
  useEffect(() => {
    const el = ref.current;
    const items = [...el.querySelectorAll(".slit__s")];
    let k = 1;                       // 1 = 어긋남, 0 = 정렬
    let last = performance.now();
    return onFrame(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = el.closest(".is-hovered") ? 0 : 1;
      const step = dt / 0.3;         // 0.3초 동안 0↔1
      k = target < k ? Math.max(target, k - step) : Math.min(target, k + step);
      const e = k * k * (3 - 2 * k); // 부드럽게(smoothstep)

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      // 화면 가운데 올수록 정렬, 멀수록 어긋남 (+ base 만큼은 항상 어긋남)
      const d = (r.top + r.height / 2 - vh / 2) / vh;
      // wave: 마우스가 위에 있으면 커서 주변 띠가 물결처럼 출렁임
      const inside = wave && mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
      el._w = (el._w || 0) + ((inside ? 1 : 0) - (el._w || 0)) * 0.1;
      const sw = r.width / items.length;
      items.forEach((s, i) => {
        const dir = i % 2 ? 1 : -1;
        let amt;
        if (calm > 0) {
          // 가운데 calm 구간은 0, 바깥 구간은 0→1로 부드럽게(smoothstep) 증가
          const half = calm / 2;
          const far = Math.min(1, Math.max(0, (Math.abs(d) - half) / (0.65 - half)));
          const ease = far * far * (3 - 2 * far);
          amt = dir * Math.sign(d) * ease * (70 + (i % 3) * 35) * e;
        } else {
          amt = dir * (base * (1 + (i % 3) * 0.5) + d * (60 + (i % 3) * 30)) * e;
        }
        if (el._w > 0.01) {
          const dx = (r.left + sw * (i + 0.5) - mouse.x) / sw;
          amt += Math.sin(dx * 0.9 + now / 260) * 26 * Math.exp(-(dx * dx) / 8) * el._w;
        }
        s._y = s._y === undefined ? amt : s._y + (amt - s._y) * (calm > 0 ? 0.08 : 1); // calm 모드는 천천히 따라감
        s.style.transform = `translate3d(0, ${s._y.toFixed(2)}px, 0)`;
      });
    });
  }, [strips, base, calm]);
  return (
    <div className={`slit ${className}`} ref={ref} style={{ "--n": strips }}>
      {Array.from({ length: strips }, (_, i) => (
        <div className="slit__s" key={i} style={{ "--i": i }}>
          <div className="slit__inner">
            {useVideo
              ? <video src={video} autoPlay muted loop playsInline onError={() => setFailed(true)} />
              : <div className="slit__img" style={src ? { backgroundImage: `url("${src}")` } : undefined} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * 캔버스 슬릿 — 영상 1개만 재생하고, 매 프레임 캔버스 1장에 n조각으로 잘라 어긋나게 그림.
 * (띠마다 <video>를 두는 방식보다 디코딩·메모리 부하가 1/n 수준)
 * - 영상이 없거나 5초 안에 안 뜨면 src 이미지로 대체
 * - 화면 밖에선 그리기 중단 + 영상 일시정지
 * - wave: 마우스를 올리면 커서 주변 띠가 물결처럼 출렁임
 */
export function SlitCanvas({ video, src, strips = 12, wave = false, className = "" }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const [failed, setFailed] = useState(false);
  const useVideo = video && !failed;
  useVideoTimeout(wrap, video, setFailed);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const vid = el.querySelector("video");
    const img = new Image();
    if (src) img.src = src;

    // 캔버스 해상도 = 표시 크기 × 기기 배율(최대 2)
    let W = 0, H = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.round(el.clientWidth * dpr); H = Math.round(el.clientHeight * dpr);
      cv.width = W; cv.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // 화면에 보일 때만 영상 재생
    const io = new IntersectionObserver(([e]) => {
      if (!vid) return;
      if (e.isIntersecting) vid.play().catch(() => {}); else vid.pause();
    }, { threshold: 0 });
    io.observe(el);

    const offs = new Array(strips).fill(0);
    let waveAmt = 0;
    const stop = onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -50 || r.top > vh + 50 || !W) return;

      // 그릴 소스: 재생 가능한 영상 → 아니면 이미지
      const source = vid && vid.readyState >= 2 ? vid : (img.complete && img.naturalWidth ? img : null);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      if (!source) return;
      const sw = source.videoWidth || source.naturalWidth;
      const sh = source.videoHeight || source.naturalHeight;
      if (!sw || !sh) return;

      // object-fit: cover 계산
      const scale = Math.max(W / sw, H / sh);
      const viewW = W / scale, viewH = H / scale;
      const ox = (sw - viewW) / 2, oy = (sh - viewH) / 2;

      // 띠별 어긋남 (화면 가운데 올수록 정렬) + 마우스 물결
      const now = performance.now();
      const dpr = W / Math.max(1, r.width);
      const d = (r.top + r.height / 2 - vh / 2) / vh;
      const inside = wave && mouse.x >= r.left && mouse.x <= r.right && mouse.y >= r.top && mouse.y <= r.bottom;
      waveAmt += ((inside ? 1 : 0) - waveAmt) * 0.1;
      const stripW = W / strips;
      for (let i = 0; i < strips; i++) {
        const dir = i % 2 ? 1 : -1;
        let y = dir * d * (60 + (i % 3) * 30);
        if (waveAmt > 0.01) {
          const dx = (r.left + (r.width / strips) * (i + 0.5) - mouse.x) / (r.width / strips);
          y += Math.sin(dx * 0.9 + now / 260) * 26 * Math.exp(-(dx * dx) / 8) * waveAmt;
        }
        offs[i] += (y - offs[i]) * 0.2;
        const dx = i * stripW;
        ctx.drawImage(source, ox + dx / scale, oy, stripW / scale, viewH, Math.floor(dx), offs[i] * dpr, Math.ceil(stripW) + 1, H);
      }
    });
    return () => { stop(); ro.disconnect(); io.disconnect(); };
  }, [video, src, strips, wave, useVideo]);

  return (
    <div className={`slit-canvas ${className}`} ref={wrap}>
      {useVideo && (
        <video className="slit-canvas__src" src={video} muted loop playsInline autoPlay preload="auto"
          onError={() => setFailed(true)} aria-hidden="true" />
      )}
      <canvas ref={canvas} />
    </div>
  );
}

export function Showreel3({ showreel }) {
  return (
    <section className="showreel3">
      <SlitCanvas video={showreel.video} src={photo("monoform-reel", 1920, 960)} wave />
      <div className="showreel3__cap"><span>{showreel.left.join(" ")}</span><span>{showreel.right}</span></div>
    </section>
  );
}

/** 글자 굵기가 스크롤 위치에 따라 물결처럼 바뀌는 제목 (가변 폰트) */
export function MorphTitle({ text, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const chars = [...el.querySelectorAll(".morph__c")];
    return onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // 스크롤 위치에만 반응 (스크롤하지 않으면 멈춰 있음)
      const t = (r.top / vh) * 6;
      chars.forEach((c, i) => {
        const w = 500 + 400 * Math.sin(t + i * 0.55);
        c.style.fontVariationSettings = `"wght" ${Math.round(w)}`;
      });
    });
  }, [text]);
  return (
    <h2 className={`morph ${className}`} ref={ref} aria-label={text}>
      {/* 단어 단위로 묶어 줄바꿈이 단어 중간에서 일어나지 않게 */}
      {text.split(" ").map((w, k, arr) => (
        <span className="morph__w" key={k} aria-hidden="true">
          {[...w].map((c, i) => <span className="morph__c" key={i}>{c}</span>)}
          {k < arr.length - 1 && <span className="morph__c">{"\u00a0"}</span>}
        </span>
      ))}
    </h2>
  );
}

export function SectionBar3({ label, count, href }) {
  return (
    <div className="bar3">
      <span className="bar3__label">{label}</span>
      {count != null && <span className="bar3__count">({String(count).padStart(2, "0")})</span>}
      {href && <Link className="pill3" href={href}><span>View all</span><Arrow /></Link>}
    </div>
  );
}
