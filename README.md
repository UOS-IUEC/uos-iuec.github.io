# Intelligent μWave Energy Center

서울시립대학교 전자전기컴퓨터공학과 **지능형 전파-에너지 연구센터(IUEC)** 홈페이지.

> 개발 중입니다. 배포 주소는 정해지면 여기에 적습니다 ([#3](https://github.com/UOS-IUEC/homepage/issues/3)).

---

# 콘텐츠 수정하기

**코드를 몰라도 됩니다.** 논문·구성원·소식은 `content/` 폴더의 JSON 파일에만 들어 있습니다.
이 파일들만 고치면 사이트가 따라옵니다. 화면을 만드는 코드는 건드릴 필요가 없습니다.

| 고치고 싶은 것 | 파일 |
|---|---|
| 논문 목록 | `content/publications.json` |
| 구성원·졸업생 | `content/members.json` |
| 소식·공지 | `content/news.json` |
| 연구 분야 | `content/research.json` |
| 연구실 이름·주소·연락처 | `content/site.json` |

## 가장 쉬운 방법 — 브라우저에서 바로 고치기

git을 설치하지 않아도 됩니다.

1. GitHub에서 고칠 파일을 연다 (예: `content/publications.json`)
2. 오른쪽 위 **연필 아이콘**(Edit this file)을 누른다
3. 내용을 고친다
4. 아래 **Commit changes** 를 누른다

커밋하면 자동 검사가 돌아갑니다. **형식이 틀리면 빨간 X가 뜨고 어디가 틀렸는지 알려줍니다.**
초록색 체크가 뜨면 정상입니다.

---

## 논문 추가하기

`content/publications.json` 의 **맨 위**에 항목을 하나 넣습니다. 순서는 상관없지만
(사이트가 연도순으로 정렬합니다) 최근 것을 위에 두면 찾기 쉽습니다.

```json
{
  "id": "hong2026-metasurface",
  "type": "journal",
  "title": "A Reconfigurable Metasurface for Wireless Power Transfer",
  "authors": ["Gildong Hong", "Minsu Kim", "Myung-Qun Lee"],
  "venue": "IEEE Transactions on Antennas and Propagation",
  "year": 2026,
  "volume": "74",
  "pages": "1234-1240",
  "doi": "10.1109/TAP.2026.1234567",
  "url": "",
  "pdf": "",
  "code": "",
  "award": null,
  "highlight": true
}
```

| 항목 | 설명 |
|---|---|
| `id` | 겹치지 않는 아무 문자열. `성2026-키워드` 형태를 권장 |
| `type` | `journal` `conference` `preprint` `patent` `thesis` 중 하나 |
| `authors` | **게재된 순서 그대로.** 연구실 구성원 이름은 사이트가 알아서 굵게 표시합니다 |
| `year` | 따옴표 없는 숫자. `2026` (O) / `"2026"` (X) |
| `volume` | **숫자만.** `"74"` (O) / `"vol. 74"` (X) — `vol.`은 화면에서 자동으로 붙습니다 |
| `pages` | `"1234-1240"` |
| `doi` | **식별자만.** `"10.1109/..."` (O) / `"https://doi.org/10.1109/..."` (X) — 링크는 자동 생성됩니다 |
| `award` | 수상 없으면 `null`, 있으면 `"Best Paper Award"` 처럼 |
| `highlight` | `true` 면 홈 화면에 노출됩니다. 대표 논문 2~3편만 |

모르는 항목은 `""` 로 비워두면 화면에서 알아서 빠집니다. **없는 정보를 지어내지 마세요.**

### 저자 이름 표기

구성원 이름을 굵게 강조하는 건 `content/members.json` 의 `name` 과 **글자가 정확히 같을 때만** 동작합니다.
`"Gildong Hong"` 과 `"G. Hong"` 은 다른 것으로 봅니다. 두 파일의 표기를 맞춰 주세요.

---

## 구성원 추가하기

`content/members.json`

```json
{
  "id": "gildong-hong",
  "name": "Gildong Hong",
  "role": "phd",
  "title": "Ph.D. Student",
  "photo": "/images/members/gildong-hong.jpg",
  "email": "hong@uos.ac.kr",
  "interests": ["Wireless Power Transfer", "Metasurfaces"],
  "links": { "scholar": "", "github": "", "linkedin": "", "homepage": "" },
  "joined": "2024-03",
  "left": null
}
```

| 항목 | 설명 |
|---|---|
| `role` | `pi` `postdoc` `phd` `ms` `undergrad` `staff` `alumni` 중 하나. 이 순서대로 화면에 묶입니다 |
| `photo` | 사진이 없으면 `null`. 있으면 아래 "사진 넣기" 참고 |
| `joined` | `"2024-03"` 형태(YYYY-MM). 모르면 `null` |
| `links` | 없는 것은 `""` 로 두면 화면에서 빠집니다 |

### 졸업 처리

**항목을 지우지 마세요.** 두 곳만 고칩니다.

```json
"role": "alumni",
"left": "2026-02",
"title": "M.S. 2026 — Samsung Electronics"
```

진로 정보는 `title` 에 적습니다. Alumni 섹션에 따로 모입니다.

---

## 소식 올리기

`content/news.json`

```json
{
  "id": "2026-09-best-paper",
  "date": "2026-09-15",
  "title": "Gildong Hong receives the Best Paper Award at APMC 2026",
  "body": "The award recognizes work on reconfigurable metasurfaces.",
  "link": ""
}
```

`date` 는 반드시 `YYYY-MM-DD` 형태입니다. 최신순으로 자동 정렬됩니다.
`link` 에 URL을 넣으면 제목 아래 링크가 생깁니다.

---

## 연구 분야

`content/research.json`

```json
{
  "id": "wireless-power",
  "title": "Wireless Power Transfer",
  "summary": "두세 문장으로 이 분야를 설명합니다.",
  "image": "/images/research/wireless-power.jpg",
  "tags": ["Rectenna", "Metasurface"]
}
```

이미지가 없으면 `"image": null`.

---

## 사진 넣기

1. **먼저 크기를 줄입니다.** 구성원 사진은 가로 400px 내외, 배너는 1600px 이하.
   원본 수 MB 파일을 그대로 올리면 사이트가 느려집니다.
2. `public/images/members/` 또는 `public/images/research/` 에 올립니다.
3. JSON의 `photo` / `image` 에 `/images/members/파일명.jpg` 형태로 적습니다.
   (`public` 은 경로에 넣지 않습니다)

브라우저에서 올리려면 해당 폴더에서 **Add file → Upload files**.

---

## 아직 안 정해진 값 — `TODO:`

값을 모를 때는 지어내지 말고 이렇게 남깁니다.

```json
"tagline": "TODO: 확인 필요 — 한 줄 소개"
```

`TODO:` 로 시작하는 값은 **사이트 화면에 점선 테두리로 눈에 띄게 표시됩니다.** 일부러 그렇게 만들었습니다.
비어 보이는 사이트가 완성된 척하는 사이트보다 낫고, 무엇을 채워야 하는지 화면만 봐도 보여야 하기 때문입니다.

지금 사이트 곳곳에 노란 표시가 보이는 건 정상입니다. 내용이 들어오면 사라집니다.

---

## 형식이 틀렸을 때

커밋하면 자동 검사가 이런 메시지를 보여줍니다.

```
content/publications.json 형식이 스키마와 맞지 않습니다:
  - 0.type: Invalid option: expected one of "journal"|"conference"|"preprint"|"patent"|"thesis"
  - 0.year: Invalid input: expected number, received string
  - 1.authors: Invalid input: expected array, received undefined
```

`0.` 은 **첫 번째 항목**, `1.` 은 두 번째 항목이라는 뜻입니다 (0부터 셉니다).

가장 흔한 실수:

- 항목 사이 **쉼표** 를 빠뜨리거나, 마지막 항목 뒤에 쉼표를 남김
- 숫자를 따옴표로 감쌈 (`"2026"` → `2026`)
- 큰따옴표 대신 작은따옴표나 한글 따옴표 사용

고치고 다시 커밋하면 됩니다. 형식이 틀리면 **빌드 자체가 실패하므로 잘못된 내용이 사이트에 올라가지는 않습니다.**
배포된 사이트는 마지막으로 성공한 상태를 그대로 유지합니다.

---

# 개발

Node.js 22 이상이 필요합니다.

```bash
git clone https://github.com/UOS-IUEC/homepage.git
cd homepage
npm install
npm run build     # 최초 1회 필요 (아래 참고)
npm run dev       # http://localhost:3000
```

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 타입 검사 |

> clone 직후에는 `npm run build` 를 한 번 돌려야 `typecheck` 가 통과합니다.
> Next.js 16이 라우트 타입을 빌드할 때 생성하기 때문입니다.

## 구조

```
app/           페이지 (라우트당 1폴더)
components/    재사용 UI
content/       ★ 모든 텍스트·데이터
lib/content.ts 데이터 로더 + 스키마 — 콘텐츠를 읽는 단일 진입점
public/        이미지·첨부파일
```

기술 스택은 Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · zod 입니다.
정적 사이트로 빌드되므로 서버가 필요 없습니다.

## 기여

코드를 고치기 전에 [CLAUDE.md](CLAUDE.md) 를 읽어 주세요. 스택 결정, 콘텐츠 스키마,
커밋 메시지 규칙, 정적 export 제약이 모두 거기 있습니다.

할 일과 결정 사항은 [Issues](https://github.com/UOS-IUEC/homepage/issues) 에서 관리합니다.
