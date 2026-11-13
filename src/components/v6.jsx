/* ==========================================================================
   6안 전용 컴포넌트 — 템플릿 판매 홈
   Templates6 : 템플릿 목록. 호버하면 실제 사이트 미리보기가 커서를 따라오고,
                누르면 화면 전체에 직접 조작 가능한 데모가 열림
   Process6   : 4단계 진행 과정. 화면에 고정된 채 스크롤하면 가로로 넘어감
   Pricing6   : 3단계 플랜 카드
   Faq6       : 눌러서 펼치는 질문 목록
   StickyCta6 : 첫 화면을 지나면 아래에 따라다니는 상담 버튼
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import { Arrow, Link } from "./primitives";
import { mouse, onFrame } from "../lib/pointer";
import { getLenis, scrollToHash } from "../lib/scroll";
import { SectionHead4 } from "./v4";

const FINE = typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const demoUrl = v => `${window.location.pathname}?v=${v}&embed=1`;

/* ---------------- 템플릿 목록 + 미리보기 + 데모 ---------------- */
export function Templates6({ data, onOpen }) {
  const list = useRef(null);
  const box = useRef(null);
  const frame = useRef(null);
  const [hover, setHover] = useState(null);

  // 미리보기 상자: 커서를 따라옴 (5안 커서보다 살짝 느리게 → 무게감)
  useEffect(() => {
    if (!FINE) return;
    const p = { x: -999, y: -999 };
    return onFrame(() => {
      const el = box.current;
      if (!el) return;
      const hit = mouse.x < 0 ? null : document.elementFromPoint(mouse.x, mouse.y)?.closest(".tpl6");
      const idx = hit && list.current.contains(hit) ? Number(hit.dataset.i) : null;
      setHover(h => (h === idx ? h : idx));
      if (p.x < -900) { p.x = mouse.x; p.y = mouse.y; }
      p.x += (mouse.x - p.x) * 0.18;
      p.y += (mouse.y - p.y) * 0.18;
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    });
  }, []);

  const cur = hover == null ? null : data.items[hover];
  // 같은 템플릿이면 다시 불러오지 않음
  useEffect(() => {
    if (!cur || !frame.current) return;
    const url = demoUrl(cur.v);
    if (frame.current.dataset.src !== url) {
      frame.current.dataset.src = url;
      frame.current.classList.remove("is-ready");
      frame.current.src = url;
    }
  }, [cur]);

  return (
    <section className="tpl6-sec" id="templates">
      <SectionHead4 title={data.title} no={1} />
      <div className="tpl6-list" ref={list}>
        {data.items.map((t, i) => (
          <button type="button" key={t.v} className={`tpl6${hover === i ? " is-on" : ""}`} data-i={i} onClick={() => onOpen(t)}>
            <span className="tpl6__no">{t.no}</span>
            <span className="tpl6__name">{t.name}</span>
            <span className="tpl6__mood">{t.mood}</span>
            <span className="tpl6__fit">{t.fit}</span>
            <span className="tpl6__go"><span>Live demo</span><Arrow /></span>
          </button>
        ))}
      </div>
      <p className="tpl6__note">{data.note}</p>
      {FINE && (
        <div className={`tpl6-preview${cur ? " is-on" : ""}`} ref={box} aria-hidden="true">
          <iframe ref={frame} title="preview" tabIndex={-1} onLoad={e => e.currentTarget.classList.add("is-ready")} />
          <span className="tpl6-preview__label">{cur ? `${cur.name} — ${cur.mood}` : ""}</span>
        </div>
      )}
    </section>
  );
}

/** 화면 전체 데모: 실제 템플릿을 그대로 띄워 직접 스크롤해 볼 수 있음 */
export function Demo6({ item, onClose, ctaHref }) {
  useEffect(() => {
    if (!item) return;
    const l = getLenis();
    l?.stop();
    document.documentElement.classList.add("demo6-open");
    const key = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => { l?.start(); document.documentElement.classList.remove("demo6-open"); window.removeEventListener("keydown", key); };
  }, [item, onClose]);
  if (!item) return null;
  return (
    <div className="demo6" role="dialog" aria-modal="true" aria-label={`${item.name} 데모`}>
      <div className="demo6__bar">
        <span className="demo6__name"><b>{item.name}</b> — {item.mood} · {item.fit}</span>
        <span className="demo6__right">
          <button type="button" className="pill4" onClick={() => { onClose(); setTimeout(() => scrollToHash(ctaHref), 60); }}>
            <span>이 템플릿으로 상담하기</span><Arrow />
          </button>
          <button type="button" className="demo6__close" onClick={onClose} aria-label="닫기">Close</button>
        </span>
      </div>
      <iframe className="demo6__frame" src={demoUrl(item.v)} title={`${item.name} 데모`} />
    </div>
  );
}

