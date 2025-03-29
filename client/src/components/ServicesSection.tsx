import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Service type definition
interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  icon: string;
  iconClass: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "WEB APP DEVELOPMENT",
    description: "Custom responsive website design and development with modern UI/UX principles and futuristic aesthetics.",
    price: "₹17,000",
    icon: "ri-code-s-slash-line",
    iconClass: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
  },
  {
    id: 2,
    title: "APP DEVELOPMENT",
    description: "Native and cross-platform mobile applications with cutting-edge features and smooth performance.",
    price: "₹20,000",
    icon: "ri-smartphone-line",
    iconClass: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"
  },
  {
    id: 3,
    title: "AI DEVELOPMENT",
    description: "Custom AI solutions, machine learning models, and intelligent automation for your business.",
    price: "₹10,000",
    icon: "ri-ai-generate",
    iconClass: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]"
  },
  {
    id: 4,
    title: "UI / UX DESIGN",
    description: "Expert user interface and experience design that combines aesthetics with functionality for maximum engagement.",
    price: "₹15,000",
    icon: "ri-paint-brush-line",
    iconClass: "bg-purple-600/10 text-purple-600"
  },
  {
    id: 5,
    title: "BUG BOUNTY",
    description: "Professional security testing and vulnerability assessments to protect your digital assets.",
    price: "CONTACT US",
    icon: "ri-bug-line",
    iconClass: "bg-red-600/10 text-red-600"
  },
  {
    id: 6,
    title: "API Integration",
    description: "Seamless integration of third-party APIs and development of custom RESTful services.",
    price: "₹8,000",
    icon: "ri-code-box-line",
    iconClass: "bg-blue-600/10 text-blue-600"
  }
];

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { toast } = useToast();

  const handleBookNow = (service: Service) => {
    setSelectedService(service);
    // Scroll to service request form instead of calling API
    const serviceRequestSection = document.getElementById('service-request');
    if (serviceRequestSection) {
      // Add service name to the URL as a parameter
      const currentUrl = window.location.href.split('#')[0];
      window.history.pushState({}, '', `${currentUrl}#service-request?service=${service.title}`);
      serviceRequestSection.scrollIntoView({ behavior: 'smooth' });

      // Highlight the form briefly to attract attention
      serviceRequestSection.classList.add('pulse-animation');
      setTimeout(() => {
        serviceRequestSection.classList.remove('pulse-animation');
      }, 1500);

      // Show success message
      toast({
        title: "Please fill out request form",
        description: `Tell us more about your ${service.title} project needs below.`,
      });
    }
  };

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// 01</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">OUR SERVICES</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Affordable freelancing services for individuals and small businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="service-card gradient-border bg-[hsl(var(--card))] rounded-lg overflow-hidden h-full transform hover:scale-[1.02] transition-all duration-300"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              onHoverStart={() => {
                const element = document.getElementById(`service-${service.id}`);
                if (element) {
                  element.classList.add("animate-glitch");
                  setTimeout(() => element.classList.remove("animate-glitch"), 800);
                }
              }}
              id={`service-${service.id}`}
            >
              <div className="p-6">
                <div className={`h-14 w-14 rounded-lg ${service.iconClass} flex items-center justify-center mb-6`}>
                  <i className={`${service.icon} text-3xl`}></i>
                </div>
                <h3 className="font-pixel text-lg text-[hsl(var(--secondary))] mb-4">{service.title}</h3>
                <p className="font-body text-sm text-foreground/80 mb-6">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[hsl(var(--primary))] font-code text-xs">{service.price}</span>
                  <button 
                    onClick={() => handleBookNow(service)}
                    className="text-[hsl(var(--secondary))] text-sm hover:text-[hsl(var(--primary))] transition-colors duration-300 flex items-center"
                  >
                    <span>Book Now</span>
                    <i className="ri-arrow-right-line ml-1"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.a
            href="#service-request"
            className="inline-block gradient-border bg-[hsl(var(--card))] px-6 py-3 rounded font-pixel text-sm text-[hsl(var(--accent))] hover:shadow-[0_0_20px_rgba(255,255,0,0.5)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            REQUEST CUSTOM SERVICE
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;