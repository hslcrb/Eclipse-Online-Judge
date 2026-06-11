'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type CatPose = 'sit' | 'stretch' | 'layDown' | 'playful' | 'groom';

interface CatPetProps {
  initialPosition?: { x: number; y: number };
  onRemove?: () => void;
}

export default function CatPet({ initialPosition = { x: 300, y: 100 }, onRemove }: CatPetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const catRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene 설정
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera 설정
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer 설정
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true
    });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 조명
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(3, 8, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-3, 2, -5);
    scene.add(rimLight);

    // 고양이 생성
    const cat = createCat();
    scene.add(cat);
    catRef.current = cat;

    // 애니메이션 루프
    let time = 0;
    let catPose: CatPose = 'sit';
    let poseTime = 0;
    
    const animate = () => {
      time += 0.015;
      poseTime += 0.015;
      
      if (catRef.current) {
        const cat = catRef.current;
        
        // 파츠 가져오기
        const head = cat.children.find(c => c.userData.name === 'head');
        const leftEar = cat.children.find(c => c.userData.name === 'leftEar');
        const rightEar = cat.children.find(c => c.userData.name === 'rightEar');
        const tail = cat.children.find(c => c.userData.name === 'tail');
        const tailTip = cat.children.find(c => c.userData.name === 'tailTip');
        const leftFrontLeg = cat.children.find(c => c.userData.name === 'leftFrontLeg');
        const rightFrontLeg = cat.children.find(c => c.userData.name === 'rightFrontLeg');
        const leftBackLeg = cat.children.find(c => c.userData.name === 'leftBackLeg');
        const rightBackLeg = cat.children.find(c => c.userData.name === 'rightBackLeg');
        const leftPupil = cat.children.find(c => c.userData.name === 'leftPupil');
        const rightPupil = cat.children.find(c => c.userData.name === 'rightPupil');
        
        // 포즈 전환 (4초마다)
        if (poseTime > 4) {
          poseTime = 0;
          const poses: CatPose[] = ['sit', 'stretch', 'layDown', 'playful', 'groom'];
          const currentIndex = poses.indexOf(catPose);
          catPose = poses[(currentIndex + 1) % poses.length];
        }
        
        // 기본 자세 리셋
        cat.rotation.x = 0;
        cat.rotation.y = 0;
        cat.rotation.z = 0;
        cat.position.y = 0;
        
        // 귀 미세한 움직임 (항상)
        if (leftEar) {
          leftEar.rotation.z = Math.sin(time * 1.5) * 0.1;
        }
        if (rightEar) {
          rightEar.rotation.z = -Math.sin(time * 1.5) * 0.1;
        }
        
        // 꼬리 자연스러운 움직임 (항상)
        if (tail) {
          tail.rotation.x = Math.sin(time * 0.8) * 0.3;
          tail.rotation.y = Math.sin(time * 1.2) * 0.15;
        }
        if (tailTip) {
          tailTip.rotation.x = Math.sin(time * 1.5 + 1) * 0.4;
          tailTip.rotation.y = Math.sin(time * 2) * 0.2;
        }
        
        // 눈동자 미세한 움직임
        if (leftPupil) {
          leftPupil.position.x = -0.25 + Math.sin(time * 0.6) * 0.015;
          leftPupil.position.y = 1.65 + Math.cos(time * 0.4) * 0.01;
        }
        if (rightPupil) {
          rightPupil.position.x = 0.25 + Math.sin(time * 0.6) * 0.015;
          rightPupil.position.y = 1.65 + Math.cos(time * 0.4) * 0.01;
        }
        
        const progress = poseTime / 4;
        const smooth = (Math.sin((progress - 0.5) * Math.PI) + 1) / 2;
        
        switch (catPose) {
          case 'sit':
            // 앉은 자세
            if (head) {
              head.rotation.x = Math.sin(time * 0.5) * 0.08;
            }
            if (leftFrontLeg) {
              leftFrontLeg.rotation.x = 0.2;
            }
            if (rightFrontLeg) {
              rightFrontLeg.rotation.x = 0.2;
            }
            if (leftBackLeg) {
              leftBackLeg.rotation.x = -0.8;
            }
            if (rightBackLeg) {
              rightBackLeg.rotation.x = -0.8;
            }
            break;
            
          case 'stretch':
            // 기지개 켜기
            cat.rotation.x = -smooth * 0.3;
            cat.position.y = -smooth * 0.2;
            
            if (head) {
              head.rotation.x = smooth * 0.4;
            }
            if (leftFrontLeg) {
              leftFrontLeg.rotation.x = smooth * 0.8;
              leftFrontLeg.position.z = smooth * 0.3;
            }
            if (rightFrontLeg) {
              rightFrontLeg.rotation.x = smooth * 0.8;
              rightFrontLeg.position.z = smooth * 0.3;
            }
            if (leftBackLeg) {
              leftBackLeg.rotation.x = -0.3;
            }
            if (rightBackLeg) {
              rightBackLeg.rotation.x = -0.3;
            }
            if (tail) {
              tail.rotation.x = smooth * 0.6;
            }
            break;
            
          case 'layDown':
            // 눕기
            cat.position.y = -0.4;
            cat.rotation.x = -0.1;
            
            if (head) {
              head.position.y = 1.2 - smooth * 0.2;
              head.rotation.x = Math.sin(time) * 0.05;
            }
            if (leftFrontLeg) {
              leftFrontLeg.rotation.x = smooth * 1.2;
              leftFrontLeg.position.z = smooth * 0.4;
            }
            if (rightFrontLeg) {
              rightFrontLeg.rotation.x = smooth * 1.2;
              rightFrontLeg.position.z = smooth * 0.4;
            }
            if (leftBackLeg) {
              leftBackLeg.rotation.x = smooth * 0.5;
            }
            if (rightBackLeg) {
              rightBackLeg.rotation.x = smooth * 0.5;
            }
            break;
            
          case 'playful':
            // 장난치기 (엉덩이 들기)
            cat.rotation.x = Math.sin(poseTime * 2) * 0.2 - 0.3;
            cat.position.y = Math.abs(Math.sin(poseTime * 3)) * 0.15;
            
            if (head) {
              head.rotation.x = -0.2 + Math.sin(poseTime * 4) * 0.1;
            }
            if (leftFrontLeg) {
              leftFrontLeg.rotation.x = 0.3;
            }
            if (rightFrontLeg) {
              rightFrontLeg.rotation.x = 0.3;
            }
            if (leftBackLeg) {
              leftBackLeg.rotation.x = -1.0 + Math.sin(poseTime * 4) * 0.2;
            }
            if (rightBackLeg) {
              rightBackLeg.rotation.x = -1.0 + Math.sin(poseTime * 4 + Math.PI) * 0.2;
            }
            if (tail) {
              tail.rotation.x = Math.sin(poseTime * 5) * 0.6;
              tail.rotation.y = Math.cos(poseTime * 3) * 0.4;
            }
            break;
            
          case 'groom':
            // 그루밍 (세수하기)
            if (head) {
              head.rotation.x = -0.3 + Math.sin(poseTime * 3) * 0.15;
              head.rotation.y = Math.sin(poseTime * 2) * 0.2;
            }
            if (leftFrontLeg) {
              leftFrontLeg.rotation.x = -0.5 + Math.abs(Math.sin(poseTime * 3)) * 0.3;
              leftFrontLeg.position.y = 0.5 + Math.abs(Math.sin(poseTime * 3)) * 0.2;
            }
            if (rightFrontLeg) {
              rightFrontLeg.rotation.x = 0.2;
            }
            if (leftBackLeg) {
              leftBackLeg.rotation.x = -0.6;
            }
            if (rightBackLeg) {
              rightBackLeg.rotation.x = -0.6;
            }
            break;
        }
      }

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 고양이 생성 함수
  const createCat = (): THREE.Group => {
    const cat = new THREE.Group();
    
    // 재질
    const catMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFF8C42, // 주황색 고양이
      shininess: 50,
      specular: 0x442211
    });
    
    const whiteMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFE6CC,
      shininess: 40
    });
    
    const pinkMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFB6C1,
      shininess: 60
    });
    
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xCCFF99,
      shininess: 100
    });
    
    const pupilMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x000000,
      shininess: 100
    });

    // === 몸통 ===
    const bodyGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    bodyGeometry.scale(1, 0.9, 1.3);
    const body = new THREE.Mesh(bodyGeometry, catMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    cat.add(body);

    // === 가슴 (흰색) ===
    const chestGeometry = new THREE.SphereGeometry(0.4, 24, 24);
    chestGeometry.scale(0.9, 1.1, 0.6);
    const chest = new THREE.Mesh(chestGeometry, whiteMaterial);
    chest.position.set(0, 0.7, 0.4);
    cat.add(chest);

    // === 머리 ===
    const headGeometry = new THREE.SphereGeometry(0.45, 32, 32);
    headGeometry.scale(1.1, 1, 1);
    const head = new THREE.Mesh(headGeometry, catMaterial);
    head.position.y = 1.2;
    head.userData.name = 'head';
    head.castShadow = true;
    cat.add(head);

    // === 귀 (삼각형) ===
    const earGeometry = new THREE.ConeGeometry(0.15, 0.3, 4);
    
    const leftEar = new THREE.Mesh(earGeometry, catMaterial);
    leftEar.position.set(-0.3, 1.5, 0);
    leftEar.rotation.z = -0.3;
    leftEar.userData.name = 'leftEar';
    cat.add(leftEar);
    
    // 귀 안쪽 (핑크)
    const innerEarGeometry = new THREE.ConeGeometry(0.08, 0.18, 4);
    const leftInnerEar = new THREE.Mesh(innerEarGeometry, pinkMaterial);
    leftInnerEar.position.set(-0.3, 1.48, 0.05);
    leftInnerEar.rotation.z = -0.3;
    cat.add(leftInnerEar);
    
    const rightEar = new THREE.Mesh(earGeometry, catMaterial);
    rightEar.position.set(0.3, 1.5, 0);
    rightEar.rotation.z = 0.3;
    rightEar.userData.name = 'rightEar';
    cat.add(rightEar);
    
    const rightInnerEar = new THREE.Mesh(innerEarGeometry, pinkMaterial);
    rightInnerEar.position.set(0.3, 1.48, 0.05);
    rightInnerEar.rotation.z = 0.3;
    cat.add(rightInnerEar);

    // === 주둥이 ===
    const snoutGeometry = new THREE.SphereGeometry(0.25, 20, 20);
    snoutGeometry.scale(0.8, 0.7, 0.6);
    const snout = new THREE.Mesh(snoutGeometry, whiteMaterial);
    snout.position.set(0, 1.05, 0.4);
    cat.add(snout);

    // === 코 ===
    const noseGeometry = new THREE.SphereGeometry(0.06, 12, 12);
    noseGeometry.scale(1, 0.8, 0.8);
    const nose = new THREE.Mesh(noseGeometry, pinkMaterial);
    nose.position.set(0, 1.15, 0.6);
    cat.add(nose);

    // === 눈 ===
    const eyeGeometry = new THREE.SphereGeometry(0.12, 20, 20);
    eyeGeometry.scale(0.7, 1.2, 1);
    
    // 왼쪽 눈
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.25, 1.3, 0.35);
    cat.add(leftEye);
    
    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      pupilMaterial
    );
    leftPupil.position.set(-0.25, 1.65, 0.42);
    leftPupil.userData.name = 'leftPupil';
    cat.add(leftPupil);
    
    const leftHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    leftHighlight.position.set(-0.23, 1.35, 0.45);
    cat.add(leftHighlight);
    
    // 오른쪽 눈
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.25, 1.3, 0.35);
    cat.add(rightEye);
    
    const rightPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      pupilMaterial
    );
    rightPupil.position.set(0.25, 1.65, 0.42);
    rightPupil.userData.name = 'rightPupil';
    cat.add(rightPupil);
    
    const rightHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    rightHighlight.position.set(0.27, 1.35, 0.45);
    cat.add(rightHighlight);

    // === 수염 ===
    const whiskerMaterial = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
    
    for (let side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const points = [
          new THREE.Vector3(side * 0.15, 1.1 - i * 0.08, 0.55),
          new THREE.Vector3(side * 0.6, 1.12 - i * 0.08, 0.55)
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const whisker = new THREE.Line(geometry, whiskerMaterial);
        cat.add(whisker);
      }
    }

    // === 앞다리 ===
    const frontLegGeometry = new THREE.CylinderGeometry(0.1, 0.08, 0.6, 16);
    
    const leftFrontLeg = new THREE.Mesh(frontLegGeometry, catMaterial);
    leftFrontLeg.position.set(-0.3, 0.3, 0.35);
    leftFrontLeg.userData.name = 'leftFrontLeg';
    leftFrontLeg.castShadow = true;
    cat.add(leftFrontLeg);
    
    const rightFrontLeg = new THREE.Mesh(frontLegGeometry, catMaterial);
    rightFrontLeg.position.set(0.3, 0.3, 0.35);
    rightFrontLeg.userData.name = 'rightFrontLeg';
    rightFrontLeg.castShadow = true;
    cat.add(rightFrontLeg);
    
    // 앞발 (흰색 발)
    const pawGeometry = new THREE.SphereGeometry(0.11, 16, 16);
    pawGeometry.scale(1, 0.6, 1);
    
    const leftFrontPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    leftFrontPaw.position.set(-0.3, 0.05, 0.35);
    cat.add(leftFrontPaw);
    
    const rightFrontPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    rightFrontPaw.position.set(0.3, 0.05, 0.35);
    cat.add(rightFrontPaw);

    // === 뒷다리 ===
    const backLegGeometry = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 16);
    
    const leftBackLeg = new THREE.Mesh(backLegGeometry, catMaterial);
    leftBackLeg.position.set(-0.35, 0.4, -0.2);
    leftBackLeg.userData.name = 'leftBackLeg';
    leftBackLeg.castShadow = true;
    cat.add(leftBackLeg);
    
    const rightBackLeg = new THREE.Mesh(backLegGeometry, catMaterial);
    rightBackLeg.position.set(0.35, 0.4, -0.2);
    rightBackLeg.userData.name = 'rightBackLeg';
    rightBackLeg.castShadow = true;
    cat.add(rightBackLeg);
    
    // 뒷발
    const leftBackPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    leftBackPaw.position.set(-0.35, 0.05, -0.2);
    cat.add(leftBackPaw);
    
    const rightBackPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    rightBackPaw.position.set(0.35, 0.05, -0.2);
    cat.add(rightBackPaw);

    // === 꼬리 (2단계) ===
    const tailGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.5, 16);
    const tail = new THREE.Mesh(tailGeometry, catMaterial);
    tail.position.set(0, 0.8, -0.7);
    tail.rotation.x = -0.5;
    tail.userData.name = 'tail';
    cat.add(tail);
    
    const tailTipGeometry = new THREE.CylinderGeometry(0.06, 0.03, 0.4, 16);
    const tailTip = new THREE.Mesh(tailTipGeometry, catMaterial);
    tailTip.position.set(0, 1.0, -1.0);
    tailTip.rotation.x = -1.0;
    tailTip.userData.name = 'tailTip';
    cat.add(tailTip);

    // === 무늬 (줄무늬) ===
    const stripePositions = [
      { x: 0, y: 0.9, z: -0.3, scale: [0.8, 0.1, 0.4] },
      { x: 0, y: 0.7, z: -0.35, scale: [0.7, 0.12, 0.35] },
      { x: 0, y: 0.5, z: -0.3, scale: [0.6, 0.1, 0.3] },
    ];
    
    const stripeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xCC6622,
      shininess: 50
    });
    
    stripePositions.forEach(stripe => {
      const stripeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      stripeGeometry.scale(stripe.scale[0], stripe.scale[1], stripe.scale[2]);
      const stripeMesh = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripeMesh.position.set(stripe.x, stripe.y, stripe.z);
      cat.add(stripeMesh);
    });

    return cat;
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    
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

  // 우클릭 핸들러
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
    setContextMenu(null);
    onRemove?.();
  };

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
        className="cat-pet"
      />
      
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
            🐱 고양이 끄기
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
