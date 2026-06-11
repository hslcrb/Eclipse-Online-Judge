"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "loading" | "running" | "error";

export default function Home() {
  const displayRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [message, setMessage] = useState("CheerpJ 로딩 중...");
  const [errorDetail, setErrorDetail] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function bootEclipse() {
      try {
        // CheerpJ 3.0: ES Module 동적 임포트
        setMessage("CheerpJ 3.0 WASM 런타임 임포트 중...");
        const { cheerpjInit, cheerpjCreateDisplay, cheerpjRunJar } =
          await import(
            // @ts-ignore
            "https://cjrtnc.leaningtech.com/3.0/loader.js"
          );

        if (cancelled) return;

        setMessage("JVM 초기화 중...");
        await cheerpjInit({
          enableSound: false,
        });

        if (cancelled) return;

        // IndexedDB 기반 가상 파일시스템 마운트
        // CheerpJ 3.0: "str" 타입은 IndexedDB 스토리지 백엔드
        const { cheerpjFSMount } = await import(
          // @ts-ignore
          "https://cjrtnc.leaningtech.com/3.0/loader.js"
        );
        await cheerpjFSMount("str", "/str/");

        if (cancelled) return;

        // SWT 그래픽 캔버스 생성 (부모 엘리먼트에 렌더링)
        setMessage("SWT 디스플레이 캔버스 생성 중...");
        if (displayRef.current) {
          await cheerpjCreateDisplay(-1, -1, displayRef.current);
        }

        if (cancelled) return;

        // Eclipse Platform JAR 실행
        // Next.js: /public 폴더의 파일은 /로 서빙됨
        // CheerpJ: HTTP로 서빙되는 JAR은 /app/ prefix 사용
        setMessage("Eclipse Platform 실행 중...");
        setPhase("running");

        const exitCode = await cheerpjRunJar("/app/eclipse-platform-wasm.jar");
        console.log("Eclipse JVM 종료 코드:", exitCode);
        if (!cancelled) {
          setPhase("error");
          setMessage(`JVM 종료 (코드: ${exitCode})`);
        }
      } catch (err: any) {
        if (!cancelled) {
          setPhase("error");
          setErrorDetail(err?.message || String(err));
          setMessage("오류 발생");
        }
      }
    }

    bootEclipse();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#1e1e1e" }}>

      {/* Eclipse SWT 렌더링 컨테이너 - 항상 마운트 */}
      <div
        ref={displayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* 로딩 오버레이 - running 상태에서 자동 숨김 */}
      {phase !== "running" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(18, 18, 18, 0.97)",
            color: "#fff",
            fontFamily: "monospace",
            gap: 20,
            zIndex: 10,
          }}
        >
          {/* Eclipse 로고 */}
          <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke="#FF7B00" strokeWidth="5" fill="none" />
            <ellipse cx="42" cy="50" rx="28" ry="18" fill="#1e1e1e" />
            <text x="50" y="56" textAnchor="middle" fill="#FF7B00" fontSize="22" fontWeight="bold">e</text>
          </svg>

          {phase === "loading" ? (
            <>
              {/* 스피너 */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "4px solid rgba(255,123,0,0.2)",
                  borderTop: "4px solid #FF7B00",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ margin: 0, fontSize: 14, color: "#aaa" }}>{message}</p>
            </>
          ) : (
            <>
              {/* 에러 표시 */}
              <div style={{ fontSize: 14, color: "#ff5555", textAlign: "center", maxWidth: 480, lineHeight: 1.6 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{message}</p>
                {errorDetail && (
                  <pre style={{
                    marginTop: 12,
                    background: "#2a1a1a",
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: 12,
                    overflowX: "auto",
                    textAlign: "left",
                    border: "1px solid #5a1a1a",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}>
                    {errorDetail}
                  </pre>
                )}
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: 20,
                    padding: "8px 20px",
                    background: "#FF7B00",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  다시 시도
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
