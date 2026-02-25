import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "left" | "right";
    blur?: boolean;
}

const directionOffsets = {
    up: { y: 30, x: 0 },
    left: { y: 0, x: -30 },
    right: { y: 0, x: 30 },
};

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
    blur = true,
}: ScrollRevealProps) {
    const offset = directionOffsets[direction];
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: offset.y,
                x: offset.x,
                filter: blur ? "blur(8px)" : "blur(0px)",
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                filter: "blur(0px)",
            }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
