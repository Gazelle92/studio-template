import { useEffect, useRef, useState } from "react";
import { Link, Scramble } from "./primitives";
import { registerHover } from "../lib/pointer";
import { killScramble, scrambleRe } from "../lib/scramble";
import { getLenis } from "../lib/scroll";

/**
 * 내비 아이템 — 원본 동작:
 *  hover(프레임 감지) → ● 표시 + 텍스트 재스크램블, 벗어나면 즉시 원복
 *  클릭 시에도 재스크램블, 하위 메뉴(Follow)는 hover 시 바로 펼침
 */
function NavItem({ item, onNavigate }) {
  const ref = useRef(null);
  const label = useRef(null);
  useEffect(() => registerHover(
    ref.current,
    el => { el.classList.add("is-hovered"); scrambleRe(label.current.firstChild); },
    el => { el.classList.remove("is-hovered"); killScramble(label.current.firstChild); }
  ), []);
  const inner = (
    <>
      <i className="dot" />
      <span className="label" ref={label} onClick={() => scrambleRe(label.current.firstChild)}>
        <Scramble text={item.label} />
      </span>
      {item.children && (
        <span className="nav__sub">
          {item.children.map(c => <Link key={c.label} href={c.href}>{c.label}</Link>)}
        </span>
      )}
    </>
  );
  const cls = `nav__item${item.active ? " is-active" : ""}`;
  return item.children
    ? <div ref={ref} className={cls} tabIndex={0}>{inner}</div>
    : <Link ref={ref} className={cls} href={item.href} onNavigate={onNavigate}>{inner}</Link>;
}

/** 시계 — 원본처럼 페이지 상단에 놓여 스크롤과 함께 올라감 (고정 아님) */
export function Clock({ clock }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const [hh, mm] = new Intl.DateTimeFormat("en-GB", {
    timeZone: clock.timeZone, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now).split(":");
  const colonOn = now.getSeconds() % 2 === 0;
  return (
    <div className="clock-row grid">
      <div className="clock">
        <div className="clock__time">
          <span>{hh}<span className={`clock__colon${colonOn ? "" : " off"}`}>:</span>{mm}</span>
          <Scramble text={`${clock.zoneLabel} ${clock.offsetLabel}`} viewport />
        </div>
        {clock.cities.map(c => <Scramble key={c} text={c} viewport />)}
      </div>
    </div>
  );
}

export default function Header({ site }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const l = getLenis();
    open ? l?.stop() : l?.start();
  }, [open]);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="nav grid">
        <Link className="nav__brand" href="#top" onNavigate={close}>{site.brand.short}</Link>
        {site.nav.map(n => <NavItem key={n.label} item={n} onNavigate={close} />)}
        <button className="nav__toggle" type="button" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </nav>
    </header>
  );
}
