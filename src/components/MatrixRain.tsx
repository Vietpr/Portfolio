import { useEffect, useRef } from "react";

// AI/ML code snippets that fall in the matrix rain
const CODE_SNIPPETS = [
    "import torch",
    "nn.Linear",
    "model.train()",
    "loss.backward()",
    "optimizer.step()",
    "torch.tensor",
    "attention",
    "embeddings",
    "transformer",
    "self.forward",
    "conv2d",
    "batch_norm",
    "dropout(0.1)",
    "softmax",
    "cross_entropy",
    "gradient",
    "backprop",
    "epoch += 1",
    "accuracy",
    "learning_rate",
    "weight_decay",
    "hidden_dim",
    "num_heads",
    "query @ key.T",
    "F.relu(x)",
    "tokenizer",
    "fine_tune()",
    "inference",
    "CUDA",
    "GPU",
    "tensor.shape",
    "model.eval()",
    "torch.no_grad",
    "DataLoader",
    "Dataset",
    "img2vec",
    "latent_space",
    "diffusion",
    "YOLO",
    "detection",
    "pose_6dof",
    "ArUco",
    "OpenCV",
    "ONNX",
    "deploy()",
    "FastAPI",
    "async def",
    "predict(x)",
    "RAG",
    "retrieve()",
    "vector_db",
    "cosine_sim",
    "chunk_text",
];

interface Column {
    x: number;
    chars: string;
    y: number;
    speed: number;
    opacity: number;
    fontSize: number;
}

export default function MatrixRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let columns: Column[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initColumns();
        };

        const initColumns = () => {
            columns = [];
            const colWidth = 28;
            const numCols = Math.ceil(canvas.width / colWidth);

            for (let i = 0; i < numCols; i++) {
                // Only populate ~40% of columns for a sparse look
                if (Math.random() > 0.4) continue;

                const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
                columns.push({
                    x: i * colWidth + Math.random() * 8,
                    chars: snippet,
                    y: -Math.random() * canvas.height * 2,
                    speed: 0.3 + Math.random() * 0.8,
                    opacity: 0.03 + Math.random() * 0.06,
                    fontSize: 10 + Math.random() * 3,
                });
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            columns.forEach((col) => {
                ctx.font = `${col.fontSize}px "JetBrains Mono", monospace`;
                ctx.fillStyle = `hsla(185, 100%, 50%, ${col.opacity})`;

                // Draw each character vertically
                for (let i = 0; i < col.chars.length; i++) {
                    const charY = col.y + i * (col.fontSize + 2);

                    // Fade out characters at top and bottom
                    const distFromCenter = Math.abs(charY - canvas.height / 2) / (canvas.height / 2);
                    const fadeFactor = Math.max(0, 1 - distFromCenter * 0.8);

                    if (charY > -20 && charY < canvas.height + 20) {
                        ctx.globalAlpha = col.opacity * fadeFactor;

                        // Leading character is brighter
                        if (i === col.chars.length - 1) {
                            ctx.fillStyle = `hsla(185, 100%, 70%, ${col.opacity * 3})`;
                        } else {
                            ctx.fillStyle = `hsla(185, 100%, 50%, ${col.opacity})`;
                        }

                        ctx.fillText(col.chars[i], col.x, charY);
                    }
                }

                ctx.globalAlpha = 1;

                // Move column down
                col.y += col.speed;

                // Reset when off screen
                if (col.y > canvas.height + 100) {
                    col.y = -Math.random() * canvas.height - 200;
                    col.chars = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
                    col.speed = 0.3 + Math.random() * 0.8;
                    col.opacity = 0.03 + Math.random() * 0.06;
                }
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
}
