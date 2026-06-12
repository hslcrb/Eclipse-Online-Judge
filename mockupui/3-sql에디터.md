이번 화면은 "SQL Editor 탭이 열린 상태"다.

기존 버전과 비교하면 추가된 요소가 몇 개뿐이라 구현은 더 쉽다.

핵심 차이:

### 중앙 영역

기존:

```text
Open a file or drop files here...
```

↓

지금:

```text
┌─────────────────────────────────────────────┐
│ sql.sql ✕                                   │
├─────────────────────────────────────────────┤
│ Connection profile                          │
│ Type: Oracle_11  Name: New Oracle  DB: xe   │
├─────────────────────────────────────────────┤
│ 1                                           │
│                                             │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

즉 중앙을 SQL 에디터처럼 보이게 하면 된다.

TSX에서는:

```tsx
<div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#fff"
  }}
>
  {/* editor tab */}
  <div
    style={{
      height: 28,
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
      borderBottom: "1px solid #d0d0d0",
      background: "#f7f7f7"
    }}
  >
    📄 sql.sql ✕
  </div>

  {/* connection bar */}
  <div
    style={{
      height: 44,
      background: "#f3f3f3",
      borderBottom: "1px solid #d8d8d8",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 12px"
    }}
  >
    <span>Type: Oracle_11</span>
    <span>Name: New Oracle</span>
    <span>Database: xe</span>
    <span style={{ marginLeft: "auto" }}>
      Connected, Auto Commit
    </span>
  </div>

  {/* editor */}
  <div
    style={{
      flex: 1,
      position: "relative",
      background: "#fff"
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 34,
        height: "100%",
        background: "#fafafa",
        borderRight: "1px solid #e0e0e0"
      }}
    >
      <div
        style={{
          paddingTop: 8,
          textAlign: "center",
          color: "#666"
        }}
      >
        1
      </div>
    </div>
  </div>
</div>
```

---

하단 Data Source Explorer는 그대로.

좌측 Project Explorer도 그대로.

---

상태바만 이번 스샷처럼 바꾸면 더 비슷해진다.

```tsx
<div
  style={{
    height: 22,
    background: "#f0f0f0",
    borderTop: "1px solid #ccc",
    display: "flex",
    alignItems: "center",
    padding: "0 6px",
    fontSize: 11
  }}
>
  Database type: Oracle_11
  <span style={{ marginLeft: 20 }}>
    Current profile: New Oracle
  </span>

  <span style={{ marginLeft: 20 }}>
    Database: xe
  </span>

  <span style={{ marginLeft: 20 }}>
    connected
  </span>

  <span style={{ marginLeft: "auto" }}>
    Writable | Insert | 1 : 1 : 0
  </span>
</div>
```

즉 이전 TSX에서 **가운데 빈 공간만 SQL 에디터로 교체**하면 지금 스크린샷과 거의 같은 느낌이 난다.
