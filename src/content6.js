/* ==========================================================================
   6안 CONTENT — 5안 디자인 그대로, "템플릿 플랫폼 판매 + 포트폴리오" 홈
   - 포트폴리오·고객사·연락처: 5안(hummman 실제 내용) 그대로
   - 템플릿·가격·진행 과정·FAQ: 아직 정해지지 않아 [가안]으로 표시
   - 템플릿 v 값 = 실제로 움직이는 데모 (?v=번호 로 열림)
   ========================================================================== */
import SITE5 from "./content5";

/** hummman WORK 썸네일 */
const work = file => `https://images.prismic.io/hummman-pt/${file}?auto=format,compress`;

const SITE6 = {
  ...SITE5,

  meta: {
    title: "mono-form — 에이전시가 만든 유니크한 웹사이트 템플릿",
    description: "14년 차 웹 에이전시 mono-form이 설계한 유니크한 웹사이트 템플릿. 템플릿을 고르고 자료만 보내면 제작·세팅·오픈까지 진행합니다.",
  },

  nav: [
    { label: "Templates", href: "#templates", active: true },
    { label: "Work", href: "#cases" },
    { label: "Process", href: "#process" },
    { label: "Plans", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Follow", href: "#", children: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Behance", href: "https://behance.net" },
    ]},
  ],

  statement: {
    lines: [
      "No two brands are alike,",
      "so no two websites should be.",
      "Templates designed by an agency,",
      "finished with your brand.",
    ],
  },

  // 포트폴리오: 5안의 Major Works 그대로, 제목만 템플릿과 연결
  cases: { ...SITE5.cases, title: "Made by the same team" },

  recognitions: { ...SITE5.recognitions, label: "Trusted by" },

  about: { label: "About mono-form — 에이전시 소개", href: "#about" },

  footer: {
    ...SITE5.footer,
    cta: { label: "템플릿 상담하기", href: "#contact" },
    subscribe: { placeholder: "상담 받을 이메일", thanks: "문의가 정상적으로 접수되었습니다." },
  },

  extras: {
    ...SITE5.extras,
    about4: "에이전시가 만든, 하나뿐인 웹사이트 템플릿. 14년 동안 30여 개 브랜드의 사이트를 만든 팀이 설계했습니다.",
    introCtas: [
      { label: "템플릿 둘러보기", href: "#templates" },
      { label: "제작 상담", href: "#contact", ghost: true },
    ],
    statsTitle: "Why Unique",
    stats4: [
      { n: 1, label: "One per industry", text: "[가안] 한 템플릿은 같은 업종·지역에 한 곳만 판매합니다. 옆 가게와 같은 사이트가 될 일은 없습니다.", cta: "판매 정책", seed: "mf6-stat-1", href: "#faq" },
      { n: 14, label: "Years of agency craft", text: "2012년부터 LG, KT, Amore Pacific의 사이트를 만든 팀이 템플릿을 설계합니다.", cta: "Our Work", seed: "mf6-stat-2", href: "#cases" },
      { n: 30, label: "Real projects behind", text: "모든 템플릿의 구조와 인터랙션은 실제 프로젝트에서 검증한 것만 담았습니다.", cta: "Templates", seed: "mf6-stat-3", href: "#templates" },
    ],
  },

  // ---------------- 6안 전용 ----------------
  templates: {
    title: "Templates",
    note: "[가안] 줄에 마우스를 올리면 실제 화면을 미리 보고, 누르면 직접 스크롤해 볼 수 있는 데모가 열립니다.",
    items: [
      { no: "F — 01", name: "Signal", v: "1", mood: "Editorial", fit: "크리에이티브 스튜디오 · 포트폴리오" },
      { no: "F — 02", name: "Subtle", v: "2", mood: "Minimal", fit: "스타트업 · 브랜드 사이트" },
      { no: "F — 03", name: "Bold", v: "3", mood: "Kinetic", fit: "패션 · 엔터테인먼트 · 이벤트" },
      { no: "F — 04", name: "Möbius", v: "4", mood: "Gallery", fit: "라이프스타일 · 리빙 · 뷰티" },
      { no: "F — 05", name: "Mono", v: "5", mood: "Agency", fit: "기업 · B2B · 에이전시" },
    ],
  },

  // Why Unique: 왼쪽 제목 고정 + 오른쪽 그림 스크롤 (How it works와 같은 구조)
  why: {
    title: "Why Unique",
    lead: "템플릿이지만, 결과물은 하나뿐입니다. 그렇게 말할 수 있는 이유 세 가지.",
    steps: [
      { no: "01", title: "One per industry", ko: "업종별 1곳",
        text: "[가안] 한 템플릿은 같은 업종·지역에 한 곳만 판매합니다. 옆 가게와 같은 사이트가 될 일은 없습니다.",
        points: ["업종 + 지역 기준으로 판매 관리", "상담 단계에서 사용 여부 먼저 확인", "브랜드 컬러 · 글꼴 · 모션으로 한 번 더 차별화"],
        visual: "oneper" },
      { no: "14", title: "Years of agency craft", ko: "14년 에이전시",
        text: "2012년부터 LG, KT, Amore Pacific의 사이트를 만든 팀이 템플릿을 설계합니다.",
        points: ["대기업 · 브랜드 프로젝트 경험", "UX/UI · GUI · 개발까지 한 팀", "템플릿 이후 맞춤 제작으로 확장"],
        visual: "years",
        images: [
          { src: work("aE1dn7NJEFaPX9pS_lgenius_thumb.jpg"), label: "LG Display — LGenius" },
          { src: work("aFF-4LNJEFaPYCE2_kt_thumb.jpg"), label: "KT — MAI-WACS" },
          { src: work("aFtShHfc4bHWisil_24_thumb.jpg"), label: "Amore Pacific — Two Slash Four" },
          { src: work("aEqQs7NJEFaPX5EX_lx_thumb.jpg"), label: "LX International" },
        ] },
      { no: "30", title: "Real projects behind", ko: "실제 프로젝트 30개",
        text: "모든 템플릿의 구조와 인터랙션은 실제 프로젝트에서 검증한 것만 담았습니다.",
        points: ["웹사이트 · 커머스 · 앱 · 시스템 UI", "실제 운영 중인 사이트에서 검증된 구조", "반응형 · 기본 SEO 기본 적용"],
        visual: "mosaic",
        images: [
          "aEqOh7NJEFaPX5Cp_ttt_thumb.jpg", "aEqPirNJEFaPX5DI_cosmax_thumb.jpg", "ahUug7K9tuLqEIRw_chaevi_thumb.jpg",
          "aEqP3bNJEFaPX5Dg_hurom_thumb.jpg", "aEqPrLNJEFaPX5DU_loc_thumb.jpg", "aEqQBLNJEFaPX5Dq_bifido_thumb.jpg",
          "aE0bLbNJEFaPX9jE_haegin_thumb.jpg", "aEqOt7NJEFaPX5Cx_sfoc_thumb.jpg", "aFzzH3fc4bHWivNw_LG_thumb.jpg",
        ].map(f => ({ src: work(f) })) },
    ],
  },

  process: {
    title: "How it works",
    lead: "템플릿을 고르고 자료만 보내 주세요. 나머지는 14년 차 에이전시 팀이 맡습니다.",
    steps: [
      { no: "01", title: "Choose", ko: "템플릿 선택",
        text: "데모를 직접 스크롤해 보며 브랜드에 맞는 템플릿을 고릅니다. 고민되면 상담에서 업종과 목표를 듣고 어울리는 템플릿을 추천해 드립니다.",
        points: ["모든 템플릿은 실제로 움직이는 데모로 확인", "업종·분위기별 추천 상담", "같은 업종·지역에 이미 쓰인 템플릿인지 확인"],
        visual: "choose" },
      { no: "02", title: "Send", ko: "자료 전달",
        text: "로고, 소개 문구, 이미지, 연락처만 보내 주세요. 문구가 정리되지 않았거나 이미지가 부족해도 괜찮습니다. 템플릿 구조에 맞게 함께 다듬어 드립니다.",
        points: ["전용 신청서로 한 번에 전달", "문구 정리 · 이미지 보정 지원", "도메인이 없어도 준비부터 안내"],
        visual: "send" },
      { no: "03", title: "Build", ko: "제작 · 세팅",
        text: "에이전시 디자이너와 개발자가 브랜드 컬러, 글꼴, 모션까지 맞춰 템플릿을 하나뿐인 사이트로 완성합니다. 중간 시안을 보며 함께 수정합니다.",
        points: ["브랜드 컬러 · 글꼴 · 모션 반영", "PC · 태블릿 · 모바일 반응형", "중간 시안 확인 후 수정"],
        visual: "build" },
      { no: "04", title: "Launch", ko: "오픈",
        text: "도메인 연결, 검색 노출을 위한 기본 설정까지 마치고 오픈합니다. 오픈 후에도 같은 팀이 수정과 확장을 이어서 맡습니다.",
        points: ["도메인 연결 · 보안 인증서(SSL)", "검색 등록용 기본 SEO 설정", "오픈 후 수정 · 맞춤 제작으로 확장"],
        visual: "launch" },
    ],
  },

  pricing: {
    title: "Plans",
    note: "비용과 일정은 상담을 통해 브랜드에 맞게 안내해 드립니다.",
    plans: [
      { name: "Template", ko: "템플릿", desc: "고른 템플릿에 브랜드 자료를 반영해 빠르게 오픈합니다.",
        items: ["템플릿 1종 + 기본 페이지", "로고 · 컬러 · 글꼴 반영", "반응형 · 기본 SEO", "오픈 후 1개월 수정"] },
      { name: "Template+", ko: "템플릿 플러스", desc: "템플릿을 바탕으로 페이지와 인터랙션을 더합니다.", featured: true,
        items: ["Template 전부 포함", "서브페이지 3개 추가", "브랜드 맞춤 모션 1종", "오픈 후 3개월 유지보수"] },
      { name: "Custom", ko: "맞춤 제작", desc: "템플릿으로 시작해 에이전시 맞춤 제작으로 확장합니다.",
        items: ["UX 전략 · 기획", "UI/GUI 맞춤 디자인", "Front & Back-end 개발", "커머스 · 앱 · 터치스크린"] },
    ],
  },

  faq: {
    title: "FAQ",
    items: [
      { q: "템플릿이면 다른 사이트와 비슷해 보이지 않나요?", a: "[가안] 한 템플릿은 같은 업종·지역에 한 곳만 판매합니다. 여기에 브랜드 컬러·글꼴·모션을 맞춰 완성하기 때문에, 같은 템플릿이라도 결과물은 하나뿐입니다." },
      { q: "직접 만들 줄 몰라도 괜찮나요?", a: "네. 템플릿을 고르고 자료만 보내 주시면 제작·세팅·오픈은 mono-form이 진행합니다." },
      { q: "비용과 제작 기간은 어떻게 되나요?", a: "템플릿과 필요한 범위에 따라 달라서, 상담을 통해 브랜드에 맞게 안내해 드립니다." },
      { q: "나중에 맞춤 제작으로 바꿀 수 있나요?", a: "네. 같은 팀이 만들기 때문에 템플릿 사이트를 그대로 확장해 맞춤 제작으로 이어갈 수 있습니다." },
      { q: "오픈 후 수정이나 유지보수는요?", a: "[가안] 플랜별로 수정 기간이 포함되며, 이후에는 월 단위 유지보수로 이어갈 수 있습니다." },
    ],
  },

  stickyCta: { label: "템플릿 상담하기", href: "#contact" },
};

export default SITE6;
