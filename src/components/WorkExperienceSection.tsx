import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { workExperience } from "@/data";
import ScrollReveal from "./ScrollReveal";

const bulletVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, delay: i * 0.15, ease: "easeOut" },
    }),
};

export default function WorkExperienceSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

    return (
        <section className="section-container" id="experience" ref={ref}>
            <motion.div style={{ y }}>
                {/* Header */}
                <ScrollReveal>
                    <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Work Experience</h2>
                </ScrollReveal>
                <ScrollReveal delay={0.15}>
                    <p className="text-muted-foreground mb-12 max-w-lg">
                        Where I've applied my skills to deliver real-world impact.
                    </p>
                </ScrollReveal>

                {workExperience.map((job) => (
                    <motion.div
                        key={job.company}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5 }}
                        className="glass rounded-2xl p-6 sm:p-8"
                    >
                        {/* ── Company header ───────────────────────── */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-5">
                            <div className="flex items-center gap-3">
                                {/* Pulsing dot */}
                                <span className="relative flex h-3 w-3 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                                </span>
                                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                                    {job.company}
                                </h3>
                            </div>

                            <div className="flex items-center gap-3 ml-6 sm:ml-0">
                                <span className="font-mono text-sm text-primary">{job.role}</span>
                                <span className="text-xs font-mono text-muted-foreground/60 px-3 py-1 rounded-full bg-muted/50 border border-border/40">
                                    {job.period}
                                </span>
                            </div>
                        </div>

                        {/* ── Role summary ─────────────────────────── */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 ml-6 subgroup-accent">
                            <span className="font-semibold text-foreground/80">Role:</span>{" "}
                            {job.summary}
                        </p>

                        {/* ── Core Contributions ───────────────────── */}
                        <div className="ml-6">
                            <p className="font-mono text-xs text-primary tracking-wider uppercase mb-4">
                                Core Contributions
                            </p>
                            <ul className="space-y-3">
                                {job.contributions.map((item, i) => (
                                    <motion.li
                                        key={i}
                                        custom={i}
                                        variants={bulletVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-30px" }}
                                        className="flex items-start gap-3 group"
                                    >
                                        {/* Neon bullet */}
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_8px_hsl(185_100%_50%/0.5)] transition-all duration-300" />
                                        <span className="text-sm sm:text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                                            {item.includes(": ") ? (
                                                <>
                                                    <span className="font-semibold text-foreground/90">{item.split(": ")[0]}:</span>{" "}
                                                    {item.substring(item.indexOf(": ") + 2)}
                                                </>
                                            ) : item}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
