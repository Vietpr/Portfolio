import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import WorkExperienceSection from "@/components/WorkExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsSection from "@/components/CertificationsSection";
import FooterSection from "@/components/FooterSection";
import AnimatedGrid from "@/components/AnimatedGrid";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden scroll-smooth relative">
      <AnimatedGrid />
      <CursorGlow />
      <Navbar />
      <HeroSection />
      <SkillsSection />
      <WorkExperienceSection />
      <ProjectsSection />
      <CertificationsSection />
      <FooterSection />
    </main>
  );
};

export default Index;
