'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DancePhase = 'rightArm' | 'leftArm' | 'rightLeg' | 'leftLeg' | 'wallClimb';

export default function FrogPet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frogRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    // Scene 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1.5, 0);
    cameraRef.current = camera;

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true // 투명 배경
    });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0); // 완전 투명
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 개구리 생성
    const frog = createFrog();
    scene.add(frog);
    frogRef.current = frog;

    // 애니메이션 루프 - 우아한 춤
    let time = 0;
    let dancePhase: DancePhase = 'rightArm';
    let phaseTime = 0;
    
    const animate = () => {
      time += 0.02; // 전체적으로 느리게
      phaseTime += 0.02;
      
      if (frogRef.current) {
        const frog = frogRef.current;
        
        // 각 파츠 가져오기
        const leftArm = frog.children.find(c => c.userData.name === 'leftArm');
        const rightArm = frog.children.find(c => c.userData.name === 'rightArm');
        const leftLeg = frog.children.find(c => c.userData.name === 'leftLeg');
        const rightLeg = frog.children.find(c => c.userData.name === 'rightLeg');
        const head = frog.children.find(c => c.userData.name === 'head');
        
        // 댄스 페이즈 전환 (각 동작 3초)
        if (phaseTime > 3) {
          phaseTime = 0;
          const phases: DancePhase[] = ['rightArm', 'leftArm', 'rightLeg', 'leftLeg', 'wallClimb'];
          const currentIndex = phases.indexOf(dancePhase);
          dancePhase = phases[(currentIndex + 1) % phases.length];
        }
        
        // 기본 자세로 리셋
        frog.rotation.z = 0;
        frog.position.y = 0;
        frog.rotation.x = 0;
        
        if (leftArm) {
          leftArm.rotation.z = 0.5;
          leftArm.rotation.x = 0;
          leftArm.rotation.y = 0;
        }
        if (rightArm) {
          rightArm.rotation.z = -0.5;
          rightArm.rotation.x = 0;
          rightArm.rotation.y = 0;
        }
        if (leftLeg) {
          leftLeg.rotation.x = 0;
        }
        if (rightLeg) {
          rightLeg.rotation.x = 0;
        }
        if (head) {
          head.rotation.x = 0;
          head.rotation.z = 0;
        }
        
        // 페이즈별 동작
        const progress = phaseTime / 3; // 0 ~ 1
        const smoothProgress = (Math.sin((progress - 0.5) * Math.PI) + 1) / 2; // 부드러운 진행
        
        switch (dancePhase) {
          case 'rightArm':
            // 오른팔 천천히 앞으로 내밀기
            if (rightArm) {
              rightArm.rotation.z = -0.5 - smoothProgress * 1.2; // 점점 앞으로
              rightArm.rotation.x = -smoothProgress * 0.8;
            }
            // 허리를 오른쪽으로 축축
            frog.rotation.z = Math.sin(phaseTime * 2) * 0.15;
            // 머리도 살짝
            if (head) {
              head.rotation.z = Math.sin(phaseTime * 2) * 0.1;
            }
            break;
            
          case 'leftArm':
            // 왼팔 천천히 앞으로 내밀기
            if (leftArm) {
              leftArm.rotation.z = 0.5 + smoothProgress * 1.2;
              leftArm.rotation.x = -smoothProgress * 0.8;
            }
            // 허리를 왼쪽으로 축축
            frog.rotation.z = -Math.sin(phaseTime * 2) * 0.15;
            if (head) {
              head.rotation.z = -Math.sin(phaseTime * 2) * 0.1;
            }
            break;
            
          case 'rightLeg':
            // 오른발 내밀고 허리 돌리기
            if (rightLeg) {
              rightLeg.rotation.x = smoothProgress * 0.6;
            }
            frog.rotation.z = Math.sin(phaseTime * 1.5) * 0.2;
            frog.rotation.y = smoothProgress * 0.3;
            if (head) {
              head.rotation.x = Math.sin(phaseTime * 2) * 0.1;
            }
            break;
            
          case 'leftLeg':
            // 왼발 내밀고 허리 돌리기
            if (leftLeg) {
              leftLeg.rotation.x = smoothProgress * 0.6;
            }
            frog.rotation.z = -Math.sin(phaseTime * 1.5) * 0.2;
            frog.rotation.y = -smoothProgress * 0.3;
            if (head) {
              head.rotation.x = -Math.sin(phaseTime * 2) * 0.1;
            }
            break;
            
          case 'wallClimb':
            // 벽타기 시뮬레이션
            // 몸을 앞으로 기울이고
            frog.rotation.x = smoothProgress * 0.5;
            
            // 팔다리를 교차로 움직임
            if (leftArm) {
              leftArm.rotation.z = 0.5 + Math.sin(phaseTime * 4) * 0.6;
              leftArm.rotation.y = Math.sin(phaseTime * 4) * 0.3;
            }
            if (rightArm) {
              rightArm.rotation.z = -0.5 - Math.sin(phaseTime * 4 + Math.PI) * 0.6;
              rightArm.rotation.y = -Math.sin(phaseTime * 4 + Math.PI) * 0.3;
            }
            if (leftLeg) {
              leftLeg.rotation.x = Math.sin(phaseTime * 4 + Math.PI) * 0.4;
            }
            if (rightLeg) {
              rightLeg.rotation.x = Math.sin(phaseTime * 4) * 0.4;
            }
            
            // 위아래로 살짝 움직임 (기어오르는 느낌)
            frog.position.y = Math.sin(phaseTime * 2) * 0.3;
            
            // 머리를 위로
            if (head) {
              head.rotation.x = -0.2;
            }
            break;
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 클린업
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isVisible]);

  // 개구리 생성 함수
  const createFrog = (): THREE.Group => {
    const frog = new THREE.Group();
    
    // 재질 (밝은 녹색 개구리)
    const frogMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x7FFF00,
      shininess: 30
    });
    
    const darkGreenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x228B22 
    });
    
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF 
    });
    
    const pupilMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x000000 
    });

    // 몸통 (타원형)
    const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    bodyGeometry.scale(1, 1.2, 0.9);
    const body = new THREE.Mesh(bodyGeometry, frogMaterial);
    body.position.y = 1.5;
    frog.add(body);

    // 머리 (큰 구)
    const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const head = new THREE.Mesh(headGeometry, frogMaterial);
    head.position.y = 2.5;
    head.userData.name = 'head';
    frog.add(head);

    // 눈 (튀어나온 큰 눈)
    const eyeBaseGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    
    // 왼쪽 눈
    const leftEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    leftEyeBase.position.set(-0.35, 2.7, 0.4);
    frog.add(leftEyeBase);
    
    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      eyeMaterial
    );
    leftEye.position.set(-0.35, 2.7, 0.55);
    frog.add(leftEye);
    
    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      pupilMaterial
    );
    leftPupil.position.set(-0.35, 2.7, 0.65);
    frog.add(leftPupil);

    // 오른쪽 눈
    const rightEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    rightEyeBase.position.set(0.35, 2.7, 0.4);
    frog.add(rightEyeBase);
    
    const rightEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      eyeMaterial
    );
    rightEye.position.set(0.35, 2.7, 0.55);
    frog.add(rightEye);
    
    const rightPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 16, 16),
      pupilMaterial
    );
    rightPupil.position.set(0.35, 2.7, 0.65);
    frog.add(rightPupil);

    // 입 (작은 선)
    const mouthGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.1);
    const mouth = new THREE.Mesh(mouthGeometry, darkGreenMaterial);
    mouth.position.set(0, 2.3, 0.6);
    frog.add(mouth);

    // 배 (밝은 부분)
    const bellyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    bellyGeometry.scale(1, 1.3, 0.5);
    const belly = new THREE.Mesh(
      bellyGeometry,
      new THREE.MeshPhongMaterial({ color: 0xFFFF99 })
    );
    belly.position.set(0, 1.5, 0.5);
    frog.add(belly);

    // 왼팔 (이족보행이니까 짧고 귀여운 팔)
    const armGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.8, 16);
    const leftArm = new THREE.Mesh(armGeometry, frogMaterial);
    leftArm.position.set(-0.7, 1.8, 0);
    leftArm.rotation.z = 0.5;
    leftArm.userData.name = 'leftArm';
    frog.add(leftArm);

    // 왼손 (동그란 손)
    const handGeometry = new THREE.SphereGeometry(0.18, 16, 16);
    const leftHand = new THREE.Mesh(handGeometry, frogMaterial);
    leftHand.position.set(-1.1, 1.4, 0);
    frog.add(leftHand);

    // 오른팔
    const rightArm = new THREE.Mesh(armGeometry, frogMaterial);
    rightArm.position.set(0.7, 1.8, 0);
    rightArm.rotation.z = -0.5;
    rightArm.userData.name = 'rightArm';
    frog.add(rightArm);

    // 오른손
    const rightHand = new THREE.Mesh(handGeometry, frogMaterial);
    rightHand.position.set(1.1, 1.4, 0);
    frog.add(rightHand);

    // 왼다리 (이족보행 - 두껍고 튼튼)
    const legGeometry = new THREE.CylinderGeometry(0.25, 0.2, 1, 16);
    const leftLeg = new THREE.Mesh(legGeometry, frogMaterial);
    leftLeg.position.set(-0.4, 0.5, 0);
    leftLeg.userData.name = 'leftLeg';
    frog.add(leftLeg);

    // 왼발 (큰 발)
    const footGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.5);
    const leftFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    leftFoot.position.set(-0.4, 0, 0.15);
    frog.add(leftFoot);

    // 오른다리
    const rightLeg = new THREE.Mesh(legGeometry, frogMaterial);
    rightLeg.position.set(0.4, 0.5, 0);
    rightLeg.userData.name = 'rightLeg';
    frog.add(rightLeg);

    // 오른발
    const rightFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    rightFoot.position.set(0.4, 0, 0.15);
    frog.add(rightFoot);

    // 등에 무늬 (작은 반점들)
    for (let i = 0; i < 5; i++) {
      const spot = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        darkGreenMaterial
      );
      spot.position.set(
        (Math.random() - 0.5) * 0.8,
        1.5 + (Math.random() - 0.5) * 0.6,
        -0.3
      );
      frog.add(spot);
    }

    return frog;
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 좌클릭만
    
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 우클릭 핸들러 (커스텀 메뉴)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // 메뉴 닫기
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    
    if (contextMenu) {
      document.addEventListener('click', closeMenu);
      document.addEventListener('contextmenu', closeMenu);
      
      return () => {
        document.removeEventListener('click', closeMenu);
        document.removeEventListener('contextmenu', closeMenu);
      };
    }
  }, [contextMenu]);

  // 펫 제거
  const handleRemove = () => {
    setIsVisible(false);
    setContextMenu(null);
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '200px',
          height: '200px',
          zIndex: 99999,
          cursor: 'grab',
          pointerEvents: 'auto',
        }}
        className="frog-pet"
      />
      
      {/* 커스텀 우클릭 메뉴 */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 999999,
            background: '#2B2B2B',
            border: '1px solid #555',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            padding: '4px 0',
            minWidth: '150px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={handleRemove}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#FF6B6B',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 107, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🐸 개구리 끄기
          </div>
          <div
            style={{
              height: '1px',
              background: '#444',
              margin: '4px 8px',
            }}
          />
          <div
            style={{
              padding: '8px 16px',
              color: '#888',
              fontSize: '11px',
              pointerEvents: 'none',
            }}
          >
            드래그로 이동 가능
          </div>
        </div>
      )}
    </>
  );
}
