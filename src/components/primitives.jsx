import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { SCRAMBLE_CONFIG, killScramble, scrambleViewport } from "../lib/scramble";
import { mouse, onFrame } from "../lib/pointer";
import { scrollToHash } from "../lib/scroll";

/**
 * <Scramble text="..." />
 *  - viewport: 화면에 들어올 때마다 스크램블 (원본: threshold 0.1, 100ms 지연, 매번 재생)
 *              원본에서는 시계·상단 라벨·헤드라인 아래 단어들에만 적용됨
 *  - re: 부모 hover 시 재스크램블 대상 표시 (data-re)
 */
export function Scramble({ text, as: Tag = "span", viewport = false, re = false, className, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.dataset.originalText = text;
    if (!viewport) return;
    let timer;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        clearTimeout(timer);
        timer = setTimeout(() => scrambleViewport(el), SCRAMBLE_CONFIG.scroll.delay);
      }),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); killScramble(el); };
  }, [text, viewport]);
  // key={text}: 텍스트가 바뀌면 DOM을 새로 만들어 직접 조작한 textContent와 충돌 방지
  return (
    <Tag key={text} ref={ref} className={className} data-re={re || undefined} {...rest}>
      {text}
    </Tag>
  );
}

/** 해시 링크는 Lenis로 부드럽게 스크롤 */
export const Link = forwardRef(function Link({ href = "#", onNavigate, onClick, children, ...rest }, ref) {
  const external = /^https?:/.test(href);
  return (
    <a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
      onClick={e => {
        if (href.startsWith("#") && scrollToHash(href)) { e.preventDefault(); onNavigate?.(); }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
});

export const Arrow = () => (
  <svg className="arrow" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M0 5h21M16.5.5 21 5l-4.5 4.5" />
  </svg>
);

export const Globe = () => (
  <svg className="globe" viewBox="0 0 100 100" fill="none" stroke="#777" strokeWidth="1.4">
    <circle cx="50" cy="50" r="48" />
    <path d="M2 50h96M50 2v96M8 26h84M8 74h84" />
    {[0, 1, 2, 3].map(i => (
      <ellipse key={i} cx="50" cy="50" rx="48" ry="48" style={{ animationDelay: `-${i * 1.5}s` }} />
    ))}
  </svg>
);

/**
 * 커서 이미지 — 원본과 동일: 보간(지연) 없이 마우스 좌표에 정확히 붙고, 중심 정렬.
 * ref.show(src, owner) / ref.hide(owner)
 * owner: 지금 이미지를 띄운 행. 다른 행의 hide()가 새로 들어간 행의 이미지를 끄지 않도록
 *        (아래→위로 이동할 때 위 행 enter → 아래 행 leave 순서로 처리되는 문제 방지)
 */
export const CursorImage = forwardRef(function CursorImage({ className = "" }, ref) {
  const img = useRef(null);
  const owner = useRef(null);
  useImperativeHandle(ref, () => ({
    show(src, who) {
      owner.current = who ?? true;
      if (img.current.getAttribute("src") !== src) img.current.src = src;
      img.current.style.opacity = "1";
    },
    hide(who) {
      if (who !== undefined && owner.current !== who) return; // 다른 행이 이미 가져감
      owner.current = null;
      img.current.style.opacity = "0";
    },
  }));
  useEffect(() => onFrame(() => {
    if (!owner.current) return;
    img.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
  }), []);
  return <img ref={img} className={`cursor-media ${className}`} alt="" aria-hidden="true" />;
});

/** placeholder 이미지 생성 (외부 파일 없이) */
export function placeholder(colors = ["#222", "#888"], label = "") {
  const [a, b] = colors;
  const safe = String(label).replace(/[<&>]/g, "").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="r" cx=".65" cy=".35" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="600" height="800" fill="url(#g)"/><rect width="600" height="800" fill="url(#r)"/>
    <text x="30" y="770" font-family="monospace" font-size="20" fill="#fff" fill-opacity=".7">${safe}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/** 수상 로고 placeholder (정사각형) */
export function badge(label = "") {
  const safe = String(label).replace(/[<&>]/g, "").toUpperCase();
  const size = Math.min(40, Math.floor(300 / (safe.length * 0.62)));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <circle cx="200" cy="200" r="190" fill="#000"/>
    <text x="200" y="${200 + size * 0.35}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="${size}" fill="#fff">${safe}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
