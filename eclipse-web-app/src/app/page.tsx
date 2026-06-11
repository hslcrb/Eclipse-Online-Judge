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

    // 전역 cheerpjInit 함수가 로드될 때까지 대기하는 함수
    async function waitForCheerpJ(): Promise<any> {
      return new Promise((resolve, reject) => {
        const win = window as any;

        // 이미 정의되어 있다면 바로 반환
        if (win.cheerpjInit) {
          resolve(win);
          return;
        }

        let attempts = 0;
        const interval = setInterval(() => {
          if (win.cheerpjInit) {
            clearInterval(interval);
            resolve(win);
          } else {
            attempts++;
            // 최대 30초 (100ms * 300) 대기
            if (attempts > 300) {
              clearInterval(interval);
              reject(
                new Error(
                  "CheerpJ CDN 스크립트 로드 타임아웃. CDN(cjrtnc.leaningtech.com) 접속 상태를 확인해 주세요."
                )
              );
            }
          }
        }, 100);
      });
    }

    async function bootEclipse() {
      try {
        setMessage("CheerpJ 런타임 파일(WASM)을 다운로드하는 중...");
        const win = await waitForCheerpJ();
        if (cancelled) return;

        setMessage("WebAssembly JVM 환경 초기화 중...");
        // CheerpJ 3.0 공식 API 초기화
        await win.cheerpjInit({
          enableSound: false,
        });
        if (cancelled) return;

        setMessage("가상 IndexedDB 파일시스템 마운트 중...");
        // CheerpJ 3.0: cheerpjFSMount(type, path)
        await win.cheerpjFSMount("str", "/str/");
        if (cancelled) return;

        setMessage("SWT 디스플레이 컨테이너 준비 중...");
        if (displayRef.current) {
          // -1, -1은 컨테이너 div 크기에 맞춰 100% 가득 채우는 것을 의미합니다.
          await win.cheerpjCreateDisplay(-1, -1, displayRef.current);
        }
        if (cancelled) return;

        setMessage("Eclipse IDE 실행 중...");
        setPhase("running");

        // Next.js public/에 위치한 jar를 /app/ 경로를 통해 실행
        const exitCode = await win.cheerpjRunJar("/app/eclipse-platform-wasm.jar");
        
        if (!cancelled) {
          setPhase("error");
          setMessage(`JVM 프로세스 종료`);
          setErrorDetail(`Eclipse가 종료 코드 ${exitCode}로 종료되었습니다.`);
        }
      } catch (err: any) {
        if (!cancelled) {
          setPhase("error");
          setMessage("초기화 오류");
          setErrorDetail(err?.message || String(err));
        }
      }
    }

    bootEclipse();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#1e1e1e" }}>
      {/* Eclipse SWT Canvas가 렌더링될 영역 */}
      <div
        ref={displayRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "#000",
        }}
      />

      {/* 로딩 및 에러 오버레이 */}
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
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "4px solid rgba(255, 123, 0, 0.2)",
                  borderTop: "4px solid #FF7B00",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ margin: 0, fontSize: 14, color: "#aaa" }}>{message}</p>
            </>
          ) : (
            <div style={{ fontSize: 14, color: "#ff5555", textAlign: "center", maxWidth: 520, lineHeight: 1.6 }}>
              <p style={{ margin: 0, fontWeight: "bold" }}>{message}</p>
              {errorDetail && (
                <pre
                  style={{
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
                  }}
                >
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
          )}
        </div>
      )}
    </div>
  );
}
