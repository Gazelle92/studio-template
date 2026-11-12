/* ==========================================================================
   2안 전용 컴포넌트 — 레퍼런스: joshgrafik.com
   큰 그로테스크 타이포, 글자 단위 등장, 스크롤로 채워지는 문장,
   상단 진행 바, 마우스 좌표 표시, 인덱스 표 형태의 케이스 목록
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { Arrow, CursorImage, Link, Scramble, placeholder } from "./primitives";
import { mouse, onFrame, registerHover } from "../lib/pointer";
import { killScramble, scrambleRe } from "../lib/scramble";

/** {dot}/{line}/{globe}/* 표시를 빼고 평문으로 */
export const plain = lines => lines.join(" ")
  .replace(/\{(dot|line|globe)\}/g, " ").replace(/\*/g, "").replace(/\s+/g, " ").trim();

/** 글자 단위로 아래에서 올라오는 텍스트 (등장 후 overflow 해제 → 글자 잘림 없음) */
export function SplitChars({ text, as: Tag = "span", className = "", delay = 0, immediate = false }) {
  const ref = useRef(null);
  const [state, setState] = useState("");
  useEffect(() => {
    const timers = [];
    const play = () => {
      timers.push(setTimeout(() => setState("is-in"), delay));
      timers.push(setTimeout(() => setState("is-in is-done"), delay + 2200));
    };
    // immediate: 첫 화면(히어로)은 바로 재생
    if (immediate) { play(); return () => timers.forEach(clearTimeout); }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      play();
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [delay, immediate]);
  let i = 0;
  return (
    <Tag ref={ref} className={`split ${state} ${className}`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span className="split__word" key={w} aria-hidden="true">
          {[...word].map((c, k) => <span className="split__char" key={k} style={{ "--i": i++ }}>{c}</span>)}
        </span>
      ))}
    </Tag>
  );
}

/** 스크롤에 따라 단어가 회색 → 진한색으로 채워지는 문장 */
export function ScrollFill({ text, as: Tag = "p", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const words = [...el.querySelectorAll(".fill__w")];
    let last = -1;
    return onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(p * words.length);
      if (n === last) return;
      last = n;
      words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
    });
  }, [text]);
  return (
    <Tag ref={ref} className={`fill ${className}`}>
      {text.split(" ").map((w, i) => <span className="fill__w" key={i}>{w} </span>)}
    </Tag>
  );
}

/** 섹션 라벨: "What we do (01)" */
export const SectionLabel = ({ text, no }) => (
  <div className="v2-label">{text} <span>({String(no).padStart(2, "0")})</span></div>
);

/** 상단 스크롤 진행 바 */
export function ProgressBar() {
  const ref = useRef(null);
  useEffect(() => onFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }), []);
  return <div className="v2-progress" ref={ref} />;
}

/** 왼쪽 아래 마우스 좌표 표시 */
export function CursorReadout() {
  const x = useRef(null), y = useRef(null);
  useEffect(() => onFrame(() => {
    x.current.textContent = `X: ${Math.max(0, Math.round(mouse.x))}PX`;
    y.current.textContent = `Y: ${Math.max(0, Math.round(mouse.y))}PX`;
  }), []);
  return <div className="v2-readout"><span ref={x}>X: 0PX</span><span ref={y}>Y: 0PX</span></div>;
}

/** 2안 히어로 */
export function Hero2({ site, extras }) {
  const text = plain(site.hero.lines);
  return (
    <section className="hero2">
      <div className="hero2__kicker">{extras.kicker}</div>
      <SplitChars as="h1" className="hero2__title" text={text} delay={150} immediate />
      <div className="hero2__aside">
        <p>{extras.services}</p>
        <Link className="hero2__cta" href={site.footer.cta.href}>
          <span>Start a project</span><Arrow />
        </Link>
      </div>
    </section>
  );
}

/** 2안 스테이트먼트 */
export function Statement2({ lines, extras }) {
  return (
    <section className="statement2 grid-12">
      <SectionLabel text={extras.statementLabel} no={1} />
      <ScrollFill className="statement2__text" text={plain(lines)} />
    </section>
  );
}

/** 2안 케이스: 큰 제목 + 인덱스 표 (hover 시 미리보기 이미지가 커서를 따라옴) */
function IndexRow({ item, i, cursor }) {
  const ref = useRef(null);
  const img = item.image || placeholder(item.colors, item.title);
  useEffect(() => registerHover(
    ref.current,
    el => {
      el.classList.add("is-hovered");
      cursor.current?.show(img, el);
      el.querySelectorAll("[data-re]").forEach(scrambleRe);
    },
    el => {
      el.classList.remove("is-hovered");
      cursor.current?.hide(el);
      el.querySelectorAll("[data-re]").forEach(killScramble);
    }
  ), [img, cursor]);
  return (
    <Link ref={ref} className="index-row" href={item.href}>
      <span className="index-row__no">{String(i + 1).padStart(2, "0")}</span>
      <span className="index-row__title">{item.title}</span>
      <Scramble className="index-row__type" text={`(${item.type})`} re />
      <Scramble className="index-row__scope" text={item.scope.join(", ")} re />
      <span className="index-row__go">↗</span>
    </Link>
  );
}

export function CasesIndex({ cases, extras }) {
  const cursor = useRef(null);
  return (
    <section className="cases2" id="cases">
      <h2 className="v2-big">
        <ScrollFill as="span" text={extras.workLabel} />
        <sup>({String(cases.items.length).padStart(2, "0")})</sup>
      </h2>
      <div className="index-table">
        <div className="index-head"><span>No.</span><span>Project</span><span>Category</span><span>Scope</span><span /></div>
        {cases.items.map((it, i) => <IndexRow key={it.no} item={it} i={i} cursor={cursor} />)}
      </div>
      <Link className="v2-more" id="archive" href={cases.archive.href}>
        <span>{cases.archive.label}</span><Arrow />
      </Link>
      <CursorImage ref={cursor} className="preview" />
    </section>
  );
}
