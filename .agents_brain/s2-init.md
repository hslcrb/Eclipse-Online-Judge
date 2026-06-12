# Eclipse Online Judge - 세션 2 초기화 문서

**작성일**: 2026년 6월 12일  
**프로젝트**: Eclipse Online Judge  
**세션**: Session 2 (계속)  
**기술 스택**: Next.js 16, React 19, TypeScript, TailwindCSS 4, Three.js  

---

## 📋 세션 1 완료 사항 요약

### 🎮 구현된 3가지 게임 모드

#### 1. **Normal Mode (일반 모드)** 🖥️
- Eclipse IDE 완벽 재현 (다크/라이트 테마)
- 읽기 전용 → **편집 가능으로 개선 완료**
- 4개 파일 시스템:
  - Main.java (실행 가능한 메인 클래스)
  - Solution.java (솔루션 구현 클래스)
  - BFS.java (BFS 알고리즘 예제)
  - build.gradle (Gradle 빌드 설정)
- 탭 클릭으로 파일 전환
- Textarea 기반 코드 편집
- 줌 기능 (Ctrl + --, Ctrl + ++)
- D2Coding 폰트 적용

#### 2. **Line Match Mode (라인 맞추기 모드)** 🎯
**코드 스니펫이 비처럼 떨어지는 타이밍 게임**

**주요 기능:**
- ✅ **9개의 스폰 레인** - 여러 위치에서 동시에 떨어짐 (5%, 15%, 25%, ..., 85%)
- ✅ **8가지 알록달록한 색상** - 무작위 색상 팔레트
- ✅ **길이 기반 속도** - 짧은 코드는 빠르게, 긴 코드는 느리게
- ✅ **음수 점수 허용** - 실력에 따라 음수 가능
- ✅ **시간 압박** - 위험 구역(70% 이상)에서 점수 차감
- ✅ **난이도 기반 점수** - 길이, 대문자, 특수문자에 따라 차등 점수
- ✅ **3단계 난이도 시스템** - 쉬움/보통/어려움
- ✅ **페널티 시스템**:
  - 틀린 입력: -30점
  - 사라진 코드 입력: -50점
  - 위험 구역: 500ms당 -5점

**난이도별 설정:**
| 난이도 | 속도 | 스폰 간격 |
|--------|------|-----------|
| 쉬움 😊 | 0.6x | 3.5초 |
| 보통 😐 | 1.0x | 2.5초 |
| 어려움 😤 | 1.5x | 1.5초 |

**점수 계산:**
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
  - 틀린 입력: -30점
  - 이미 사라진 코드: -50점
