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
  }, []);

  // 개구리 생성 함수 - 극도로 정교한 버전
  const createFrog = (): THREE.Group => {
    const frog = new THREE.Group();
    
    // 최고급 재질 (스무스하고 촉촉한 느낌)
    const frogMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7FFF00,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0x001100,
      emissiveIntensity: 0.05
    });
    
    const darkGreenMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22,
      roughness: 0.4,
      metalness: 0.05
    });
    
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFFFFF,
      roughness: 0.1,
      metalness: 0.2
    });
    
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      roughness: 0.2,
      metalness: 0.3
    });
    
    const bellyMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFF99,
      roughness: 0.5,
      metalness: 0
    });

    // === 몸통 (매우 부드러운 형태, 고해상도) ===
    const bodyGeometry = new THREE.SphereGeometry(0.8, 64, 64);
    bodyGeometry.scale(1, 1.3, 0.95);
    const body = new THREE.Mesh(bodyGeometry, frogMaterial);
    body.position.y = 1.5;
    body.castShadow = true;
    body.receiveShadow = true;
    frog.add(body);

    // === 머리 (매우 큼, 초고해상도) ===
    const headGeometry = new THREE.SphereGeometry(0.75, 64, 64);
    headGeometry.scale(1.15, 1.05, 1.1);
    const head = new THREE.Mesh(headGeometry, frogMaterial);
    head.position.y = 2.6;
    head.userData.name = 'head';
    head.castShadow = true;
    head.receiveShadow = true;
    frog.add(head);

    // === 눈 베이스 (크고 튀어나옴, 초고해상도) ===
    const eyeBaseGeometry = new THREE.SphereGeometry(0.32, 48, 48);
    eyeBaseGeometry.scale(0.95, 1.15, 1.05);
    
    // 왼쪽 눈 베이스 (약간 반짝임)
    const leftEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    leftEyeBase.position.set(-0.42, 2.85, 0.38);
    leftEyeBase.castShadow = true;
    leftEyeBase.receiveShadow = true;
    frog.add(leftEyeBase);
    
    // 왼쪽 눈 흰자 (더 크고 반짝임)
    const leftEyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      eyeMaterial
    );
    leftEyeWhite.position.set(-0.42, 2.85, 0.60);
    leftEyeWhite.receiveShadow = true;
    frog.add(leftEyeWhite);
    
    // 왼쪽 동공 (크고 깊이감)
    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 32, 32),
      pupilMaterial
    );
    leftPupil.position.set(-0.42, 2.85, 0.73);
    leftPupil.userData.name = 'leftPupil';
    frog.add(leftPupil);
    
    // 왼쪽 눈 하이라이트 (두 개로 더 입체감)
    const leftHighlight1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    leftHighlight1.position.set(-0.38, 2.92, 0.76);
    frog.add(leftHighlight1);
    
    const leftHighlight2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 })
    );
    leftHighlight2.position.set(-0.45, 2.80, 0.74);
    frog.add(leftHighlight2);

    // 오른쪽 눈 베이스
    const rightEyeBase = new THREE.Mesh(eyeBaseGeometry, frogMaterial);
    rightEyeBase.position.set(0.42, 2.85, 0.38);
    rightEyeBase.castShadow = true;
    rightEyeBase.receiveShadow = true;
    frog.add(rightEyeBase);
    
    // 오른쪽 눈 흰자
    const rightEyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      eyeMaterial
    );
    rightEyeWhite.position.set(0.42, 2.85, 0.60);
    rightEyeWhite.receiveShadow = true;
    frog.add(rightEyeWhite);
    
    // 오른쪽 동공
    const rightPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 32, 32),
      pupilMaterial
    );
    rightPupil.position.set(0.42, 2.85, 0.73);
    rightPupil.userData.name = 'rightPupil';
    frog.add(rightPupil);
    
    // 오른쪽 눈 하이라이트
    const rightHighlight1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    rightHighlight1.position.set(0.46, 2.92, 0.76);
    frog.add(rightHighlight1);
    
    const rightHighlight2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 })
    );
    rightHighlight2.position.set(0.39, 2.80, 0.74);
    frog.add(rightHighlight2);

    // === 입 (훨씬 더 정교한 미소) ===
    // 윗입술
    const upperLipGeometry = new THREE.TorusGeometry(0.18, 0.035, 16, 32, Math.PI);
    const upperLip = new THREE.Mesh(upperLipGeometry, darkGreenMaterial);
    upperLip.position.set(0, 2.40, 0.68);
    upperLip.rotation.x = Math.PI / 2 + 0.1;
    frog.add(upperLip);
    
    // 아랫입술 (약간 작음)
    const lowerLipGeometry = new THREE.TorusGeometry(0.15, 0.03, 16, 32, Math.PI);
    const lowerLip = new THREE.Mesh(lowerLipGeometry, darkGreenMaterial);
    lowerLip.position.set(0, 2.32, 0.66);
    lowerLip.rotation.x = Math.PI / 2 - 0.15;
    lowerLip.rotation.y = Math.PI;
    frog.add(lowerLip);
    
    // 입 가장자리 (더 자연스럽게)
    const mouthCornerGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const leftMouthCorner = new THREE.Mesh(mouthCornerGeo, darkGreenMaterial);
    leftMouthCorner.position.set(-0.17, 2.36, 0.66);
    frog.add(leftMouthCorner);
    
    const rightMouthCorner = new THREE.Mesh(mouthCornerGeo, darkGreenMaterial);
    rightMouthCorner.position.set(0.17, 2.36, 0.66);
    frog.add(rightMouthCorner);
    
    // 콧구멍 (더 자연스럽게)
    const nostrilGeometry = new THREE.SphereGeometry(0.045, 16, 16);
    nostrilGeometry.scale(1, 0.8, 0.7);
    
    const leftNostril = new THREE.Mesh(nostrilGeometry, darkGreenMaterial);
    leftNostril.position.set(-0.16, 2.55, 0.70);
    frog.add(leftNostril);
    
    const rightNostril = new THREE.Mesh(nostrilGeometry, darkGreenMaterial);
    rightNostril.position.set(0.16, 2.55, 0.70);
    frog.add(rightNostril);

    // === 배 (매우 자연스러운 형태) ===
    const bellyGeometry = new THREE.SphereGeometry(0.68, 48, 48);
    bellyGeometry.scale(1.1, 1.45, 0.65);
    const belly = new THREE.Mesh(bellyGeometry, bellyMaterial);
    belly.position.set(0, 1.5, 0.52);
    belly.receiveShadow = true;
    frog.add(belly);

    // === 목 (더 부드러운 연결) ===
    const neckGeometry = new THREE.CylinderGeometry(0.45, 0.55, 0.45, 32);
    const neck = new THREE.Mesh(neckGeometry, frogMaterial);
    neck.position.y = 2.1;
    neck.castShadow = true;
    neck.receiveShadow = true;
    frog.add(neck);

    // === 왼쪽 팔 (훨씬 더 유기적, 고해상도) ===
    // 상완 (어깨에서 팔꿈치)
    const upperArmGeometry = new THREE.CylinderGeometry(0.18, 0.15, 0.55, 24);
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, frogMaterial);
    leftUpperArm.position.set(-0.78, 1.92, 0);
    leftUpperArm.rotation.z = 0.6;
    leftUpperArm.userData.name = 'leftUpperArm';
    leftUpperArm.castShadow = true;
    leftUpperArm.receiveShadow = true;
    frog.add(leftUpperArm);
    
    // 팔꿈치 관절 (더 둥글게)
    const elbowJointGeo = new THREE.SphereGeometry(0.15, 20, 20);
    const leftElbowJoint = new THREE.Mesh(elbowJointGeo, frogMaterial);
    leftElbowJoint.position.set(-1.02, 1.55, 0);
    leftElbowJoint.castShadow = true;
    frog.add(leftElbowJoint);
    
    // 하완 (팔꿈치에서 손목)
    const forearmGeometry = new THREE.CylinderGeometry(0.15, 0.12, 0.45, 24);
    const leftForearm = new THREE.Mesh(forearmGeometry, frogMaterial);
    leftForearm.position.set(-1.05, 1.52, 0);
    leftForearm.rotation.z = 0.3;
    leftForearm.userData.name = 'leftForearm';
    leftForearm.castShadow = true;
    frog.add(leftForearm);

    // 왼손 (더 자연스러운 형태)
    const handGeometry = new THREE.SphereGeometry(0.22, 24, 24);
    handGeometry.scale(1.25, 0.85, 1.05);
    const leftHand = new THREE.Mesh(handGeometry, frogMaterial);
    leftHand.position.set(-1.22, 1.30, 0);
    leftHand.userData.name = 'leftHand';
    leftHand.castShadow = true;
    frog.add(leftHand);
    
    // 왼손 손가락 (4개, 더 세밀하게)
    const fingerPositions = [
      { x: -1.30, y: 1.22, z: 0.12, rot: -0.6 },
      { x: -1.35, y: 1.20, z: 0.04, rot: -0.5 },
      { x: -1.38, y: 1.18, z: -0.04, rot: -0.4 },
      { x: -1.35, y: 1.16, z: -0.12, rot: -0.3 },
    ];
    
    fingerPositions.forEach(pos => {
      const fingerGeometry = new THREE.CylinderGeometry(0.035, 0.025, 0.18, 12);
      const finger = new THREE.Mesh(fingerGeometry, darkGreenMaterial);
      finger.position.set(pos.x, pos.y, pos.z);
      finger.rotation.z = pos.rot;
      finger.castShadow = true;
      frog.add(finger);
      
      // 손가락 끝 (둥글게)
      const fingerTipGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const fingerTip = new THREE.Mesh(fingerTipGeo, darkGreenMaterial);
      fingerTip.position.set(
        pos.x - Math.cos(pos.rot) * 0.09, 
        pos.y - Math.sin(pos.rot) * 0.09, 
        pos.z
      );
      frog.add(fingerTip);
    });

    // === 오른쪽 팔 ===
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, frogMaterial);
    rightUpperArm.position.set(0.78, 1.92, 0);
    rightUpperArm.rotation.z = -0.6;
    rightUpperArm.userData.name = 'rightUpperArm';
    rightUpperArm.castShadow = true;
    rightUpperArm.receiveShadow = true;
    frog.add(rightUpperArm);
    
    const rightElbowJoint = new THREE.Mesh(elbowJointGeo, frogMaterial);
    rightElbowJoint.position.set(1.02, 1.55, 0);
    rightElbowJoint.castShadow = true;
    frog.add(rightElbowJoint);
    
    const rightForearm = new THREE.Mesh(forearmGeometry, frogMaterial);
    rightForearm.position.set(1.05, 1.52, 0);
    rightForearm.rotation.z = -0.3;
    rightForearm.userData.name = 'rightForearm';
    rightForearm.castShadow = true;
    frog.add(rightForearm);

    const rightHand = new THREE.Mesh(handGeometry, frogMaterial);
    rightHand.position.set(1.22, 1.30, 0);
    rightHand.userData.name = 'rightHand';
    rightHand.castShadow = true;
    frog.add(rightHand);
    
    const rightFingerPositions = [
      { x: 1.30, y: 1.22, z: 0.12, rot: 0.6 },
      { x: 1.35, y: 1.20, z: 0.04, rot: 0.5 },
      { x: 1.38, y: 1.18, z: -0.04, rot: 0.4 },
      { x: 1.35, y: 1.16, z: -0.12, rot: 0.3 },
    ];
    
    rightFingerPositions.forEach(pos => {
      const fingerGeometry = new THREE.CylinderGeometry(0.035, 0.025, 0.18, 12);
      const finger = new THREE.Mesh(fingerGeometry, darkGreenMaterial);
      finger.position.set(pos.x, pos.y, pos.z);
      finger.rotation.z = pos.rot;
      finger.castShadow = true;
      frog.add(finger);
      
      const fingerTipGeo = new THREE.SphereGeometry(0.028, 12, 12);
      const fingerTip = new THREE.Mesh(fingerTipGeo, darkGreenMaterial);
      fingerTip.position.set(
        pos.x + Math.cos(pos.rot) * 0.09, 
        pos.y - Math.sin(pos.rot) * 0.09, 
        pos.z
      );
      frog.add(fingerTip);
    });

    // === 왼쪽 다리 (매우 튼튼하고 근육질, 고해상도) ===
    // 허벅지 (더 두껍고 근육질)
    const thighGeometry = new THREE.CylinderGeometry(0.32, 0.28, 0.75, 32);
    const leftThigh = new THREE.Mesh(thighGeometry, frogMaterial);
    leftThigh.position.set(-0.38, 0.88, 0);
    leftThigh.userData.name = 'leftThigh';
    leftThigh.castShadow = true;
    leftThigh.receiveShadow = true;
    frog.add(leftThigh);
    
    // 무릎 (더 크고 튼튼하게)
    const kneeGeometry = new THREE.SphereGeometry(0.26, 24, 24);
    const leftKnee = new THREE.Mesh(kneeGeometry, frogMaterial);
    leftKnee.position.set(-0.38, 0.50, 0);
    leftKnee.castShadow = true;
    frog.add(leftKnee);
    
    // 종아리 (더 자연스러운 곡선)
    const calfGeometry = new THREE.CylinderGeometry(0.25, 0.20, 0.55, 32);
    const leftCalf = new THREE.Mesh(calfGeometry, frogMaterial);
    leftCalf.position.set(-0.38, 0.26, 0.12);
    leftCalf.userData.name = 'leftCalf';
    leftCalf.castShadow = true;
    frog.add(leftCalf);
    
    // 발목 관절
    const ankleGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const leftAnkle = new THREE.Mesh(ankleGeo, frogMaterial);
    leftAnkle.position.set(-0.38, 0.02, 0.18);
    leftAnkle.castShadow = true;
    frog.add(leftAnkle);

    // 왼발 (더 자연스럽고 유기적)
    const footGeometry = new THREE.BoxGeometry(0.40, 0.22, 0.68);
    // 모서리를 둥글게
    footGeometry.scale(1, 0.9, 1);
    const leftFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    leftFoot.position.set(-0.38, 0.06, 0.30);
    leftFoot.userData.name = 'leftFoot';
    leftFoot.castShadow = true;
    leftFoot.receiveShadow = true;
    frog.add(leftFoot);
    
    // 발가락들 (5개, 더 자연스럽게)
    const toePositions = [
      { x: -0.50, z: 0.58, size: 0.045 },
      { x: -0.43, z: 0.62, size: 0.050 },
      { x: -0.38, z: 0.64, size: 0.052 },
      { x: -0.33, z: 0.62, size: 0.050 },
      { x: -0.26, z: 0.58, size: 0.045 },
    ];
    
    toePositions.forEach(pos => {
      const toeGeometry = new THREE.CylinderGeometry(pos.size, pos.size * 0.8, 0.14, 12);
      const toe = new THREE.Mesh(toeGeometry, darkGreenMaterial);
      toe.position.set(pos.x, 0.02, pos.z);
      toe.rotation.x = Math.PI / 2;
      toe.castShadow = true;
      frog.add(toe);
      
      // 발가락 끝 (둥글게)
      const toeTipGeo = new THREE.SphereGeometry(pos.size * 0.85, 12, 12);
      const toeTip = new THREE.Mesh(toeTipGeo, darkGreenMaterial);
      toeTip.position.set(pos.x, 0.02, pos.z + 0.08);
      frog.add(toeTip);
    });

    // === 오른쪽 다리 ===
    const rightThigh = new THREE.Mesh(thighGeometry, frogMaterial);
    rightThigh.position.set(0.38, 0.88, 0);
    rightThigh.userData.name = 'rightThigh';
    rightThigh.castShadow = true;
    rightThigh.receiveShadow = true;
    frog.add(rightThigh);
    
    const rightKnee = new THREE.Mesh(kneeGeometry, frogMaterial);
    rightKnee.position.set(0.38, 0.50, 0);
    rightKnee.castShadow = true;
    frog.add(rightKnee);
    
    const rightCalf = new THREE.Mesh(calfGeometry, frogMaterial);
    rightCalf.position.set(0.38, 0.26, 0.12);
    rightCalf.userData.name = 'rightCalf';
    rightCalf.castShadow = true;
    frog.add(rightCalf);
    
    const rightAnkle = new THREE.Mesh(ankleGeo, frogMaterial);
    rightAnkle.position.set(0.38, 0.02, 0.18);
    rightAnkle.castShadow = true;
    frog.add(rightAnkle);

    const rightFoot = new THREE.Mesh(footGeometry, darkGreenMaterial);
    rightFoot.position.set(0.38, 0.06, 0.30);
    rightFoot.userData.name = 'rightFoot';
    rightFoot.castShadow = true;
    rightFoot.receiveShadow = true;
    frog.add(rightFoot);
    
    const rightToePositions = [
      { x: 0.50, z: 0.58, size: 0.045 },
      { x: 0.43, z: 0.62, size: 0.050 },
      { x: 0.38, z: 0.64, size: 0.052 },
      { x: 0.33, z: 0.62, size: 0.050 },
      { x: 0.26, z: 0.58, size: 0.045 },
    ];
    
    rightToePositions.forEach(pos => {
      const toeGeometry = new THREE.CylinderGeometry(pos.size, pos.size * 0.8, 0.14, 12);
      const toe = new THREE.Mesh(toeGeometry, darkGreenMaterial);
      toe.position.set(pos.x, 0.02, pos.z);
      toe.rotation.x = Math.PI / 2;
      toe.castShadow = true;
      frog.add(toe);
      
      const toeTipGeo = new THREE.SphereGeometry(pos.size * 0.85, 12, 12);
      const toeTip = new THREE.Mesh(toeTipGeo, darkGreenMaterial);
      toeTip.position.set(pos.x, 0.02, pos.z + 0.08);
      frog.add(toeTip);
    });

    // === 등 무늬 (더 자연스럽고 다양하게) ===
    const spotPositions = [
      { x: -0.32, y: 2.05, z: -0.52, size: 0.13, opacity: 0.8 },
      { x: 0.22, y: 2.15, z: -0.48, size: 0.11, opacity: 0.75 },
      { x: -0.12, y: 1.85, z: -0.62, size: 0.16, opacity: 0.85 },
      { x: 0.38, y: 1.62, z: -0.52, size: 0.09, opacity: 0.7 },
      { x: -0.42, y: 1.52, z: -0.58, size: 0.12, opacity: 0.78 },
      { x: 0.12, y: 1.42, z: -0.65, size: 0.10, opacity: 0.72 },
      { x: -0.22, y: 2.35, z: -0.42, size: 0.08, opacity: 0.68 },
      { x: 0.15, y: 2.28, z: -0.45, size: 0.07, opacity: 0.65 },
    ];
    
    spotPositions.forEach(spot => {
      const spotGeo = new THREE.SphereGeometry(spot.size, 20, 20);
      const spotMat = new THREE.MeshStandardMaterial({
        color: 0x228B22,
        roughness: 0.4,
        metalness: 0.05,
        transparent: true,
        opacity: spot.opacity
      });
      const spotMesh = new THREE.Mesh(spotGeo, spotMat);
      spotMesh.position.set(spot.x, spot.y, spot.z);
      spotMesh.receiveShadow = true;
      frog.add(spotMesh);
    });

    // === 꼬리 (더 자연스러운 형태) ===
    const tailGeometry = new THREE.ConeGeometry(0.10, 0.18, 16);
    const tail = new THREE.Mesh(tailGeometry, darkGreenMaterial);
    tail.position.set(0, 1.18, -0.72);
    tail.rotation.x = Math.PI;
    tail.castShadow = true;
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
