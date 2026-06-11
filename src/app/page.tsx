"use client";
import { useState, useEffect, useRef } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  LineBasicMaterial,
  BufferGeometry,
  BufferAttribute,
  LineSegments,
  Vector3
} from "three";

// Theme palettes
const DARK_COLORS = {
  bg: "#3C3F41",
  editorBg: "#2B2B2B",
  tabBar: "#3C3F41",
  tabActive: "#2B2B2B",
  tabInactive: "#4E5254",
  sidebarBg: "#3C3F41",
  menuBg: "#3C3F41",
  toolbarBg: "#3C3F41",
  text: "#A9B7C6",
  textDim: "#6E7070",
  textBright: "#BBBBBB",
  border: "#515658",
  selection: "#214283",
  keyword: "#CC7832",
  string: "#6A8759",
  comment: "#629755",
  number: "#6897BB",
  annotation: "#BBB529",
  type: "#A9B7C6",
  blue: "#5C8FD6",
  statusBg: "#306EAF",
  statusBarText: "#FFFFFF",
  consoleBg: "#1E1E1E",
  javaFileText: "#FFC66D",
  lineNumbersBg: "#313335",
  lineNumbersColor: "#606366",
  lineNumbersBorder: "#3C3C3C",
  panelTitleBg: "#4E5254",
  scrollbarThumb: "rgba(255, 255, 255, 0.2)",
  scrollbarThumbHover: "rgba(255, 255, 255, 0.35)",
  scrollbarTrack: "rgba(0, 0, 0, 0.1)",
};

const LIGHT_COLORS = {
  bg: "#F3F3F3",
  editorBg: "#FFFFFF",
  tabBar: "#E1E1E2",
  tabActive: "#FFFFFF",
  tabInactive: "#ECECEE",
  sidebarBg: "#F3F3F3",
  menuBg: "#F3F3F3",
  toolbarBg: "#F3F3F3",
  text: "#000000",
  textDim: "#787878",
  textBright: "#1E1E1E",
  border: "#C9C9C9",
  selection: "#A6CAF0",
  keyword: "#7F0055",
  string: "#2A00FF",
  comment: "#3F7F5F",
  number: "#0000FF",
  annotation: "#646464",
  type: "#000000",
  blue: "#0066CC",
  statusBg: "#EAEAEA",
  statusBarText: "#333333",
  consoleBg: "#FFFFFF",
  javaFileText: "#333333",
  lineNumbersBg: "#FFFFFF",
  lineNumbersColor: "#787878",
  lineNumbersBorder: "#E1E1E2",
  panelTitleBg: "#E1E1E2",
  scrollbarThumb: "rgba(0, 0, 0, 0.15)",
  scrollbarThumbHover: "rgba(0, 0, 0, 0.3)",
  scrollbarTrack: "rgba(0, 0, 0, 0.03)",
};

