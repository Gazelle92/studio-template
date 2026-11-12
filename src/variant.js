/* ==========================================================================
   시안(Variant) 전환
   - 주소 뒤에 ?v=1 / ?v=2 / ?v=3 을 붙이거나, 화면 왼쪽 아래 버튼으로 전환
   - 마지막으로 본 시안을 기억 (localStorage)
   ========================================================================== */
export const VARIANTS = [
  { id: "1", name: "1안", desc: "Original" },
  { id: "2", name: "2안", desc: "Subtle" },
  { id: "3", name: "3안", desc: "Bold" },
];

const valid = id => VARIANTS.some(v => v.id === id);

export function getVariant() {
  if (typeof window === "undefined") return "1";
  const q = new URLSearchParams(window.location.search).get("v");
  if (valid(q)) return q;
  try {
    const saved = localStorage.getItem("variant");
    if (valid(saved)) return saved;
  } catch { /* 저장소 사용 불가 */ }
  return "1";
}

/** 시안을 바꾸면 새로고침해서 스크롤·애니메이션 상태를 깨끗하게 초기화 */
export function setVariant(id) {
  try { localStorage.setItem("variant", id); } catch { /* 무시 */ }
  const url = new URL(window.location.href);
  url.searchParams.set("v", id);
  url.hash = "";
  window.location.href = url.toString();
}
