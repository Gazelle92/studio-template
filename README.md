# Studio Portfolio Template (React + Vite)

## 실행 방법
Node.js 18 이상이 필요합니다 (https://nodejs.org 에서 LTS 버전 설치).

```bash
cd C:\Users\hutsw\Desktop\project\template
npm install      # 처음 한 번만
npm run dev      # 개발 서버 실행 → 브라우저가 자동으로 열림 (http://localhost:5173)
```
배포용으로 빌드하려면 `npm run build`를 실행하세요. 결과물은 `dist/` 폴더에 생깁니다.

## 폴더 구조
```
src/
  content.js            ★ 모든 텍스트·링크·이미지·설정 (이 파일만 수정)
  App.jsx               섹션 조립
  styles.css            디자인 토큰 + 레이아웃
  components/
    Header.jsx          내비 · 시계 · 모바일 메뉴
    FitText.jsx         양끝 정렬 대형 헤드라인
    Cases.jsx           케이스 스터디 행 + 커서 이미지
    Sections.jsx        Hero · Showreel · Statement · Recognitions · About · Footer · Marquee
    primitives.jsx      Scramble, Link, CursorImage 등 공용 컴포넌트
  lib/
    scramble.js         스크램블 효과 (원본 타이밍 값)
    pointer.js          프레임 단위 hover 감지 (원본 방식)
    scroll.js           Lenis 부드러운 스크롤 (원본 설정)
```

## 원본과 동일하게 맞춘 값 (마우스/스크롤 감도)
| 항목 | 값 |
|---|---|
| 스크롤 (Lenis) | lerp 0.12, wheelMultiplier 1.2, easing `(--t)*t*t+1` |
| 커서 이미지 | 보간 없이 마우스 좌표에 정확히 붙음, 중심 정렬, 285×380 (1440px 화면 기준) |
| hover 감지 | 매 프레임 요소 영역과 마우스 좌표를 비교 → 마우스를 가만히 두고 스크롤해도 hover가 바뀜 |
| 큰 타이틀 reveal | 전체 400ms, 글자당 60ms 동안 20ms 간격 랜덤 |
| 화면 진입 스크램블 | 100ms 지연 후 400ms, 글자당 20회 랜덤, 들어올 때마다 재생 |
| hover 재스크램블 | 400ms, 20ms 간격, 200ms부터 왼쪽→오른쪽으로 확정 |
| 마키 | 데스크톱 220px/s, 태블릿 200px/s, 모바일 90px/s |

값을 바꾸려면 `src/lib/scramble.js`의 `SCRAMBLE_CONFIG`와 `src/lib/scroll.js`를 수정하세요.

## 섹션별 텍스트 효과 (원본과 동일)
| 위치 | 효과 |
|---|---|
| 시계 · 도시 · ( 스튜디오 ) 라벨 · 헤드라인 아래 단어들 | 화면에 들어올 때마다 스크램블 |
| 상단 메뉴 | hover/클릭 시 재스크램블 + ● 표시, Follow는 하위 메뉴 펼침 |
| 케이스 행 | hover 시 번호·작은 제목이 사라지고 큰 세리프 제목 스크램블 등장, 분야 0.5초 페이드인, 수상·범위 텍스트 재스크램블, 이미지가 커서를 따라옴 |
| 수상 목록 | hover 시 200×200 로고가 커서를 따라옴 (스크램블 없음) |
| About 링크 | hover 시 윗선이 나타남 |
| 푸터 CTA | hover 시 화살표가 나타남 |
| 대형 헤드라인 · 스테이트먼트 | 애니메이션 없음 (`hero.reveal: true`로 켤 수 있음) |

## 화면 폭별 크기 (원본 breakpoint)
| 화면 폭 | 모노 글씨 | 본문 그로테스크 | 헤드라인 아래 단어 | 케이스 행 높이 | 케이스 큰 제목 |
|---|---|---|---|---|---|
| 1920px 이상 | 13px | 19px | 19px | 400px | 130px |
| 1550~1919px | 13px | 19px | 19px | 330px | 130px |
| 1331~1549px | 12px | 17px | 17px | 300px | 100px |
| 992~1330px | 12px | 17px | 13px | 300px | 100px |
| 991px 이하 | 11px (767 이하 10px) | 19px | 19px (599 이하 11px) | 자동 | 숨김 |

모든 값은 `src/styles.css` 맨 위 `:root` 변수에 모여 있어요.

## 폰트
원본 폰트는 유료 라이선스라 무료 폰트로 대체했어요. 원본과 같은 크기로 나란히 놓고 굵기와 폭을 비교해서 가장 가까운 것을 골랐어요.

| 원본 | 대체 (Google Fonts) |
|---|---|
| GT America Mono Light | DM Mono 400 |
| Neue Haas Grotesk Text 400 / Display Bold | Inter 600 / 700 |
| PP Editorial New Ultralight | Newsreader 200 |

라이선스를 구매했다면 `src/styles.css` 맨 위의 `--f-mono`, `--f-sans`, `--f-serif`와 굵기 변수(`--mono-weight`, `--sans-weight`, `--serif-weight`)만 바꾸면 돼요.

## 텍스트 문법 (content.js의 hero.lines / statement.lines)
- 배열의 한 요소가 화면의 **한 줄**이 되며, 줄마다 양끝 정렬됩니다
- `*단어*` → 굵은 산세리프, 나머지는 얇은 세리프
- `{dot}` ● / `{line}` 가로선 / `{globe}` 회전 지구본

## 자동화
`<App site={데이터} />` 형태로 content 객체를 넘기면 그 데이터로 렌더링됩니다.
JSON에서 사이트를 여러 개 찍어내거나 CMS와 연결할 때 이 구조를 그대로 쓰면 됩니다.
