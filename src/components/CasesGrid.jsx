import { useEffect, useRef } from "react";
import { Arrow, Link, Scramble, placeholder } from "./primitives";
import { registerHover } from "../lib/pointer";
import { SlitMedia, MorphTitle, photo } from "./v3";
import { killScramble, scrambleRe, scrambleReveal } from "../lib/scramble";

/**
 * 3안 — 케이스 스터디 카드 그리드
 * 이미지가 항상 보이고, hover 시 이미지 확대 + 제목 스크램블 + 정보 재스크램블
 */
function CaseCard({ item, slit }) {
  const ref = useRef(null);
  const title = useRef(null);
  // 이미지가 없으면 실제 사진(무료 Lorem Picsum)을 프로젝트 이름으로 고정 배정
  const img = item.image || photo(`monoform-${item.title}`);

  useEffect(() => registerHover(
    ref.current,
    el => {
      el.classList.add("is-hovered");
      scrambleReveal(title.current);
      el.querySelectorAll("[data-re]").forEach(scrambleRe);
    },
    el => {
      el.classList.remove("is-hovered");
      [title.current, ...el.querySelectorAll("[data-re]")].forEach(killScramble);
    }
  ), []);

  return (
    <Link ref={ref} className="card" href={item.href}>
      <div className="card__media">{slit ? <SlitMedia src={img} strips={6} calm={0.3} /> : <img src={img} alt="" loading="lazy" />}</div>
      <div className="card__meta">
        <span>{item.no}</span>
        <Scramble text={item.type} re />
      </div>
      <div className="card__title" ref={title} data-original-text={item.title}>{item.title}</div>
      <div className="card__scope">
        {item.scope.map(s => <Scramble key={s} text={s} re />)}
      </div>
    </Link>
  );
}

/** slit=true(3안): 카드 이미지가 세로 띠로 나뉘어 스크롤에 따라 엇갈림, 제목은 굵기가 출렁이는 MorphTitle */
export default function CasesGrid({ cases, slit = false, morph = false }) {
  return (
    <section className="cases cases--grid" id="cases">
      <div className="grid">
        {morph
          ? <div className="morph-head"><MorphTitle text={cases.title} /><span className="section-count">({String(cases.items.length).padStart(2, "0")})</span></div>
          : <h2 className="section-title">
              <span>{cases.title}</span>
              <span className="section-count">({String(cases.items.length).padStart(2, "0")})</span>
            </h2>}
        <div className="card-grid">
          {cases.items.map(it => <CaseCard key={it.no} item={it} slit={slit} />)}
        </div>
        <Link className="case-archive case-archive--wide" id="archive" href={cases.archive.href}>
          <span>{cases.archive.label}</span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