const S: { [key: string]: React.CSSProperties } = {
  root: { display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: "var(--eclipse-bg)", fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 12, color: "var(--eclipse-text)", overflow: "hidden", userSelect: "none" },
  menuBar: { display: "flex", alignItems: "center", background: "var(--eclipse-menuBg)", borderBottom: "1px solid var(--eclipse-border)", height: 22, flexShrink: 0, paddingLeft: 4 },
  menuItem: { padding: "0 8px", height: "100%", display: "flex", alignItems: "center", cursor: "pointer", fontSize: 12 },
  toolbar: { display: "flex", alignItems: "center", background: "var(--eclipse-toolbarBg)", borderBottom: "1px solid var(--eclipse-border)", height: 26, flexShrink: 0, padding: "0 4px", gap: 1 },
  toolBtn: { width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 2, border: "1px solid transparent", fontSize: 13 },
  separator: { width: 1, height: 18, background: "var(--eclipse-border)", margin: "0 3px" },
  workspace: { display: "flex", flex: 1, overflow: "hidden" },
  sidePanel: { width: 220, display: "flex", flexDirection: "column", background: "var(--eclipse-sidebarBg)", borderRight: "1px solid var(--eclipse-border)", flexShrink: 0 },
  panelTitle: { background: "var(--eclipse-panelTitleBg)", color: "var(--eclipse-textBright)", padding: "3px 6px", fontSize: 11, fontWeight: "bold", borderBottom: "1px solid var(--eclipse-border)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitleIcons: { display: "flex", gap: 3 },
  panelIcon: { cursor: "pointer", opacity: 0.7, fontSize: 10 },
  tree: { flex: 1, overflow: "auto", padding: "2px 0" },
  treeItem: { display: "flex", alignItems: "center", gap: 3, padding: "1px 4px", cursor: "pointer", whiteSpace: "nowrap" },
  centerArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  tabBar: { display: "flex", background: "var(--eclipse-tabBar)", borderBottom: "1px solid var(--eclipse-border)", height: 24, flexShrink: 0, alignItems: "flex-end" },
  tab: { display: "flex", alignItems: "center", gap: 5, padding: "0 10px", height: 22, cursor: "pointer", borderRight: "1px solid var(--eclipse-border)", fontSize: 12, whiteSpace: "nowrap" },
  tabActive: { background: "var(--eclipse-tabActive)", borderTop: "2px solid var(--eclipse-blue)" },
  tabInactive: { background: "var(--eclipse-tabInactive)", opacity: 0.8 },
  editor: { flex: 1, overflow: "auto", background: "var(--eclipse-editorBg)", display: "flex" },
  lineNumbers: { color: "var(--eclipse-lineNumbersColor)", fontSize: 12, padding: "6px 8px 6px 6px", textAlign: "right", userSelect: "none", borderRight: "1px solid var(--eclipse-lineNumbersBorder)", lineHeight: "18px", flexShrink: 0, background: "var(--eclipse-lineNumbersBg)" },
  code: { padding: "6px 8px", fontSize: 13, fontFamily: "'D2Coding', 'JetBrains Mono', 'Consolas', monospace", lineHeight: "18px", whiteSpace: "pre", flex: 1, outline: "none" },
  bottomPanel: { height: 150, borderTop: "1px solid var(--eclipse-border)", display: "flex", flexDirection: "column", flexShrink: 0 },
  bottomTabs: { display: "flex", background: "var(--eclipse-tabBar)", borderBottom: "1px solid var(--eclipse-border)", height: 22, alignItems: "flex-end" },
  bottomTab: { display: "flex", alignItems: "center", gap: 4, padding: "0 10px", height: 20, cursor: "pointer", fontSize: 12, borderRight: "1px solid var(--eclipse-border)" },
  console: { flex: 1, background: "var(--eclipse-consoleBg)", padding: "4px 8px", overflow: "auto", fontFamily: "Consolas, monospace", fontSize: 12, lineHeight: "16px" },
  rightPanel: { width: 180, borderLeft: "1px solid var(--eclipse-border)", display: "flex", flexDirection: "column", background: "var(--eclipse-sidebarBg)", flexShrink: 0 },
  statusBar: { height: 18, background: "var(--eclipse-statusBg)", display: "flex", alignItems: "center", padding: "0 8px", gap: 16, fontSize: 11, color: "var(--eclipse-statusBarText)", flexShrink: 0, borderTop: "1px solid var(--eclipse-border)" },
  statusSep: { width: 1, height: 12, background: "var(--eclipse-statusSep)" },
};

const JAVA_CODE: { t: string; type?: "keyword" | "text" | "comment" | "number" | "string" | "annotation" | "type" }[] = [
  { t: "package", type: "keyword" }, { t: " com.eclipse.judge.solution;", type: "text" },
  { t: "\n" },
  { t: "\n" },
  { t: "import", type: "keyword" }, { t: " java.util.Scanner;\n", type: "text" },
  { t: "import", type: "keyword" }, { t: " java.util.ArrayList;\n", type: "text" },
  { t: "\n" },
  { t: "/**\n * Main solution class for the Online Judge\n * @author user\n */", type: "comment" },
  { t: "\n" },
  { t: "public", type: "keyword" }, { t: " " }, { t: "class", type: "keyword" }, { t: " Main {\n", type: "text" },
  { t: "\n" },
  { t: "    ", type: "text" }, { t: "private", type: "keyword" }, { t: " ", type: "text" }, { t: "static", type: "keyword" }, { t: " ", type: "text" }, { t: "int", type: "keyword" }, { t: " N;\n", type: "text" },
  { t: "    ", type: "text" }, { t: "private", type: "keyword" }, { t: " ", type: "text" }, { t: "static", type: "keyword" }, { t: " ArrayList<Integer> adj[];\n", type: "text" },
  { t: "\n" },
  { t: "    ", type: "text" }, { t: "public", type: "keyword" }, { t: " ", type: "text" }, { t: "static", type: "keyword" }, { t: " ", type: "text" }, { t: "void", type: "keyword" }, { t: " main(String[] args) {\n", type: "text" },
  { t: "        Scanner sc = ", type: "text" }, { t: "new", type: "keyword" }, { t: " Scanner(System.in);\n", type: "text" },
  { t: "        N = sc.nextInt();\n", type: "text" },
  { t: "        " }, { t: "int", type: "keyword" }, { t: " M = sc.nextInt();\n", type: "text" },
  { t: "\n" },
  { t: "        // Initialize adjacency list\n", type: "comment" },
  { t: "        adj = ", type: "text" }, { t: "new", type: "keyword" }, { t: " ArrayList[N + ", type: "text" }, { t: "1", type: "number" }, { t: "];\n", type: "text" },
  { t: "        " }, { t: "for", type: "keyword" }, { t: " (", type: "text" }, { t: "int", type: "keyword" }, { t: " i = ", type: "text" }, { t: "0", type: "number" }, { t: "; i <= N; i++) {\n", type: "text" },
  { t: "            adj[i] = ", type: "text" }, { t: "new", type: "keyword" }, { t: " ArrayList<>();\n", type: "text" },
  { t: "        }\n", type: "text" },
  { t: "\n" },
  { t: "        " }, { t: "for", type: "keyword" }, { t: " (", type: "text" }, { t: "int", type: "keyword" }, { t: " i = ", type: "text" }, { t: "0", type: "number" }, { t: "; i < M; i++) {\n", type: "text" },
  { t: "            " }, { t: "int", type: "keyword" }, { t: " u = sc.nextInt(), v = sc.nextInt();\n", type: "text" },
  { t: "            adj[u].add(v);\n", type: "text" },
  { t: "            adj[v].add(u);\n", type: "text" },
  { t: "        }\n\n" },
  { t: "        System.out.println(bfs(", type: "text" }, { t: "1", type: "number" }, { t: "));\n", type: "text" },
  { t: "    }\n\n" },
  { t: "    ", type: "text" }, { t: "static", type: "keyword" }, { t: " ", type: "text" }, { t: "int", type: "keyword" }, { t: " bfs(", type: "text" }, { t: "int", type: "keyword" }, { t: " start) {\n", type: "text" },
  { t: "        ", type: "text" }, { t: "boolean", type: "keyword" }, { t: "[] visited = ", type: "text" }, { t: "new", type: "keyword" }, { t: " ", type: "text" }, { t: "boolean", type: "keyword" }, { t: "[N + ", type: "text" }, { t: "1", type: "number" }, { t: "];\n", type: "text" },
  { t: "        // BFS traversal\n", type: "comment" },
  { t: "        visited[start] = ", type: "text" }, { t: "true", type: "keyword" }, { t: ";\n", type: "text" },
  { t: "        " }, { t: "return", type: "keyword" }, { t: " ", type: "text" }, { t: "0", type: "number" }, { t: ";\n", type: "text" },
  { t: "    }\n" },
  { t: "}\n" },
];

const totalLines = (() => {
  let n = 1;
  for (const t of JAVA_CODE) if (t.t.includes("\n")) n += (t.t.match(/\n/g) || []).length;
  return n;
})();

// Challenge files from _jsp folder
const CHALLENGE_FILES: { [key: string]: { content: string; lines: number; hint: string } } = {
  "check.js": {
    content: `function joinCheck() {
    if (document.frm.custno.value == '') {
        alert('회원번호가 입력되지 않았습니다.')
        document.frm.custno.focus();
        return false;
    }
    if (document.frm.custname.value == '') {
        alert('회원성명이 입력되지 않았습니다.')
        document.frm.custname.focus();
        return false;
    }
    if (document.frm.phone.value == '') {
        alert('전화번호가 입력되지 않았습니다.')
        document.frm.phone.focus();
        return false;
    }
    if (document.frm.address.value == '') {
        alert('회원주소가 입력되지 않았습니다.')
        document.frm.address.focus();
        return false;
    }
    if (document.frm.joindate.value == '') {
        alert('가입일자가 입력되지 않았습니다.')
        document.frm.joindate.focus();
        return false;
    }
    if (document.frm.grade.value == '') {
        alert('고객등급이 입력되지 않았습니다.')
        document.frm.grade.focus();
        return false;
    }
    if (document.frm.city.value == '') {
        alert('도시코드가 입력되지 않았습니다.')
        document.frm.city.focus();
        return false;
    }

    return true;
}`,
    lines: 35,
    hint: "폼 유효성 검사 함수입니다. 각 필드가 비어있는지 확인하세요!"
  },
  "db.jsp": {
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.sql.*" %>

<% 
  Class.forName("oracle.jdbc.OracleDriver");
  Connection con = DriverManager.getConnection(
    "jdbc:oracle:thin:@//localhost:1521/xe",
    "system",
    "1234"
  );
%>`,
    lines: 10,
    hint: "Oracle DB 연결 설정입니다. JDBC 드라이버를 로드하고 연결 객체를 생성하세요!"
  },
  "join.jsp": {
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="db.jsp" %>
<% request.setCharacterEncoding("utf-8"); %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>회원등록</title>
</head>
<body>
    <script type="text/javascript" src="check.js"></script>
    <jsp:include page="header.jsp"></jsp:include>
    <h3 align="center">홈쇼핑 회원 등록</h3>
    
    <form name='frm' method='post' action='joinok.jsp'>
        <table align='center' border='1'>
            <tr>
                <td align='center'>회원번호</td>
                <td><input type='text' name='custno'></td>
            </tr>
            <tr>
                <td align='center'>회원성명</td>
                <td><input type='text' name='custname'></td>
            </tr>
            <tr>
                <td align='center'>회원전화</td>
                <td><input type='text' name='phone'></td>
            </tr>
            <tr>
                <td align='center'>회원주소</td>
                <td><input type='text' name='address'></td>
            </tr>
            <tr>
                <td align='center'>가입일자</td>
                <td><input type='text' name='joindate'></td>
            </tr>
            <tr>
                <td align='center'>고객등급(A: VIP, B: 일반, C: 직원)</td>
                <td><input type='text' name='grade'></td>
            </tr>
            <tr>
                <td align='center'>도시코드</td>
                <td><input type='text' name='city'></td>
            </tr>
            <tr>
                <td colspan='2' align='center'>
                    <input type='submit' value='등록' onclick='return joinCheck()'>
                    <input type='button' value='조회'>
                </td>
            </tr>
        </table>
    </form>
    
    <jsp:include page="footer.jsp"></jsp:include>
</body>
</html>`,
    lines: 54,
    hint: "회원 등록 폼입니다. 테이블 구조와 input 태그를 정확히 작성하세요!"
  },
  "sql.sql": {
    content: `CREATE TABLE member_tbl_02(
    custno number(6) NOT NULL,
    custname varchar2(20),
    phone varchar2(13),
    address varchar2(60),
    joindate date,
    grade char(1),
    city char(2),
    PRIMARY KEY(custno)
);

INSERT INTO member_tbl_02 VALUES (100001,'김행복','010-1111-2222','서울 동대문구 휘경1동','20151202','A','01');
INSERT INTO member_tbl_02 VALUES (100002,'이축복','010-1111-3333','서울 동대문구 휘경2동','20151206','B','01');
INSERT INTO member_tbl_02 VALUES (100003,'장믿음','010-1111-4444','울릉군 울릉읍 독도1리','20151001','B','30');
INSERT INTO member_tbl_02 VALUES (100004,'최사랑','010-1111-5555','울릉군 울릉읍 독도2리','20151113','A','30');
INSERT INTO member_tbl_02 VALUES (100005,'진평화','010-1111-6666','제주시 제주도 외나무골','20151225','B','60');
INSERT INTO member_tbl_02 VALUES (100006,'차공단','010-1111-7777','제주시 제주도 감나무골','20151211','C','60');`,
    lines: 17,
    hint: "테이블 생성과 데이터 삽입 쿼리입니다. SQL 문법에 주의하세요!"
  }
};

// Typing Rain mode word pools - longer phrases
const TYPING_WORDS = {
  keywords: ["function", "if", "else", "return", "const", "let", "var", "for", "while", "class", "import", "export", "async", "await", "try", "catch", "switch", "case", "break", "continue"],
  javaKeywords: ["public", "private", "static", "void", "int", "String", "boolean", "class", "extends", "implements", "new", "this", "super"],
  htmlTags: ["<div>", "<span>", "<input>", "<form>", "<table>", "<tr>", "<td>", "<button>", "<script>", "</script>", "<head>", "<body>", "</body>", "</html>"],
  jspTags: ["<%@", "%>", "<%=", "<%", "<jsp:include", "</jsp:include>", "page=\"\"", "import=\"java.sql.*\"", "contentType=\"text/html\""],
  symbols: ["(", ")", "{", "}", "[", "]", ";", ":", "=", "==", "!=", "&&", "||", ".", ",", "=>", "->"],
  phrases: [
    "document.frm.custno.value",
    "alert('입력되지 않았습니다.')",
    "document.frm.custno.focus();",
    "return false;",
    "request.setCharacterEncoding(\"utf-8\");",
    "Class.forName(\"oracle.jdbc.OracleDriver\");",
    "DriverManager.getConnection(",
    "PreparedStatement pstmt",
    "ResultSet rs",
    "if (document.frm.",
    "<td align='center'>",
    "<input type='text' name='",
    "function joinCheck() {",
    "style=\"background-color:",
    "<% request.setCharacterEncoding(",
    "<%@ include file=\"",
    "Connection con =",
    "<table align='center' border='1'>",
    "onclick='return joinCheck()'",
    "<jsp:include page=\"header.jsp\">",
  ],
  common: ["document", "value", "alert", "focus", "name", "type", "align", "center", "text", "submit", "button", "table", "border", "style"]
};

type TreeNode = { name: string; icon: string; children?: TreeNode[]; open?: boolean };

const TREE: TreeNode[] = [
  {
    name: "EclipseOnlineJudge", icon: "📁", open: true, children: [
      {
        name: "src", icon: "📂", open: true, children: [
          {
            name: "com.eclipse.judge", icon: "📦", open: true, children: [
              { name: "Main.java", icon: "☕" },
              { name: "Solution.java", icon: "☕" },
              { name: "BFS.java", icon: "☕" },
            ]
          },
          {
            name: "com.eclipse.judge.utils", icon: "📦", children: [
              { name: "InputReader.java", icon: "☕" },
              { name: "OutputWriter.java", icon: "☕" },
            ]
          }
        ]
      },
      {
        name: "_jsp", icon: "📂", open: true, children: [
          { name: "check.js", icon: "📜" },
          { name: "db.jsp", icon: "📄" },
          { name: "footer.jsp", icon: "📄" },
          { name: "header.jsp", icon: "📄" },
          { name: "index.jsp", icon: "📄" },
          { name: "join.jsp", icon: "📄" },
          { name: "joinok.jsp", icon: "📄" },
          { name: "list.jsp", icon: "📄" },
          { name: "sales.jsp", icon: "📄" },
          { name: "sql.sql", icon: "🗄️" },
        ]
      },
      {
        name: "JRE System Library [17]", icon: "📚", children: [
          { name: "rt.jar", icon: "🫙" },
        ]
      },
      { name: "build.gradle", icon: "🔧" },
      { name: "README.md", icon: "📄" },
    ]
  }
];

function TreeView({ nodes, depth = 0, onFileClick }: { nodes: TreeNode[]; depth?: number; onFileClick?: (name: string) => void }) {
  const [openMap, setOpenMap] = useState<{ [k: string]: boolean }>(() => {
    const m: { [k: string]: boolean } = {};
    nodes.forEach(n => { if (n.open) m[n.name] = true; });
    return m;
  });
  return (
    <>
      {nodes.map(node => (
        <div key={node.name}>
          <div
            style={{ ...S.treeItem, paddingLeft: 4 + depth * 14 }}
            onClick={() => {
              if (node.children) {
                setOpenMap(m => ({ ...m, [node.name]: !m[node.name] }));
              } else if (onFileClick) {
                onFileClick(node.name);
              }
            }}
          >
            {node.children ? (
              <span style={{ color: "var(--eclipse-textDim)", fontSize: 10, width: 10 }}>{openMap[node.name] ? "▾" : "▸"}</span>
            ) : (
              <span style={{ width: 10 }} />
            )}
            <span style={{ fontSize: 13 }}>{node.icon}</span>
            <span style={{ color: node.name.endsWith(".java") ? "var(--eclipse-javaFileText)" : "var(--eclipse-textBright)", fontSize: 12 }}>{node.name}</span>
          </div>
          {node.children && openMap[node.name] && (
            <TreeView nodes={node.children} depth={depth + 1} onFileClick={onFileClick} />
          )}
        </div>
      ))}
    </>
  );
}

const MENUS = ["File", "Edit", "Source", "Refactor", "Navigate", "Search", "Project", "Run", "Window", "Help"];

const TOOLBAR_ICONS = [
  ["🆕", "New"], ["📂", "Open"], ["💾", "Save"], null,
  ["↩️", "Undo"], ["↪️", "Redo"], null,
  ["🔍", "Search"], null,
  ["▶️", "Run"], ["🐛", "Debug"], null,
  ["📦", "Export"],
];

const BOTTOM_TABS = ["Problems", "Javadoc", "Declaration", "Console", "Progress", "Error Log"];

const OUTLINE_ITEMS = [
  { icon: "📦", label: "Main", depth: 0 },
  { icon: "🔷", label: "N : int", depth: 1 },
  { icon: "🔷", label: "adj : ArrayList[]", depth: 1 },
  { icon: "🟠", label: "main(String[]) : void", depth: 1 },
  { icon: "🟠", label: "bfs(int) : int", depth: 1 },
];

function Tesseract({ resolvedTheme }: { resolvedTheme: "dark" | "light" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = 210;
    const height = 210;
    const scene = new Scene();
    const camera = new PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 4D vertices (16 vertices of tesseract)
    const vertices4D: number[][] = [];
    for (let x of [-1, 1]) {
      for (let y of [-1, 1]) {
        for (let z of [-1, 1]) {
          for (let w of [-1, 1]) {
            vertices4D.push([x, y, z, w]);
          }
        }
      }
    }

    // 4D edges (32 edges)
    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        let diff = 0;
        for (let k = 0; k < 4; k++) {
          if (vertices4D[i][k] !== vertices4D[j][k]) diff++;
        }
        if (diff === 1) {
          edges.push([i, j]);
        }
      }
    }

    // Three.js Point Meshes for Vertices
    const pointGeo = new SphereGeometry(0.04, 12, 12);
    const pointMatColor = resolvedTheme === "dark" ? 0x5C8FD6 : 0x0066CC;
    const pointMat = new MeshBasicMaterial({ color: pointMatColor });
    const pointMeshes: Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const mesh = new Mesh(pointGeo, pointMat);
      scene.add(mesh);
      pointMeshes.push(mesh);
    }

    // Three.js Line Segment geometry for Edges
    const lineMatColor = resolvedTheme === "dark" ? 0x999999 : 0x555555;
    const lineMat = new LineBasicMaterial({
      color: lineMatColor,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5,
    });
    
    const linePositions = new Float32Array(32 * 2 * 3);
    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute("position", new BufferAttribute(linePositions, 3));
    const lines = new LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // Animation variables
    let angleXW = 0;
    let angleYW = 0;
    let angleZW = 0;
    let angleXY = 0;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Fast, dynamic rotation
      angleXW += 0.02;
      angleYW += 0.015;
      angleZW += 0.018;
      angleXY += 0.01;

      const projected3D: Vector3[] = [];
      const d = 2.0; // projection distance in 4D space

      for (let i = 0; i < 16; i++) {
        let [x, y, z, w] = vertices4D[i];

        // Rotation in XW plane
        let x1 = x * Math.cos(angleXW) - w * Math.sin(angleXW);
        let w1 = x * Math.sin(angleXW) + w * Math.cos(angleXW);

        // Rotation in YW plane
        let y2 = y * Math.cos(angleYW) - w1 * Math.sin(angleYW);
        let w2 = y * Math.sin(angleYW) + w1 * Math.cos(angleYW);

        // Rotation in ZW plane
        let z3 = z * Math.cos(angleZW) - w2 * Math.sin(angleZW);
        let w3 = z * Math.sin(angleZW) + w2 * Math.cos(angleZW);

        // Rotation in XY plane
        let x4 = x1 * Math.cos(angleXY) - y2 * Math.sin(angleXY);
        let y4 = x1 * Math.sin(angleXY) + y2 * Math.cos(angleXY);

        // Project 4D to 3D
        const factor = 1.2 / (d - w3); // 1.2 is a scale multiplier to make it slightly larger
        const x3d = x4 * factor;
        const y3d = y2 * factor;
        const z3d = z3 * factor;

        projected3D.push(new Vector3(x3d, y3d, z3d));
        pointMeshes[i].position.set(x3d, y3d, z3d);
      }

      // Update line segment vertices
      const positions = lineGeo.attributes.position.array as Float32Array;
      let posIdx = 0;
      for (let e = 0; e < edges.length; e++) {
        const [p1, p2] = edges[e];
        const v1 = projected3D[p1];
        const v2 = projected3D[p2];

        positions[posIdx++] = v1.x;
        positions[posIdx++] = v1.y;
        positions[posIdx++] = v1.z;

        positions[posIdx++] = v2.x;
        positions[posIdx++] = v2.y;
        positions[posIdx++] = v2.z;
      }
      lineGeo.attributes.position.needsUpdate = true;

      // Rotate entire scene
      scene.rotation.y += 0.008;
      scene.rotation.x += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pointGeo.dispose();
      pointMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, [resolvedTheme]);

  return <div ref={mountRef} style={{ width: 210, height: 210 }} />;
}

