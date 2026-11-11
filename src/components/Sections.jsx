import { useEffect, useRef, useState } from "react";
import FitText from "./FitText";
import { Arrow, CursorImage, Link, Scramble, badge } from "./primitives";
import { registerHover } from "../lib/pointer";

export function Hero({ site }) {
  const { hero, brand } = site;
  const col = (rows, cls) => (
    <div className={`hero__sub-col ${cls}`}>
      {rows.map((words, i) => (
        <div className="hero__sub-row" key={i}>
          {words.map((w, k) => <Scramble key={k} text={w} viewport />)}
        </div>
      ))}
    </div>
  );
  return (
    <section className="hero">
      <div className="hero__label"><Scramble text={brand.label} viewport /></div>
      <h1 className="hero__title"><FitText lines={hero.lines} reveal={hero.reveal || false} pitch={0.052} /></h1>
      <div className="hero__sub grid-12">
        {col(hero.sub.left, "a")}
        {col(hero.sub.right, "b")}
      </div>
    </section>
  );
}

/**
 * 쇼릴 영상 — 자동재생·무음·반복.
 * React는 muted를 HTML 속성으로 넣지 않아서 브라우저가 자동재생을 막는 경우가 있음
 * → ref로 muted를 직접 켜고 play() 호출. 불러오기 실패 시 placeholder 유지 + 콘솔 안내.
 */
function ShowreelVideo({ src, poster }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.play().catch(() => {});
  }, [src]);
  if (failed) return <div className="showreel__ph" />;
  return (
    <video
      ref={ref} src={src} poster={poster || undefined}
      autoPlay muted loop playsInline preload="auto"
      onClick={e => { const v = e.currentTarget; v.paused ? v.play() : v.pause(); }}  // 원본: 클릭 시 재생/일시정지
      onError={() => {
        console.warn(`[showreel] 영상을 불러오지 못했어요: ${src}\n` +
          "주소가 맞는지, 그 서버가 다른 사이트에서의 재생을 막고 있지 않은지 확인하세요. " +
          "public 폴더에 파일을 넣고 \"/파일명.mp4\"로 지정하는 방법이 가장 확실해요.");
        setFailed(true);
      }}
    />
  );
}

export function Showreel({ showreel: s }) {
  return (
    <section className="showreel">
      <div className="grid">
        <div className="showreel__media">
          {s.video ? <ShowreelVideo src={s.video} poster={s.poster} /> : <div className="showreel__ph" />}
        </div>
        <div className="showreel__cap">
          <div>{s.left.map(t => <span key={t}>{t}</span>)}</div>
          <div>{s.right}</div>
        </div>
      </div>
    </section>
  );
}

export function Statement({ lines }) {
  return <section className="statement"><FitText lines={lines} pitch={0.0549} /></section>;
}

/** 수상 행 — 원본: hover 시 200×200 로고가 커서를 따라옴 (스크램블 없음) */
function RecRow({ item, cursor }) {
  const ref = useRef(null);
  const img = item.image || badge(item.name);
  useEffect(() => registerHover(
    ref.current,
    el => { el.style.cursor = "none"; cursor.current?.show(img, el); },
    el => { el.style.cursor = ""; cursor.current?.hide(el); }
  ), [img, cursor]);
  return (
    <div className="rec-row" ref={ref}>
      <span className="text">{item.name}</span>
      <span className="rec-row__detail">{item.detail.map((d, i) => <span key={i}>{d}</span>)}</span>
    </div>
  );
}

export function Recognitions({ data }) {
  const cursor = useRef(null);
  return (
    <section className="recognitions">
      <div className="grid">
        <div className="label">{data.label}</div>
        <div className="rec-list">
          {data.items.map((i, k) => <RecRow key={k} item={i} cursor={cursor} />)}
        </div>
      </div>
      <CursorImage ref={cursor} className="award" />
    </section>
  );
}

export function AboutTeaser({ about }) {
  return (
    <section className="about-teaser" id="about">
      <div className="grid">
        <Link className="about-link" href={about.href}><span className="text">{about.label}</span><Arrow /></Link>
      </div>
    </section>
  );
}

/** 무한 마키 — 원본과 동일: px/sec 기준 속도, 화면 밖이면 일시정지 */
function Marquee({ items, speed }) {
  const ref = useRef(null);
  useEffect(() => {
    const wrap = ref.current;
    const lists = [...wrap.querySelectorAll(".marquee__list")];
    const pps = () => {
      const w = window.innerWidth;
      return w <= 480 ? speed.mobile : w <= 768 ? speed.mobileLandscape ?? speed.mobile : w <= 1024 ? speed.tablet : speed.desktop;
    };
    const apply = () => lists.forEach(l => { l.style.animationDuration = `${l.offsetWidth / pps()}s`; });
    apply();
    document.fonts?.ready.then(apply);
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(apply, 250); };
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(([e]) =>
      lists.forEach(l => { l.style.animationPlayState = e.isIntersecting ? "running" : "paused"; }),
      { threshold: 0.01 });
    io.observe(wrap);
    return () => { window.removeEventListener("resize", onResize); io.disconnect(); clearTimeout(t); };
  }, [speed]);
  const list = items.map((m, i) => <span key={i} className={`marquee__item ${m.style}`}>{m.text}</span>);
  return (
    <div className="marquee" ref={ref}>
      <div className="marquee__list">{list}</div>
      <div className="marquee__list" aria-hidden="true">{list}</div>
    </div>
  );
}

export function Footer({ site }) {
  const f = site.footer;
  const links = arr => arr.map(l => <Link key={l.label} href={l.href}>{l.label}</Link>);
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-top">
        <div>{links(f.social)}</div>
        <div className="right">
          <span>{f.locations}</span>
          <Link href={f.privacy.href}>{f.privacy.label}</Link>
        </div>
      </div>
      <div className="footer-main grid">
        <div className="brand">{site.brand.name.toUpperCase()}</div>
        <div className="navA">{links(f.navA)}</div>
        <div className="navB">{links(f.navB)}</div>
        <Link className="cta text" href={f.cta.href}><span>{f.cta.label.toUpperCase()}</span><Arrow /></Link>
        <p className="blurb l">{f.blurbLeft}</p>
        <p className="blurb r">{f.blurbRight}</p>
      </div>
      <Marquee items={f.marquee} speed={f.marqueeSpeed} />
    </footer>
  );
}