/* ---------------- 진행 과정: 왼쪽 제목 고정 + 오른쪽 단계 스크롤 ---------------- */
/** 단계별 설명 그림 (이미지 대신 실제 과정을 보여주는 작은 화면) */
const INDUSTRIES = [
  ["카페", "성수"], ["사진 스튜디오", "연남"], ["치과", "강남"],
  ["법률사무소", "서초"], ["뷰티 살롱", "한남"], ["패션 브랜드", "압구정"],
];

function StepVisual({ kind, images = [], brands = [], demos = [] }) {
  if (kind === "brands") return (
    <div className="sv sv--brands">
      {brands.map((b, i) => <span key={b} className={i % 5 === 0 ? "is-big" : ""} style={{ "--i": i }}>{b}</span>)}
    </div>
  );
  if (kind === "team") return (
    <div className="sv sv--team">
      {[["UX", "Strategy · IA", "ux"], ["UI", "Layout · System", "ui"], ["GUI", "Visual · Motion", "gui"], ["DEV", "Front · Back-end", "dev"]].map(([t, d, k], i) => (
        <div key={t} className={`sv-disc sv-disc--${k}`} style={{ "--i": i }}>
          <span className="sv-disc__ico" aria-hidden="true"><i /><i /><i /></span>
          <b>{t}</b><span>{d}</span>
        </div>
      ))}
      <div className="sv-team__line" />
    </div>
  );
  if (kind === "demos") return (
    <div className="sv sv--demos">
      {demos.map((d, i) => (
        <div key={d} className="sv-demo" style={{ "--i": i }}>
          <i className="sv-demo__dot" /><b>{d}</b><span>Live demo</span><em>→</em>
        </div>
      ))}
    </div>
  );
  if (kind === "oneper") return (
    <div className="sv sv--oneper">
      {INDUSTRIES.map(([biz, area], i) => (
        <div key={biz} className={`sv-ind${i === 4 ? " is-yours" : ""}`}>
          <span className="sv-ind__biz">{biz}</span>
          <span className="sv-ind__area">{area}</span>
          <span className="sv-ind__tpl">{i === 4 ? "Your brand only" : ["Signal", "Subtle", "Bold", "Möbius", "", "Mono"][i]}</span>
        </div>
      ))}
    </div>
  );
  if (kind === "years") return (
    <div className="sv sv--years">
      {images.map((im, i) => (
        <figure key={im.label} className="sv-yr" style={{ "--i": i }}>
          <img src={im.src} alt="" />
          <figcaption>{im.label}</figcaption>
        </figure>
      ))}
      <span className="sv-yr__since">Since 2012</span>
    </div>
  );
  if (kind === "mosaic") return (
    <div className="sv sv--mosaic">
      {images.map((im, i) => <img key={im.src} src={im.src} alt="" style={{ "--i": i }} />)}
    </div>
  );
  if (kind === "choose") return (
    <div className="sv sv--choose">
      {["Signal", "Subtle", "Bold", "Möbius", "Mono", "Soon"].map((n, i) => (
        <div key={n} className={`sv-tpl${i === 3 ? " is-pick" : ""}${n === "Soon" ? " is-soon" : ""}`}>
          <i /><i /><i />
          <span>{n}</span>
        </div>
      ))}
      <div className="sv-cursor" />
    </div>
  );
  if (kind === "send") return (
    <div className="sv sv--send">
      <div className="sv-form">
        <div className="sv-form__head">자료 전달 신청서</div>
        {["로고 파일", "소개 문구", "대표 이미지 6장", "연락처 · 주소", "도메인 정보"].map((t, i) => (
          <div className="sv-check" key={t} style={{ "--d": `${i * 0.12}s` }}><b /> {t}</div>
        ))}
      </div>
      <div className="sv-files">
        <span>logo.svg</span><span>about.txt</span><span>photo_01.jpg</span>
      </div>
    </div>
  );
  if (kind === "build") return (
    <div className="sv sv--build">
      <div className="sv-swatch">
        {["#111111", "#f3efe8", "#c8553d", "#2f4858"].map(c => <i key={c} style={{ background: c }}><em>{c}</em></i>)}
      </div>
      <div className="sv-type"><b>Aa</b><span>Inter Tight<br />Noto Sans KR</span></div>
      <div className="sv-curve">
        <svg viewBox="0 0 120 60" aria-hidden="true"><path d="M2 58 C 40 58, 30 2, 118 2" /></svg>
        <span>Motion · ease-out</span>
      </div>
      <div className="sv-devices"><i className="d-pc" /><i className="d-tab" /><i className="d-mo" /></div>
    </div>
  );
  return (
    <div className="sv sv--launch">
      <div className="sv-browser">
        <div className="sv-browser__bar"><i /><i /><i /><span>🔒 yourbrand.com</span></div>
        <div className="sv-browser__body">
          <b>Your Brand®</b>
          <p />
          <p className="short" />
        </div>
      </div>
      <div className="sv-live"><i /> Live</div>
    </div>
  );
}