export default function EclipseIDE() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeBottom, setActiveBottom] = useState(3);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);

  // Theme states
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [toggleOpen, setToggleOpen] = useState(false);

  // Splash screen states
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Code editor zoom state
  const [codeFontSize, setCodeFontSize] = useState(13);
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Challenge mode states
  const [gameMode, setGameMode] = useState<"normal" | "lineMatch" | "typingRain">("normal");
  const [currentFile, setCurrentFile] = useState<string>("check.js");
  const [typedCode, setTypedCode] = useState("");
  const [completedLines, setCompletedLines] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [clearAnimations, setClearAnimations] = useState<{ id: number; text: string; x: number }[]>([]);
  const [combo, setCombo] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Typing Rain mode states
  const [fallingWords, setFallingWords] = useState<{ id: number; word: string; x: number; y: number; speed: number; type: string }[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentLine, setCurrentLine] = useState<string[]>([]);
  const [completedCode, setCompletedCode] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [indentLevel, setIndentLevel] = useState(0);

  // Grading system states
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [savedNotification, setSavedNotification] = useState(false);

  // Splash screen lifecycle
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Initialize themeMode from localStorage after mounting
  useEffect(() => {
    const saved = localStorage.getItem("eclipse-theme-mode");
    if (saved === "dark" || saved === "light" || saved === "system") {
      setThemeMode(saved);
    }
  }, []);

  // Handle system preference dynamic detection
  useEffect(() => {
    if (themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setResolvedTheme(mediaQuery.matches ? "dark" : "light");

      const handleChange = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setResolvedTheme(themeMode);
    }
    localStorage.setItem("eclipse-theme-mode", themeMode);
  }, [themeMode]);

  // Keyboard handler for code zoom (Ctrl + -- for zoom out, Ctrl + ++ for zoom in)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (gameMode === "lineMatch") {
          // Save in Line Match mode - trigger grading
          setSavedNotification(true);
          setTimeout(() => setSavedNotification(false), 2000);
          
          // Show save animation
          setClearAnimations(prev => [...prev, {
            id: Date.now(),
            text: "💾 SAVED!",
            x: 50
          }]);
          setTimeout(() => {
            setClearAnimations(prev => prev.slice(1));
          }, 1500);
        }
        return;
      }

      // Only handle when Ctrl (or Cmd on Mac) is pressed
      if (!e.ctrlKey && !e.metaKey) return;

      const currentTime = Date.now();
      const key = e.key;

      // Detect double press within 500ms
      if ((key === '-' || key === '=' || key === '+') && lastKey === key && (currentTime - lastKeyTime) < 500) {
        e.preventDefault();
        
        if (key === '-') {
          // Zoom out (decrease font size by 3px, minimum 8)
          setCodeFontSize(prev => Math.max(8, prev - 3));
        } else if (key === '=' || key === '+') {
          // Zoom in (increase font size by 3px, maximum 48)
          setCodeFontSize(prev => Math.min(48, prev + 3));
        }

        // Reset tracking after successful action
        setLastKey(null);
        setLastKeyTime(0);
      } else if (key === '-' || key === '=' || key === '+') {
        // First press, track it
        e.preventDefault();
        setLastKey(key);
        setLastKeyTime(currentTime);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastKey, lastKeyTime, gameMode]);

  // Challenge mode: Check typed code and trigger animations with real-time grading
  useEffect(() => {
    if (gameMode !== "lineMatch" || !startTime) return;

    const targetCode = CHALLENGE_FILES[currentFile].content;
    const lines = typedCode.split('\n');
    const targetLines = targetCode.split('\n');
    
    // Calculate accuracy
    let totalChars = 0;
    let correctChars = 0;
    let wrongChars = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const typedLine = lines[i] || "";
      const targetLine = targetLines[i] || "";
      const maxLen = Math.max(typedLine.length, targetLine.length);
      
      for (let j = 0; j < maxLen; j++) {
        totalChars++;
        if (typedLine[j] === targetLine[j]) {
          correctChars++;
        } else if (typedLine[j] !== undefined) {
          wrongChars++;
        }
      }
    }
    
    // Calculate real-time accuracy
    const currentAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    setAccuracy(currentAccuracy);
    setMistakes(wrongChars);
    
    // Count correctly completed lines
    let correctLines = 0;
    for (let i = 0; i < Math.min(lines.length, targetLines.length); i++) {
      if (lines[i] === targetLines[i]) {
        correctLines++;
      } else {
        break;
      }
    }

    if (correctLines > completedLines) {
      // Line cleared! Add animation
      const newClears: { id: number; text: string; x: number }[] = [];
      for (let i = completedLines; i < correctLines; i++) {
        const comboMultiplier = Math.floor(combo / 5) + 1;
        const accuracyBonus = Math.floor(currentAccuracy / 10);
        const lineScore = 100 * comboMultiplier * (1 + accuracyBonus * 0.1);
        setScore(prev => prev + Math.round(lineScore));
        setCombo(prev => prev + 1);
        
        newClears.push({
          id: Date.now() + i,
          text: combo >= 5 ? `COMBO x${comboMultiplier}! +${Math.round(lineScore)}` : `LINE CLEAR! +${Math.round(lineScore)}`,
          x: Math.random() * 60 + 20
        });
      }
      
      setClearAnimations(prev => [...prev, ...newClears]);
      setCompletedLines(correctLines);

      // Remove animations after 2 seconds
      setTimeout(() => {
        setClearAnimations(prev => prev.filter(a => !newClears.find(n => n.id === a.id)));
      }, 2000);
    }

    // Check if completed
    if (typedCode === targetCode) {
      const timeTaken = (Date.now() - startTime) / 1000;
      const timeBonus = Math.max(0, Math.floor((300 - timeTaken) * 10));
      const accuracyBonus = Math.floor(currentAccuracy * 50);
      const mistakePenalty = mistakes * 10;
      const finalBonus = timeBonus + accuracyBonus - mistakePenalty + 5000;
      
      setScore(prev => prev + finalBonus);
      
      setClearAnimations(prev => [...prev, {
        id: Date.now(),
        text: `🎉 PERFECT! +${finalBonus}`,
        x: 50
      }]);

      setTimeout(() => {
        alert(`파일 완성!\n\n최종 점수: ${score + finalBonus}\n정확도: ${currentAccuracy}%\n실수: ${mistakes}회\n소요 시간: ${timeTaken.toFixed(1)}초`);
      }, 100);
    }
  }, [typedCode, gameMode, currentFile, completedLines, combo, startTime, score, mistakes]);

  // Reset combo if user stops typing for 3 seconds
  useEffect(() => {
    if (gameMode !== "lineMatch" || combo === 0) return;
    
    const timer = setTimeout(() => {
      setCombo(0);
    }, 3000);

    return () => clearTimeout(timer);
  }, [typedCode, gameMode, combo]);

  // Typing Rain: Spawn falling words
  useEffect(() => {
    if (gameMode !== "typingRain") return;

    const spawnWord = () => {
      const allCategories = [
        { words: TYPING_WORDS.phrases, type: "phrase", weight: 40 },
        { words: TYPING_WORDS.keywords, type: "keyword", weight: 15 },
        { words: TYPING_WORDS.javaKeywords, type: "javaKeyword", weight: 10 },
        { words: TYPING_WORDS.htmlTags, type: "htmlTag", weight: 10 },
        { words: TYPING_WORDS.jspTags, type: "jspTag", weight: 10 },
        { words: TYPING_WORDS.symbols, type: "symbol", weight: 10 },
        { words: TYPING_WORDS.common, type: "common", weight: 5 }
      ];
      
      // Weighted random selection (favors longer phrases)
      const totalWeight = allCategories.reduce((sum, cat) => sum + cat.weight, 0);
      let random = Math.random() * totalWeight;
      
      let selectedCategory = allCategories[0];
      for (const cat of allCategories) {
        random -= cat.weight;
        if (random <= 0) {
          selectedCategory = cat;
          break;
        }
      }
      
      const word = selectedCategory.words[Math.floor(Math.random() * selectedCategory.words.length)];

      setFallingWords(prev => [...prev, {
        id: Date.now() + Math.random(),
        word,
        x: Math.random() * 80 + 5,
        y: -5,
        speed: Math.random() * 0.3 + 0.25,
        type: selectedCategory.type
      }]);
    };

    const spawnInterval = setInterval(spawnWord, 2000);
    return () => clearInterval(spawnInterval);
  }, [gameMode]);

  // Typing Rain: Update falling words positions
  useEffect(() => {
    if (gameMode !== "typingRain") return;

    const updateInterval = setInterval(() => {
      setFallingWords(prev => 
        prev
          .map(w => ({ ...w, y: w.y + w.speed }))
          .filter(w => w.y < 100) // Remove words that fell off screen
      );
    }, 16); // ~60fps

    return () => clearInterval(updateInterval);
  }, [gameMode]);

  const colors = resolvedTheme === "dark" ? DARK_COLORS : LIGHT_COLORS;

  const themeVariables = {
    "--eclipse-bg": colors.bg,
    "--eclipse-editorBg": colors.editorBg,
    "--eclipse-tabBar": colors.tabBar,
    "--eclipse-tabActive": colors.tabActive,
    "--eclipse-tabInactive": colors.tabInactive,
    "--eclipse-sidebarBg": colors.sidebarBg,
    "--eclipse-menuBg": colors.menuBg,
    "--eclipse-toolbarBg": colors.toolbarBg,
    "--eclipse-text": colors.text,
    "--eclipse-textDim": colors.textDim,
    "--eclipse-textBright": colors.textBright,
    "--eclipse-border": colors.border,
    "--eclipse-selection": colors.selection,
    "--eclipse-keyword": colors.keyword,
    "--eclipse-string": colors.string,
    "--eclipse-comment": colors.comment,
    "--eclipse-number": colors.number,
    "--eclipse-annotation": colors.annotation,
    "--eclipse-type": colors.type,
    "--eclipse-blue": colors.blue,
    "--eclipse-statusBg": colors.statusBg,
    "--eclipse-statusBarText": colors.statusBarText,
    "--eclipse-consoleBg": colors.consoleBg,
    "--eclipse-javaFileText": colors.javaFileText,
    "--eclipse-lineNumbersBg": colors.lineNumbersBg,
    "--eclipse-lineNumbersColor": colors.lineNumbersColor,
    "--eclipse-lineNumbersBorder": colors.lineNumbersBorder,
    "--eclipse-panelTitleBg": colors.panelTitleBg,
    "--eclipse-scrollbarThumb": colors.scrollbarThumb,
    "--eclipse-scrollbarThumbHover": colors.scrollbarThumbHover,
    "--eclipse-scrollbarTrack": colors.scrollbarTrack,
    "--eclipse-statusSep": resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.15)",
  } as React.CSSProperties;

  const tabs = [
    { name: "Main.java", modified: false },
    { name: "Solution.java", modified: true },
    { name: "build.gradle", modified: false },
  ];

  const handleFileClick = (fileName: string) => {
    if (CHALLENGE_FILES[fileName]) {
      setCurrentFile(fileName);
      if (gameMode === "normal") {
        const modeChoice = confirm(`${fileName} 게임 모드를 선택하세요:\n\n확인 = 라인 맞추기 모드\n취소 = 타자연습 모드`);
        if (modeChoice) {
          // Line Match Mode
          setGameMode("lineMatch");
          setTypedCode("");
          setCompletedLines(0);
          setScore(0);
          setCombo(0);
          setStartTime(Date.now());
          setTimeout(() => editorRef.current?.focus(), 100);
        } else {
          // Typing Rain Mode
          setGameMode("typingRain");
          setCurrentInput("");
          setCurrentLine([]);
          setCompletedCode([]);
          setFallingWords([]);
          setScore(0);
          setCombo(0);
          setStartTime(Date.now());
        }
      }
    }
  };

  return (
    <div style={{ ...S.root, ...themeVariables }}>
      {/* Menu Bar */}
      <div style={S.menuBar}>
        <span style={{ marginRight: 8, fontSize: 14 }}>🌑</span>
        {MENUS.map((m, i) => (
          <div
            key={m}
            style={{
              ...S.menuItem,
              background: hoveredMenu === i ? "var(--eclipse-selection)" : "transparent",
            }}
            onMouseEnter={() => setHoveredMenu(i)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            {m}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={S.toolbar}>
        {TOOLBAR_ICONS.map((t, i) =>
          t === null ? (
            <div key={i} style={S.separator} />
          ) : (
            <div key={i} title={t[1]} style={S.toolBtn}>
              <span style={{ fontSize: 14 }}>{t[0]}</span>
            </div>
          )
        )}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", background: "var(--eclipse-tabInactive)", borderRadius: 3, padding: "1px 6px", gap: 4, border: "1px solid var(--eclipse-border)" }}>
          <span style={{ color: "var(--eclipse-textDim)", fontSize: 11 }}>🔍</span>
          <span style={{ color: "var(--eclipse-textDim)", fontSize: 11 }}>Quick Access</span>
        </div>
        <div style={{ width: 20, textAlign: "center", cursor: "pointer" }}>⊞</div>
      </div>

      {/* Workspace */}
      <div style={S.workspace}>
        {/* Left: Package Explorer */}
        <div style={S.sidePanel}>
          <div style={S.panelTitle}>
            Package Explorer
            <div style={S.panelTitleIcons}>
              <span style={S.panelIcon}>⊟</span>
              <span style={S.panelIcon}>↕</span>
              <span style={S.panelIcon}>✕</span>
            </div>
          </div>
          <div style={S.tree}>
            <TreeView nodes={TREE} onFileClick={handleFileClick} />
          </div>
        </div>

        {/* Center: Editor + Bottom */}
        <div style={S.centerArea}>
          {/* Editor Tabs */}
          <div style={S.tabBar}>
            {gameMode !== "normal" && CHALLENGE_FILES[currentFile] ? (
              // Game mode: Show current challenge file
              <div
                style={{ ...S.tab, ...S.tabActive }}
              >
                <span style={{ fontSize: 13 }}>
                  {currentFile.endsWith('.js') ? '📜' : 
                   currentFile.endsWith('.jsp') ? '📄' : 
                   currentFile.endsWith('.sql') ? '🗄️' : '📝'}
                </span>
                <span>{currentFile}</span>
                <span style={{ color: "var(--eclipse-textDim)", fontSize: 10, marginLeft: 2 }}>
                  {gameMode === "lineMatch" ? "🎯" : "🌧️"}
                </span>
              </div>
            ) : (
              // Normal mode: Show default tabs
              tabs.map((tab, i) => (
                <div
                  key={tab.name}
                  style={{ ...S.tab, ...(activeTab === i ? S.tabActive : S.tabInactive) }}
                  onClick={() => setActiveTab(i)}
                >
                  <span style={{ fontSize: 13 }}>☕</span>
                  <span>{tab.modified ? `${tab.name} *` : tab.name}</span>
                  <span style={{ color: "var(--eclipse-textDim)", fontSize: 10, marginLeft: 2 }}>✕</span>
                </div>
              ))
            )}
          </div>

          {/* Editor */}
          <div style={S.editor}>
            {gameMode === "lineMatch" ? (
              // Line Match Mode Editor
              <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
                <textarea
                  ref={editorRef}
                  value={typedCode}
                  onChange={(e) => setTypedCode(e.target.value)}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    fontSize: codeFontSize,
                    fontFamily: "'D2Coding', 'JetBrains Mono', 'Consolas', monospace",
                    lineHeight: `${Math.round(codeFontSize * 1.38)}px`,
                    background: "var(--eclipse-editorBg)",
                    color: "var(--eclipse-text)",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    whiteSpace: "pre",
                    overflowWrap: "normal",
                    overflowX: "auto"
                  }}
                />
                
                {/* Score & Progress HUD */}
                <div style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(8px)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  color: "#FFF",
                  fontSize: 11,
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  pointerEvents: "none",
                  zIndex: 10
                }}>
                  <div style={{ color: "#FFD700" }}>⭐ {score.toLocaleString()}</div>
                  <div style={{ color: "#00FF88" }}>{completedLines}/{CHALLENGE_FILES[currentFile].lines} 줄</div>
                  <div style={{ 
                    color: accuracy >= 95 ? "#00FF88" : accuracy >= 80 ? "#FFD700" : "#FF6B6B" 
                  }}>
                    🎯 {accuracy}%
                  </div>
                  {mistakes > 0 && <div style={{ color: "#FF6B6B", fontSize: 10 }}>❌ {mistakes}</div>}
                  {combo >= 5 && <div style={{ color: "#FF6B6B" }}>🔥 COMBO x{Math.floor(combo / 5) + 1}</div>}
                  <div style={{ fontSize: 9, color: "#AAA", marginTop: 2 }}>{currentFile}</div>
                  <div style={{ fontSize: 9, color: "#AAA" }}>Ctrl+S 저장</div>
                </div>

                {/* Hint Button */}
                <button
                  onClick={() => setShowHint(!showHint)}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    background: "rgba(92, 143, 214, 0.9)",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    color: "#FFF",
                    fontSize: 11,
                    fontWeight: "bold",
                    cursor: "pointer",
                    zIndex: 10
                  }}
                >
                  💡 힌트
                </button>

                {showHint && (
                  <div style={{
                    position: "absolute",
                    top: 40,
                    left: 8,
                    background: "rgba(255, 235, 59, 0.95)",
                    border: "2px solid #FFA000",
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: "#000",
                    fontSize: 11,
                    maxWidth: 300,
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}>
                    {CHALLENGE_FILES[currentFile].hint}
                  </div>
                )}

                {/* Clear Animations */}
                {clearAnimations.map(anim => (
                  <div
                    key={anim.id}
                    style={{
                      position: "absolute",
                      top: "40%",
                      left: `${anim.x}%`,
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#00FF88",
                      textShadow: "0 0 10px #00FF88, 0 0 20px #00FF88",
                      animation: "clearFloat 2s ease-out forwards",
                      pointerEvents: "none",
                      zIndex: 100,
                      whiteSpace: "nowrap"
                    }}
                  >
                    {anim.text}
                  </div>
                ))}

                {/* Save Notification */}
                {savedNotification && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(0, 255, 136, 0.95)",
                    color: "#000",
                    padding: "16px 32px",
                    borderRadius: 12,
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: "0 8px 24px rgba(0, 255, 136, 0.5)",
                    zIndex: 1000,
                    animation: "clearFloat 2s ease-out forwards"
                  }}>
                    💾 저장 완료!
                  </div>
                )}
              </div>
            ) : gameMode === "typingRain" ? (
              // Typing Rain Mode
              <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
                {/* Background - Faded Source Code */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "6px 8px",
                  fontSize: codeFontSize,
                  fontFamily: "'D2Coding', 'JetBrains Mono', 'Consolas', monospace",
                  lineHeight: `${Math.round(codeFontSize * 1.38)}px`,
                  color: "var(--eclipse-text)",
                  opacity: 0.15,
                  pointerEvents: "none",
                  whiteSpace: "pre",
                  overflow: "hidden",
                  zIndex: 1
                }}>
                  {CHALLENGE_FILES[currentFile]?.content}
                </div>

                {/* Falling Words */}
                {fallingWords.map(word => (
                  <div
                    key={word.id}
                    style={{
                      position: "absolute",
                      left: `${word.x}%`,
                      top: `${word.y}%`,
                      fontSize: word.type === "phrase" ? 14 : 16,
                      fontFamily: "'D2Coding', 'JetBrains Mono', monospace",
                      fontWeight: "bold",
                      color: word.word === targetWord ? "#FFD700" : 
                             word.type === "phrase" ? "#FFA500" :
                             word.type === "keyword" ? "#CC7832" :
                             word.type === "javaKeyword" ? "#CC7832" :
                             word.type === "htmlTag" ? "#E8BF6A" :
                             word.type === "jspTag" ? "#9876AA" :
                             word.type === "symbol" ? "#A9B7C6" : "#6A8759",
                      textShadow: word.word === targetWord ? "0 0 8px #FFD700" : "0 2px 4px rgba(0,0,0,0.5)",
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      zIndex: 5,
                      opacity: 1
                    }}
                  >
                    {word.word}
                  </div>
                ))}

                {/* Completed Code Display */}
                <div style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  right: 8,
                  maxHeight: "40%",
                  overflow: "auto",
                  background: "rgba(43, 43, 43, 0.85)",
                  backdropFilter: "blur(8px)",
                  padding: "8px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontFamily: "'D2Coding', 'JetBrains Mono', monospace",
                  color: "#A9B7C6",
                  zIndex: 10,
                  lineHeight: "18px",
                  border: "1px solid rgba(92, 143, 214, 0.3)"
                }}>
                  {completedCode.length === 0 ? (
                    <div style={{ color: "#666", fontStyle: "italic" }}>완성된 코드가 여기에 표시됩니다...</div>
                  ) : (
                    completedCode.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))
                  )}
                </div>

                {/* Input Box */}
                <div style={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 20
                }}>
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCurrentInput(value);
                      
                      // Check if matches any falling word
                      const matched = fallingWords.find(w => w.word === value);
                      if (matched) {
                        setTargetWord(matched.word);
                      } else {
                        setTargetWord(null);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        
                        // Check if input matches a falling word
                        const matched = fallingWords.find(w => w.word === currentInput);
                        if (matched) {
                          // Capture word
                          setCurrentLine(prev => [...prev, matched.word]);
                          setFallingWords(prev => prev.filter(w => w.id !== matched.id));
                          setScore(prev => prev + Math.round(matched.word.length * 5));
                          setCombo(prev => prev + 1);
                          
                          // Show animation
                          setClearAnimations(prev => [...prev, {
                            id: Date.now(),
                            text: `+${Math.round(matched.word.length * 5)}`,
                            x: 50
                          }]);
                          setTimeout(() => {
                            setClearAnimations(prev => prev.slice(1));
                          }, 1000);
                        }
                        
                        // Finalize line (even if empty or partial)
                        if (currentLine.length > 0 || currentInput.length > 0) {
                          const finalLine = currentLine.length > 0 ? currentLine.join(" ") : currentInput;
                          
                          // Auto indent based on content
                          let indent = "  ".repeat(indentLevel);
                          let newIndentLevel = indentLevel;
                          
                          // Increase indent after opening braces
                          if (finalLine.includes("{") && !finalLine.includes("}")) {
                            newIndentLevel++;
                          }
                          // Decrease indent for closing braces
                          if (finalLine.includes("}") && !finalLine.includes("{")) {
                            indent = "  ".repeat(Math.max(0, indentLevel - 1));
                            newIndentLevel = Math.max(0, indentLevel - 1);
                          }
                          
                          setCompletedCode(prev => [...prev, indent + finalLine]);
                          setCurrentLine([]);
                          setIndentLevel(newIndentLevel);
                          setScore(prev => prev + 100);
                          
                          setClearAnimations(prev => [...prev, {
                            id: Date.now(),
                            text: `✓ LINE! +100`,
                            x: 50
                          }]);
                          setTimeout(() => {
                            setClearAnimations(prev => prev.slice(1));
                          }, 1500);
                        }
                        
                        setCurrentInput("");
                        setTargetWord(null);
                      } else if (e.key === " " && currentInput.length > 0) {
                        // Space: try to match word
                        e.preventDefault();
                        const matched = fallingWords.find(w => w.word === currentInput);
                        if (matched) {
                          setCurrentLine(prev => [...prev, matched.word]);
                          setFallingWords(prev => prev.filter(w => w.id !== matched.id));
                          setCurrentInput("");
                          setScore(prev => prev + Math.round(matched.word.length * 5));
                          setCombo(prev => prev + 1);
                          setTargetWord(null);
                          
                          setClearAnimations(prev => [...prev, {
                            id: Date.now(),
                            text: `+${Math.round(matched.word.length * 5)}`,
                            x: 50
                          }]);
                          setTimeout(() => {
                            setClearAnimations(prev => prev.slice(1));
                          }, 1000);
                        }
                      }
                    }}
                    style={{
                      width: 500,
                      padding: "12px 16px",
                      fontSize: 16,
                      fontFamily: "'D2Coding', 'JetBrains Mono', monospace",
                      background: "rgba(43, 43, 43, 0.95)",
                      color: "#FFF",
                      border: "2px solid #5C8FD6",
                      borderRadius: 8,
                      outline: "none",
                      textAlign: "left"
                    }}
                    placeholder="떨어지는 단어를 입력하고 Enter로 확정..."
                    autoFocus
                  />
                  {currentLine.length > 0 && (
                    <div style={{
                      marginTop: 8,
                      padding: "8px 12px",
                      background: "rgba(0, 255, 136, 0.2)",
                      border: "1px solid #00FF88",
                      borderRadius: 6,
                      fontSize: 12,
                      color: "#00FF88",
                      fontFamily: "'D2Coding', monospace"
                    }}>
                      현재: {currentLine.join(" ")}
                    </div>
                  )}
                </div>

                {/* Score HUD */}
                <div style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(8px)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  color: "#FFF",
                  fontSize: 11,
                  fontWeight: "bold",
                  zIndex: 10
                }}>
                  <div style={{ color: "#FFD700" }}>⭐ {score.toLocaleString()}</div>
                  <div style={{ color: "#00FF88" }}>줄: {completedCode.length}</div>
                  {combo > 0 && <div style={{ color: "#FF6B6B" }}>🔥 x{combo}</div>}
                  <div style={{ fontSize: 9, color: "#AAA", marginTop: 4 }}>Space: 단어 구분</div>
                  <div style={{ fontSize: 9, color: "#AAA" }}>Enter: 줄 확정</div>
                </div>

                {/* Clear Animations */}
                {clearAnimations.map(anim => (
                  <div
                    key={anim.id}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${anim.x}%`,
                      fontSize: 20,
                      fontWeight: "bold",
                      color: "#00FF88",
                      textShadow: "0 0 10px #00FF88",
                      animation: "clearFloat 1s ease-out forwards",
                      pointerEvents: "none",
                      zIndex: 100
                    }}
                  >
                    {anim.text}
                  </div>
                ))}
              </div>
            ) : (
              // Normal Mode Editor
              <>
                {/* Line numbers */}
                <div style={{ ...S.lineNumbers, fontSize: codeFontSize - 1, lineHeight: `${Math.round(codeFontSize * 1.38)}px` }}>
                  {Array.from({ length: totalLines }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Code */}
                <div style={{ ...S.code, fontSize: codeFontSize, lineHeight: `${Math.round(codeFontSize * 1.38)}px` }}>
                  {JAVA_CODE.map((token, i) => (
                    <span key={i} style={{ color: token.type ? `var(--eclipse-${token.type})` : "var(--eclipse-text)" }}>
                      {token.t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Bottom Panel */}
          <div style={S.bottomPanel}>
            <div style={S.bottomTabs}>
              {BOTTOM_TABS.map((t, i) => (
                <div
                  key={t}
                  style={{
                    ...S.bottomTab,
                    ...(activeBottom === i ? { background: "var(--eclipse-tabActive)", borderTop: "2px solid var(--eclipse-blue)" } : { background: "var(--eclipse-tabInactive)" }),
                  }}
                  onClick={() => setActiveBottom(i)}
                >
                  {t === "Problems" && <span style={{ color: "#e05252", fontSize: 10 }}>⚠</span>}
                  {t === "Console" && <span style={{ fontSize: 10 }}>🖥</span>}
                  {t}
                </div>
              ))}
            </div>
            <div style={S.console}>
              {activeBottom === 3 ? (
                <>
                  <div style={{ color: "#6A9955" }}><span style={{ color: "#607B97" }}>Eclipse Online Judge</span> [Java Application]</div>
                  <div style={{ color: "var(--eclipse-text)" }}>{'>'} Compiled successfully. Running with JDK 17...</div>
                  <div style={{ color: "var(--eclipse-textBright)" }}>{'>'} Waiting for input...</div>
                  <div style={{ color: "var(--eclipse-textDim)", marginTop: 4 }}>Terminated. (Exit value: 0)</div>
                </>
              ) : activeBottom === 0 ? (
                <div style={{ color: "var(--eclipse-textDim)" }}>0 errors, 0 warnings, 0 infos</div>
              ) : (
                <div style={{ color: "var(--eclipse-textDim)" }}>No content</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Outline */}
        <div style={S.rightPanel}>
          <div style={S.panelTitle}>
            Outline
            <div style={S.panelTitleIcons}>
              <span style={S.panelIcon}>✕</span>
            </div>
          </div>
          <div style={{ padding: "4px 0" }}>
            {OUTLINE_ITEMS.map((item, i) => (
              <div key={i} style={{ ...S.treeItem, paddingLeft: 6 + item.depth * 14, fontSize: 12 }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{ color: "var(--eclipse-textBright)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={S.statusBar}>
        <span>Main.java</span>
        <div style={S.statusSep} />
        <span>Line 24, Column 18</span>
        <div style={S.statusSep} />
        <span>UTF-8</span>
        <div style={S.statusSep} />
        <span>Java 17</span>
        <div style={{ flex: 1 }} />
        <span>Eclipse Online Judge</span>
      </div>

      {/* Floating Theme & Mode Toggle */}
      <div style={{ position: "fixed", bottom: 28, right: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, zIndex: 9999 }}>
        {toggleOpen && (
          <div style={{
            background: resolvedTheme === "dark" ? "rgba(43, 43, 43, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--eclipse-border)",
            borderRadius: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            minWidth: 140,
          }}>
            {/* Theme Options */}
            <div style={{ 
              padding: "4px 8px", 
              fontSize: 10, 
              color: "var(--eclipse-textDim)", 
              fontWeight: "bold",
              borderBottom: "1px solid var(--eclipse-border)"
            }}>테마</div>
            {[
              { id: "light", label: "Light", icon: "☀️" },
              { id: "dark", label: "Dark", icon: "🌙" },
              { id: "system", label: "System", icon: "🖥️" }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  setThemeMode(opt.id as any);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  color: themeMode === opt.id ? "var(--eclipse-blue)" : "var(--eclipse-textBright)",
                  background: themeMode === opt.id 
                    ? (resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                  fontWeight: themeMode === opt.id ? "bold" : "normal",
                  transition: "background 0.15s"
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </div>
            ))}

            {/* Mode Options */}
            <div style={{ 
              padding: "4px 8px", 
              fontSize: 10, 
              color: "var(--eclipse-textDim)", 
              fontWeight: "bold",
              borderBottom: "1px solid var(--eclipse-border)",
              marginTop: 4
            }}>모드</div>
            {[
              { id: "normal", label: "Normal", icon: "📝" },
              { id: "lineMatch", label: "Line Match", icon: "🎯" },
              { id: "typingRain", label: "Typing Rain", icon: "🌧️" }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  setGameMode(opt.id as any);
                  if (opt.id !== "normal") {
                    // Reset game states
                    setScore(0);
                    setCombo(0);
                    setStartTime(Date.now());
                    if (opt.id === "lineMatch") {
                      setTypedCode("");
                      setCompletedLines(0);
                    } else if (opt.id === "typingRain") {
                      setCurrentInput("");
                      setCurrentLine([]);
                      setCompletedCode([]);
                      setFallingWords([]);
                    }
                  }
                  setToggleOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  color: gameMode === opt.id ? "var(--eclipse-blue)" : "var(--eclipse-textBright)",
                  background: gameMode === opt.id 
                    ? (resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)")
                    : "transparent",
                  fontWeight: gameMode === opt.id ? "bold" : "normal",
                  transition: "background 0.15s"
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setToggleOpen(!toggleOpen)}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: resolvedTheme === "dark" ? "rgba(43, 43, 43, 0.85)" : "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--eclipse-border)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "transform 0.2s, background 0.2s",
            outline: "none"
          }}
        >
          {gameMode === "lineMatch" ? "🎯" : gameMode === "typingRain" ? "🌧️" : (themeMode === "light" ? "☀️" : themeMode === "dark" ? "🌙" : "🖥️")}
        </button>
      </div>

      {/* Splash Screen Overlay */}
      {showSplash && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: resolvedTheme === "dark" ? "#2B2B2B" : "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          opacity: fadeSplash ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: fadeSplash ? "none" : "auto",
        }}>
          <div style={{
            transform: fadeSplash ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.5s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16
          }}>
            <Tesseract resolvedTheme={resolvedTheme} />
            <h1 style={{
              fontSize: 24,
              fontWeight: "lighter",
              color: resolvedTheme === "dark" ? "#FFFFFF" : "#000000",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              letterSpacing: 2,
              margin: 0
            }}>
              Eclipse IDE
            </h1>
            <p style={{
              fontSize: 12,
              color: resolvedTheme === "dark" ? "#888888" : "#666666",
              margin: 0
            }}>
              Eclipse Online Judge Solution
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
