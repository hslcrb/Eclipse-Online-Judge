# Eclipse Online Judge - 프로젝트 초기화 문서

**작성일**: 2026년 6월 11일  
**프로젝트**: Eclipse Online Judge  
**기술 스택**: Next.js 16, React 19, TypeScript, TailwindCSS 4, Three.js  

---

## 📋 프로젝트 개요

Eclipse IDE UI를 웹으로 재현하고, 코딩 연습을 위한 게임 모드를 제공하는 온라인 저지 플랫폼.

### 핵심 컨셉
- Eclipse IDE의 완벽한 UI/UX 재현 (다크/라이트 테마)
- 게임화된 코딩 연습 (TETR.IO 스타일)
- 타이핑 게임 + 실시간 채점 시스템

---

## 🎮 구현된 3가지 모드

### 1. **Normal Mode (기본 모드)** 🖥️
- Eclipse IDE 완벽 재현
- 읽기 전용 코드 뷰어
- 프로젝트 탐색기, 아웃라인, 콘솔 패널
- 줌 기능 (Ctrl + --, Ctrl + ++)

### 2. **Line Match Mode (라인 맞추기 모드)** 🎯
**코드 스니펫이 비처럼 떨어지는 타이밍 게임**

#### 주요 기능:
- ✅ **9개의 스폰 레인** - 여러 위치에서 동시에 떨어짐
- ✅ **8가지 알록달록한 색상** - 무작위 색상 팔레트
- ✅ **길이 기반 속도** - 짧은 코드는 빠르게, 긴 코드는 느리게
- ✅ **음수 점수 허용** - 실력에 따라 음수 가능
- ✅ **시간 압박** - 위험 구역(70% 이상)에서 점수 차감
- ✅ **난이도 기반 점수** - 길이, 대문자, 특수문자에 따라 차등 점수
- ✅ **페널티 시스템**:
  - 틀린 입력: -30점
  - 사라진 코드 입력: -50점
  - 위험 구역: 500ms당 -5점

#### 점수 계산:
```javascript
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
```

#### 비주얼:
- 떨어지는 스니펫: 100% 불투명도, 동적 너비
- 완료된 스니펫: 25% 투명도로 배경에 누적
- 매칭 중: 황금색 테두리 + 스케일 증가
- 위험 구역: 빨간색 테두리 + 그림자

### 3. **Typing Rain Mode (타자연습 모드)** 🌧️
**단어/태그가 비처럼 떨어지는 타자 연습 게임**

#### 주요 기능:
- ✅ **5가지 카테고리**:
  - 🔵 Keywords: `function`, `if`, `return`
  - 🟡 HTML Tags: `<div>`, `<input>`, `<table>`
  - 🟣 JSP Tags: `<%@`, `<%=`, `<jsp:include>`
  - ⚪ Symbols: `(`, `)`, `{`, `}`, `;`
  - 🟢 Phrases: 긴 구문 (40% 출현율)
- ✅ **입력 시스템**: 
  - Space로 단어 구분
  - Enter로 즉시 확정
- ✅ **매칭 피드백**: 황금색 하이라이트
- ✅ **점수**: 캐릭터 길이 × 5

---

## 🎨 UI/UX 특징

### 테마 시스템
- ☀️ Light Mode
- 🌙 Dark Mode  
- 🖥️ System (자동 감지)
- CSS 변수 기반 테마 전환
- localStorage 저장

### 통합 플로팅 UI (우측 하단)
```
📝 테마 선택
   └─ Light / Dark / System

🎮 모드 선택
   └─ Normal / Line Match / Typing Rain
```

### 인터랙션
- **Ctrl + --** (더블 프레스): 줌 아웃 (3px 단계)
- **Ctrl + ++** (더블 프레스): 줌 인 (3px 단계)
- **Ctrl + S**: 저장 (실시간 채점 포함)
- **Space**: 단어 확정 (Typing Rain)
- **Enter**: 라인/단어 확정 (게임 모드)

### D2Coding 폰트
- 코드 영역에만 적용
- CDN 로드: `cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_three@1.0/D2Coding.woff`
- 폴백 체인: `D2Coding → JetBrains Mono → Consolas → monospace`

### 커스텀 스크롤바
- 둥근 모서리 (`border-radius: 9999px`)
- 테마별 색상
- 부드러운 호버 효과

---

## 🏗️ 프로젝트 구조

