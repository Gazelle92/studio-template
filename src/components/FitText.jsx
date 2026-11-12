import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Globe } from "./primitives";

/**
 * 양끝 정렬 대형 텍스트.
 * 문법: *bold* → Grotesk Bold, {dot} {line} {globe} 토큰. 배열 1요소 = 1줄.
 * 가장 긴 줄이 컨테이너 너비에 꼭 맞도록 font-size 자동 계산.
 * reveal: false(원본과 동일, 애니메이션 없음) | "load" | "scroll"
 * pitch: 줄 간격 = 컨테이너 너비 × pitch (원본 SVG 비율: 헤드라인 0.052, 스테이트먼트 0.0549)
 */
function parseLine(line, counter) {
  let bold = false;
  return line.split(/\s+/).filter(Boolean).map((raw, k) => {
    if (raw === "{dot}") return <i key={k} className="tok-dot" />;
    if (raw === "{line}") return <i key={k} className="tok-line" />;
    if (raw === "{globe}") return <i key={k} className="tok-globe"><Globe /></i>;
    let w = raw, b = bold;
    if (w.startsWith("*")) { b = bold = true; w = w.slice(1); }
    if (w.endsWith("*")) { bold = false; w = w.slice(0, -1); }
    return (
      <span key={k} className={b ? "w b" : "w"}>
        <span style={{ "--i": counter.i++ }}>{w}</span>
      </span>
    );
  });
}

export default function FitText({ lines, reveal = false, pitch = 0, className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useLayoutEffect(() => {
    const block = ref.current;
    const fit = () => {
      const rows = [...block.querySelectorAll(".fit__line")];
      const avail = block.clientWidth;
      if (!avail) return;
      block.style.fontSize = "100px";
      let max = 0;
      rows.forEach(l => {
        // 내용 실제 폭을 재기 위해 잠시 max-content로 (짧은 한 줄도 꽉 차게 맞추기 위함)
        l.style.justifyContent = "flex-start"; l.style.gap = ".22em"; l.style.width = "max-content";
        max = Math.max(max, l.getBoundingClientRect().width);
        l.style.justifyContent = ""; l.style.gap = ""; l.style.width = "";
      });
      if (max) block.style.fontSize = `${(100 * avail) / max}px`;
      if (pitch) block.style.lineHeight = `${pitch * avail}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(block);
    return () => ro.disconnect();
  }, [lines, pitch]);

  useEffect(() => {
    if (!reveal) return;
    const block = ref.current;
    let cancelled = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      (document.fonts?.ready || Promise.resolve()).then(() => !cancelled && setInView(true));
      io.disconnect();
    }, { threshold: 0, rootMargin: reveal === "load" ? "0px" : "0px 0px -10% 0px" });
    io.observe(block);
    return () => { cancelled = true; io.disconnect(); };
  }, [reveal]);

  const counter = { i: 0 };
  return (
    <div ref={ref} className={`fit ${reveal ? "reveal" : ""} ${inView ? "is-in" : ""} ${className}`}>
      {lines.map((l, i) => <div className="fit__line" key={i}>{parseLine(l, counter)}</div>)}
    </div>
  );
}
