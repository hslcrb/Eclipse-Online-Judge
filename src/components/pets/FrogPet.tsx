'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type DancePhase = 'rightArm' | 'leftArm' | 'rightLeg' | 'leftLeg' | 'wallClimb';

interface FrogPetProps {
  initialPosition?: { x: number; y: number };
  onRemove?: () => void;
}

export default function FrogPet({ initialPosition = { x: 100, y: 100 }, onRemove }: FrogPetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frogRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

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
        const leftUpperArm = frog.children.find(c => c.userData.name === 'leftUpperArm');
        const rightUpperArm = frog.children.find(c => c.userData.name === 'rightUpperArm');
        const leftForearm = frog.children.find(c => c.userData.name === 'leftForearm');
        const rightForearm = frog.children.find(c => c.userData.name === 'rightForearm');
        const leftHand = frog.children.find(c => c.userData.name === 'leftHand');
        const rightHand = frog.children.find(c => c.userData.name === 'rightHand');
        const leftThigh = frog.children.find(c => c.userData.name === 'leftThigh');
        const rightThigh = frog.children.find(c => c.userData.name === 'rightThigh');
        const leftCalf = frog.children.find(c => c.userData.name === 'leftCalf');
        const rightCalf = frog.children.find(c => c.userData.name === 'rightCalf');
        const leftFoot = frog.children.find(c => c.userData.name === 'leftFoot');
        const rightFoot = frog.children.find(c => c.userData.name === 'rightFoot');
        const head = frog.children.find(c => c.userData.name === 'head');
        const leftPupil = frog.children.find(c => c.userData.name === 'leftPupil');
        const rightPupil = frog.children.find(c => c.userData.name === 'rightPupil');
        
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
        
        if (leftUpperArm) {
          leftUpperArm.rotation.z = 0.6;
          leftUpperArm.rotation.x = 0;
          leftUpperArm.rotation.y = 0;
        }
        if (rightUpperArm) {
          rightUpperArm.rotation.z = -0.6;
          rightUpperArm.rotation.x = 0;
          rightUpperArm.rotation.y = 0;
        }
        if (leftForearm) {
          leftForearm.rotation.z = 0.3;
          leftForearm.rotation.x = 0;
        }
        if (rightForearm) {
          rightForearm.rotation.z = -0.3;
          rightForearm.rotation.x = 0;
        }
        if (leftThigh) {
          leftThigh.rotation.x = 0;
        }
        if (rightThigh) {
          rightThigh.rotation.x = 0;
        }
        if (leftCalf) {
          leftCalf.rotation.x = 0;
        }
        if (rightCalf) {
          rightCalf.rotation.x = 0;
        }
        if (head) {
          head.rotation.x = 0;
          head.rotation.z = 0;
        }
        
        // 눈동자 미세한 움직임 (항상)
        if (leftPupil) {
          leftPupil.position.x = -0.4 + Math.sin(time * 0.5) * 0.02;
          leftPupil.position.y = 2.8 + Math.cos(time * 0.3) * 0.015;
        }
        if (rightPupil) {
          rightPupil.position.x = 0.4 + Math.sin(time * 0.5) * 0.02;
          rightPupil.position.y = 2.8 + Math.cos(time * 0.3) * 0.015;
        }
        
        // 페이즈별 동작
        const progress = phaseTime / 3; // 0 ~ 1
        const smoothProgress = (Math.sin((progress - 0.5) * Math.PI) + 1) / 2; // 부드러운 진행
        const easeInOut = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2; // easeInOutQuad
        
        switch (dancePhase) {
          case 'rightArm':
            // 오른팔 천천히 앞으로 내밀기 (더 정교한 관절 움직임)
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.6 - smoothProgress * 1.0;
              rightUpperArm.rotation.x = -smoothProgress * 0.6;
            }
            if (rightForearm) {
              rightForearm.rotation.z = -0.3 - smoothProgress * 0.8;
              rightForearm.rotation.x = -smoothProgress * 0.4;
            }
            if (rightHand) {
              rightHand.rotation.y = smoothProgress * 0.3;
            }
            
            // 허리를 오른쪽으로 축축
            frog.rotation.z = Math.sin(phaseTime * 2) * 0.12;
            
            // 머리도 살짝
            if (head) {
              head.rotation.z = Math.sin(phaseTime * 2) * 0.08;
              head.rotation.x = Math.sin(phaseTime * 1.5) * 0.05;
            }
            
            // 발은 지탱
            if (rightFoot) {
              rightFoot.rotation.x = -smoothProgress * 0.1;
            }
            break;
            
          case 'leftArm':
            // 왼팔 천천히 앞으로 내밀기
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.6 + smoothProgress * 1.0;
              leftUpperArm.rotation.x = -smoothProgress * 0.6;
            }
            if (leftForearm) {
              leftForearm.rotation.z = 0.3 + smoothProgress * 0.8;
              leftForearm.rotation.x = -smoothProgress * 0.4;
            }
            if (leftHand) {
              leftHand.rotation.y = -smoothProgress * 0.3;
            }
            
            // 허리를 왼쪽으로 축축
            frog.rotation.z = -Math.sin(phaseTime * 2) * 0.12;
            
            if (head) {
              head.rotation.z = -Math.sin(phaseTime * 2) * 0.08;
              head.rotation.x = Math.sin(phaseTime * 1.5) * 0.05;
            }
            
            if (leftFoot) {
              leftFoot.rotation.x = -smoothProgress * 0.1;
            }
            break;
            
          case 'rightLeg':
            // 오른발 내밀고 허리 돌리기 (더 자연스러운 관절)
            if (rightThigh) {
              rightThigh.rotation.x = smoothProgress * 0.5;
            }
            if (rightCalf) {
              rightCalf.rotation.x = smoothProgress * 0.3;
            }
            if (rightFoot) {
              rightFoot.rotation.x = -smoothProgress * 0.4;
            }
            
            // 균형을 위한 팔 움직임
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.6 + smoothProgress * 0.5;
            }
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.6 - smoothProgress * 0.3;
            }
            
            frog.rotation.z = Math.sin(phaseTime * 1.5) * 0.15;
            frog.rotation.y = smoothProgress * 0.25;
            
            if (head) {
              head.rotation.x = Math.sin(phaseTime * 2) * 0.08;
              head.rotation.y = smoothProgress * 0.15;
            }
            break;
            
          case 'leftLeg':
            // 왼발 내밀고 허리 돌리기
            if (leftThigh) {
              leftThigh.rotation.x = smoothProgress * 0.5;
            }
            if (leftCalf) {
              leftCalf.rotation.x = smoothProgress * 0.3;
            }
            if (leftFoot) {
              leftFoot.rotation.x = -smoothProgress * 0.4;
            }
            
            // 균형을 위한 팔 움직임
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.6 - smoothProgress * 0.5;
            }
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.6 + smoothProgress * 0.3;
            }
            
            frog.rotation.z = -Math.sin(phaseTime * 1.5) * 0.15;
            frog.rotation.y = -smoothProgress * 0.25;
            
            if (head) {
              head.rotation.x = -Math.sin(phaseTime * 2) * 0.08;
              head.rotation.y = -smoothProgress * 0.15;
            }
            break;
            
          case 'wallClimb':
            // 벽타기 시뮬레이션 (더 사실적인 등반 동작)
            frog.rotation.x = smoothProgress * 0.4;
            
            // 팔다리를 교차로 움직임 (더 정교하게)
            const climbCycle = Math.sin(phaseTime * 3);
            
            if (leftUpperArm) {
              leftUpperArm.rotation.z = 0.6 + climbCycle * 0.7;
              leftUpperArm.rotation.y = climbCycle * 0.4;
              leftUpperArm.rotation.x = -0.3 + Math.abs(climbCycle) * 0.3;
            }
            if (leftForearm) {
              leftForearm.rotation.z = 0.3 + Math.abs(climbCycle) * 0.5;
            }
            
            if (rightUpperArm) {
              rightUpperArm.rotation.z = -0.6 - climbCycle * 0.7;
              rightUpperArm.rotation.y = -climbCycle * 0.4;
              rightUpperArm.rotation.x = -0.3 + Math.abs(climbCycle) * 0.3;
            }
            if (rightForearm) {
              rightForearm.rotation.z = -0.3 - Math.abs(climbCycle) * 0.5;
            }
            
            if (leftThigh) {
              leftThigh.rotation.x = -climbCycle * 0.5;
            }
            if (leftCalf) {
              leftCalf.rotation.x = Math.abs(climbCycle) * 0.4;
            }
            
            if (rightThigh) {
              rightThigh.rotation.x = climbCycle * 0.5;
            }
            if (rightCalf) {
              rightCalf.rotation.x = Math.abs(climbCycle) * 0.4;
            }
            
            // 위아래로 움직임 (기어오르는 느낌)
            frog.position.y = Math.abs(Math.sin(phaseTime * 1.5)) * 0.25;
            
            // 머리를 위로
            if (head) {
              head.rotation.x = -0.15 + Math.sin(phaseTime * 2) * 0.05;
            }
            
            // 손발 움직임
            if (leftHand) {
              leftHand.rotation.z = climbCycle * 0.3;
            }
            if (rightHand) {
              rightHand.rotation.z = -climbCycle * 0.3;
            }
            if (leftFoot) {
              leftFoot.rotation.x = -Math.abs(climbCycle) * 0.3;
            }
            if (rightFoot) {
              rightFoot.rotation.x = -Math.abs(climbCycle) * 0.3;
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

  // 개구리 생성 함수 - 더 정교한 버전
  const createFrog = (): THREE.Group => {
    const frog = new THREE.Group();
    
    // 고급 재질 (더 부드럽고 사실적)
    const frogMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x7FFF00,
      shininess: 60,
      specular: 0x224422
    });
    
    const darkGreenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x228B22,
      shininess: 40
    });
    
    const eyeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFFF,
      shininess: 100,
      specular: 0xFFFFFF
    });
    
    const pupilMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x000000,
      shininess: 100
    });
    
    const bellyMaterial = new THREE.MeshPhongMaterial({
      color: 0xFFFF99,
      shininess: 30
    });

    // === 몸통 (더 유기적인 형태) ===
    const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    bodyGeometry.scale(1, 1.3, 0.95);
    const body = new THREE.Mesh(bodyGeometry, frogMaterial);
    body.position.y = 1.5;
    body.castShadow = true;
    frog.add(body);

    // === 머리 (더 둥글고 큼) ===
    const headGeometry = new THREE.SphereGeometry(0.75, 32, 32);
    headGeometry.scale(1.1, 1, 1.05);
    const head = new THREE.Mesh(headGeometry, frogMaterial);
    head.position.y = 2.6;
    head.userData.name = 'head';
    head.castShadow = true;
    frog.add(head);

    // === 눈 베이스 (더 크고 튀어나옴) ===
    const eyeBaseGeometry = new THREE.SphereGeometry(0.3, 20, 20);
    eyeBaseGeometry.scale(0.9, 1.1, 1);
    
    // 왼쪽 눈 베이스
    const leftEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    leftEyeBase.position.set(-0.4, 2.8, 0.35);
    leftEyeBase.castShadow = true;
    frog.add(leftEyeBase);
    
    // 왼쪽 눈 흰자
    const leftEyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      eyeMaterial
    );
    leftEyeWhite.position.set(-0.4, 2.8, 0.55);
    frog.add(leftEyeWhite);
    
    // 왼쪽 동공 (더 크고 반짝임)
    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 20),
      pupilMaterial
    );
    leftPupil.position.set(-0.4, 2.8, 0.66);
    leftPupil.userData.name = 'leftPupil';
    frog.add(leftPupil);
    
    // 왼쪽 눈 하이라이트
    const leftHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    leftHighlight.position.set(-0.35, 2.85, 0.7);
    frog.add(leftHighlight);

    // 오른쪽 눈 베이스
    const rightEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    rightEyeBase.position.set(0.4, 2.8, 0.35);
    rightEyeBase.castShadow = true;
    frog.add(rightEyeBase);
    
    // 오른쪽 눈 흰자
    const rightEyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      eyeMaterial
    );
    rightEyeWhite.position.set(0.4, 2.8, 0.55);
    frog.add(rightEyeWhite);
    
    // 오른쪽 동공
    const rightPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 20),
      pupilMaterial
    );
    rightPupil.position.set(0.4, 2.8, 0.66);
    rightPupil.userData.name = 'rightPupil';
    frog.add(rightPupil);
    
    // 오른쪽 눈 하이라이트
    const rightHighlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    rightHighlight.position.set(0.45, 2.85, 0.7);
    frog.add(rightHighlight);

    // === 입 (더 정교하게) ===
    // 입술 라인
    const mouthGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16, Math.PI);
    const mouth = new THREE.Mesh(mouthGeometry, darkGreenMaterial);
    mouth.position.set(0, 2.35, 0.65);
    mouth.rotation.x = Math.PI / 2;
    frog.add(mouth);
    
    // 콧구멍
    const nostrilGeometry = new THREE.SphereGeometry(0.04, 12, 12);
    const leftNostril = new THREE.Mesh(nostrilGeometry, darkGreenMaterial);
    leftNostril.position.set(-0.15, 2.5, 0.68);
    frog.add(leftNostril);
    
    const rightNostril = new THREE.Mesh(nostrilGeometry, darkGreenMaterial);
    rightNostril.position.set(0.15, 2.5, 0.68);
    frog.add(rightNostril);

    // === 배 (더 자연스러운 형태) ===
    const bellyGeometry = new THREE.SphereGeometry(0.65, 32, 32);
    bellyGeometry.scale(1.05, 1.4, 0.6);
    const belly = new THREE.Mesh(bellyGeometry, bellyMaterial);
    belly.position.set(0, 1.5, 0.5);
    frog.add(belly);

    // === 목 (연결부 자연스럽게) ===
    const neckGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.4, 20);
    const neck = new THREE.Mesh(neckGeometry, frogMaterial);
    neck.position.y = 2.1;
    frog.add(neck);

    // === 왼쪽 팔 (더 유기적) ===
    // 상완
    const upperArmGeometry = new THREE.CylinderGeometry(0.16, 0.14, 0.5, 16);
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, frogMaterial);
    leftUpperArm.position.set(-0.75, 1.9, 0);
    leftUpperArm.rotation.z = 0.6;
    leftUpperArm.userData.name = 'leftUpperArm';
    leftUpperArm.castShadow = true;
    frog.add(leftUpperArm);
    
    // 하완
    const forearmGeometry = new THREE.CylinderGeometry(0.14, 0.11, 0.4, 16);
    const leftForearm = new THREE.Mesh(forearmGeometry, frogMaterial);
    leftForearm.position.set(-1, 1.5, 0);
    leftForearm.rotation.z = 0.3;
    leftForearm.userData.name = 'leftForearm';
    frog.add(leftForearm);

    // 왼손 (4개 손가락 표현)
    const handGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    handGeometry.scale(1.2, 0.8, 1);
    const leftHand = new THREE.Mesh(handGeometry, frogMaterial);
    leftHand.position.set(-1.2, 1.3, 0);
    leftHand.userData.name = 'leftHand';
    frog.add(leftHand);
    
    // 손가락들
    for (let i = 0; i < 3; i++) {
      const fingerGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.15, 8);
      const finger = new THREE.Mesh(fingerGeometry, darkGreenMaterial);
      finger.position.set(-1.25 - i * 0.08, 1.2, 0.05);
      finger.rotation.z = -0.5 + i * 0.2;
      frog.add(finger);
    }

    // === 오른쪽 팔 ===
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, frogMaterial);
    rightUpperArm.position.set(0.75, 1.9, 0);
    rightUpperArm.rotation.z = -0.6;
    rightUpperArm.userData.name = 'rightUpperArm';
    rightUpperArm.castShadow = true;
    frog.add(rightUpperArm);
    
    const rightForearm = new THREE.Mesh(forearmGeometry, frogMaterial);
    rightForearm.position.set(1, 1.5, 0);
    rightForearm.rotation.z = -0.3;
    rightForearm.userData.name = 'rightForearm';
    frog.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeometry, frogMaterial);
    rightHand.position.set(1.2, 1.3, 0);
    rightHand.userData.name = 'rightHand';
    frog.add(rightHand);
    
    for (let i = 0; i < 3; i++) {
      const fingerGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.15, 8);
      const finger = new THREE.Mesh(fingerGeometry, darkGreenMaterial);
      finger.position.set(1.25 + i * 0.08, 1.2, 0.05);
      finger.rotation.z = 0.5 - i * 0.2;
      frog.add(finger);
    }

    // === 왼쪽 다리 (더 튼튼하고 근육질) ===
    // 허벅지
    const thighGeometry = new THREE.CylinderGeometry(0.28, 0.24, 0.7, 20);
    const leftThigh = new THREE.Mesh(thighGeometry, frogMaterial);
    leftThigh.position.set(-0.35, 0.85, 0);
    leftThigh.userData.name = 'leftThigh';
    leftThigh.castShadow = true;
    frog.add(leftThigh);
    
    // 무릎
    const kneeGeometry = new THREE.SphereGeometry(0.22, 16, 16);
    const leftKnee = new THREE.Mesh(kneeGeometry, frogMaterial);
    leftKnee.position.set(-0.35, 0.5, 0);
    frog.add(leftKnee);
    
    // 종아리
    const calfGeometry = new THREE.CylinderGeometry(0.22, 0.18, 0.5, 20);
    const leftCalf = new THREE.Mesh(calfGeometry, frogMaterial);
    leftCalf.position.set(-0.35, 0.25, 0.1);
    leftCalf.userData.name = 'leftCalf';
    frog.add(leftCalf);

    // 왼발 (더 디테일하게)
    const footGeometry = new THREE.BoxGeometry(0.35, 0.2, 0.6);
    const leftFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    leftFoot.position.set(-0.35, 0.05, 0.25);
    leftFoot.userData.name = 'leftFoot';
    leftFoot.castShadow = true;
    frog.add(leftFoot);
    
    // 발가락들 (5개)
    for (let i = 0; i < 5; i++) {
      const toeGeometry = new THREE.CylinderGeometry(0.04, 0.03, 0.12, 8);
      const toe = new THREE.Mesh(toeGeometry, darkGreenMaterial);
      toe.position.set(-0.45 + i * 0.08, 0.02, 0.5);
      toe.rotation.x = Math.PI / 2;
      frog.add(toe);
    }

    // === 오른쪽 다리 ===
    const rightThigh = new THREE.Mesh(thighGeometry, frogMaterial);
    rightThigh.position.set(0.35, 0.85, 0);
    rightThigh.userData.name = 'rightThigh';
    rightThigh.castShadow = true;
    frog.add(rightThigh);
    
    const rightKnee = new THREE.Mesh(kneeGeometry, frogMaterial);
    rightKnee.position.set(0.35, 0.5, 0);
    frog.add(rightKnee);
    
    const rightCalf = new THREE.Mesh(calfGeometry, frogMaterial);
    rightCalf.position.set(0.35, 0.25, 0.1);
    rightCalf.userData.name = 'rightCalf';
    frog.add(rightCalf);

    const rightFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    rightFoot.position.set(0.35, 0.05, 0.25);
    rightFoot.userData.name = 'rightFoot';
    rightFoot.castShadow = true;
    frog.add(rightFoot);
    
    for (let i = 0; i < 5; i++) {
      const toeGeometry = new THREE.CylinderGeometry(0.04, 0.03, 0.12, 8);
      const toe = new THREE.Mesh(toeGeometry, darkGreenMaterial);
      toe.position.set(0.45 - i * 0.08, 0.02, 0.5);
      toe.rotation.x = Math.PI / 2;
      frog.add(toe);
    }

    // === 등 무늬 (더 많고 자연스럽게) ===
    const spotPositions = [
      { x: -0.3, y: 2.0, z: -0.5, size: 0.12 },
      { x: 0.2, y: 2.1, z: -0.5, size: 0.1 },
      { x: -0.1, y: 1.8, z: -0.6, size: 0.15 },
      { x: 0.35, y: 1.6, z: -0.5, size: 0.08 },
      { x: -0.4, y: 1.5, z: -0.55, size: 0.11 },
      { x: 0.1, y: 1.4, z: -0.6, size: 0.09 },
      { x: -0.2, y: 2.3, z: -0.4, size: 0.07 },
    ];
    
    spotPositions.forEach(spot => {
      const spotMesh = new THREE.Mesh(
        new THREE.SphereGeometry(spot.size, 12, 12),
        darkGreenMaterial
      );
      spotMesh.position.set(spot.x, spot.y, spot.z);
      frog.add(spotMesh);
    });

    // === 꼬리 (작은 돌기) ===
    const tailGeometry = new THREE.ConeGeometry(0.08, 0.15, 12);
    const tail = new THREE.Mesh(tailGeometry, darkGreenMaterial);
    tail.position.set(0, 1.2, -0.7);
    tail.rotation.x = Math.PI;
    frog.add(tail);

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
