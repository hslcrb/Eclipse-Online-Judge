'use client';

import { useState } from 'react';
import FrogPet from '@/components/pets/FrogPet';
import CatPet from '@/components/pets/CatPet';

type UIStage = 1 | 2 | 3 | 4;

export default function EclipseOnlineJudge() {
  // UI 단계 관리
  const [uiStage, setUiStage] = useState<UIStage>(1);
  const [dbConnected, setDbConnected] = useState(false);
  
  // 파일 시스템
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'sql.sql': 'CREATE TABLE member_tbl_02(\n  custno NUMBER(6) NOT NULL PRIMARY KEY,\n  custname VARCHAR2(20),\n  phone VARCHAR2(13),\n  address VARCHAR2(60),\n  joindate DATE,\n  grade CHAR(1),\n  city CHAR(2)\n);',
    'header.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>쇼핑몰 회원관리</title>\n</head>\n<body>',
    'footer.jsp': '</body>\n</html>',
    'index.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<%@ include file="header.jsp" %>\n<h1>홈화면</h1>\n<%@ include file="footer.jsp" %>',
    'list.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<%@ page import="java.sql.*" %>\n<%@ include file="header.jsp" %>\n<h2>회원 목록 조회</h2>\n<%@ include file="footer.jsp" %>',
    'join.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<%@ include file="header.jsp" %>\n<h2>회원 등록</h2>\n<form name="frm" method="post" action="joinok.jsp">\n</form>\n<%@ include file="footer.jsp" %>',
    'joinok.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<%@ page import="java.sql.*" %>\n<%\n  // 회원 등록 처리\n%>',
    'sales.jsp': '<%@ page language="java" contentType="text/html; charset=UTF-8"\n    pageEncoding="UTF-8"%>\n<%@ include file="header.jsp" %>\n<h2>회원매출조회</h2>\n<%@ include file="footer.jsp" %>',
    'check.jsp': 'function checkForm() {\n  if (document.frm.custno.value.length == 0) {\n    alert("회원번호를 입력하세요");\n    return false;\n  }\n  return true;\n}',
  });
  
  // 펫 시스템
  const [showFrogPet, setShowFrogPet] = useState(true);
  const [showCatPet, setShowCatPet] = useState(true);
  
  // DB 연결 핸들러
  const handleConnect = () => {
    setDbConnected(true);
    setUiStage(2);
  };
  
  // 파일 클릭 핸들러
  const handleFileClick = (fileName: string) => {
    if (!dbConnected) return;
    
    if (!openFiles.includes(fileName)) {
      setOpenFiles([...openFiles, fileName]);
    }
    setActiveFile(fileName);
    
    // SQL 파일이면 3단계, JSP 파일이면 4단계
    if (fileName === 'sql.sql') {
      setUiStage(3);
    } else {
      setUiStage(4);
    }
  };
  
  // 파일 닫기
  const handleCloseFile = (fileName: string) => {
    const newOpenFiles = openFiles.filter(f => f !== fileName);
    setOpenFiles(newOpenFiles);
    
    if (activeFile === fileName) {
      if (newOpenFiles.length > 0) {
        setActiveFile(newOpenFiles[newOpenFiles.length - 1]);
      } else {
        setActiveFile(null);
        setUiStage(2);
      }
    }
  };
  
  // 코드 변경 핸들러
  const handleCodeChange = (fileName: string, newCode: string) => {
    setFileContents({
      ...fileContents,
      [fileName]: newCode,
    });
  };
  
  return (
    <>
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#ececec',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Segoe UI, sans-serif',
        overflow: 'hidden',
        color: '#222',
      }}>
        {/* 메뉴 바 */}
        <div style={{
          height: 26,
          background: '#f5f5f5',
          borderBottom: '1px solid #d4d4d4',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          paddingLeft: 8,
          fontSize: 13,
        }}>
          <span>File</span>
          <span>Edit</span>
          <span>Navigate</span>
          <span>Search</span>
          <span>Project</span>
          <span>Run</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        
        {/* 툴바 */}
        <div style={{
          height: 32,
          background: '#f7f7f7',
          borderBottom: '1px solid #d5d5d5',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 8,
        }}>
          {['📄', '📂', '💾', '↩️', '↪️', '🔍', '⚙️', '▶️', '⏹️', '🐞', '📦', '☕'].map((x, i) => (
            <span key={i} style={{ cursor: 'pointer' }}>{x}</span>
          ))}
        </div>
        
        {/* 메인 영역 */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '330px 1fr 260px',
          overflow: 'hidden',
        }}>
          {/* 왼쪽: Project Explorer */}
          <ProjectExplorer 
            onFileClick={handleFileClick}
            activeFile={activeFile}
            dbConnected={dbConnected}
          />
          
          {/* 중앙: 에디터 영역 */}
          <CenterArea 
            uiStage={uiStage}
            onConnect={handleConnect}
            openFiles={openFiles}
            activeFile={activeFile}
            fileContents={fileContents}
            onCloseFile={handleCloseFile}
            onCodeChange={handleCodeChange}
          />
          
          {/* 오른쪽: Outline */}
          <Outline activeFile={activeFile} />
        </div>
        
        {/* 하단 패널 */}
        <BottomPanel dbConnected={dbConnected} />
        
        {/* 상태바 */}
        <StatusBar uiStage={uiStage} dbConnected={dbConnected} />
      </div>
      
      {/* 펫 시스템 */}
      {showFrogPet && <FrogPet onRemove={() => setShowFrogPet(false)} />}
      {showCatPet && <CatPet onRemove={() => setShowCatPet(false)} />}
    </>
  );
}

