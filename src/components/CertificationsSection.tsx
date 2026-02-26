import { motion } from "framer-motion";
import { certifications } from "@/data";
import { Award, ExternalLink } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function CertificationsSection() {
  return (
    <section className="section-container" id="certifications">
      <div className="text-center mb-14">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">Certifications</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground max-w-md mx-auto">
            Continuous learning through world-class programs from leading institutions.
          </p>
        </ScrollReveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {certifications.map((cert, idx) => {
          const Wrapper = cert.link ? motion.a : motion.div;
          const linkProps = cert.link
            ? { href: cert.link, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Wrapper
              key={cert.title}
              {...linkProps}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 p-5 flex flex-col gap-3 group cursor-pointer transition-all duration-300 hover:neon-glow-sm hover:border-primary/40"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-background/40 backdrop-blur-sm text-blue-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                {cert.link && (
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                )}
              </div>

              <div className="relative flex-1 flex flex-col">
                <h3 className="font-semibold text-foreground text-sm leading-snug">
                  {cert.title}
                </h3>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-400">{cert.issuer}</span>
                  <span className="text-[10px] text-muted-foreground/70 font-mono">{cert.date}</span>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>

    </section>
  );
}
