import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { projects } from "@/data";
import type { Project } from "@/data";
import ProjectModal from "./ProjectModal";
import TiltCard from "./TiltCard";
import ScrollReveal from "./ScrollReveal";

const CATEGORIES = [
  {
    key: "professional" as const, label: "Professional", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    )
  },
  {
    key: "personal" as const, label: "R&D / Personal", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6l3 7-6 11-6-11z" /><circle cx="12" cy="10" r="2" />
      </svg>
    )
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<"professional" | "personal">("professional");
  const [selected, setSelected] = useState<Project | null>(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const filtered = projects.filter((p) => p.category === activeCategory);

  return (
    <section className="section-container" id="projects" ref={ref}>
      <motion.div style={{ y }}>
        {/* Header */}
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">Featured Projects</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground mb-10 max-w-lg">
            A selection of systems I've designed, built, and deployed.
          </p>
        </ScrollReveal>

        {/* ── Category Tabs ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-3 mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`
                relative flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs sm:text-sm
                tracking-wider uppercase transition-all duration-300 border
                ${activeCategory === cat.key
                  ? "border-primary/60 text-primary tab-glow bg-primary/10"
                  : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border bg-card/40 backdrop-blur-sm"
                }
              `}
            >
              <span className={`transition-colors duration-300 ${activeCategory === cat.key ? "text-primary" : "text-muted-foreground"}`}>
                {cat.icon}
              </span>
              {cat.label}
              <span className={`text-[10px] ml-1 px-1.5 py-0.5 rounded-full transition-colors duration-300 ${activeCategory === cat.key
                ? "bg-primary/20 text-primary"
                : "bg-muted/50 text-muted-foreground/60"
                }`}>
                {projects.filter((p) => p.category === cat.key).length}
              </span>

              {activeCategory === cat.key && (
                <motion.div
                  layoutId="projectTabIndicator"
                  className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ── Project Cards ─────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <TiltCard
                  className="bento-card flex flex-col justify-between h-full"
                >
                  <div>
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1.5 rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300"
                          title="View on GitHub"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono px-2 py-1 rounded-md bg-muted/60 text-muted-foreground border border-border/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* View details button */}
                  <button
                    onClick={() => setSelected(project)}
                    className="self-start text-sm font-mono text-primary hover:underline underline-offset-4 transition-colors flex items-center gap-1.5 group"
                  >
                    Technical Details
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <ProjectModal
        project={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}
