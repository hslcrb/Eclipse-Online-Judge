"use client";
import { useState } from "react";

const ECLIPSE_COLORS = {
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
};

const S: { [key: string]: React.CSSProperties } = {
  root: { display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: ECLIPSE_COLORS.bg, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 12, color: ECLIPSE_COLORS.text, overflow: "hidden", userSelect: "none" },
  menuBar: { display: "flex", alignItems: "center", background: ECLIPSE_COLORS.menuBg, borderBottom: `1px solid ${ECLIPSE_COLORS.border}`, height: 22, flexShrink: 0, paddingLeft: 4 },
  menuItem: { padding: "0 8px", height: "100%", display: "flex", alignItems: "center", cursor: "pointer", fontSize: 12 },
  toolbar: { display: "flex", alignItems: "center", background: ECLIPSE_COLORS.toolbarBg, borderBottom: `1px solid ${ECLIPSE_COLORS.border}`, height: 26, flexShrink: 0, padding: "0 4px", gap: 1 },
  toolBtn: { width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 2, border: "1px solid transparent", fontSize: 13 },
  separator: { width: 1, height: 18, background: ECLIPSE_COLORS.border, margin: "0 3px" },
  workspace: { display: "flex", flex: 1, overflow: "hidden" },
  sidePanel: { width: 220, display: "flex", flexDirection: "column", background: ECLIPSE_COLORS.sidebarBg, borderRight: `1px solid ${ECLIPSE_COLORS.border}`, flexShrink: 0 },
  panelTitle: { background: "#4E5254", color: ECLIPSE_COLORS.textBright, padding: "3px 6px", fontSize: 11, fontWeight: "bold", borderBottom: `1px solid ${ECLIPSE_COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  panelTitleIcons: { display: "flex", gap: 3 },
  panelIcon: { cursor: "pointer", opacity: 0.7, fontSize: 10 },
  tree: { flex: 1, overflow: "auto", padding: "2px 0" },
  treeItem: { display: "flex", alignItems: "center", gap: 3, padding: "1px 4px", cursor: "pointer", whiteSpace: "nowrap" },
  centerArea: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  tabBar: { display: "flex", background: ECLIPSE_COLORS.tabBar, borderBottom: `1px solid ${ECLIPSE_COLORS.border}`, height: 24, flexShrink: 0, alignItems: "flex-end" },
  tab: { display: "flex", alignItems: "center", gap: 5, padding: "0 10px", height: 22, cursor: "pointer", borderRight: `1px solid ${ECLIPSE_COLORS.border}`, fontSize: 12, whiteSpace: "nowrap" },
  tabActive: { background: ECLIPSE_COLORS.tabActive, borderTop: `2px solid ${ECLIPSE_COLORS.blue}` },
  tabInactive: { background: ECLIPSE_COLORS.tabInactive, opacity: 0.8 },
  editor: { flex: 1, overflow: "auto", background: ECLIPSE_COLORS.editorBg, display: "flex" },
  lineNumbers: { color: "#606366", fontSize: 12, padding: "6px 8px 6px 6px", textAlign: "right", userSelect: "none", borderRight: `1px solid #3c3c3c`, lineHeight: "18px", flexShrink: 0, background: "#313335" },
  code: { padding: "6px 8px", fontSize: 13, fontFamily: "'JetBrains Mono', 'Consolas', monospace", lineHeight: "18px", whiteSpace: "pre", flex: 1, outline: "none" },
  bottomPanel: { height: 150, borderTop: `1px solid ${ECLIPSE_COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0 },
  bottomTabs: { display: "flex", background: ECLIPSE_COLORS.tabBar, borderBottom: `1px solid ${ECLIPSE_COLORS.border}`, height: 22, alignItems: "flex-end" },
  bottomTab: { display: "flex", alignItems: "center", gap: 4, padding: "0 10px", height: 20, cursor: "pointer", fontSize: 12, borderRight: `1px solid ${ECLIPSE_COLORS.border}` },
  console: { flex: 1, background: "#1E1E1E", padding: "4px 8px", overflow: "auto", fontFamily: "Consolas, monospace", fontSize: 12, lineHeight: "16px" },
  rightPanel: { width: 180, borderLeft: `1px solid ${ECLIPSE_COLORS.border}`, display: "flex", flexDirection: "column", background: ECLIPSE_COLORS.sidebarBg, flexShrink: 0 },
  statusBar: { height: 18, background: ECLIPSE_COLORS.statusBg, display: "flex", alignItems: "center", padding: "0 8px", gap: 16, fontSize: 11, color: "#fff", flexShrink: 0, borderTop: `1px solid #1a4a7a` },
  statusSep: { width: 1, height: 12, background: "rgba(255,255,255,0.3)" },
};

const JAVA_CODE = [
  { t: "package", c: ECLIPSE_COLORS.keyword }, { t: " com.eclipse.judge.solution;", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "\n" },
  { t: "import", c: ECLIPSE_COLORS.keyword }, { t: " java.util.Scanner;\n", c: ECLIPSE_COLORS.text },
  { t: "import", c: ECLIPSE_COLORS.keyword }, { t: " java.util.ArrayList;\n", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "/**\n * Main solution class for the Online Judge\n * @author user\n */", c: ECLIPSE_COLORS.comment },
  { t: "\n" },
  { t: "public", c: ECLIPSE_COLORS.keyword }, { t: " " }, { t: "class", c: ECLIPSE_COLORS.keyword }, { t: " Main {\n", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "    ", c: ECLIPSE_COLORS.text }, { t: "private", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "static", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " N;\n", c: ECLIPSE_COLORS.text },
  { t: "    ", c: ECLIPSE_COLORS.text }, { t: "private", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "static", c: ECLIPSE_COLORS.keyword }, { t: " ArrayList<Integer> adj[];\n", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "    ", c: ECLIPSE_COLORS.text }, { t: "public", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "static", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "void", c: ECLIPSE_COLORS.keyword }, { t: " main(String[] args) {\n", c: ECLIPSE_COLORS.text },
  { t: "        Scanner sc = ", c: ECLIPSE_COLORS.text }, { t: "new", c: ECLIPSE_COLORS.keyword }, { t: " Scanner(System.in);\n", c: ECLIPSE_COLORS.text },
  { t: "        N = sc.nextInt();\n", c: ECLIPSE_COLORS.text },
  { t: "        " }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " M = sc.nextInt();\n", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "        // Initialize adjacency list\n", c: ECLIPSE_COLORS.comment },
  { t: "        adj = ", c: ECLIPSE_COLORS.text }, { t: "new", c: ECLIPSE_COLORS.keyword }, { t: " ArrayList[N + ", c: ECLIPSE_COLORS.text }, { t: "1", c: ECLIPSE_COLORS.number }, { t: "];\n", c: ECLIPSE_COLORS.text },
  { t: "        " }, { t: "for", c: ECLIPSE_COLORS.keyword }, { t: " (", c: ECLIPSE_COLORS.text }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " i = ", c: ECLIPSE_COLORS.text }, { t: "0", c: ECLIPSE_COLORS.number }, { t: "; i <= N; i++) {\n", c: ECLIPSE_COLORS.text },
  { t: "            adj[i] = ", c: ECLIPSE_COLORS.text }, { t: "new", c: ECLIPSE_COLORS.keyword }, { t: " ArrayList<>();\n", c: ECLIPSE_COLORS.text },
  { t: "        }\n", c: ECLIPSE_COLORS.text },
  { t: "\n" },
  { t: "        " }, { t: "for", c: ECLIPSE_COLORS.keyword }, { t: " (", c: ECLIPSE_COLORS.text }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " i = ", c: ECLIPSE_COLORS.text }, { t: "0", c: ECLIPSE_COLORS.number }, { t: "; i < M; i++) {\n", c: ECLIPSE_COLORS.text },
  { t: "            " }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " u = sc.nextInt(), v = sc.nextInt();\n", c: ECLIPSE_COLORS.text },
  { t: "            adj[u].add(v);\n", c: ECLIPSE_COLORS.text },
  { t: "            adj[v].add(u);\n", c: ECLIPSE_COLORS.text },
  { t: "        }\n\n" },
  { t: "        System.out.println(bfs(", c: ECLIPSE_COLORS.text }, { t: "1", c: ECLIPSE_COLORS.number }, { t: "));\n", c: ECLIPSE_COLORS.text },
  { t: "    }\n\n" },
  { t: "    ", c: ECLIPSE_COLORS.text }, { t: "static", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " bfs(", c: ECLIPSE_COLORS.text }, { t: "int", c: ECLIPSE_COLORS.keyword }, { t: " start) {\n", c: ECLIPSE_COLORS.text },
  { t: "        ", c: ECLIPSE_COLORS.text }, { t: "boolean", c: ECLIPSE_COLORS.keyword }, { t: "[] visited = ", c: ECLIPSE_COLORS.text }, { t: "new", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "boolean", c: ECLIPSE_COLORS.keyword }, { t: "[N + ", c: ECLIPSE_COLORS.text }, { t: "1", c: ECLIPSE_COLORS.number }, { t: "];\n", c: ECLIPSE_COLORS.text },
  { t: "        // BFS traversal\n", c: ECLIPSE_COLORS.comment },
  { t: "        visited[start] = ", c: ECLIPSE_COLORS.text }, { t: "true", c: ECLIPSE_COLORS.keyword }, { t: ";\n", c: ECLIPSE_COLORS.text },
  { t: "        " }, { t: "return", c: ECLIPSE_COLORS.keyword }, { t: " ", c: ECLIPSE_COLORS.text }, { t: "0", c: ECLIPSE_COLORS.number }, { t: ";\n", c: ECLIPSE_COLORS.text },
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
              <span style={{ color: ECLIPSE_COLORS.textDim, fontSize: 10, width: 10 }}>{openMap[node.name] ? "▾" : "▸"}</span>
            ) : (
              <span style={{ width: 10 }} />
            )}
            <span style={{ fontSize: 13 }}>{node.icon}</span>
            <span style={{ color: node.name.endsWith(".java") ? "#FFC66D" : ECLIPSE_COLORS.textBright, fontSize: 12 }}>{node.name}</span>
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

