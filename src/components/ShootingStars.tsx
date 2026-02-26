import { useEffect, useRef } from "react";

interface Star {
    id: number;
    x: number;
    y: number;
    angle: number;
    speed: number;
    length: number;
    opacity: number;
    life: number;
    maxLife: number;
    phase: "flying" | "flash" | "gone";
    flashTimer: number;
}

export default function ShootingStars() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let stars: Star[] = [];
        let nextId = 0;
        let timeSinceLastStar = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        const spawnStar = () => {
            const side = Math.random();
            let x: number, y: number, angle: number;

            if (side < 0.6) {
                // From left edge
                x = -10;
                y = Math.random() * canvas.offsetHeight * 0.6;
                angle = (15 + Math.random() * 30) * (Math.PI / 180); // 15-45 degrees
            } else if (side < 0.85) {
                // From top edge
                x = Math.random() * canvas.offsetWidth * 0.4;
                y = -10;
                angle = (50 + Math.random() * 30) * (Math.PI / 180); // 50-80 degrees
            } else {
                // From top-left corner area
                x = Math.random() * canvas.offsetWidth * 0.15;
                y = Math.random() * canvas.offsetHeight * 0.15;
                angle = (25 + Math.random() * 35) * (Math.PI / 180); // 25-60 degrees
            }

            stars.push({
                id: nextId++,
                x,
                y,
                angle,
                speed: 3 + Math.random() * 4,
                length: 60 + Math.random() * 100,
                opacity: 0.6 + Math.random() * 0.4,
                life: 0,
                maxLife: 80 + Math.random() * 60,
                phase: "flying",
                flashTimer: 0,
            });
        };

        let lastTime = performance.now();

        const animate = (now: number) => {
            const dt = Math.min((now - lastTime) / 16.67, 3); // normalize to ~60fps
            lastTime = now;

            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Spawn logic: random interval between 3-8 seconds
            timeSinceLastStar += dt;
            const spawnInterval = 180 + Math.random() * 300; // frames (~3-8s at 60fps)
            if (timeSinceLastStar > spawnInterval) {
                spawnStar();
                // Sometimes spawn 2 close together
                if (Math.random() < 0.3) {
                    setTimeout(() => spawnStar(), 200 + Math.random() * 500);
                }
                timeSinceLastStar = 0;
            }

            stars = stars.filter((s) => s.phase !== "gone");

            for (const star of stars) {
                star.life += dt;

                if (star.phase === "flying") {
                    // Move the star
                    star.x += Math.cos(star.angle) * star.speed * dt;
                    star.y += Math.sin(star.angle) * star.speed * dt;

                    // Decrease length as it "flies into distance"
                    const progress = star.life / star.maxLife;
                    const currentLength = star.length * (1 - progress * 0.5);
                    const currentOpacity = star.opacity * (1 - progress * 0.3);

                    // Draw the tail (gradient line)
                    const tailX = star.x - Math.cos(star.angle) * currentLength;
                    const tailY = star.y - Math.sin(star.angle) * currentLength;

                    const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                    gradient.addColorStop(0, `rgba(100, 220, 255, 0)`);
                    gradient.addColorStop(0.6, `rgba(140, 230, 255, ${currentOpacity * 0.3})`);
                    gradient.addColorStop(1, `rgba(200, 240, 255, ${currentOpacity})`);

                    ctx.beginPath();
                    ctx.moveTo(tailX, tailY);
                    ctx.lineTo(star.x, star.y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5 * (1 - progress * 0.4);
                    ctx.lineCap = "round";
                    ctx.stroke();

                    // Head glow
                    const headGlow = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, 4
                    );
                    headGlow.addColorStop(0, `rgba(220, 245, 255, ${currentOpacity})`);
                    headGlow.addColorStop(1, `rgba(140, 220, 255, 0)`);
                    ctx.fillStyle = headGlow;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Transition to flash when life ends
                    if (star.life >= star.maxLife) {
                        star.phase = "flash";
                        star.flashTimer = 0;
                    }
                } else if (star.phase === "flash") {
                    star.flashTimer += dt;
                    const flashDuration = 12; // frames
                    const flashProgress = star.flashTimer / flashDuration;

                    if (flashProgress < 1) {
                        // Bright flash that expands and fades
                        const radius = 3 + flashProgress * 15;
                        const flashOpacity = (1 - flashProgress) * star.opacity;

                        const flash = ctx.createRadialGradient(
                            star.x, star.y, 0,
                            star.x, star.y, radius
                        );
                        flash.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity})`);
                        flash.addColorStop(0.3, `rgba(180, 235, 255, ${flashOpacity * 0.7})`);
                        flash.addColorStop(1, `rgba(100, 200, 255, 0)`);
                        ctx.fillStyle = flash;
                        ctx.beginPath();
                        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        star.phase = "gone";
                    }
                }
            }

            animId = requestAnimationFrame(animate);
        };

        // Start first star a bit sooner
        timeSinceLastStar = 120;
        animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
