import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-background/70"></div>
      
      {/* Glowing grid lines */}
      <div className="absolute inset-0 grid-bg"></div>
      
      <motion.div 
        className="z-10 text-center px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, type: "spring" }}
      >
        <div className="text-sm font-code text-[hsl(var(--secondary))] mb-2 tracking-wider">&gt; INITIALIZING INTERFACE_</div>
        <h1 className="font-pixel text-4xl sm:text-5xl md:text-6xl text-[hsl(var(--primary))] mb-6 animate-glow tracking-tight">
          FLOCTET<br/>TECHNOLOGIES
        </h1>
        <div className="w-64 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto mb-8"></div>
        <p className="font-code text-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-10">
          &lt; Welcome to Floctet Technologies! We offer <span className="text-[hsl(var(--secondary))]">affordable freelancing services</span> in Website Design, Full-Stack Development, Software Development, Cybersecurity Audits, and <span className="text-[hsl(var(--accent))]">Mobile App Development</span>, catering to individuals and small businesses &gt;
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a 
            href="#services" 
            className="gradient-border bg-[hsl(var(--card))] px-6 py-3 rounded font-pixel text-xs sm:text-sm text-[hsl(var(--primary))] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            EXPLORE SERVICES
          </motion.a>
          <motion.a 
            href="#contact" 
            className="gradient-border bg-[hsl(var(--card))] px-6 py-3 rounded font-pixel text-xs sm:text-sm text-[hsl(var(--secondary))] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            CONTACT US
          </motion.a>
        </div>
      </motion.div>
      
      {/* Animated floating elements */}
      <motion.div 
        className="absolute w-20 h-20 top-1/4 left-1/4 border-2 border-[hsl(var(--primary))] opacity-20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-16 h-16 bottom-1/4 right-1/4 border-2 border-[hsl(var(--secondary))] opacity-20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div 
        className="absolute w-12 h-12 top-2/3 left-1/3 border-2 border-[hsl(var(--accent))] opacity-20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  );
};

export default HeroSection;