export default function EclipseIDE() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeBottom, setActiveBottom] = useState(3);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);

  const tabs = [
    { name: "Main.java", modified: false },
    { name: "Solution.java", modified: true },
    { name: "build.gradle", modified: false },
  ];

  return (
    <div style={S.root}>
      {/* Menu Bar */}
      <div style={S.menuBar}>
        <span style={{ marginRight: 8, fontSize: 14 }}>🌑</span>
        {MENUS.map((m, i) => (
          <div
            key={m}
            style={{
              ...S.menuItem,
              background: hoveredMenu === i ? ECLIPSE_COLORS.selection : "transparent",
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
        <div style={{ display: "flex", alignItems: "center", background: "#4E5254", borderRadius: 3, padding: "1px 6px", gap: 4, border: `1px solid ${ECLIPSE_COLORS.border}` }}>
          <span style={{ color: ECLIPSE_COLORS.textDim, fontSize: 11 }}>🔍</span>
          <span style={{ color: ECLIPSE_COLORS.textDim, fontSize: 11 }}>Quick Access</span>
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
                <span style={{ color: ECLIPSE_COLORS.textDim, fontSize: 10, marginLeft: 2 }}>✕</span>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div style={S.editor}>
            {/* Line numbers */}
            <div style={S.lineNumbers}>
              {Array.from({ length: totalLines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code */}
            <div style={S.code}>
              {JAVA_CODE.map((token, i) => (
                <span key={i} style={{ color: token.c || ECLIPSE_COLORS.text }}>
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
                    ...(activeBottom === i ? { background: ECLIPSE_COLORS.tabActive, borderTop: `2px solid ${ECLIPSE_COLORS.blue}` } : { background: ECLIPSE_COLORS.tabInactive }),
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
                  <div style={{ color: ECLIPSE_COLORS.text }}>{'>'} Compiled successfully. Running with JDK 17...</div>
                  <div style={{ color: "#A9B7C6" }}>{'>'} Waiting for input...</div>
                  <div style={{ color: ECLIPSE_COLORS.textDim, marginTop: 4 }}>Terminated. (Exit value: 0)</div>
                </>
              ) : activeBottom === 0 ? (
                <div style={{ color: ECLIPSE_COLORS.textDim }}>0 errors, 0 warnings, 0 infos</div>
              ) : (
                <div style={{ color: ECLIPSE_COLORS.textDim }}>No content</div>
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
                <span style={{ color: ECLIPSE_COLORS.textBright }}>{item.label}</span>
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
    </div>
  );
}
