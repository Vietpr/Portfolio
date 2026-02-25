import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Project } from "@/data";

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong sm:max-w-2xl border-border/50 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">{project.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {/* Technical Solutions */}
          <div>
            <h4 className="font-mono text-xs text-primary tracking-wider uppercase mb-3">
              Technical Solutions
            </h4>
            <ul className="space-y-2.5">
              {project.solutions.map((solution, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary/50" />
                  <span className="text-sm text-foreground/90 leading-relaxed">
                    {solution.includes(": ") ? (
                      <>
                        <span className="font-semibold text-foreground">{solution.split(": ")[0]}:</span>{" "}
                        {solution.substring(solution.indexOf(": ") + 2)}
                      </>
                    ) : solution}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-mono text-xs text-primary tracking-wider uppercase mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="skill-tag text-xs py-1 px-3">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {project.github && (
            <div className="flex gap-3 pt-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass neon-border text-sm hover:text-primary hover:neon-glow-sm transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source Code →
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
