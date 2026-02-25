import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { skillCategories } from "@/data";
import TiltCard from "./TiltCard";
import ScrollReveal from "./ScrollReveal";

/* ── Inline SVG category icons ──────────────────────────── */
const categoryIcons = [
  // Brain — Deep Learning & Vision
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a5 5 0 0 1 4.17 7.75A5 5 0 0 1 18 14.5a4.5 4.5 0 0 1-2.6 4.08A3.5 3.5 0 0 1 12 22a3.5 3.5 0 0 1-3.4-3.42A4.5 4.5 0 0 1 6 14.5a5 5 0 0 1 1.83-4.75A5 5 0 0 1 12 2z" />
    <path d="M12 2v20" /><path d="M8 6h8" /><path d="M7 10h10" /><path d="M8 14h8" /><path d="M9 18h6" />
  </svg>,
  // Cloud — Cloud, MLOps & Data
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
  </svg>,
  // Terminal — Backend & RAG System
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>,
];

/* ── Animation variants ─────────────────────────────────── */
const cardVariants = {
  enter: { opacity: 0, y: 20, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -15, scale: 0.98 },
};

const tagContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.15 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 22 } },
};

/* ── Component ──────────────────────────────────────────── */
export default function SkillsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [activeTab, setActiveTab] = useState(0);

  const activeCat = skillCategories[activeTab];
  const totalSkills = activeCat.subGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="section-container" id="skills" ref={ref}>
      <motion.div style={{ y }}>
        {/* Header */}
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Skills &amp; Tools</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground mb-10 max-w-lg">Technologies I work with daily to build intelligent systems.</p>
        </ScrollReveal>

        {/* ── Tab Buttons ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {skillCategories.map((cat, idx) => (
            <button
              key={cat.title}
              onClick={() => setActiveTab(idx)}
              className={`
                relative flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs sm:text-sm
                tracking-wider uppercase transition-all duration-300 border
                ${activeTab === idx
                  ? "border-primary/60 text-primary tab-glow bg-primary/10"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border bg-card/40 backdrop-blur-sm"
                }
              `}
            >
              <span className={`transition-colors duration-300 ${activeTab === idx ? "text-primary" : "text-muted-foreground"}`}>
                {categoryIcons[idx]}
              </span>
              {cat.title}

              {/* Animated underline indicator */}
              {activeTab === idx && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Active Category Card ─────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <TiltCard className="glass rounded-2xl p-6 sm:p-8">
              {/* Card header row */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-sm text-primary tracking-wider uppercase flex items-center gap-2">
                  <span className="text-primary/80">{categoryIcons[activeTab]}</span>
                  {activeCat.title}
                </h3>
                <span className="text-xs font-mono text-muted-foreground/70 px-3 py-1 rounded-full bg-muted/50 border border-border/40">
                  {totalSkills} skills
                </span>
              </div>

              {/* Sub-groups with stagger animation */}
              <motion.div
                className="grid sm:grid-cols-2 gap-x-8 gap-y-5"
                variants={tagContainerVariants}
                initial="hidden"
                animate="visible"
                key={activeTab}
              >
                {activeCat.subGroups.map((group) => (
                  <div key={group.label} className="subgroup-accent">
                    <p className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2.5">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <motion.span
                          key={skill}
                          variants={tagVariants}
                          className="skill-tag text-xs sm:text-sm"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            </TiltCard>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