```

**비주얼:**
- 떨어지는 스니펫: 100% 불투명도, 동적 너비
- 완료된 스니펫: 25% 투명도로 배경에 누적
- 매칭 중: 황금색 테두리 + 스케일 증가
- 위험 구역: 빨간색 테두리 + 그림자

#### 3. **Typing Rain Mode (타자연습 모드)** 🌧️
**단어/태그가 비처럼 떨어지는 타자 연습 게임**

**주요 기능:**
- ✅ **5가지 카테고리** (가중치 랜덤):
  - 🔵 Keywords: `function`, `if`, `return` (15%)
  - 🟡 HTML Tags: `<div>`, `<input>`, `<table>` (10%)
  - 🟣 JSP Tags: `<%@`, `<%=`, `<jsp:include>` (10%)
  - ⚪ Symbols: `(`, `)`, `{`, `}`, `;` (10%)
  - 🟢 Phrases: 긴 구문 (40% 출현율)
- ✅ **입력 시스템**: 
  - 실시간 매칭 피드백
  - Enter로 즉시 확정
  - 자유 입력 허용 (+20점)
- ✅ **매칭 피드백**: 황금색 하이라이트
- ✅ **점수**: 캐릭터 길이 × 5 (매칭) / +20 (자유 입력)
- ✅ **3단계 난이도 시스템**

**난이도별 설정:**
| 난이도 | 속도 범위 | 스폰 간격 |
|--------|----------|-----------|
| 쉬움 😊 | 0.15~0.3 | 2.5초 |
| 보통 😐 | 0.25~0.55 | 2.0초 |
| 어려움 😤 | 0.4~0.8 | 1.2초 |

---

## 🐸🐱 펫 시스템

### 🐸 개구리 펫 (FrogPet)
**정교한 3D 모델 (50개 메쉬):**
- 타원형 눈 + 눈동자 + 하이라이트
- 콧구멍 2개
- 토러스로 만든 미소 곡선
- 3단계 관절 팔 (상완-하완-손) + 손가락 6개
- 3단계 관절 다리 (허벅지-무릎-종아리) + 발가락 10개
- 목, 꼬리, 등 무늬 7개

**5단계 댄스 시스템 (각 3초):**
1. **오른팔 내밀기** - 천천히 오른팔 앞으로, 허리를 오른쪽으로
2. **왼팔 내밀기** - 천천히 왼팔 앞으로, 허리를 왼쪽으로
3. **오른발 내밀기** - 오른발 앞으로, 허리 돌리기
4. **왼발 내밀기** - 왼발 앞으로, 반대 방향
5. **벽타기 시뮬레이션** - 몸 기울이기, 팔다리 교차 움직임

**상시 애니메이션:**
- 눈동자 미세한 떨림
- 부드러운 관절 움직임 (easeInOutQuad)

### 🐱 고양이 펫 (CatPet)
**3D 모델:**
- 주황색 고양이 + 흰색 가슴/발/주둥이
- 핑크색 코, 귀 안쪽
- 녹색 고양이 눈 (세로 동공)
- 삼각형 귀 (Cone)
- 수염 6개 (Line geometry)
- 2단계 꼬리 (부드러운 움직임)

**5가지 고양이 포즈 (각 4초):**
1. **Sit (앉기)** - 앞다리 세우고 뒷다리 구부림
2. **Stretch (기지개)** - 몸 기울이고 앞발 쭉 뻗기
3. **Lay Down (눕기)** - 몸 낮추고 편안한 자세
4. **Playful (장난)** - 엉덩이 들고 통통 튀기
5. **Groom (그루밍)** - 왼발로 세수하기

**상시 애니메이션:**
- 귀 미세한 움직임
- 꼏리 자연스러운 흔들림

### 펫 인터랙션
- **드래그**: 마우스로 이동 가능
- **우클릭**: 커스텀 컨텍스트 메뉴 (펫 끄기)
- **토글 UI**: 플로팅 UI에서 개별 ON/OFF 가능

---

## 🎨 UI/UX 특징

### 통합 플로팅 UI (우측 하단)
```
┌─────────────────────┐
│ 테마                │
│   ☀️ Light         │
│   🌙 Dark          │
│   🖥️ System        │
├─────────────────────┤
│ 모드                │
│   📝 Normal        │
│   🎯 Line Match    │
│   🌧️ Typing Rain   │
├─────────────────────┤
│ 난이도              │
│   😊 쉬움   (느림)  │
│   😐 보통   (기본)  │
│   😤 어려움 (빠름)  │
├─────────────────────┤
│ 펫                  │
│   🐸 개구리  ON     │
│   🐱 고양이  ON     │
└─────────────────────┘
```

### 테마 시스템
- ☀️ Light Mode
- 🌙 Dark Mode  
- 🖥️ System (자동 감지)
- CSS 변수 기반 테마 전환
- localStorage 저장

### 인터랙션
- **Ctrl + --** (더블 프레스): 줌 아웃 (3px 단계)
- **Ctrl + ++** (더블 프레스): 줌 인 (3px 단계)
- **Ctrl + S**: 저장 (실시간 채점 포함)
- **Enter**: 라인/단어 확정 (게임 모드)
- **우클릭**: 펫 컨텍스트 메뉴

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
│   ├── app/
│   │   ├── page.tsx          # 메인 컴포넌트 (모든 모드 구현)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── globals.css        # 전역 스타일 + 애니메이션
│   │   └── favicon.ico
│   └── components/
│       └── pets/
│           ├── FrogPet.tsx    # 개구리 펫 컴포넌트
│           ├── CatPet.tsx     # 고양이 펫 컴포넌트
│           └── README.md      # 펫 시스템 문서
├── _jsp/                      # 챌린지 소스 파일
│   ├── check.js              # 35줄
│   ├── db.jsp                # 10줄
│   ├── join.jsp              # 54줄
│   └── sql.sql               # 17줄
├── public/                    # 정적 파일
│   └── 이클립스.svg          # 로고
├── .agents_brain/            # 에이전트 세션 기록
│   ├── init.md               # 세션 1 초기화 문서
│   ├── s1.md                 # 세션 1 대화 기록
│   ├── s1-1.md               # 세션 1 계속
│   ├── s1-2.md               # 세션 1 마지막
│   ├── frog-improvements.md  # 개구리 정교화 문서
│   ├── game-modes-optimization.md  # 게임 모드 정비 문서
│   └── s2-init.md            # 이 문서
├── README.md                 # 메인 프로젝트 문서
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
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.170.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.3",
    "postcss": "^8",
    "tailwindcss": "^4.0.0",
    "typescript": "^5"
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

## 🌈 색상 팔레트

### Line Match Mode (8가지)
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

// 난이도
const [gameDifficulty, setGameDifficulty] = useState<'easy'|'normal'|'hard'>('normal');

// Line Match Mode
const [snippets, setSnippets] = useState<Snippet[]>([]);
const [lineInput, setLineInput] = useState('');
const [lmScore, setLmScore] = useState(0);
const [lmCompleted, setLmCompleted] = useState<string[]>([]);

// Typing Rain Mode
const [fallingWords, setFallingWords] = useState<FallingWord[]>([]);
const [trInput, setTrInput] = useState('');
const [trScore, setTrScore] = useState(0);
const [currentInput, setCurrentInput] = useState('');
const [capturedWords, setCapturedWords] = useState<string[]>([]);

// Normal Mode (편집 가능)
const [activeNormalFile, setActiveNormalFile] = useState<string>("Main.java");
const [normalFileContents, setNormalFileContents] = useState<Record<string, string>>({...});

// 줌
const [codeFontSize, setCodeFontSize] = useState(13);

// 챌린지
const [activeChallenge, setActiveChallenge] = useState<Challenge|null>(null);

// 펫
const [showFrogPet, setShowFrogPet] = useState(true);
const [showCatPet, setShowCatPet] = useState(true);
```

