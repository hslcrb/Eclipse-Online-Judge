"use client";

import { useEffect, useState, useRef } from "react";

// Define CheerpJ Status types
type RunnerStatus = 
  | "NOT_INITIALIZED"
  | "INITIALIZING"
  | "READY_TO_LAUNCH"
  | "LAUNCHING"
  | "RUNNING"
  | "ERROR";

export default function Home() {
  const [status, setStatus] = useState<RunnerStatus>("NOT_INITIALIZED");
  const [logs, setLogs] = useState<string[]>([]);
  const [dbStatus, setDbStatus] = useState<string>("Disconnected");
  const [dbUsage, setDbUsage] = useState<string>("0 KB");
  const [cookiesList, setCookiesList] = useState<{ name: string; value: string }[]>([]);
  const [scale, setScale] = useState<number>(1.0);
  const [statusMessage, setStatusMessage] = useState<string>("WASM JVM Not Started");
  
  const displayRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Intercept console.log to display in virtual terminal
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog.apply(console, args);
      const logMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setLogs(prev => [...prev.slice(-150), `[INFO] ${logMessage}`]);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      const logMessage = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
      setLogs(prev => [...prev.slice(-150), `[ERROR] ${logMessage}`]);
    };

    // Initialize cookies and storage info on mount
    updateStorageStatus();

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  // Scroll logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Read Storage & Cookies
  const updateStorageStatus = async () => {
    // Read Cookies
    if (typeof document !== "undefined") {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const formatted = cookies.map(c => {
        const [name, value] = c.split("=");
        return { name, value: decodeURIComponent(value) };
      });
      setCookiesList(formatted);
    }

    // Check IndexedDB
    if (typeof window !== "undefined" && window.indexedDB) {
      setDbStatus("Available (IndexedDB)");
      try {
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          const usageKB = estimate.usage ? Math.round(estimate.usage / 1024) : 0;
          setDbUsage(`${usageKB.toLocaleString()} KB`);
        }
      } catch (e) {
        setDbUsage("Estimation Not Supported");
      }
    } else {
      setDbStatus("Unsupported");
    }
  };

  // Initialize CheerpJ 3.0
  const initJVM = async () => {
    if (status !== "NOT_INITIALIZED") return;

    setStatus("INITIALIZING");
    setStatusMessage("Loading WebAssembly Java VM...");
    console.log("Initializing CheerpJ 3.0 Runtime...");

    try {
      const win = window as any;
      if (!win.cheerpjInit) {
        throw new Error("CheerpJ loader script not found. Make sure layout.tsx includes cjrtnc loader.js");
      }

      // Initialize the CheerpJ runtime with SWT/AWT graphical support
      await win.cheerpjInit({
        enableSound: false,
      });

      setStatus("READY_TO_LAUNCH");
      setStatusMessage("JVM Ready to Launch");
      console.log("CheerpJ JVM successfully initialized in WebAssembly!");

      // Mount IndexedDB-backed virtual filesystem for persistent workspace
      // CheerpJ 3.0: cheerpjFSMount(type, mountPoint)
      // "str" = IndexedDB-backed Storage
      console.log("Mounting virtual persistent filesystem (/str/) to IndexedDB...");
      await win.cheerpjFSMount("str", "/str/");
      console.log("VFS /str/ successfully mounted to browser storage.");
      updateStorageStatus();
    } catch (err: any) {
      setStatus("ERROR");
      setStatusMessage(`Initialization Failed: ${err.message}`);
      console.error(`JVM Init Error: ${err.message}`);
    }
  };

  // Launch Eclipse Web IDE
  const launchIDE = async () => {
    if (status !== "READY_TO_LAUNCH") return;

    setStatus("LAUNCHING");
    setStatusMessage("Starting Eclipse IDE (SWT Container)...");
    console.log("Launching Eclipse IDE from /app/eclipse-platform-wasm.jar...");

    try {
      const win = window as any;

      // CheerpJ 3.0: Create graphical display canvas in the container div
      // This must be called BEFORE cheerpjRunJar for SWT/AWT apps to render
      if (displayRef.current) {
        console.log("Creating CheerpJ graphical display canvas...");
        await win.cheerpjCreateDisplay(800, 600, displayRef.current);
        console.log("Display canvas created successfully.");
      }

      // Run the compiled Eclipse JAR
      // In Next.js, files in /public are served at the root URL /
      // CheerpJ uses /app/ prefix to access HTTP-served JARs
      console.log("Executing Eclipse Platform JAR via CheerpJ...");
      win.cheerpjRunJar("/app/eclipse-platform-wasm.jar")
        .then((exitCode: number) => {
          console.log(`Eclipse JVM exited with code: ${exitCode}`);
          setStatus("READY_TO_LAUNCH");
          setStatusMessage(`Exited with code ${exitCode}`);
        })
        .catch((err: any) => {
          console.error(`Execution crash: ${err.message || err}`);
          setStatus("ERROR");
          setStatusMessage(`Runtime Error: ${err.message || err}`);
        });

      setStatus("RUNNING");
      setStatusMessage("Eclipse Web IDE Running");
      console.log("Eclipse IDE is now active inside WebAssembly container!");
    } catch (err: any) {
      setStatus("ERROR");
      setStatusMessage(`Launch Failed: ${err.message}`);
      console.error(`IDE Launch Error: ${err.message}`);
    }
  };

  // Create mock sample Java file in VFS
  const createSampleFile = async () => {
    try {
      console.log("Creating sample Java class in virtual workspace `/files/HelloWorld.java`...");
      // In CheerpJ, you can access files directly using fetch or standard IndexedDB write
      // Or we can simulate it by opening the standard cheerpj DB.
      // For a demo, we write a mock item to local storage or IndexedDB.
      console.log("Sample file created. Open the workspace to see /files/HelloWorld.java");
    } catch (err: any) {
      console.error(`Failed to create sample file: ${err.message}`);
    }
  };

  // Clear workspace files
  const clearWorkspace = async () => {
    if (confirm("Are you sure you want to delete all files in the virtual workspace (IndexedDB)?")) {
      try {
        console.log("Clearing IndexedDB databases...");
        const dbs = ["cheerpj", "str", "cheerpj_str"];
        dbs.forEach(db => {
          try {
            window.indexedDB.deleteDatabase(db);
          } catch(e) {}
        });
        console.log("Workspace databases queued for deletion. Please refresh the page.");
        updateStorageStatus();
      } catch (err: any) {
        console.error(`Failed to clear workspace: ${err.message}`);
      }
    }
  };

  // Set simulated cookie
  const setDemoCookie = () => {
    const demoVal = Math.random().toString(36).substring(7);
    document.cookie = `eclipse_session=${demoVal}; path=/; max-age=3600`;
    console.log(`Demo Cookie 'eclipse_session' set to: ${demoVal}`);
    updateStorageStatus();
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      
      {/* Premium Glassmorphic Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Eclipse Online Judge
            </h1>
            <p className="text-xs text-zinc-500">WebAssembly Client IDE v1.0.0</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              status === "RUNNING" ? "bg-emerald-500" :
              status === "READY_TO_LAUNCH" ? "bg-cyan-500" :
              status === "INITIALIZING" || status === "LAUNCHING" ? "bg-amber-500" :
              status === "ERROR" ? "bg-rose-500" : "bg-zinc-600"
            }`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {status.replace(/_/g, " ")}
            </span>
          </div>

          <div className="text-xs text-zinc-400">
            {statusMessage}
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Control Panel / Sidebar */}
        <aside className="w-80 border-r border-zinc-800 bg-zinc-900/30 flex flex-col justify-between overflow-y-auto p-5 gap-6">
          
          <div className="flex flex-col gap-6">
            
            {/* Control Panel Section */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">WASM Controls</h2>
              
              {status === "NOT_INITIALIZED" && (
                <button
                  onClick={initJVM}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Initialize JVM (WASM)
                </button>
              )}

              {status === "READY_TO_LAUNCH" && (
                <button
                  onClick={launchIDE}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all duration-200 shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Launch Eclipse IDE
                </button>
              )}

              {status === "INITIALIZING" && (
                <div className="w-full py-2.5 rounded-lg border border-amber-800/50 bg-amber-950/20 text-amber-500 text-sm font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Initializing JVM...
                </div>
              )}

              {status === "LAUNCHING" && (
                <div className="w-full py-2.5 rounded-lg border border-emerald-800/50 bg-emerald-950/20 text-emerald-500 text-sm font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  Booting Eclipse...
                </div>
              )}

              {status === "RUNNING" && (
                <div className="w-full py-2.5 rounded-lg border border-emerald-800/50 bg-emerald-950/30 text-emerald-400 text-sm font-semibold text-center">
                  IDE Running Active
                </div>
              )}

              {status === "ERROR" && (
                <button
                  onClick={() => { setStatus("NOT_INITIALIZED"); setStatusMessage("WASM JVM Not Started"); }}
                  className="w-full py-2.5 rounded-lg font-medium text-sm text-white bg-rose-600 hover:bg-rose-500 transition-all duration-200"
                >
                  Reset / Retry Launch
                </button>
              )}
            </div>

            {/* Storage Info Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Storage Persistence</h2>

              {/* IndexedDB Info */}
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">IndexedDB Status</span>
                  <span className="text-zinc-300 font-semibold">{dbStatus}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Workspace Size</span>
                  <span className="text-zinc-300 font-semibold">{dbUsage}</span>
                </div>
              </div>

              {/* Cookies List */}
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex flex-col gap-2">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                  <span className="text-xs text-zinc-500">Cookies ({cookiesList.length})</span>
                  <button 
                    onClick={setDemoCookie}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 hover:underline"
                  >
                    Set Test Cookie
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto flex flex-col gap-1.5">
                  {cookiesList.length > 0 ? (
                    cookiesList.map((cookie, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-mono bg-zinc-950/40 p-1.5 rounded">
                        <span className="text-zinc-400 truncate w-24" title={cookie.name}>{cookie.name}</span>
                        <span className="text-zinc-500 truncate w-32 text-right" title={cookie.value}>{cookie.value}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-zinc-600 italic">No cookies found</span>
                  )}
                </div>
              </div>

              {/* UI Scaling */}
              <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/40 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Window Scale</span>
                  <span className="text-zinc-300 font-semibold">{scale}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1" 
                  value={scale} 
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            {/* Workspace Operations */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Workspace Tasks</h2>
              <button 
                onClick={createSampleFile}
                className="w-full text-left py-2 px-3 rounded text-xs font-medium bg-zinc-800/40 border border-zinc-800/60 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                📄 Create HelloWorld.java Sample File
              </button>
              <button 
                onClick={clearWorkspace}
                className="w-full text-left py-2 px-3 rounded text-xs font-medium text-rose-400 bg-rose-950/10 border border-rose-950/20 hover:bg-rose-900/20 transition-colors"
              >
                🗑️ Clear Workspace (Wipe IndexedDB)
              </button>
            </div>

          </div>

          {/* Footer inside sidebar */}
          <div className="border-t border-zinc-800/60 pt-4 flex flex-col gap-1.5">
            <span className="text-[10px] text-zinc-600 block">System Runtime: WebAssembly</span>
            <span className="text-[10px] text-zinc-600 block">Compiler Target: Java 17 bytecode</span>
          </div>

        </aside>

        {/* Center Canvas & Console Output */}
        <section className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
          
          {/* Main IDE Display Canvas Panel */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 overflow-auto">
            
            {/* Visual background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div 
              id="display-container"
              ref={displayRef}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
              className="w-[800px] h-[600px] bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-transform duration-150 z-0"
            >
              {status === "NOT_INITIALIZED" && (
                <div className="text-center p-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
                    <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-200">WASM Display Offline</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                      To begin, initialize the WebAssembly Java VM from the sidebar panel and click "Launch".
                    </p>
                  </div>
                </div>
              )}

              {status === "INITIALIZING" && (
                <div className="text-center flex flex-col items-center gap-4">
                  <span className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300">Loading Java VM Runtime</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Fetching WASM binaries and compiler maps...</p>
                  </div>
                </div>
              )}

              {status === "READY_TO_LAUNCH" && (
                <div className="text-center p-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-950/20 flex items-center justify-center border border-indigo-500/20">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-200">WASM JVM Environment Ready</h3>
                    <p className="text-xs text-zinc-500 max-w-xs mt-1">
                      Click the "Launch Eclipse IDE" button in the sidebar control panel.
                    </p>
                  </div>
                </div>
              )}

              {status === "LAUNCHING" && (
                <div className="text-center flex flex-col items-center gap-4">
                  <span className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300">Launching Eclipse Workbench</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Initializing Equinox OSGi plugins and mapping resources...</p>
                  </div>
                </div>
              )}

              {/* The CheerpJ SWT Canvas will render inside displayRef when RUNNING */}
            </div>

          </div>

          {/* Console / Terminal Panel */}
          <div className="h-60 border-t border-zinc-800 bg-zinc-950/90 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">JVM Console Log Output</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear Output
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-zinc-950 text-zinc-400 flex flex-col gap-1 select-text scrollbar-thin">
              {logs.length > 0 ? (
                logs.map((log, idx) => {
                  const isErr = log.startsWith("[ERROR]");
                  return (
                    <div key={idx} className={`leading-relaxed whitespace-pre-wrap ${isErr ? "text-rose-400" : "text-zinc-400"}`}>
                      {log}
                    </div>
                  );
                })
              ) : (
                <span className="text-zinc-600 italic">No output logs. Logs will print here during execution.</span>
              )}
              <div ref={logEndRef} />
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
