import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import { useTypewriter } from "@/hooks/useTypewriter";
import portrait from "@/assets/portrait.jpg";

const Scene3D = lazy(() => import("./Scene3D"));

function TypewriterTitle() {
  const { displayed: title, done: titleDone } = useTypewriter(personalInfo.title, 100, 500);
  return (
    <p className="font-mono text-sm sm:text-base text-primary tracking-widest uppercase mb-3 min-h-[1.4em]">
      {title}
      {!titleDone && <span className="animate-pulse ml-0.5">|</span>}
    </p>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" id="about">
      {/* ── Background: 3D Scene (ambient layer) ── */}
      <div className="absolute inset-0 z-0 opacity-25 lg:opacity-30">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>

      {/* ── Background: Portrait (right side, large, fading) ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none hidden lg:block">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-[40%] h-[80%] flex items-center justify-end">
          <div className="portrait-glow w-full h-full max-w-[420px] relative" style={{ mixBlendMode: "lighten" }}>
            <img
              src={portrait}
              alt={personalInfo.name}
              className="portrait-cyber w-full h-full object-cover object-top"
            />
            {/* Subtle cyan tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 to-secondary/5 mix-blend-color" />
          </div>
        </div>
      </div>

      {/* ── Foreground: Text Content ── */}
      <div className="relative z-10 section-container w-full">
        <div className="max-w-2xl">
          {/* Mobile portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden mb-8 flex justify-center"
          >
            <div className="portrait-glow">
              <img
                src={portrait}
                alt={personalInfo.name}
                className="portrait-cyber w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Title: AI ENGINEER (typewriter) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TypewriterTitle />
          </motion.div>

          {/* Name: Glitch + Breathing Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h1
              className="glitch glitch-load text-4xl sm:text-5xl lg:text-7xl font-bold breathing-gradient leading-tight cursor-default"
              data-text={personalInfo.name}
            >
              {personalInfo.name}
            </h1>
          </motion.div>

          {/* About paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="mt-6 text-muted-foreground text-base sm:text-lg max-w-lg leading-relaxed text-justify text-backdrop"
          >
            {personalInfo.about}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a
              href="#projects"
              className="px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:neon-glow transition-all duration-300 hover:scale-105"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-lg glass neon-border font-semibold text-sm text-foreground hover:text-primary hover:neon-glow-sm transition-all duration-300 hover:scale-105"
            >
              Contact Me
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Dark gradient at bottom to blend into next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
