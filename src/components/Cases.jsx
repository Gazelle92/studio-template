import { useEffect, useRef } from "react";
import { Arrow, CursorImage, Link, Scramble, placeholder } from "./primitives";
import { registerHover } from "../lib/pointer";
import { killScramble, scrambleRe, scrambleReveal } from "../lib/scramble";

/**
 * 케이스 행 — 원본 동작:
 *  enter: 번호·작은 제목 숨김 → 큰 세리프 타이틀 표시 + reveal 스크램블,
 *         분야 텍스트 0.5초 페이드인, 수상/범위 텍스트 재스크램블,
 *         커서 숨김 + 이미지가 마우스에 정확히 붙어 따라옴
 *  leave: 모든 스크램블 즉시 중단·원복, 즉시 원래 상태로
 */
function CaseRow({ item, cursor }) {
  const row = useRef(null);
  const big = useRef(null);
  const img = item.image || placeholder(item.colors, item.title);

  useEffect(() => registerHover(
    row.current,
    el => {
      el.classList.add("is-hovered");
      el.style.cursor = "none";
      cursor.current?.show(img, el);
      big.current.style.display = "block";
      big.current.style.visibility = "hidden";
      requestAnimationFrame(() => {
        big.current.style.visibility = "";
        scrambleReveal(big.current);
        el.querySelectorAll("[data-re]").forEach(scrambleRe);
      });
    },
    el => {
      el.classList.remove("is-hovered");
      el.style.cursor = "";
      cursor.current?.hide(el);
      [big.current, ...el.querySelectorAll("[data-re]")].forEach(killScramble);
      big.current.style.display = "";
    }
  ), [img, cursor]);

  return (
    <Link ref={row} className="case" href={item.href}>
      <div className="case__no">{item.no}</div>
      <div className="case__big" ref={big} data-original-text={item.title}>{item.title}</div>
      <div className="case__title-sm">{item.title}</div>
      <Scramble className="case__type" as="div" text={item.type} re />
      <Scramble className="case__rec-label" as="div" text="Notable recognitions" re />
      <div className="case__list rec">{item.recognitions.map(r => <Scramble key={r} text={r} re />)}</div>
      <div className="case__scope-label">Project scope</div>
      <div className="case__list scope">{item.scope.map(r => <Scramble key={r} text={r} re />)}</div>
      <span className="case__sep" aria-hidden="true" />
    </Link>
  );
}

export default function Cases({ cases }) {
  const cursor = useRef(null);
  return (
    <section className="cases" id="cases">
      <div className="grid">
        <h2 className="section-title">{cases.title}</h2>
        <div className="case-list">
          {/* 원본: 행(300) + 간격 20 + 구분선 1px + 간격 20
              → 간격과 구분선을 <a> 안(padding + 선)으로 넣어 행 사이 빈틈이 없게 (hover 이미지 끊김 방지) */}
          {cases.items.map(it => <CaseRow key={it.no} item={it} cursor={cursor} />)}
          <Link className="case-archive" id="archive" href={cases.archive.href}>
          <span>{cases.archive.label}</span>
            <Arrow />
          </Link>
        </div>
      </div>
      <CursorImage ref={cursor} />
    </section>
  );
}
