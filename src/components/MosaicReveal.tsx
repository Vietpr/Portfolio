import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface MosaicRevealProps {
    src: string;
    alt: string;
    className?: string;
    cols?: number;
    rows?: number;
    duration?: number;
    delay?: number;
}

export default function MosaicReveal({
    src,
    alt,
    className = "",
    cols = 6,
    rows = 8,
    duration = 1.8,
    delay = 0.3,
}: MosaicRevealProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setImageLoaded(true);
    }, [src]);

    const tileOrder = useMemo(() => {
        const total = cols * rows;
        const indices = Array.from({ length: total }, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }, [cols, rows]);

    const totalTiles = cols * rows;
    const staggerDelay = duration / totalTiles;

    return (
        <div
            className={`${className}`}
            style={{ position: "relative", overflow: "hidden" }}
            role="img"
            aria-label={alt}
        >
            {/* Only the mosaic grid — no second image, no spacer */}
            {imageLoaded && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, 1fr)`,
                    }}
                >
                    {Array.from({ length: totalTiles }).map((_, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const order = tileOrder.indexOf(index);

                        return (
                            <motion.div
                                key={index}
                                style={{ overflow: "hidden", position: "relative" }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: delay + order * staggerDelay,
                                    ease: [0.34, 1.56, 0.64, 1],
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        backgroundImage: `url(${src})`,
                                        backgroundSize: `${cols * 100}% ${rows * 100}%`,
                                        backgroundPosition: `${(col / Math.max(cols - 1, 1)) * 100}% ${(row / Math.max(rows - 1, 1)) * 100}%`,
                                    }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
