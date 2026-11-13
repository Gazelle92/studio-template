/* ==========================================================================
   5안 CONTENT — 4안 디자인 그대로, 내용은 hummman.com 기준 (이름만 mono-form)
   - 홈 · About · Work · Contact 페이지에 실제로 있는 문구·고객사·작업만 사용
   - 사이트에 없는 내용(수상, 통계 문구 등)은 만들지 않음
   - 숫자 섹션은 사이트 목록을 센 값: 주요 작업 22개 · 고객사 19곳 · 서비스 8개
   - 쇼릴 영상은 content.js에 넣어둔 것을 그대로 가져와서 씀
   ========================================================================== */
import BASE from "./content";

/** WORK 페이지 썸네일 (원본 1280×720) */
const work = file => `https://images.prismic.io/hummman-pt/${file}?auto=format,compress`;

const SITE5 = {
  meta: {
    title: "mono-form — 웹사이트 제작·UX/UI 디자인 에이전시",
    description: "mono-form의 디지털 경험 디자인, 웹·앱 개발, BX 디자인 등 서비스 분야와 주요 고객사를 소개합니다.",
  },

  brand: {
    name: "mono-form",
    short: "M—F",
    label: "( mono-form )",
  },

  nav: [
    { label: "Work", href: "#cases", active: true },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Follow", href: "#", children: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Behance", href: "https://behance.net" },
    ]},
  ],

  clock: {
    timeZone: "Asia/Seoul",
    zoneLabel: "KST",
    offsetLabel: "UTC/GMT +9",
    cities: ["Seoul"],
  },

  hero: {
    lines: [
      "{dot} *Creative* Studio",
      "focused on new",
      "*Digital*",
      "eXperiences",
    ],
    reveal: false,
    sub: {
      left:  [["UX", "UI"], ["GUI", "DEV"], ["2012"]],
      right: [[], [], []],
    },
  },

  showreel: {
    ...BASE.showreel,
    left: ["UX UI GUI DEV", "2012"],
    right: "웹사이트 제작 · UX/UI 디자인 에이전시",
  },

  // WORK 페이지 'Major Works' 앞 6개 — 프로젝트 / 클라이언트 / 서비스 그대로
  cases: {
    title: "Major Works",
    labels: { rec: "Client", scope: "Service" },
    items: [
      { no: "W — 1", title: "Think Thing Thank", type: "Website", href: "#",
        recognitions: ["Think Thing Thank"],
        scope: ["UX/UI", "Front & Back-end Dev"],
        image: work("aEqOh7NJEFaPX5Cp_ttt_thumb.jpg"), colors: ["#1b1d22", "#7d8aa6"] },
      { no: "W — 2", title: "MUCL", type: "Website", href: "#",
        recognitions: ["Musicians Club"],
        scope: ["UX/UI", "Front & Back-end Dev"],
        image: work("aEqQeLNJEFaPX5EI_mucl_thumb.jpg"), colors: ["#c9c2b4", "#5b5145"] },
      { no: "W — 3", title: "Chaevi", type: "Touch Screen UI, App", href: "#",
        recognitions: ["Daeyoung Chaevi"],
        scope: ["UX/UI/GUI", "Publishing"],
        image: work("ahUug7K9tuLqEIRw_chaevi_thumb.jpg"), colors: ["#e9d6cf", "#a24f3c"] },
      { no: "W — 4", title: "Cosmax+", type: "Website", href: "#",
        recognitions: ["Cosmax"],
        scope: ["UX/UI/GUI", "Front-end Dev"],
        image: work("aEqPirNJEFaPX5DI_cosmax_thumb.jpg"), colors: ["#101010", "#c48f7b"] },
      { no: "W — 5", title: "KT MAI-WACS", type: "System UI", href: "#",
        recognitions: ["KT"],
        scope: ["UX/UI", "Front-end Dev"],
        image: work("aFF-4LNJEFaPYCE2_kt_thumb.jpg"), colors: ["#2c3b2f", "#c3d1b4"] },
      { no: "W — 6", title: "Vemontes korea", type: "E-Commerce Site", href: "#",
        recognitions: ["Vemontes korea"],
        scope: ["UX/UI", "Front & Back-end Dev"],
        image: work("hz8K7aIqLXkgau4i_vmts_thumb.jpg"), colors: ["#d7dde8", "#3a4f8c"] },
    ],
    archive: { label: "All Works — 전체 작업 보기", href: "#cases" },
  },

  // 홈 메인 문구
  statement: {
    lines: [
      "Creative Studio focused",
      "on new Digital eXperiences.",
      "UX UI GUI DEV.",
    ],
  },

  // ABOUT 'WORK WITH' 고객사 중 WORK 페이지에 실제 작업이 있는 곳 + 그 밖의 WORK 고객사
  // 오른쪽 칸 = WORK 상세 페이지의 Project / Service 그대로
  recognitions: {
    label: "Work With",
    items: [
      { name: "LG Group", detail: ["LG BCG 3.0 — Website", "UX/UI · Front & Back-end Dev"] },
      { name: "LG Display", detail: ["LGenius — Website", "UX/UI · Front & Back-end Dev"] },
      { name: "LX International", detail: ["Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Amore Pacific", detail: ["Two Slash Four — E-Commerce Site", "UI · Front & Back-end Dev"] },
      { name: "L'occitane Korea", detail: ["E-Commerce Site", "UX/UI · Design Guideline"] },
      { name: "Hurom", detail: ["Website", "UX/UI · Front-end Dev"] },
      { name: "CTK Evision", detail: ["Popin Border — Global Website", "UX/UI/GUI · Front & Back-end Dev"] },
      { name: "MH Medicare", detail: ["Narin — Branding, E-Commerce Site", "BX/BI · UX/UI · Front & Back-end Dev"] },
      { name: "정보통신산업진흥원(NIPA)", detail: ["SW 사용성(UX/UI) 개선 지원사업", "UX/UI/GUI · Prototype"] },
      { name: "기후솔루션", detail: ["SFO℃ — Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Bifido", detail: ["Website", "UX/UI/GUI · Front & Back-end Dev"] },
      { name: "Carbom", detail: ["App, Branding", "BX/BI · UX/UI/GUI · Front-end Dev"] },
      { name: "Paco", detail: ["Website", "UX/UI/GUI · Front & Back-end Dev"] },
      { name: "Haegin", detail: ["Website", "UX/UI/GUI · Front & Back-end Dev"] },
      { name: "RBK Nutraceuticals", detail: ["Website", "UX/UI/GUI · Front & Back-end Dev"] },
      { name: "A by Bom", detail: ["Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Medical Star", detail: ["Blood one — System UI", "UX/UI/GUI"] },
      { name: "URG", detail: ["025s — E-Commerce Site", "UX/UI · Front & Back-end Dev"] },
      { name: "Sazin Onsil", detail: ["Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Nostalgia", detail: ["Official Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Lee International", detail: ["Official Website", "UX/UI · Front & Back-end Dev"] },
      { name: "Minitmute", detail: ["E-Commerce Site", "UX/UI · Front & Back-end Dev"] },
      { name: "Three Finger Studio", detail: ["Website", "UX/UI · Front & Back-end Dev"] },
    ].map(it => ({ ...it, image: null })),
  },

  about: { label: "About — 회사 소개", href: "#about" },

  footer: {
    social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Behance", href: "https://behance.net" },
    ],
    locations: "서울시 용산구 한남동 644-10 광창Bldg 406",
    privacy: { label: "02-707-1619", href: "tel:027071619" },
    navA: [
      { label: "Work", href: "#cases" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    navB: [],
    cta: { label: "프로젝트 문의", href: "#contact" },
    blurbLeft: "Creative Studio focused on new Digital eXperiences — 웹사이트 제작 · UX/UI 디자인 에이전시, since 2012.",
    blurbRight: "Website · UX/UI Design · BX Design · Front/Back-end Dev. · Application · Touch Screen",
    subscribe: { placeholder: "이메일", thanks: "문의가 정상적으로 접수되었습니다." },
    marquee: [
      { style: "mark", text: "M—F" },
      { style: "serif-italic", text: "mono-form" },
      { style: "mark", text: "M—F" },
      { style: "sans", text: "MONO-FORM" },
    ],
    marqueeSpeed: BASE.footer.marqueeSpeed,
  },

  extras: {
    // ABOUT 메타 설명 + 홈 타이틀
    about4: "디지털 경험 디자인, 웹·앱 개발, BX 디자인. 웹사이트 제작 · UX/UI 디자인 에이전시.",
    // ABOUT 페이지 'DIGITAL' 서비스 목록
    servicesTitle: "Digital",
    services4: ["Strategy", "Digital Experience Design", "Web & App Dev.", "Touch Interface", "Front-end Dev.", "BX Creation", "E-Commerce", "Editorial"],
    servicesNote: "UX · UI · GUI · DEV — 디지털 경험 디자인, 웹·앱 개발, BX 디자인.",
    statsTitle: "In Numbers",
    stats4: [
      { n: 22, label: "Major Works", text: "Website · App · System UI · E-Commerce Site", cta: "Work", seed: "mf5-stat-1", href: "#cases" },
      { n: 19, label: "Work With", text: "LG Electronics · LG Display · KT · Amore Pacific & More..", cta: "About", seed: "mf5-stat-2", href: "#about" },
      { n: 8, label: "Digital", text: "디지털 경험 디자인 · 웹·앱 개발 · BX 디자인", cta: "Contact", seed: "mf5-stat-3", href: "#contact" },
    ],
  },
};

export default SITE5;
