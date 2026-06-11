<div align="center">

![Eclipse Online Judge](./이클립스.svg)

# 🌙 Eclipse Online Judge

**코딩을 게임처럼, 학습을 즐겁게**

Eclipse IDE UI를 웹으로 재현한 게임화된 코딩 연습 플랫폼

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.170-green?style=flat-square&logo=three.js)](https://threejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

[데모 보기](#) • [기능](#-주요-기능) • [시작하기](#-시작하기) • [스크린샷](#-스크린샷)

</div>

---

## 🎮 주요 기능

### 🖥️ Eclipse IDE 완벽 재현
- 다크/라이트 테마 자동 전환
- 실제 Eclipse와 동일한 UI/UX
- Package Explorer, Outline, Console 패널
- 커스텀 둥근 스크롤바

### 🎯 Line Match Mode (라인 맞추기)
- 코드 스니펫이 비처럼 떨어지는 타이밍 게임
- 9개 스폰 레인 × 8가지 알록달록한 색상
- 길이 기반 속도 (짧을수록 빠름)
- 시간 압박 시스템 (위험 구역에서 점수 차감)
- 난이도별 점수 (길이, 대문자, 특수문자)
- 음수 점수 허용

### 🌧️ Typing Rain Mode (타자연습)
- 단어/구문이 비처럼 떨어짐
- 5가지 카테고리 (키워드, HTML, JSP, 심볼, 구문)
- 긴 구문 40% 가중치
- 매칭 시 황금색 하이라이트
- 캐릭터 길이 기반 점수

### 🐸 Pet System (펫 시스템)
- Three.js 3D 이족보행 개구리
- 5가지 우아한 댄스 모션
- 벽타기 시뮬레이션
- 드래그 가능
- 커스텀 우클릭 메뉴

### ⚡ 고급 기능
- **Ctrl + --/++**: 줌 인/아웃 (3px 단계)
- **Ctrl + S**: 저장 & 실시간 채점
- D2Coding 폰트 (코드 영역)
- 3D 테서랙트 스플래시 (2초)
- 통합 플로팅 UI (테마 + 모드 전환)

---

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-repo/eclipse-online-judge.git
cd eclipse-online-judge

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

---

## 📁 프로젝트 구조

```
Eclipse-Online-Judge/
├── src/
│   ├── app/
│   │   ├── page.tsx           # 메인 컴포넌트 (3가지 모드)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 전역 스타일 + 애니메이션
│   └── components/
│       └── pets/
│           ├── FrogPet.tsx    # 3D 개구리 펫
│           └── README.md      # 펫 시스템 문서
├── _jsp/                      # 챌린지 소스 파일
│   ├── check.js              # JavaScript 폼 검증
│   ├── db.jsp                # DB 연결
│   ├── join.jsp              # 회원가입 폼
│   └── sql.sql               # SQL 테이블
├── public/
│   └── 이클립스.svg           # 로고
├── .agents_brain/            # AI 에이전트 세션 기록
├── package.json
└── README.md
```

---

## 🎯 게임 모드

### 1️⃣ Normal Mode (일반 모드)
Eclipse IDE를 완벽히 재현한 읽기 전용 뷰어

**특징:**
- 프로젝트 탐색기
- 코드 에디터 (신택스 하이라이팅)
- 아웃라인 & 콘솔
- 줌 기능 (Ctrl + --, Ctrl + ++)

### 2️⃣ Line Match Mode (라인 맞추기)
코드 스니펫을 빠르고 정확하게 입력하는 타이밍 게임

**점수 계산:**
```
기본 점수 = 50점

보너스:
  - 60자 이상: +100점
  - 40~59자: +70점
  - 20~39자: +40점
  - 10~19자: +20점
  - 대문자: +2점/개
  - 특수문자: +3점/개

페널티:
  - 위험 구역(Y > 70%): -2 × (Y% - 70%)
  - 틀린 입력: -30점
  - 사라진 코드: -50점
```

### 3️⃣ Typing Rain Mode (타자연습)
떨어지는 단어를 입력하는 타자 연습 게임

**카테고리:**
- 🔵 Keywords: `function`, `if`, `return`
- 🟡 HTML Tags: `<div>`, `<input>`
- 🟣 JSP Tags: `<%@`, `<%=`
- ⚪ Symbols: `(`, `)`, `{`, `}`
- 🟢 Phrases: `document.getElementById()` (40% 가중치)

---

## 🐸 펫 시스템

### 이족보행 개구리
- **50개 이상의 메쉬**로 구성된 정교한 3D 모델
- **3단계 관절 시스템** (상완-하완-손, 허벅지-종아리-발)
- **손가락 6개 + 발가락 10개**
- **눈동자 미세 움직임** (항상 작동)

**댄스 모션 (15초 사이클):**
1. 오른팔 내밀기 (3초)
2. 왼팔 내밀기 (3초)
3. 오른발 내밀기 (3초)
4. 왼발 내밀기 (3초)
5. 벽타기 시뮬레이션 (3초)

**인터랙션:**
- 좌클릭 + 드래그: 이동
- 우클릭: 커스텀 메뉴 (끄기)

---

## 🎨 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | Next.js 16, React 19 |
| **언어** | TypeScript 5 |
| **스타일링** | TailwindCSS 4, CSS Variables |
| **3D 렌더링** | Three.js 0.170 |
| **폰트** | D2Coding (코드), System Font (UI) |
| **배포** | Vercel |

---

## ⌨️ 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl + --` | 줌 아웃 (3px) |
| `Ctrl + ++` | 줌 인 (3px) |
| `Ctrl + S` | 저장 & 채점 |
| `Space` | 단어 확정 (Typing Rain) |
| `Enter` | 라인/단어 확정 (게임 모드) |
| `우클릭` | 펫 메뉴 (펫 위에서) |

---

## 📊 실시간 채점 시스템

### 정확도 계산
```typescript
정확도 = (올바른 문자 수 / 전체 입력 문자 수) × 100
```

### 최종 점수
```typescript
완성 보너스 = 시간보너스 + 정확도보너스 - 실수패널티 + 5000
- 시간보너스: max(0, (300 - 소요시간) × 10)
- 정확도보너스: 정확도 × 50
- 실수패널티: 실수횟수 × 10
```

### HUD 표시
- ⭐ 점수
- 📝 완성줄/전체줄
- 🎯 정확도% (색상 코딩)
- ❌ 실수 횟수
- 🔥 COMBO (5개 이상)

---

## 🎨 스크린샷

### Normal Mode
![Normal Mode](./screenshots/normal-mode.png)

### Line Match Mode
![Line Match Mode](./screenshots/line-match-mode.png)

### Typing Rain Mode
![Typing Rain Mode](./screenshots/typing-rain-mode.png)

### Frog Pet
![Frog Pet](./screenshots/frog-pet.png)

---

## 📝 챌린지 파일

`_jsp/` 폴더에 포함된 실제 코딩 챌린지:

| 파일 | 줄 수 | 난이도 | 설명 |
|------|-------|--------|------|
| `check.js` | 35줄 | Medium | JavaScript 폼 검증 |
| `db.jsp` | 10줄 | Easy | Oracle DB 연결 설정 |
| `join.jsp` | 54줄 | Hard | 회원가입 페이지 |
| `sql.sql` | 17줄 | Easy | 테이블 생성 SQL |

---

## 🌈 테마 시스템

### 3가지 테마 모드
- ☀️ **Light Mode**: 밝은 배경
- 🌙 **Dark Mode**: 다크 배경 (Eclipse 스타일)
- 🖥️ **System**: OS 설정 자동 감지

### CSS 변수 기반
```css
--eclipse-bg
--eclipse-editor-bg
--eclipse-text
--eclipse-keyword
--eclipse-string
--eclipse-comment
/* ... 50개 이상의 변수 */
```

---

## 🛠️ 개발

### 의존성
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "three": "^0.170.0"
  }
}
```

### 스크립트
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 실행
npm run lint     # ESLint
```

---

## 🤝 기여

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

This project is licensed under the MIT License.

---

## 🙏 감사의 말

- [Next.js](https://nextjs.org) - React 프레임워크
- [Three.js](https://threejs.org) - 3D 라이브러리
- [TailwindCSS](https://tailwindcss.com) - CSS 프레임워크
- [D2Coding Font](https://github.com/naver/d2codingfont) - 코딩 폰트
- Eclipse IDE - UI/UX 영감

---

<div align="center">

**Made with 💚 by Eclipse Online Judge Team**

[⬆ 맨 위로](#-eclipse-online-judge)

</div>