```
Eclipse-Online-Judge/
├── src/
│   └── app/
│       ├── page.tsx          # 메인 컴포넌트 (모든 모드 구현)
│       ├── layout.tsx         # 루트 레이아웃
│       ├── globals.css        # 전역 스타일 + 애니메이션
│       └── favicon.ico
├── _jsp/                      # 챌린지 소스 파일
│   ├── check.js              # 35줄
│   ├── db.jsp                # 10줄
│   ├── join.jsp              # 54줄
│   └── sql.sql               # 17줄
├── public/                    # 정적 파일
├── .agents_brain/            # 에이전트 세션 기록
│   ├── s1.md
│   ├── s1-1.md
│   └── init.md               # 이 문서
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## 📦 주요 의존성

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "@types/three": "^0.170.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

---

## 🎯 챌린지 파일 시스템

### 챌린지 데이터 구조
```typescript
interface Challenge {
  id: string;           // 파일명
  name: string;         // 표시 이름
  code: string;         // 소스코드
  hints: string[];      // 힌트 목록
  difficulty: 'easy' | 'medium' | 'hard';
}
```

### 현재 챌린지 파일
1. **check.js** - JavaScript 폼 검증 (35줄, medium)
2. **db.jsp** - DB 연결 설정 (10줄, easy)
3. **join.jsp** - 회원가입 폼 (54줄, hard)
4. **sql.sql** - SQL 테이블 생성 (17줄, easy)

### 챌린지 시작 흐름
```
Package Explorer 클릭
  → confirm() 다이얼로그
    → 확인: Line Match Mode
    → 취소: Typing Rain Mode
```

---

## 🌈 색상 팔레트 (Line Match Mode)

```typescript
const colorPalettes = [
  { border: "#00FF88", bg: "rgba(0, 255, 136, 0.1)", text: "#00FF88" }, // 녹색
  { border: "#5C8FD6", bg: "rgba(92, 143, 214, 0.1)", text: "#5C8FD6" }, // 파란색
  { border: "#FFD700", bg: "rgba(255, 215, 0, 0.1)", text: "#FFD700" },  // 금색
  { border: "#FF69B4", bg: "rgba(255, 105, 180, 0.1)", text: "#FF69B4" }, // 분홍색
  { border: "#00CED1", bg: "rgba(0, 206, 209, 0.1)", text: "#00CED1" }, // 청록색
  { border: "#FF8C00", bg: "rgba(255, 140, 0, 0.1)", text: "#FF8C00" },  // 주황색
  { border: "#9370DB", bg: "rgba(147, 112, 219, 0.1)", text: "#9370DB" }, // 보라색
  { border: "#32CD32", bg: "rgba(50, 205, 50, 0.1)", text: "#32CD32" },  // 라임색
];
```

---

## 🎬 애니메이션

### CSS 키프레임
```css
@keyframes float-up {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100px); opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

### 사용처
- **float-up**: LINE CLEAR!, COMBO!, PERFECT! 메시지
- **fade-in**: 스플래시 화면
- **fade-out**: 스플래시 화면, 저장 알림

---

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npx tsc --noEmit

# 린트
npm run lint
```

---

## 📊 상태 관리 구조

### 주요 State
```typescript
// 테마
const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');
const [isDarkTheme, setIsDarkTheme] = useState(false);

// 모드
const [gameMode, setGameMode] = useState<'normal'|'lineMatch'|'typingRain'>('normal');

// Line Match Mode
const [snippets, setSnippets] = useState<Snippet[]>([]);
const [lineInput, setLineInput] = useState('');
const [lmScore, setLmScore] = useState(0);
const [lmCompleted, setLmCompleted] = useState<string[]>([]);

// Typing Rain Mode
const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
const [trInput, setTrInput] = useState('');
const [trScore, setTrScore] = useState(0);
const [currentLine, setCurrentLine] = useState<string[]>([]);
const [completedCode, setCompletedCode] = useState<string[]>([]);

// 줌
const [codeFontSize, setCodeFontSize] = useState(13);

// 챌린지
const [activeChallenge, setActiveChallenge] = useState<Challenge|null>(null);
```

---

## 🎓 핵심 알고리즘

### 1. 스니펫 속도 계산
```typescript
const baseSpeed = 0.08;
const speedMultiplier = Math.max(0.5, 1 - (snippet.length / 150));
const speed = baseSpeed + (baseSpeed * speedMultiplier * 2);

// 짧은 코드: 빠르게
// 긴 코드: 느리게
```

### 2. 스니펫 점수 계산
```typescript
let score = 50; // 기본

// 길이 보너스
if (snippet.length >= 60) score += 100;
else if (snippet.length >= 40) score += 70;
else if (snippet.length >= 20) score += 40;
else if (snippet.length >= 10) score += 20;

// 대문자 보너스
const uppercase = (snippet.match(/[A-Z]/g) || []).length;
score += uppercase * 2;

// 특수문자 보너스
const special = (snippet.match(/[^a-zA-Z0-9\s]/g) || []).length;
score += special * 3;

