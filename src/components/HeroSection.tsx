import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "@/data";
import { useTypewriter } from "@/hooks/useTypewriter";
import portrait from "@/assets/portrait.jpg";

const Scene3D = lazy(() => import("./Scene3D"));

function TypewriterHero() {
  const { displayed: title, done: titleDone } = useTypewriter(personalInfo.title, 100, 500);
  const { displayed: name, done: nameDone } = useTypewriter(personalInfo.name, 90, 1200);

  return (
    <div className="text-center lg:text-left">
      <p className="font-mono text-sm text-primary tracking-widest uppercase mb-2 min-h-[1.4em]">
        {title}
        {!titleDone && <span className="animate-pulse">▊</span>}
      </p>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text leading-tight min-h-[1.2em]">
        {name}
        {titleDone && !nameDone && <span className="animate-pulse">▊</span>}
      </h1>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center section-container pt-28" id="about">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
        {/* Left: 3D Scene */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-[350px] sm:h-[450px] lg:h-[550px] order-2 lg:order-1"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            }
          >
            <Scene3D />
          </Suspense>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start gap-6 order-1 lg:order-2"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 to-secondary/40 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={portrait}
              alt={personalInfo.name}
              className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover neon-border"
            />
          </div>

          <TypewriterHero />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-4 text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed text-justify"
          >
            {personalInfo.about}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-4 mt-2"
          >
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:neon-glow transition-all duration-300"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg glass neon-border font-medium text-sm text-foreground hover:text-primary hover:neon-glow-sm transition-all duration-300"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
