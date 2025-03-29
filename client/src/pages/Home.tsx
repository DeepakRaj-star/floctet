import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import ProjectsSection from "@/components/ProjectsSection";
import AwardsSection from "@/components/AwardsSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const { data: user } = useQuery<{ username: string } | null>({
    queryKey: ["/api/auth/me"],
    refetchOnWindowFocus: false,
  });

  const handleOpenAuthModal = (tab: "login" | "register") => {
    setActiveTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        isAuthenticated={!!user} 
        onOpenAuthModal={handleOpenAuthModal} 
      />
      
      <HeroSection />
      <ServicesSection />
      <ServiceRequestForm />
      <ProjectsSection />
      <AwardsSection />
      <TeamSection />
      <ContactSection />
      <Footer />
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        activeTab={activeTab}
      />
    </div>
  );
};

export default Home;
