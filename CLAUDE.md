# Intelligent uWave Energy Center — Lab Homepage

Next.js 16의 변경점은 `next dev`가 자동 생성·갱신하는 AGENTS.md에 있다.

@AGENTS.md

## 0. 연구실 정보

사이트 표기의 정본. 코드에 하드코딩하지 말고 `content/site.json`에 담아 쓴다.

| 항목 | 값 |
|---|---|
| 영문 명칭 | Intelligent uWave Energy Center |
| 국문 명칭 | 지능형 전파-에너지 연구센터 |
| 약어 | IUEC |
| 소속(영문) | Dept. of Electrical and Computer Engineering, University of Seoul |
| 소속(국문) | 서울시립대학교 전자전기컴퓨터공학과 |
| GitHub | https://github.com/UOS-IUEC |

- 사이트 언어가 영어 단일이므로 **화면에 나가는 표기는 영문 명칭**을 쓴다. 국문 명칭은 `site.json`에 참고용으로만 보관한다.
- **`HiCAS`는 구 명칭이다.** 저장소 폴더명(`Hicas_Page`)에 흔적이 남아 있을 뿐이며, 사이트 문구·컴포넌트명·URL·메타데이터 어디에도 쓰지 않는다.

## 1. 기본 결정 사항

| 항목 | 결정 |
|---|---|
| 프레임워크 | Next.js (App Router) + TypeScript (strict) |
| 스타일 | Tailwind CSS |
| 사이트 언어 | **영어 단일** (i18n 레이어 없음) |
| 콘텐츠 관리 | `content/` 아래 JSON 데이터 파일 |
| 배포 | **미정** → 정적 export 호환성을 유지할 것 (§5) |

## 2. 명령어

```bash
npm run dev        # 개발 서버 (localhost:3000)
npm run build      # 프로덕션 빌드
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

변경 후에는 `npm run typecheck && npm run lint`를 통과시킨 뒤 보고한다.

**clone 직후에는 `npm run build`를 한 번 돌려야 `typecheck`가 통과한다.** Next.js 16이 `LayoutProps` 같은 라우트 타입을 빌드할 때 `.next/types/`에 생성하기 때문에, 빌드 전에는 tsc가 그 타입을 찾지 못하고 에러를 낸다.

## 3. 디렉터리 구조

```
README.md               # 구성원용 안내 — 콘텐츠 수정법·실행법
CLAUDE.md               # 이 문서 — 개발 규칙
AGENTS.md               # Next.js가 자동 생성·갱신. 직접 고치지 않는다
app/                    # 라우트 (페이지당 1폴더)
  layout.tsx            # 공통 셸: 헤더/푸터/메타데이터
  page.tsx              # Home
  globals.css           # 색상·폰트 토큰 (CSS 변수는 여기 한 곳에서만)
  research/             # 연구 분야
  publications/         # 논문 목록
  members/              # 구성원
  news/                 # 소식
  contact/              # 연락처·오시는 길
components/             # 재사용 UI (라우트에 종속되지 않는 것만)
content/                # ★ 모든 텍스트·데이터가 여기 모인다
  site.json             # 랩 이름, 소속, 주소, 연락처, 외부 링크
  members.json
  publications.json
  research.json
  news.json
lib/
  content.ts            # 데이터 로더 + zod 스키마 (단일 진입점)
  utils.ts
public/
  images/members/       # 구성원 사진
  images/research/
  files/                # PDF 등 첨부물
assets-raw/             # 리사이즈 전 원본 이미지 (커밋하지 않음)

