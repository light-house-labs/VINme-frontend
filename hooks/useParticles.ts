import { useEffect, useRef } from "react";

export function useParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const cols = 60;
    const rows = 40;
    const spacingX = 60;
    const spacingZ = 60;

    let mouseX = 0;
    let mouseY = 0;
    let currentCamX = 0;
    let currentCamY = -350;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Smooth camera interpolation for 3D parallax
      currentCamX += (mouseX * 400 - currentCamX) * 0.05;
      currentCamY += (-mouseY * 200 - 350 - currentCamY) * 0.05;

      const focalLength = 600;
      const camZ = -200;
      const camY = currentCamY; 
      const camX = currentCamX;

      const offsetX = -(cols * spacingX) / 2;
      const offsetZ = 0;

      ctx.lineWidth = 1;

      // Pre-calculate points to draw both horizontal and vertical lines efficiently
      const points: { projX: number; projY: number; alpha: number; relZ: number }[][] = [];

      for (let z = 0; z < rows; z++) {
        const rowPoints = [];
        for (let x = 0; x < cols; x++) {
          const distance = Math.sqrt(Math.pow(x - cols / 2, 2) + Math.pow(z - rows / 2, 2));
          
          // Aerodynamic sweeping wave math
          const wave1 = Math.sin(x * 0.15 + time * 2) * 40;
          const wave2 = Math.cos(z * 0.1 + time * 1.5) * 60;
          const wave3 = Math.sin(distance * 0.1 - time * 3) * 30;

          const pX = x * spacingX + offsetX;
          const pZ = z * spacingZ + offsetZ;
          const pY = wave1 + wave2 + wave3;

          const relZ = pZ - camZ;
          const relX = pX - camX;
          const relY = pY - camY;

          if (relZ > 0) {
            const scale = focalLength / relZ;
            const projX = relX * scale + canvas.width / 2;
            const projY = relY * scale + canvas.height / 2 + 100;

            const alpha = Math.max(0, 1 - (relZ / 2500));
            rowPoints.push({ projX, projY, alpha, relZ });
          } else {
            rowPoints.push({ projX: 0, projY: 0, alpha: 0, relZ });
          }
        }
        points.push(rowPoints);
      }

      // Draw horizontal lines (Z-axis rows)
      for (let z = 0; z < rows - 1; z++) {
        ctx.beginPath();
        let isDrawing = false;
        let avgAlpha = 0;
        let pointCount = 0;

        for (let x = 0; x < cols; x++) {
          const p = points[z][x];
          if (p.relZ > 0 && p.alpha > 0.01) {
            avgAlpha += p.alpha;
            pointCount++;
            if (!isDrawing) {
              ctx.moveTo(p.projX, p.projY);
              isDrawing = true;
            } else {
              ctx.lineTo(p.projX, p.projY);
            }
          } else {
            isDrawing = false;
          }
        }
        
        if (pointCount > 0) {
          avgAlpha /= pointCount;
          ctx.strokeStyle = `rgba(0, 74, 173, ${avgAlpha * 0.35})`;
          ctx.stroke();
        }
      }

      // Draw vertical lines (X-axis columns)
      for (let x = 0; x < cols; x++) {
        ctx.beginPath();
        let isDrawing = false;
        let avgAlpha = 0;
        let pointCount = 0;

        for (let z = 0; z < rows; z++) {
          const p = points[z][x];
          if (p.relZ > 0 && p.alpha > 0.01) {
            avgAlpha += p.alpha;
            pointCount++;
            if (!isDrawing) {
              ctx.moveTo(p.projX, p.projY);
              isDrawing = true;
            } else {
              ctx.lineTo(p.projX, p.projY);
            }
          } else {
            isDrawing = false;
          }
        }

        if (pointCount > 0) {
          avgAlpha /= pointCount;
          ctx.strokeStyle = `rgba(0, 74, 173, ${avgAlpha * 0.35})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return canvasRef;
}
