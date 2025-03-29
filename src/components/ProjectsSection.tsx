import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Project type definition
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: { name: string; color: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "FLICK-IT",
    category: "MOBILE & WEB APP",
    description: "AI-powered all-in-one web application that integrates services across multiple sectors into a single, unified platform. This intelligent system leverages AI-driven automation, data analysis, and user personalization to provide seamless access to healthcare, agriculture, environment, entertainment, research, space, Financial, security, Travel, Government, Sports, Science(Biotechnology and Physics) and social services.",
    image: "https://media-hosting.imagekit.io/21fff2d635e54eee/WhatsApp Image 2025-03-19 at 21.39.15_77a5d8b1.jpg?Expires=1837628218&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=YkPOQgzdyiw1f4SPaj4Pf1YMinI4NKtXOhMEnirCZb~JGsbuempT4RRKEP7zheTadq6msB4szzqugm4i8O3Fr6XqjOXLGVqgKJzmsKv~kkeIQIgHdHs8UWNF9p9bjlvDNP8mkvv18Zzmt-2JuKVnoVkEZhSINW7WDt6Ei5Vx-t7PLshtROfNr2d-uVm7SIUanrYO7m1NrNZyDaLaR4NcLfvDRVzbYb73DBLO3YuWbPrIa6~4O4FuCxh5Kl5iTQsD4Hb~XKkfeO8UOGiUPnDiMqKBrw9H4R7oVa3c~ZsM57E7kL9~nA4sVYGGuqn5pBjckqsQoF3iTzoOFhkBTLnT-Q__",
    tags: [
      { name: "Android", color: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" },
      { name: "AI", color: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]" },
      { name: "Web-App", color: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" }
    ]
  },
  {
    id: 2,
    title: "Aero Genius",
    category: "AI SOLUTION",
    description: "Aero Genius is a powerful AI droven Web app is mainly designed to enhance human life effectively in all sectors..",
    image: "https://media-hosting.imagekit.io/80f1ad7ef6d14dc6/videoframe_2182.png?Expires=1837628131&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lcf3YnpNQ7KcehLz2JymJNSeiOFtSdu2MXLXKZEQhbW8a9M8KVyVsGjmlGdH7W5tl-lrHTcLuilrFpd8lRDslTnBr8QPYQBzm64sXMA6hjZ1b~vlD3U0RJNZ~a5kYT3D2sQ9bS6~rDXLlMOo7ZkgJsrr8H1TOjQu9-9FQp~FIo97Fg0KRK3Jh42p58-nldrIUrjxtjbxw8S6ZoANpj5HDHTRHlNp~~QfzewQeeqAH~1I8D8MAVdU~O2Kz9b1HApYvynxHMHgDortlw~ZFf~yXO2V90u9Oum3AVWaQE90r7NuoD0Y6jVZklLriBXRuo~Vy9kQwPiqM9MIqeOVGA4~xA__",
    tags: [
      { name: "Python", color: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" },
      { name: "WEB APP", color: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]" },
      { name: "NLP", color: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" }
    ]
  },
  {
    id: 3,
    title: "Doctor Availability and Appointment management system",
    category: "WEB DESIGN",
    description: "check out the demo of the website - https://drive.google.com/file/d/1bjRYVAV3NJ-05RkqsafRwwCagVZDxaI2/view?usp=sharing.",
    image: "https://media-hosting.imagekit.io/e6ea8aac5fab4667/kamal_amma2-removebg-preview.png?Expires=1837628433&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=aemohFPS0iZg7qhEZvO-4z0EZ6bc6YKpZn7dBmCZfJx4We3iRU2krBiMxY-H5Fgg3Bvzqhw9pNCfvZS2AdKDJEot3wfEfZiJOUtN~DAIvOacs9Qh-A4H9TtNIeB8dIn544mDrWkVVuECPSzSZqsxct01cIekQlhbDwf8-FWFNWX3ZFWrkz4IAQbFezwyhAHctlre9a0V05nJdSfOY0LCz4JtvKo7M6AOh1qfGUT-Cx0SDcJNz~oRGF7i7bXouOkL9K3Q4oK-tKsrOUF5QFXzl2v4ImaEOqylIOwkzA0~iWuAEhgOqN~Zk4htNVaaJ3Qmt40aBGV1vxEhDP81mF9j8A__",
    tags: [
      { name: "React", color: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]" },
      { name: "UI/UX", color: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]" },
      { name: "Website", color: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]" }
    ]
  }
];

const ProjectsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Make scrollable on mobile with drag
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      scrollContainer.classList.add("active");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const mouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove("active");
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", mouseDown);
    scrollContainer.addEventListener("mouseleave", mouseLeave);
    scrollContainer.addEventListener("mouseup", mouseUp);
    scrollContainer.addEventListener("mousemove", mouseMove);

    return () => {
      scrollContainer.removeEventListener("mousedown", mouseDown);
      scrollContainer.removeEventListener("mouseleave", mouseLeave);
      scrollContainer.removeEventListener("mouseup", mouseUp);
      scrollContainer.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// 02</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">OUR PROJECTS</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Innovative solutions we've delivered for our clients
          </p>
        </div>
        
        <div className="relative" id="projectsSlider">
          {/* Project cards container */}
          <div 
            ref={scrollContainerRef}
            className="flex flex-nowrap overflow-x-auto pb-12 snap-x scrollbar-hide space-x-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="min-w-[300px] md:min-w-[400px] snap-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="gradient-border bg-[hsl(var(--card))] rounded-lg overflow-hidden h-full transform hover:scale-[1.02] transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="font-code text-xs text-[hsl(var(--secondary))]">{project.category}</p>
                      <h3 className="font-pixel text-lg text-white">{project.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="font-body text-sm text-foreground/80 mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-1 ${tag.color} rounded text-xs font-code`}>{tag.name}</span>
                      ))}
                    </div>
                    <motion.a 
                      href="https://www.youtube.com/watch?v=vjOxwr8FeBI" 
                      className="text-[hsl(var(--secondary))] text-sm hover:text-[hsl(var(--primary))] transition-colors duration-300 flex items-center"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <span>View Project</span>
                      <i className="ri-arrow-right-line ml-1"></i>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={scrollLeft}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--secondary))] flex items-center justify-center text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))] transition-colors duration-300"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          <button 
            onClick={scrollRight}
            className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--secondary))] flex items-center justify-center text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--background))] transition-colors duration-300"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <motion.a
            href="#"
            className="inline-block gradient-border bg-[hsl(var(--card))] px-6 py-3 rounded font-pixel text-sm text-[hsl(var(--secondary))] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VIEW ALL PROJECTS
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