---

## 🎓 핵심 알고리즘

### 1. 스니펫 속도 계산 (Line Match)
```typescript
const difficultySettings = {
  easy: { speedMultiplier: 0.6, spawnInterval: 3500 },
  normal: { speedMultiplier: 1.0, spawnInterval: 2500 },
  hard: { speedMultiplier: 1.5, spawnInterval: 1500 }
};

const settings = difficultySettings[gameDifficulty];
const baseSpeed = 0.08 * settings.speedMultiplier;
const lengthMultiplier = Math.max(0.5, 1 - (snippet.length / 150));
const speed = baseSpeed + (baseSpeed * lengthMultiplier * 2);
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

## 📝 세션 1 개발 히스토리

### 완료된 작업 (순서대로)
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
13. ✅ 스니펫 시스템 (여러 위치, 알록달록, 가변 속도)
14. ✅ 난이도 시스템 (3단계)
15. ✅ 입력 시스템 정비
16. ✅ 개구리 펫 구현 (정교한 3D 모델, 5단계 댄스)
17. ✅ 개구리 정교화 (50개 메쉬, 3단계 관절)
18. ✅ 고양이 펫 구현 (5가지 포즈)
19. ✅ 펫 토글 시스템
20. ✅ 메인 README.md 작성
21. ✅ 일반 모드 편집 기능 추가

---

## 🎯 세션 2 목표

### 즉시 작업할 항목
- [ ] (사용자 지시 대기)

### 추가 개선 가능 항목
1. **더 많은 챌린지 파일** - `_jsp` 폴더에 추가
2. **리더보드 시스템** - 점수 순위표
3. **난이도 선택** - Easy/Medium/Hard 필터
4. **통계 대시보드** - 정확도, 평균 점수, 플레이 시간
5. **사운드 이펙트** - 매칭/실수/완성 효과음
6. **튜토리얼 모드** - 처음 사용자 가이드
7. **멀티플레이어** - 실시간 대결 모드
8. **코드 하이라이팅 개선** - 신택스별 색상 강화
9. **더 많은 펫** - 강아지, 토끼, 오리 등
10. **펫 인벤토리 시스템** - 펫 수집 & 관리

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

## 🎉 현재 상태 체크리스트

- [x] 3가지 모드 완전 구현 (Normal, Line Match, Typing Rain)
- [x] 테마 시스템 (Light/Dark/System)
- [x] 줌 기능 (3px 단계)
- [x] 스플래시 화면 (3D 테서랙트)
- [x] 챌린지 시스템 (4개 파일)
- [x] 실시간 채점
- [x] 스니펫 시스템 (9개 레인, 8가지 색상, 가변 속도)
- [x] 타자연습 모드 (실시간 매칭)
- [x] 난이도 시스템 (3단계)
- [x] D2Coding 폰트
- [x] 커스텀 스크롤바
- [x] 통합 플로팅 UI (테마/모드/난이도/펫)
- [x] 개구리 펫 (정교한 3D, 5단계 댄스)
- [x] 고양이 펫 (5가지 포즈)
- [x] 펫 토글 시스템
- [x] 메인 README.md
- [x] 일반 모드 편집 기능
- [x] 빌드 성공 확인

**프로젝트 상태**: 🚀 **프로덕션 준비 완료**

**마지막 빌드**: 성공 ✅  
**마지막 업데이트**: 2026년 6월 12일  

---

## 📞 세션 2 시작

이 문서는 세션 1 종료 시점의 프로젝트 상태를 정리한 초기화 문서입니다.  
세션 2에서는 이 문서를 참고하여 프로젝트를 이어갈 수 있습니다.

**세션 2 준비 완료!** 🎊

사용자의 다음 지시를 기다립니다.