next.config.ts          # images.unoptimized — 정적 export 대비 (§5)
tsconfig.json · eslint.config.mjs · postcss.config.mjs
```

`components/` `content/` `lib/`와 6개 라우트 폴더는 아직 없다. 위 구조는 만들 때 따를 목표다.

## 4. 절대 규칙

1. **콘텐츠를 컴포넌트에 직접 쓰지 않는다.** 이름·논문 제목·공지 문구 등 사람이 고칠 내용은 전부 `content/*.json`에 둔다. 컴포넌트는 데이터를 받아 그리기만 한다. 이유: 나중에 연구실 구성원이 코드를 몰라도 JSON만 고쳐 업데이트할 수 있어야 한다.
2. **실제 데이터를 지어내지 않는다.** 논문, 저자, 수상 이력, 과제명, 구성원 정보를 추측해서 채우지 말 것. 모르는 값은 `"TODO: 확인 필요"`로 남기거나 사용자에게 묻는다. 학계 사이트에서 허위 실적은 치명적이다.
3. **데이터는 `lib/content.ts`를 통해서만 읽는다.** 컴포넌트가 JSON을 직접 import하지 않는다. 스키마 검증(zod)을 거쳐 타입이 보장된 값만 내보낸다.
4. **`any` 금지.** 타입이 애매하면 스키마부터 고친다.
5. **스타일은 Tailwind 유틸리티로만.** CSS Modules, styled-components, 인라인 `style` 속성을 섞지 않는다. 색상·폰트·간격 토큰은 `app/globals.css`의 CSS 변수 한 곳에서 정의한다.

## 5. 정적 export 호환 제약 (배포처 미정이므로 유지)

배포 대상이 GitHub Pages나 학교 서버가 될 수 있으므로, 서버 런타임이 필요한 기능은 쓰지 않는다.

- Route Handlers (`app/api/`), Server Actions, `middleware.ts` 사용 금지
- `next/image`는 `unoptimized: true` 전제로 사용
- ISR·`revalidate`·요청 시점 동적 렌더링에 의존하지 않는다
- 문의 폼이 필요하면 `mailto:` 또는 외부 폼 서비스 링크로 처리한다

배포처가 확정되면(#3) 이 절과 §1 표를 갱신한다.

## 6. 콘텐츠 스키마

`lib/content.ts`의 zod 스키마가 정본이다. JSON을 고칠 때 아래 형태를 따른다.

> `lib/content.ts`가 만들어지면 아래 **JSON 예시는 삭제하고** 각 항목의 규칙(불릿)만 남긴다. 필드 정의가 두 곳에 있으면 반드시 어긋난다.

**members.json**
```json
{
  "id": "gildong-hong",
  "name": "Gildong Hong",
  "role": "pi | postdoc | phd | ms | undergrad | staff | alumni",
  "title": "Ph.D. Student",
  "photo": "/images/members/gildong-hong.jpg",
  "email": "...",
  "interests": ["..."],
  "links": { "scholar": "", "github": "", "linkedin": "" },
  "joined": "2024-03",
  "left": null
}
```
- 졸업생은 삭제하지 말고 `role: "alumni"` + `left` 채우기 (진로 정보는 `title`에)
- 표시 순서는 `role` 우선순위 → `joined` 오름차순. JSON 배열 순서에 의존하지 않는다.

**publications.json**
```json
{
  "id": "hong2026-example",
  "type": "journal | conference | preprint | patent | thesis",
  "title": "...",
  "authors": ["Gildong Hong", "..."],
  "venue": "IEEE Transactions on ...",
  "year": 2026,
  "volume": "", "pages": "",
  "doi": "", "url": "", "pdf": "", "code": "",
  "award": null,
  "highlight": false
}
```
- `authors`는 게재된 순서 그대로. 연구실 구성원 강조는 렌더링 단계에서 `members.json`의 이름과 매칭해 처리한다(JSON에 마크업을 넣지 않는다).
- 기본 정렬: `year` 내림차순 → `type` 순. `highlight: true`는 홈 화면 노출용.

## 7. 품질 기준

- **반응형**: 360px(모바일)부터 깨지지 않아야 한다. 가로 스크롤 금지.
- **접근성**: 시맨틱 태그, 모든 이미지에 의미 있는 `alt`, 키보드 탐색 가능, 본문 대비 4.5:1 이상.
- **메타데이터**: 각 라우트에 `metadata` export (title, description). 논문·구성원 페이지는 검색 유입 경로다.
- **성능**: 사진은 커밋 전 리사이즈(구성원 사진 400px 내외, 배너 1600px 이하). 원본 수 MB 이미지를 그대로 올리지 않는다.

## 8. 작업 방식

- 한 번에 한 페이지/한 기능씩 완성한다. 레이아웃만 여섯 페이지 만들어 두고 내용은 비워 두는 식으로 진행하지 않는다.
- 새 의존성 추가 전에 먼저 묻는다. 기본 스택(Next/TS/Tailwind)으로 되는 일은 그대로 한다.
- 디자인 시안이 없는 상태에서 만든 화면은 "임시 시안"임을 명시하고, 사용자 확인 후 다듬는다.
- 에이전트 협업·위임 정책은 전역 `~/.agents/AGENT_ROLES.md`를 따른다. 여기에 다시 적지 않는다.

### 무엇을 어디에 적나

| 내용 | 위치 |
|---|---|
| 항상 지켜야 할 규칙·제약 | 이 문서 |
| 콘텐츠 수정법·실행법 (구성원 안내) | `README.md` |
| 확정되지 않은 결정 | GitHub Issues, `decision` 라벨 |
| 할 일과 순서 | GitHub Issues + 마일스톤 |

결론이 난 결정은 이슈를 닫고 **이 문서에 반영한다.** 이슈는 repo와 함께 사라질 수 있지만 규칙은 남아야 한다.

## 9. Git 규칙

### 커밋 메시지 — Conventional Commits

```
<type>: <subject>

<body>
```

- **영어**로 쓴다. 명령형 현재 시제(`add`, `added`나 `adds`가 아님), 소문자 시작, 끝에 마침표 없음
- 제목 50자 내외, 본문은 72자에서 줄바꿈
- 본문에는 *무엇을* 바꿨는지가 아니라 **왜** 바꿨는지를 쓴다. 무엇은 diff를 보면 된다
- 변경이 자명하면 본문은 생략해도 된다

| type | 용도 |
|---|---|
| `feat` | 새 기능·새 페이지 |
| `fix` | 버그 수정 |
| `content` | `content/*.json` 데이터 갱신 (논문·구성원·뉴스) |
| `docs` | 문서 (CLAUDE.md, README) |
| `style` | 포맷팅만, 동작 변화 없음 |
| `refactor` | 동작 그대로 구조만 개선 |
| `build` | 의존성·빌드 설정 |
| `ci` | GitHub Actions 등 |
| `chore` | 그 외 잡무 |

```
content: add 2026 IEEE TAP paper
feat: add publications page with year filter
fix: correct member photo aspect ratio on mobile
```

### 브랜치와 push

- 기본 브랜치는 `main`이다.
- 콘텐츠 갱신처럼 작고 독립적인 변경은 `main`에 직접 커밋해도 된다.
- 페이지 추가·구조 변경은 `feat/...`, `fix/...` 브랜치에서 작업하고 PR로 합친다.
- 작업은 이슈 단위로 한다. PR 본문에 `Closes #12`처럼 적으면 머지될 때 해당 이슈가 자동으로 닫힌다.
- **이미 push한 커밋은 고치지 않는다.** 메시지 수정은 push 전에 `git commit --amend`로 한다. 공유 브랜치에 force push 금지 — 다른 사람의 로컬 히스토리가 깨진다.

### 커밋 전 확인

`.gitignore`로는 막을 수 없는 것들이다. 사람이 알고 있어야만 지켜진다.

- **이 저장소는 언제든 public으로 전환될 수 있다고 전제한다.** 개인 연락처, 미공개 과제 정보, 심사 중인 원고를 커밋하지 않는다. 한 번 커밋되면 나중에 파일을 지워도 히스토리에는 남는다.
- API 키·토큰을 코드에 넣지 않는다. 값은 `.env.local`에만 둔다.