// Project Explorer 컴포넌트
function ProjectExplorer({ 
  onFileClick, 
  activeFile, 
  dbConnected 
}: { 
  onFileClick: (fileName: string) => void;
  activeFile: string | null;
  dbConnected: boolean;
}) {
  const files = [
    'check.jsp',
    'footer.jsp',
    'header.jsp',
    'index.jsp',
    'join.jsp',
    'joinok.jsp',
    'list.jsp',
    'sales.jsp',
    'sql.sql',
  ];
  
  return (
    <div style={{
      borderRight: '1px solid #ccc',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: 6,
        borderBottom: '1px solid #ddd',
        fontWeight: 600,
        fontSize: 13,
      }}>
        📁 Project Explorer
      </div>
      
      <div style={{ padding: 8, fontSize: 13, lineHeight: 1.6 }}>
        <div>🖥️ Servers</div>
        
        <div style={{ marginTop: 4 }}>
          ▼ 📂 test1
        </div>
        
        <div style={{ paddingLeft: 18 }}>
          <div>📄 Deployment Descriptor</div>
          <div>🌐 JAX-WS Web Services</div>
          <div>☕ Java Resources</div>
          <div>📁 build</div>
          
          <div>▼ 📁 src</div>
          
          <div style={{ paddingLeft: 18 }}>
            <div>▼ 📁 main</div>
            
            <div style={{ paddingLeft: 18 }}>
              <div>☕ java</div>
              
              <div>▼ 🌍 webapp</div>
              
              <div style={{ paddingLeft: 18 }}>
                <div>📁 META-INF</div>
                
                <div>▼ 📁 WEB-INF</div>
                
                <div style={{ paddingLeft: 18 }}>
                  <div>▼ 📁 lib</div>
                  
                  <div style={{ paddingLeft: 18 }}>
                    📦 ojdbc6.jar
                  </div>
                </div>
                
                {files.map(file => {
                  const isActive = activeFile === file;
                  const ext = file.split('.').pop();
                  const icon = ext === 'jsp' ? '📄' : ext === 'sql' ? '📄' : '📄';
                  
                  return (
                    <div
                      key={file}
                      onClick={() => onFileClick(file)}
                      style={{
                        cursor: dbConnected ? 'pointer' : 'default',
                        background: isActive ? '#cfe8ff' : 'transparent',
                        border: isActive ? '1px solid #99c4ff' : 'none',
                        width: 'fit-content',
                        padding: isActive ? '0 4px' : '0',
                        opacity: dbConnected ? 1 : 0.5,
                      }}
                    >
                      {icon} {file}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 중앙 영역 컴포넌트
function CenterArea({
  uiStage,
  onConnect,
  openFiles,
  activeFile,
  fileContents,
  onCloseFile,
  onCodeChange,
}: {
  uiStage: UIStage;
  onConnect: () => void;
  openFiles: string[];
  activeFile: string | null;
  fileContents: Record<string, string>;
  onCloseFile: (fileName: string) => void;
  onCodeChange: (fileName: string, newCode: string) => void;
}) {
  // 1단계: DB 연결 모달
  if (uiStage === 1) {
    return (
      <div style={{
        position: 'relative',
        background: '#efefef',
      }}>
        <ConnectionModal onConnect={onConnect} />
      </div>
    );
  }
  
  // 2단계: 빈 화면
  if (uiStage === 2 || !activeFile) {
    return (
      <div style={{
        background: '#efefef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#8b8b8b',
          lineHeight: 1.8,
          fontSize: 13,
        }}>
          Open a file or drop files here to open them.
          <br />
          Find Actions &nbsp; Ctrl+3
          <br />
          Show Key Assist &nbsp; Ctrl+Shift+L
          <br />
          New &nbsp; Ctrl+N
        </div>
      </div>
    );
  }
  
  // 3단계: SQL 에디터
  if (uiStage === 3 && activeFile === 'sql.sql') {
    return <SQLEditor fileContents={fileContents} activeFile={activeFile} onCodeChange={onCodeChange} onCloseFile={onCloseFile} />;
  }
  
  // 4단계: JSP 에디터
  return <JSPEditor fileContents={fileContents} activeFile={activeFile} onCodeChange={onCodeChange} onCloseFile={onCloseFile} />;
}

// DB 연결 모달
function ConnectionModal({ onConnect }: { onConnect: () => void }) {
  return (
    <div style={{
      width: 440,
      height: 520,
      background: '#f8f8f8',
      borderRadius: 12,
      boxShadow: '0 15px 40px rgba(0,0,0,.25)',
      border: '1px solid #ccc',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        height: 42,
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        fontWeight: 600,
      }}>
        🗄️ New Connection Profile
      </div>
      
      <div style={{
        flex: 1,
        padding: 20,
        fontSize: 13,
      }}>
        <b>Specify a Driver and Connection Details</b>
        
        <div style={{ marginTop: 20 }}>
          Driver
          <input
            value="Oracle Thin Driver"
            readOnly
            style={{
              width: '100%',
              marginTop: 4,
              padding: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>
        
        <div style={{ marginTop: 12 }}>
          Host
          <input
            value="localhost"
            readOnly
            style={{
              width: '100%',
              padding: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>
        
        <div style={{ marginTop: 12 }}>
          Port
          <input
            value="1521"
            readOnly
            style={{
              width: '100%',
              padding: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>
        
        <div style={{ marginTop: 12 }}>
          Username
          <input
            value="system"
            readOnly
            style={{
              width: '100%',
              padding: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>
        
        <div style={{ marginTop: 12 }}>
          Password
          <input
            value="••••••••"
            type="password"
            readOnly
            style={{
              width: '100%',
              padding: 4,
              border: '1px solid #ccc',
            }}
          />
        </div>
        
        <div style={{ marginTop: 20 }}>
          ☑ Connect when wizard completes
        </div>
      </div>
      
      <div style={{
        height: 60,
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        paddingRight: 12,
      }}>
        <button style={{ padding: '4px 12px' }}>{'< Back'}</button>
        <button style={{ padding: '4px 12px' }}>{'Next >'}</button>
        <button 
          onClick={onConnect}
          style={{ 
            padding: '4px 12px',
            background: '#0078d4',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Finish
        </button>
        <button style={{ padding: '4px 12px' }}>Cancel</button>
      </div>
    </div>
  );
}

// SQL 에디터
function SQLEditor({
  fileContents,
  activeFile,
  onCodeChange,
  onCloseFile,
}: {
  fileContents: Record<string, string>;
  activeFile: string;
  onCodeChange: (fileName: string, newCode: string) => void;
  onCloseFile: (fileName: string) => void;
}) {
  const code = fileContents[activeFile] || '';
  const lines = code.split('\n');
  
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
    }}>
      {/* 탭 */}
      <div style={{
        height: 28,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        borderBottom: '1px solid #d0d0d0',
        background: '#f7f7f7',
        gap: 4,
      }}>
        📄 {activeFile} 
        <span 
          onClick={() => onCloseFile(activeFile)}
          style={{ cursor: 'pointer', marginLeft: 4 }}
        >
          ✕
        </span>
      </div>
      
      {/* Connection 바 */}
      <div style={{
        height: 44,
        background: '#f3f3f3',
        borderBottom: '1px solid #d8d8d8',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 12px',
        fontSize: 12,
      }}>
        <span>Type: Oracle_11</span>
        <span>Name: New Oracle</span>
        <span>Database: xe</span>
        <span style={{ marginLeft: 'auto' }}>
          Connected, Auto Commit
        </span>
      </div>
      
      {/* 에디터 */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#fff',
        overflow: 'auto',
        display: 'flex',
      }}>
        {/* 라인 넘버 */}
        <div style={{
          width: 40,
          background: '#fafafa',
          borderRight: '1px solid #e0e0e0',
          color: '#777',
          fontSize: 13,
          lineHeight: '20px',
          paddingTop: 8,
          textAlign: 'right',
          paddingRight: 8,
          fontFamily: 'Consolas, monospace',
        }}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* 코드 영역 */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(activeFile, e.target.value)}
          style={{
            flex: 1,
            fontFamily: 'Consolas, monospace',
            fontSize: 13,
            lineHeight: '20px',
            padding: '8px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre',
          }}
        />
      </div>
    </div>
  );
}

// JSP 에디터
function JSPEditor({
  fileContents,
  activeFile,
  onCodeChange,
  onCloseFile,
}: {
  fileContents: Record<string, string>;
  activeFile: string;
  onCodeChange: (fileName: string, newCode: string) => void;
  onCloseFile: (fileName: string) => void;
}) {
  const code = fileContents[activeFile] || '';
  const lines = code.split('\n');
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* 탭 */}
      <div style={{
        height: 24,
        background: '#f7f7f7',
        borderBottom: '1px solid #d7d7d7',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        gap: 4,
      }}>
        📄 {activeFile} 
        <span 
          onClick={() => onCloseFile(activeFile)}
          style={{ cursor: 'pointer', marginLeft: 4 }}
        >
          ✕
        </span>
      </div>
      
      {/* 에디터 */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {/* 라인 넘버 */}
        <div style={{
          width: 36,
          background: '#fafafa',
          borderRight: '1px solid #e0e0e0',
          color: '#777',
          fontSize: 13,
          lineHeight: '22px',
          paddingTop: 4,
          textAlign: 'right',
          paddingRight: 6,
          fontFamily: 'Consolas, monospace',
        }}>
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* 코드 영역 */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(activeFile, e.target.value)}
          style={{
            flex: 1,
            fontFamily: 'Consolas, monospace',
            fontSize: 13,
            lineHeight: '22px',
            padding: '4px 8px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            whiteSpace: 'pre',
          }}
        />
      </div>
    </div>
  );
}

// Outline 패널
function Outline({ activeFile }: { activeFile: string | null }) {
  return (
    <div style={{
      borderLeft: '1px solid #ccc',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: 6,
        borderBottom: '1px solid #ddd',
        fontWeight: 600,
        fontSize: 13,
      }}>
        📋 Outline
      </div>
      
      <div style={{
        padding: 8,
        fontSize: 13,
        color: '#666',
      }}>
        {activeFile ? (
          <div>
            <div>📄 jsp:directive.page language=java</div>
            <div>📄 DOCTYPE:html</div>
            <div style={{ paddingLeft: 16 }}>
              <div>📁 html</div>
            </div>
          </div>
        ) : (
          'There is no active editor that provides an outline.'
        )}
      </div>
    </div>
  );
}

// 하단 패널
function BottomPanel({ dbConnected }: { dbConnected: boolean }) {
  return (
    <div style={{
      height: 160,
      borderTop: '1px solid #ccc',
      background: '#f7f7f7',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        height: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        paddingLeft: 10,
        borderBottom: '1px solid #ddd',
        fontSize: 12,
      }}>
        <span>⚠️ Problems</span>
        <span>🖥️ Servers</span>
        <span>💻 Terminal</span>
        <span style={{
          background: '#fff',
          border: '1px solid #bbb',
          borderBottom: 'none',
          padding: '2px 8px',
        }}>
          🗄️ Data Source Explorer
        </span>
        <span>📄 Properties</span>
      </div>
      
      <div style={{
        flex: 1,
        background: '#fff',
        padding: 10,
        fontSize: 12,
        lineHeight: 1.6,
      }}>
        {dbConnected ? (
          <>
            <div>▼ 📁 Database Connections</div>
            <div style={{ paddingLeft: 20 }}>
              <div>▼ 🗄️ New Oracle (Oracle v.0.2.0.2.0 - 64bit Production)</div>
              <div style={{ paddingLeft: 20 }}>
                📦 xe
              </div>
            </div>
            <div style={{ marginTop: 4 }}>
              ▼ 📁 ODA Data Sources
            </div>
            <div style={{ paddingLeft: 20 }}>
              <div>📄 Flat File Data Source</div>
              <div>📄 Web Services Data Source</div>
              <div>📄 XML Data Source</div>
            </div>
          </>
        ) : (
          <>
            <div>📁 Database Connections</div>
            <div>📁 ODA Data Sources</div>
            <div style={{ paddingLeft: 20 }}>
              <div>📄 Flat File Data Source</div>
              <div>📄 Web Services Data Source</div>
              <div>📄 XML Data Source</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 상태바
function StatusBar({ uiStage, dbConnected }: { uiStage: UIStage; dbConnected: boolean }) {
  if (uiStage === 3 && dbConnected) {
    return (
      <div style={{
        height: 22,
        background: '#f0f0f0',
        borderTop: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        fontSize: 11,
      }}>
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
        <span style={{ marginLeft: 'auto' }}>
          Writable | Insert | 1 : 1 : 0
        </span>
      </div>
    );
  }
  
  if (uiStage === 4) {
    return (
      <div style={{
        height: 22,
        background: '#f0f0f0',
        borderTop: '1px solid #d0d0d0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6px',
        fontSize: 11,
      }}>
        <span>Writable</span>
        <span style={{ marginLeft: 24 }}>
          Smart Insert
        </span>
        <span style={{ marginLeft: 24 }}>
          1 : 1 : 0
        </span>
        <span style={{ marginLeft: 'auto' }}>
          💡
        </span>
      </div>
    );
  }
  
  return (
    <div style={{
      height: 22,
      background: '#f0f0f0',
      borderTop: '1px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
      fontSize: 11,
    }}>
      <span>0 items selected</span>
      <span style={{ marginLeft: 'auto' }}>💡</span>
    </div>
  );
}
