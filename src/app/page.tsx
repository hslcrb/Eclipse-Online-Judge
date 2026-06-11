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
  lineNumbers: { color: "var(--eclipse-lineNumbersColor)", fontSize: 12, padding: "6px 8px 6px 6px", textAlign: "right", userSelect: "none", borderRight: "1px solid var(--eclipse-lineNumbersBorder)", lineHeight: "18px", flexShrink: 0, background: "var(--eclipse-lineNumbersBg)", transition: "font-size 0.15s ease, line-height 0.15s ease" },
  code: { padding: "6px 8px", fontSize: 13, fontFamily: "'JetBrains Mono', 'Consolas', monospace", lineHeight: "18px", whiteSpace: "pre", flex: 1, outline: "none", transition: "font-size 0.15s ease, line-height 0.15s ease" },
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
        name: "JRE System Library [17]", icon: "📚", children: [
          { name: "rt.jar", icon: "🫙" },
        ]
      },
      { name: "build.gradle", icon: "🔧" },
      { name: "README.md", icon: "📄" },
    ]
  }
];

function TreeView({ nodes, depth = 0 }: { nodes: TreeNode[]; depth?: number }) {
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
            onClick={() => node.children && setOpenMap(m => ({ ...m, [node.name]: !m[node.name] }))}
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
            <TreeView nodes={node.children} depth={depth + 1} />
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

    const width = 300;
    const height = 300;
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

  return <div ref={mountRef} style={{ width: 300, height: 300 }} />;
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
      // Only handle when Ctrl (or Cmd on Mac) is pressed
      if (!e.ctrlKey && !e.metaKey) return;

      const currentTime = Date.now();
      const key = e.key;

      // Detect double press within 500ms
      if ((key === '-' || key === '=' || key === '+') && lastKey === key && (currentTime - lastKeyTime) < 500) {
        e.preventDefault();
        
        if (key === '-') {
          // Zoom out (decrease font size, minimum 8)
          setCodeFontSize(prev => Math.max(8, prev - 1));
        } else if (key === '=' || key === '+') {
          // Zoom in (increase font size, maximum 24)
          setCodeFontSize(prev => Math.min(24, prev + 1));
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
  }, [lastKey, lastKeyTime]);

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
            <TreeView nodes={TREE} />
          </div>
        </div>

        {/* Center: Editor + Bottom */}
        <div style={S.centerArea}>
          {/* Editor Tabs */}
          <div style={S.tabBar}>
            {tabs.map((tab, i) => (
              <div
                key={tab.name}
                style={{ ...S.tab, ...(activeTab === i ? S.tabActive : S.tabInactive) }}
                onClick={() => setActiveTab(i)}
              >
                <span style={{ fontSize: 13 }}>☕</span>
                <span>{tab.modified ? `${tab.name} *` : tab.name}</span>
                <span style={{ color: "var(--eclipse-textDim)", fontSize: 10, marginLeft: 2 }}>✕</span>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div style={S.editor}>
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

      {/* Floating Theme Toggle */}
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
            minWidth: 100,
          }}>
            {[
              { id: "light", label: "Light", icon: "☀️" },
              { id: "dark", label: "Dark", icon: "🌙" },
              { id: "system", label: "System", icon: "🖥️" }
            ].map(opt => (
              <div
                key={opt.id}
                onClick={() => {
                  setThemeMode(opt.id as any);
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
          {themeMode === "light" ? "☀️" : themeMode === "dark" ? "🌙" : "🖥️"}
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
