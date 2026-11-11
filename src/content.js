/* ==========================================================================
   CONTENT CONFIG — 이 파일만 수정하면 사이트 전체가 바뀝니다.
   - 헤드라인/스테이트먼트 문법:
       *굵은 산세리프*  → 별표로 감싼 단어는 Bold Grotesk, 나머지는 얇은 Serif
       {dot}            → 검은 원(●)
       {line}           → 가로 선
       {globe}          → 회전하는 지구본 아이콘
       배열의 한 요소 = 화면의 한 줄 (양끝 정렬)
   - image: null 이면 placeholder 이미지가 자동 생성됩니다.
   ========================================================================== */
const SITE = {
  meta: {
    title: "Monoform Studio • Interface & Experience Design",
    description: "Independent interface & experience design studio.",
  },

  brand: {
    name: "Monoform",           // 풀네임
    short: "M—F",               // 약어(로고/마키)
    label: "( M—F Studio )",    // 히어로 상단 라벨
  },

  nav: [
    { label: "Home", href: "#top", active: true },
    { label: "Case Studies", href: "#cases" },
    { label: "Archive", href: "#archive" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Follow", href: "#", children: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Behance", href: "https://behance.net" },
    ]},
  ],

  clock: {
    timeZone: "Asia/Seoul",     // IANA 타임존
    zoneLabel: "KST",
    offsetLabel: "UTC/GMT +9",
    cities: ["Seoul", "Busan"],
  },

  hero: {
    // ※ 레이아웃 테스트용: 원본과 줄 수·단어 수·단어별 글자 수·굵은 위치가 같은 문구
    lines: [
      "{dot} Monoform is an *ever-evolving*",
      "interface & experience *design*",
      "*studio* intentional in building",
      "crafted digital products",
    ],
    reveal: false,             // true면 단어가 아래에서 올라오는 효과 (원본에는 없음)
    // 헤드라인 아래 작은 단어들: 두 칸(left/right), 각 줄은 양끝 정렬
    sub: {
      left:  [["Value-based", "Thoroughness"], ["Designed", "To", "Inspire"], ["With", "Your", "Visitors"]],
      right: [[], ["Built", "For"], ["The", "Durable", "Effect"]],
    },
  },

  showreel: {
    video: "https://s-i-g.nl/signal-a-showreel-short-2026.mp4",
    poster: null,
    left: ["Showreel", "2026"],
    right: "Coming Soon",
  },

  cases: {
    title: "Case Studies",
    items: [
      { no: "A — 1", title: "Northern Atelier", type: "Artist", href: "#",
        recognitions: ["Awwwards: Honorable Mention", "Site Inspire", "CSS Winner: Site of the day"],
        scope: ["Art Direction", "Web Design", "Branding", "Web Development"],
        image: null, colors: ["#1b1d22", "#7d8aa6"] },
      { no: "A — 2", title: "Halden", type: "Real Estate Developer", href: "#",
        recognitions: ["Site Inspire", "Behance"],
        scope: ["Art Direction", "Brand Design", "Web Design", "Web Development"],
        image: null, colors: ["#c9c2b4", "#5b5145"] },
      { no: "A — 3", title: "Ines Varo", type: "Illustrator", href: "#",
        recognitions: ["Awwwards: Site of the day", "Site Inspire", "Muzli", "It's Nice that"],
        scope: ["Art Direction", "Web Design", "Web Development"],
        image: null, colors: ["#e9d6cf", "#a24f3c"] },
      { no: "A — 4", title: "KRNO", type: "Watchface Designer", href: "#",
        recognitions: ["Red Dot Design Award", "A'Design Award", "IF Design Award"],
        scope: ["Art Direction", "Product Design"],
        image: null, colors: ["#101010", "#c48f7b"] },
      { no: "A — 5", title: "Staticfold", type: "Production Studio", href: "#",
        recognitions: ["Site Inspire", "Awwwards: Honorable Mention"],
        scope: ["Art Direction", "Web Design", "Web Development"],
        image: null, colors: ["#2c3b2f", "#c3d1b4"] },
      { no: "A — 6", title: "Oto Lumenik", type: "Illustrator", href: "#",
        recognitions: ["Site Inspire", "Awwwards: Site of the day"],
        scope: ["Art Direction", "Web Design", "Web Development"],
        image: null, colors: ["#d7dde8", "#3a4f8c"] },
    ],
    archive: { label: "Explore Monoform Archive", href: "#archive" },
  },

  statement: {
    lines: [
      "Studio {line} X crafts methodically",
      "refined digital experiences that",
      "amplify your artistic intent,",
      "guiding your ideas onward in a",
      "noisier {globe} world.",
    ],
  },

  recognitions: {
    label: "Industry Recognitions",
    items: [
      // image: 로고 이미지 경로 (없으면 원형 placeholder) — hover 시 커서를 따라다님
      { name: "Awwwards", detail: ["Site of the day", "× 4"], image: null },
      { name: "Awwwards", detail: ["Honorable mention", "× 7"], image: null },
      { name: "Red Dot Design Award", detail: ["Winner - App design"], image: null },
      { name: "A' Design Award", detail: ["Bronze winner - Interface design"], image: null },
      { name: "IF Design Award", detail: ["Best app design"], image: null },
      { name: "Behance", detail: ["× 6"], image: null },
      { name: "Behance", detail: ["Behance main page"], image: null },
      { name: "Site Inspire", detail: ["× 6"], image: null },
      { name: "It's Nice That", detail: ["Featured"], image: null },
      { name: "Communication Arts", detail: ["Featured"], image: null },
    ],
  },

  about: { label: "About the Studio", href: "#about" },

  footer: {
    social: [{ label: "Behance", href: "https://behance.net" }],
    locations: "Seoul – Busan",
    privacy: { label: "Privacy Policy", href: "#" },
    navA: [
      { label: "Home", href: "#top" },
      { label: "Case Studies", href: "#cases" },
      { label: "Archive", href: "#archive" },
    ],
    navB: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
    cta: { label: "Schedule a discovery call", href: "#contact" },
    blurbLeft: "Monoform is an ever-evolving interface & experience design studio intentional in building crafted digital products.",
    blurbRight: "Schedule a short introductory call to discuss your next idea and find out more about how we could help with your project",
    marquee: [
      { style: "mark", text: "M—F" },
      { style: "serif-italic", text: "Monoform" },
      { style: "mark", text: "M—F" },
      { style: "sans", text: "MONOFORM" },
      { style: "mark", text: "M—F" },
      { style: "serif", text: "MONOFORM" },
    ],
    marqueeSpeed: { desktop: 220, tablet: 200, mobileLandscape: 120, mobile: 80 }, // px/sec (원본 값)
  },
};

export default SITE;
