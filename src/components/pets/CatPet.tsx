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

  // 고양이 생성 함수 - 극도로 정교한 버전
  const createCat = (): THREE.Group => {
    const cat = new THREE.Group();
    
    // 최고급 재질 (부드럽고 포근한 털 느낌)
    const catMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFF8C42,
      roughness: 0.6,
      metalness: 0,
      emissive: 0x331100,
      emissiveIntensity: 0.02
    });
    
    const whiteMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFE6CC,
      roughness: 0.7,
      metalness: 0
    });
    
    const pinkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFFB6C1,
      roughness: 0.3,
      metalness: 0.1
    });
    
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xCCFF99,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x336600,
      emissiveIntensity: 0.1
    });
    
    const pupilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      roughness: 0.3,
      metalness: 0.4
    });

    // === 몸통 (고해상도, 유연한 형태) ===
    const bodyGeometry = new THREE.SphereGeometry(0.6, 48, 48);
    bodyGeometry.scale(1, 0.9, 1.35);
    const body = new THREE.Mesh(bodyGeometry, catMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    body.receiveShadow = true;
    cat.add(body);

    // === 가슴 (흰색, 더 부드럽게) ===
    const chestGeometry = new THREE.SphereGeometry(0.42, 32, 32);
    chestGeometry.scale(0.92, 1.15, 0.62);
    const chest = new THREE.Mesh(chestGeometry, whiteMaterial);
    chest.position.set(0, 0.72, 0.42);
    chest.receiveShadow = true;
    cat.add(chest);

    // === 머리 (초고해상도, 둥글고 귀여운 형태) ===
    const headGeometry = new THREE.SphereGeometry(0.48, 48, 48);
    headGeometry.scale(1.12, 1.02, 1.05);
    const head = new THREE.Mesh(headGeometry, catMaterial);
    head.position.y = 1.22;
    head.userData.name = 'head';
    head.castShadow = true;
    head.receiveShadow = true;
    cat.add(head);

    // === 귀 (더 입체적인 삼각형, 고해상도) ===
    const earGeometry = new THREE.ConeGeometry(0.17, 0.35, 6);
    
    const leftEar = new THREE.Mesh(earGeometry, catMaterial);
    leftEar.position.set(-0.32, 1.55, 0);
    leftEar.rotation.z = -0.35;
    leftEar.userData.name = 'leftEar';
    leftEar.castShadow = true;
    leftEar.receiveShadow = true;
    cat.add(leftEar);
    
    // 귀 안쪽 (핑크, 더 사실적)
    const innerEarGeometry = new THREE.ConeGeometry(0.09, 0.22, 6);
    const leftInnerEar = new THREE.Mesh(innerEarGeometry, pinkMaterial);
    leftInnerEar.position.set(-0.32, 1.52, 0.06);
    leftInnerEar.rotation.z = -0.35;
    cat.add(leftInnerEar);
    
    // 귀 털 (안쪽)
    const earFurGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftEarFur = new THREE.Mesh(earFurGeo, whiteMaterial);
    leftEarFur.position.set(-0.32, 1.45, 0.08);
    cat.add(leftEarFur);
    
    const rightEar = new THREE.Mesh(earGeometry, catMaterial);
    rightEar.position.set(0.32, 1.55, 0);
    rightEar.rotation.z = 0.35;
    rightEar.userData.name = 'rightEar';
    rightEar.castShadow = true;
    rightEar.receiveShadow = true;
    cat.add(rightEar);
    
    const rightInnerEar = new THREE.Mesh(innerEarGeometry, pinkMaterial);
    rightInnerEar.position.set(0.32, 1.52, 0.06);
    rightInnerEar.rotation.z = 0.35;
    cat.add(rightInnerEar);
    
    const rightEarFur = new THREE.Mesh(earFurGeo, whiteMaterial);
    rightEarFur.position.set(0.32, 1.45, 0.08);
    cat.add(rightEarFur);

    // === 주둥이 (더 입체적으로) ===
    const snoutGeometry = new THREE.SphereGeometry(0.28, 32, 32);
    snoutGeometry.scale(0.85, 0.75, 0.65);
    const snout = new THREE.Mesh(snoutGeometry, whiteMaterial);
    snout.position.set(0, 1.08, 0.42);
    snout.receiveShadow = true;
    cat.add(snout);
    
    // 주둥이 양쪽 볼록한 부분
    const cheekGeo = new THREE.SphereGeometry(0.12, 24, 24);
    const leftCheek = new THREE.Mesh(cheekGeo, whiteMaterial);
    leftCheek.position.set(-0.15, 1.08, 0.52);
    cat.add(leftCheek);
    
    const rightCheek = new THREE.Mesh(cheekGeo, whiteMaterial);
    rightCheek.position.set(0.15, 1.08, 0.52);
    cat.add(rightCheek);

    // === 코 (더 입체적이고 귀여운 형태) ===
    const noseGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    noseGeometry.scale(1, 0.85, 0.85);
    const nose = new THREE.Mesh(noseGeometry, pinkMaterial);
    nose.position.set(0, 1.18, 0.62);
    nose.castShadow = true;
    cat.add(nose);
    
    // 코 아래 입선 (Y자 형태)
    const mouthLineGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8);
    const centerMouthLine = new THREE.Mesh(mouthLineGeo, pinkMaterial);
    centerMouthLine.position.set(0, 1.10, 0.60);
    cat.add(centerMouthLine);
    
    const leftMouthLineGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.06, 8);
    const leftMouthLine = new THREE.Mesh(leftMouthLineGeo, pinkMaterial);
    leftMouthLine.position.set(-0.04, 1.06, 0.58);
    leftMouthLine.rotation.z = 0.5;
    cat.add(leftMouthLine);
    
    const rightMouthLine = new THREE.Mesh(leftMouthLineGeo, pinkMaterial);
    rightMouthLine.position.set(0.04, 1.06, 0.58);
    rightMouthLine.rotation.z = -0.5;
    cat.add(rightMouthLine);

    // === 눈 (더 크고 반짝이는 고양이 눈) ===
    const eyeGeometry = new THREE.SphereGeometry(0.14, 32, 32);
    eyeGeometry.scale(0.75, 1.25, 1);
    
    // 왼쪽 눈
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.26, 1.32, 0.38);
    leftEye.castShadow = true;
    leftEye.receiveShadow = true;
    cat.add(leftEye);
    
    // 왼쪽 동공 (고양이 세로 동공)
    const pupilGeometry = new THREE.SphereGeometry(0.06, 24, 24);
    pupilGeometry.scale(0.4, 1.2, 1);
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.set(-0.26, 1.32, 0.48);
    leftPupil.userData.name = 'leftPupil';
    cat.add(leftPupil);
    
    // 왼쪽 하이라이트 (2개로 입체감)
    const leftHighlight1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    leftHighlight1.position.set(-0.24, 1.38, 0.50);
    cat.add(leftHighlight1);
    
    const leftHighlight2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6 })
    );
    leftHighlight2.position.set(-0.28, 1.28, 0.49);
    cat.add(leftHighlight2);
    
    // 오른쪽 눈
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.26, 1.32, 0.38);
    rightEye.castShadow = true;
    rightEye.receiveShadow = true;
    cat.add(rightEye);
    
    // 오른쪽 동공
    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.set(0.26, 1.32, 0.48);
    rightPupil.userData.name = 'rightPupil';
    cat.add(rightPupil);
    
    // 오른쪽 하이라이트
    const rightHighlight1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    rightHighlight1.position.set(0.28, 1.38, 0.50);
    cat.add(rightHighlight1);
    
    const rightHighlight2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.6 })
    );
    rightHighlight2.position.set(0.24, 1.28, 0.49);
    cat.add(rightHighlight2);

    // === 수염 (더 자연스럽고 많이) ===
    const whiskerMaterial = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 2 });
    
    // 왼쪽 수염 (4개)
    const leftWhiskers = [
      { start: [-0.16, 1.14, 0.58], end: [-0.68, 1.18, 0.58], curve: 0.02 },
      { start: [-0.16, 1.10, 0.58], end: [-0.72, 1.12, 0.60], curve: 0.01 },
      { start: [-0.16, 1.06, 0.57], end: [-0.70, 1.05, 0.58], curve: 0 },
      { start: [-0.16, 1.02, 0.56], end: [-0.65, 0.98, 0.56], curve: -0.01 },
    ];
    
    leftWhiskers.forEach(w => {
      const points = [
        new THREE.Vector3(w.start[0], w.start[1], w.start[2]),
        new THREE.Vector3((w.start[0] + w.end[0]) / 2, (w.start[1] + w.end[1]) / 2 + w.curve, (w.start[2] + w.end[2]) / 2),
        new THREE.Vector3(w.end[0], w.end[1], w.end[2])
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const whisker = new THREE.Line(geometry, whiskerMaterial);
      cat.add(whisker);
    });
    
    // 오른쪽 수염 (4개)
    const rightWhiskers = [
      { start: [0.16, 1.14, 0.58], end: [0.68, 1.18, 0.58], curve: 0.02 },
      { start: [0.16, 1.10, 0.58], end: [0.72, 1.12, 0.60], curve: 0.01 },
      { start: [0.16, 1.06, 0.57], end: [0.70, 1.05, 0.58], curve: 0 },
      { start: [0.16, 1.02, 0.56], end: [0.65, 0.98, 0.56], curve: -0.01 },
    ];
    
    rightWhiskers.forEach(w => {
      const points = [
        new THREE.Vector3(w.start[0], w.start[1], w.start[2]),
        new THREE.Vector3((w.start[0] + w.end[0]) / 2, (w.start[1] + w.end[1]) / 2 + w.curve, (w.start[2] + w.end[2]) / 2),
        new THREE.Vector3(w.end[0], w.end[1], w.end[2])
      ];
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const whisker = new THREE.Line(geometry, whiskerMaterial);
      cat.add(whisker);
    });

    // === 앞다리 (더 유연하고 세밀하게) ===
    const frontLegGeometry = new THREE.CylinderGeometry(0.11, 0.09, 0.65, 24);
    
    const leftFrontLeg = new THREE.Mesh(frontLegGeometry, catMaterial);
    leftFrontLeg.position.set(-0.32, 0.32, 0.38);
    leftFrontLeg.userData.name = 'leftFrontLeg';
    leftFrontLeg.castShadow = true;
    leftFrontLeg.receiveShadow = true;
    cat.add(leftFrontLeg);
    
    const rightFrontLeg = new THREE.Mesh(frontLegGeometry, catMaterial);
    rightFrontLeg.position.set(0.32, 0.32, 0.38);
    rightFrontLeg.userData.name = 'rightFrontLeg';
    rightFrontLeg.castShadow = true;
    rightFrontLeg.receiveShadow = true;
    cat.add(rightFrontLeg);
    
    // 앞발 (흰색 발, 더 입체적)
    const pawGeometry = new THREE.SphereGeometry(0.12, 24, 24);
    pawGeometry.scale(1, 0.65, 1.05);
    
    const leftFrontPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    leftFrontPaw.position.set(-0.32, 0.06, 0.38);
    leftFrontPaw.castShadow = true;
    cat.add(leftFrontPaw);
    
    const rightFrontPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    rightFrontPaw.position.set(0.32, 0.06, 0.38);
    rightFrontPaw.castShadow = true;
    cat.add(rightFrontPaw);
    
    // 발가락 패드 (분홍색, 3개)
    for (let i = 0; i < 3; i++) {
      const padGeo = new THREE.SphereGeometry(0.025, 12, 12);
      const leftPad = new THREE.Mesh(padGeo, pinkMaterial);
      leftPad.position.set(-0.32 + (i - 1) * 0.04, 0.04, 0.44);
      cat.add(leftPad);
      
      const rightPad = new THREE.Mesh(padGeo, pinkMaterial);
      rightPad.position.set(0.32 + (i - 1) * 0.04, 0.04, 0.44);
      cat.add(rightPad);
    }

    // === 뒷다리 (더 튼튼하고 자연스럽게) ===
    const backLegGeometry = new THREE.CylinderGeometry(0.14, 0.11, 0.55, 24);
    
    const leftBackLeg = new THREE.Mesh(backLegGeometry, catMaterial);
    leftBackLeg.position.set(-0.38, 0.42, -0.22);
    leftBackLeg.userData.name = 'leftBackLeg';
    leftBackLeg.castShadow = true;
    leftBackLeg.receiveShadow = true;
    cat.add(leftBackLeg);
    
    const rightBackLeg = new THREE.Mesh(backLegGeometry, catMaterial);
    rightBackLeg.position.set(0.38, 0.42, -0.22);
    rightBackLeg.userData.name = 'rightBackLeg';
    rightBackLeg.castShadow = true;
    rightBackLeg.receiveShadow = true;
    cat.add(rightBackLeg);
    
    // 뒷발
    const leftBackPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    leftBackPaw.position.set(-0.38, 0.06, -0.22);
    leftBackPaw.castShadow = true;
    cat.add(leftBackPaw);
    
    const rightBackPaw = new THREE.Mesh(pawGeometry, whiteMaterial);
    rightBackPaw.position.set(0.38, 0.06, -0.22);
    rightBackPaw.castShadow = true;
    cat.add(rightBackPaw);
    
    // 뒷발 패드
    for (let i = 0; i < 3; i++) {
      const padGeo = new THREE.SphereGeometry(0.025, 12, 12);
      const leftPad = new THREE.Mesh(padGeo, pinkMaterial);
      leftPad.position.set(-0.38 + (i - 1) * 0.04, 0.04, -0.16);
      cat.add(leftPad);
      
      const rightPad = new THREE.Mesh(padGeo, pinkMaterial);
      rightPad.position.set(0.38 + (i - 1) * 0.04, 0.04, -0.16);
      cat.add(rightPad);
    }

    // === 꼬리 (훨씬 더 유연하고 자연스러운 3단계) ===
    const tailBase = new THREE.CylinderGeometry(0.10, 0.08, 0.55, 24);
    const tail = new THREE.Mesh(tailBase, catMaterial);
    tail.position.set(0, 0.82, -0.75);
    tail.rotation.x = -0.55;
    tail.userData.name = 'tail';
    tail.castShadow = true;
    tail.receiveShadow = true;
    cat.add(tail);
    
    // 꼬리 중간
    const tailMidGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.45, 24);
    const tailMid = new THREE.Mesh(tailMidGeometry, catMaterial);
    tailMid.position.set(0, 1.05, -1.02);
    tailMid.rotation.x = -1.05;
    tailMid.userData.name = 'tailTip';
    tailMid.castShadow = true;
    cat.add(tailMid);
    
    // 꼬리 끝 (가늘게)
    const tailTipGeometry = new THREE.CylinderGeometry(0.06, 0.03, 0.35, 20);
    const tailTip = new THREE.Mesh(tailTipGeometry, catMaterial);
    tailTip.position.set(0, 1.22, -1.25);
    tailTip.rotation.x = -1.3;
    tailTip.castShadow = true;
    cat.add(tailTip);

    // === 무늬 (줄무늬, 더 사실적이고 많이) ===
    const stripePositions = [
      { x: 0, y: 0.95, z: -0.35, scale: [0.85, 0.12, 0.42] },
      { x: 0, y: 0.72, z: -0.38, scale: [0.75, 0.14, 0.38] },
      { x: 0, y: 0.50, z: -0.32, scale: [0.65, 0.12, 0.32] },
      { x: -0.15, y: 0.88, z: -0.28, scale: [0.22, 0.10, 0.28] },
      { x: 0.15, y: 0.88, z: -0.28, scale: [0.22, 0.10, 0.28] },
      { x: 0, y: 1.15, z: 0.02, scale: [0.28, 0.08, 0.20] }, // 머리
      { x: -0.22, y: 1.20, z: 0.08, scale: [0.15, 0.06, 0.18] }, // 머리 옆
      { x: 0.22, y: 1.20, z: 0.08, scale: [0.15, 0.06, 0.18] }, // 머리 옆
    ];
    
    const stripeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xCC6622,
      roughness: 0.6,
      metalness: 0,
      transparent: true,
      opacity: 0.75
    });
    
    stripePositions.forEach(stripe => {
      const stripeGeometry = new THREE.SphereGeometry(0.12, 24, 24);
      stripeGeometry.scale(stripe.scale[0], stripe.scale[1], stripe.scale[2]);
      const stripeMesh = new THREE.Mesh(stripeGeometry, stripeMaterial);
      stripeMesh.position.set(stripe.x, stripe.y, stripe.z);
      stripeMesh.receiveShadow = true;
      cat.add(stripeMesh);
    });
    
    // 꼬리 줄무늬 (4개)
    for (let i = 0; i < 4; i++) {
      const tailStripeGeo = new THREE.TorusGeometry(0.08 - i * 0.01, 0.02, 8, 16);
      const tailStripe = new THREE.Mesh(tailStripeGeo, stripeMaterial);
      tailStripe.position.set(0, 0.88 + i * 0.12, -0.82 - i * 0.15);
      tailStripe.rotation.x = Math.PI / 2 - 0.55 - i * 0.15;
      cat.add(tailStripe);
    }

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
