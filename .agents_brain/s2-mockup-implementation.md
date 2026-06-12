# Eclipse IDE UI 완전 재구현 계획

**작성일**: 2026년 6월 12일  
**목표**: mockupui 폴더의 4단계 플로우를 정확히 구현  

---

## 📋 4단계 플로우

### 1단계: 초기 화면 (DB Connection Modal)
- Eclipse IDE 레이아웃
- 중앙에 "New Connection Profile" 모달
- Oracle DB 연결 설정
- Finish 버튼 클릭 → 2단계

### 2단계: DB 연결 후
- 모달 사라짐
- Project Explorer 활성화
- 하단 Data Source Explorer에 연결 정보 표시
- 파일 클릭 가능

### 3단계: SQL 에디터
- sql.sql 클릭
- SQL 에디터 탭 열림
- Connection 정보 바 표시
- 라인 넘버 + 에디터

### 4단계: JSP 에디터
- JSP 파일 클릭
- JSP 에디터 탭 열림
- 실제 코드 편집
- Outline 패널 업데이트

---

## 🎨 UI 구조

```
┌─────────────────────────────────────────────────────┐
│ Menu Bar (File, Edit, Navigate...)                 │
├─────────────────────────────────────────────────────┤
│ Toolbar (📄 📂 💾 ↩️ ↪️ ...)                      │
├──────────┬────────────────────────────┬─────────────┤
│ Project  │                            │  Outline    │
│ Explorer │     Center Area            │             │
│          │  (Modal/Editor/Empty)      │             │
│          │                            │             │
├──────────┴────────────────────────────┴─────────────┤
│ Bottom Panel (Problems, Servers, Data Source...)   │
├─────────────────────────────────────────────────────┤
│ Status Bar                                          │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 구현 전략

### State 관리
```typescript
const [uiStage, setUiStage] = useState<1 | 2 | 3 | 4>(1);
const [openFiles, setOpenFiles] = useState<string[]>([]);
const [activeFile, setActiveFile] = useState<string | null>(null);
const [fileContents, setFileContents] = useState<Record<string, string>>({});
const [dbConnected, setDbConnected] = useState(false);
```

### 파일 시스템
```typescript
const files = {
  'check.jsp': '...',
  'footer.jsp': '...',
  'header.jsp': '...',
  'index.jsp': '...',
  'join.jsp': '...',
  'joinok.jsp': '...',
  'list.jsp': '...',
  'sales.jsp': '...',
  'sql.sql': '...',
};
```

---

## 🎯 다음 작업

1. 기존 page.tsx 백업
2. 새로운 Eclipse UI 구조 구현
3. 4단계 플로우 구현
4. 파일 편집 기능 추가
5. 펫 시스템 통합

---

**준비 완료!** 구현 시작합니다.
