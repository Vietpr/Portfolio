import { motion } from "framer-motion";
import { socialLinks, personalInfo } from "@/data";
import { Github, Linkedin, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

const platformLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  mail: "Email",
};

export default function FooterSection() {
  return (
    <footer className="section-container relative overflow-hidden" id="contact">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center text-center"
      >
        {/* Animated sparkle icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
        </motion.div>

        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">Let's Build</span>{" "}
            <span className="text-foreground">Something</span>
            <br />
            <span className="text-foreground">Amazing Together</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-muted-foreground max-w-lg text-base sm:text-lg mb-10 leading-relaxed">
            Whether it's an AI project, a research collaboration, or just a great conversation — I'm always excited to connect.
          </p>
        </ScrollReveal>

        {/* CTA Button */}
        <motion.a
          href="mailto:phamvietofficial@gmail.com"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base hover:neon-glow transition-all duration-300 mb-10"
        >
          Get In Touch
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>

        {/* Social links with labels */}
        <div className="flex gap-3 sm:gap-4">
          {socialLinks.map((link, idx) => {
            const Icon = iconMap[link.icon] || Mail;
            const label = platformLabels[link.icon] || link.platform;
            return (
              <motion.a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-7 py-4 rounded-xl glass border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                aria-label={link.platform}
              >
                <Icon className="w-5 h-5" />
                <span className="text-base font-semibold hidden sm:inline">{label}</span>
              </motion.a>
            );
          })}
        </div>

        {/* Divider + copyright */}
        <div className="mt-16 pt-6 border-t border-border/30 w-full max-w-md">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {personalInfo.name}. Built with passion.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
