import { VARIANTS, setVariant } from "../variant";

/** 화면 왼쪽 아래 시안 전환 버튼 (단축키: 키보드 1 / 2 / 3) */
export default function VariantSwitcher({ current }) {
  return (
    <div className="variant-switcher" role="group" aria-label="시안 전환">
      {VARIANTS.map(v => (
        <button
          key={v.id}
          type="button"
          className={v.id === current ? "is-active" : ""}
          onClick={() => v.id !== current && setVariant(v.id)}
          title={`${v.name} · ${v.desc}`}
        >
          {v.name}
        </button>
      ))}
    </div>
  );
}