// 위험 구역 페널티
if (yPercent > 70) {
  score -= Math.floor((yPercent - 70) * 2);
}
```

### 3. 정확도 계산 (실시간 채점)
```typescript
let correct = 0;
const targetLine = challenge.code.split('\n')[currentLineIndex];
for (let i = 0; i < userInput.length; i++) {
  if (userInput[i] === targetLine[i]) correct++;
}
const accuracy = Math.floor((correct / userInput.length) * 100);
```

---

## 🚀 배포 정보

### Vercel 설정
- 프로젝트 루트에서 직접 배포
- `vercel.json` 제거 (대시보드에서 설정)
- 자동 빌드 & 배포

### 브랜치 전략
- `main`: 프로덕션
- feature 브랜치로 작업 후 PR

---

## ⚠️ 중요 사항

### UI/UX 보존 (CRITICAL)
> "UXUI 갈아엎으면 천벌을 받게 될 수도 있다" - 사용자

- Normal Mode의 Eclipse IDE UI는 **절대 변경 금지**
- 게임 모드는 별도 화면으로 전환
- 기존 레이아웃 구조 유지 필수

### 폰트 적용 범위
- **D2Coding**: 코드 에디터 영역만
- **UI 요소**: 시스템 폰트 유지 (메뉴, 버튼, 탭 등)

### 줌 기능 특성
- 500ms 이내 더블 프레스 감지
- 코드 영역에만 적용
- 라인 높이 자동 계산 (`fontSize × 1.38`)

---

## 📝 개발 히스토리 요약

### 세션 1 (s1.md)
1. ✅ 프로젝트 이해 & WASM 제거
2. ✅ 테마 시스템 (Light/Dark/System)
3. ✅ 커스텀 스크롤바
4. ✅ 3D 테서랙트 스플래시 (30% 축소)
5. ✅ Vercel 배포 설정
6. ✅ 줌 기능 (10px→5px→3px 최적화)
7. ✅ TETR.IO 스타일 챌린지 모드
8. ✅ 타자연습 모드
9. ✅ 모드 전환 UI 통합
10. ✅ 동적 탭 & 힌트 위치 조정
11. ✅ D2Coding 폰트 적용
12. ✅ Ctrl+S 저장 & 실시간 채점
13. ✅ 스니펫 시스템 (22-23번 쿼리)

### 현재 상태 (s1-1.md)
- ✅ 여러 위치 스폰 (9개 레인)
- ✅ 알록달록한 8가지 색상
- ✅ 길이 기반 속도 조절
- ✅ 음수 점수 허용
- ✅ 빌드 성공 확인

---

## 🎯 다음 작업 제안

### 추가 개선 가능 항목
1. **더 많은 챌린지 파일** - `_jsp` 폴더에 추가
2. **리더보드 시스템** - 점수 순위표
3. **난이도 선택** - Easy/Medium/Hard 필터
4. **통계 대시보드** - 정확도, 평균 점수, 플레이 시간
5. **사운드 이펙트** - 매칭/실수/완성 효과음
6. **튜토리얼 모드** - 처음 사용자 가이드
7. **멀티플레이어** - 실시간 대결 모드
8. **코드 하이라이팅 개선** - 신택스별 색상 강화

### 최적화
- Three.js 스플래시 로딩 최적화
- 스니펫 렌더링 성능 (많은 스니펫 동시 처리)
- 모바일 반응형 지원
- 접근성 개선 (키보드 네비게이션)

---

## 📚 참고 자료

### 프로젝트 관련
- [Next.js 16 문서](https://nextjs.org/docs)
- [Three.js 문서](https://threejs.org/docs)
- [TailwindCSS 4](https://tailwindcss.com/docs)

### 외부 리소스
- D2Coding 폰트: `cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_three@1.0/D2Coding.woff`
- Three.js CDN: `unpkg.com/three@0.170.0`

---

## 📞 문의 및 지원

이 문서는 세션 1 종료 시점의 프로젝트 상태를 정리한 초기화 문서입니다.  
다음 세션에서는 이 문서를 참고하여 프로젝트를 이어갈 수 있습니다.

**마지막 업데이트**: 2026년 6월 11일 오후 7:09  
**빌드 상태**: ✅ 성공  
**배포 준비**: ✅ 완료

---

## 🎉 완료 체크리스트

- [x] 3가지 모드 완전 구현
- [x] 테마 시스템
- [x] 줌 기능
- [x] 스플래시 화면
- [x] 챌린지 시스템
- [x] 실시간 채점
- [x] 스니펫 시스템 (알록달록, 다중 레인, 가변 속도)
- [x] 타자연습 모드
- [x] D2Coding 폰트
- [x] 커스텀 스크롤바
- [x] 통합 플로팅 UI
- [x] 빌드 성공 확인

**프로젝트 상태**: 🚀 **프로덕션 준비 완료**
