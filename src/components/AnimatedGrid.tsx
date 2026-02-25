import { useEffect, useRef } from "react";
import MatrixRain from "./MatrixRain";

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const spacing = 60;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      // Vertical lines
      for (let i = 0; i < cols; i++) {
        const x = i * spacing;
        const pulse = Math.sin(time * 2 + i * 0.3) * 0.5 + 0.5;
        ctx.strokeStyle = `hsla(185, 100%, 50%, ${0.03 + pulse * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let j = 0; j < rows; j++) {
        const y = j * spacing;
        const pulse = Math.sin(time * 2 + j * 0.3 + 1) * 0.5 + 0.5;
        ctx.strokeStyle = `hsla(270, 60%, 55%, ${0.02 + pulse * 0.03})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Scanning line effect (horizontal)
      const scanY = ((time * 80) % (canvas.height + 200)) - 100;
      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      gradient.addColorStop(0, "hsla(185, 100%, 50%, 0)");
      gradient.addColorStop(0.5, "hsla(185, 100%, 50%, 0.08)");
      gradient.addColorStop(1, "hsla(185, 100%, 50%, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 100);

      // Glowing intersection dots
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dist = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const wave = Math.sin(time * 3 - dist * 0.005) * 0.5 + 0.5;
          if (wave > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(185, 100%, 50%, ${(wave - 0.7) * 2})`;
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.35 }}
      />
      {/* Matrix code rain */}
      <MatrixRain />
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating-orb floating-orb-1" />
        <div className="floating-orb floating-orb-2" />
        <div className="floating-orb floating-orb-3" />
      </div>
    </>
  );
}