export function Process6({ data, no = 4 }) { return <SplitSteps6 id="process" no={no} data={data} />; }
export function Why6({ data, no = 3 }) { return <SplitSteps6 id="why" no={no} data={data} />; }

function SplitSteps6({ id, no, data }) {
  const ref = useRef(null);
  const bar = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const panels = [...el.querySelectorAll(".step6")];
    const marks = [...el.querySelectorAll(".proc6__nav li")];
    let active = -1;
    return onFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      // 진행 막대: 섹션 전체 스크롤 비율
      const p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / Math.max(1, r.height)));
      bar.current.style.transform = `scaleY(${p.toFixed(3)})`;
      // 화면 가운데에 가장 가까운 단계 = 현재 단계 (React 상태 대신 data 속성 → 등장 효과 클래스 보존)
      let idx = 0, best = Infinity;
      panels.forEach((pn, i) => {
        const b = pn.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - vh / 2);
        if (d < best) { best = d; idx = i; }
      });
      if (idx !== active) {
        active = idx;
        marks.forEach((m, i) => { m.dataset.on = String(i === idx); m.dataset.done = String(i < idx); });
        panels.forEach((pn, i) => { pn.dataset.on = String(i === idx); });
      }
    });
  }, []);
  return (
    <section className={`proc6 proc6--${id}`} id={id} ref={ref}>
      <div className="proc6__left">
        <div className="proc6__sticky">
          <SectionHead4 title={data.title} no={no} />
          <p className="proc6__lead">{data.lead}</p>
          <ol className="proc6__nav">
            {data.steps.map(s => (
              <li key={s.no}><span className="proc6__nav-no">{s.no}</span><span className="proc6__nav-t">{s.title}</span><span className="proc6__nav-ko">{s.ko}</span></li>
            ))}
          </ol>
          <div className="proc6__progress"><i ref={bar} /></div>
        </div>
      </div>
      <div className="proc6__right">
        {data.steps.map(s => (
          <article className="step6" key={s.no}>
            <div className="step6__visual"><StepVisual kind={s.visual} images={s.images} brands={s.brands} demos={s.demos} /></div>
            <div className="step6__body">
              <div className="step6__head">
                <span className="step6__no">{s.no}</span>
                <h3 className="step6__title">{s.title}</h3>
                <span className="step6__ko">{s.ko}</span>
              </div>
              <p className="step6__text">{s.text}</p>
              <ul className="step6__points">{s.points.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 가격 ---------------- */
export function Pricing6({ data, ctaHref, no = 5 }) {
  return (
    <section className="price6-sec" id="pricing">
      <SectionHead4 title={data.title} no={no} />
      <div className="price6-grid">
        {data.plans.map(p => (
          <article className={`price6${p.featured ? " is-featured" : ""}`} key={p.name}>
            <div className="price6__top">
              <h3 className="price6__name">{p.name}</h3>
              <span className="price6__ko">{p.ko}</span>
            </div>
            <p className="price6__desc">{p.desc}</p>
            <ul className="price6__items">{p.items.map(t => <li key={t}>{t}</li>)}</ul>
            <Link className="pill4 price6__cta" href={ctaHref}><span>상담하기</span><Arrow /></Link>
          </article>
        ))}
      </div>
      <p className="price6__note">{data.note}</p>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq6({ data, no }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq6-sec" id="faq">
      <SectionHead4 title={data.title} no={no} />
      <div className="faq6-list">
        {data.items.map((it, i) => (
          <div className="faq6" data-open={open === i} key={it.q}>
            <button type="button" className="faq6__q" aria-expanded={open === i} onClick={() => setOpen(o => (o === i ? -1 : i))}>
              <span className="faq6__qt">{it.q}</span>
              <span className="faq6__icon" aria-hidden="true" />
            </button>
            <div className="faq6__a"><div><p>{it.a}</p></div></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 첫 화면을 지나면 따라다니는 상담 버튼 ---------------- */
export function StickyCta6({ cta }) {
  const ref = useRef(null);
  useEffect(() => onFrame(() => {
    const el = ref.current;
    if (!el) return;
    const past = window.scrollY > window.innerHeight * 0.8;
    const foot = document.querySelector(".site-footer")?.getBoundingClientRect().top ?? 1e9;
    el.classList.toggle("is-on", past && foot > window.innerHeight * 0.9);
  }), []);
  return (
    <Link className="pill4 sticky6" href={cta.href} ref={ref}><span>{cta.label}</span><Arrow /></Link>
  );
}
