import { motion } from "framer-motion";

const TeamSection = () => {
  return (
    <section id="team" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// 04</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">OUR TEAM</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Meet the talented individuals behind our success
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="gradient-border bg-[hsl(var(--card))] rounded-lg p-8 flex flex-col md:flex-row items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
              <motion.div 
                className="relative"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[hsl(var(--primary))]/50">
                  <img src="/src/assets/deepak.jpg" alt="Deepak Raj R" className="w-full h-full object-cover" />
                </div>
                <motion.div 
                  className="absolute -inset-1 rounded-full border border-[hsl(var(--secondary))] opacity-70"
                >
                </motion.div>
              </motion.div>
            </div>

            <div className="md:w-2/3 md:pl-8">
              <h3 className="font-pixel text-2xl text-[hsl(var(--secondary))] mb-2">DEEPAK RAJ R</h3>
              <p className="font-code text-[hsl(var(--primary))] text-sm mb-4">Founder</p>

              <motion.div 
                className="mb-6 space-y-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, staggerChildren: 0.1 }}
              >
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="w-1 h-1 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                  <span className="font-body text-foreground">Full-Stack Developer</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <span className="w-1 h-1 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                  <span className="font-body text-foreground">AI Developer</span>
                </motion.div>
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="w-1 h-1 bg-[hsl(var(--secondary))] rounded-full mr-2"></span>
                  <span className="font-body text-foreground">Software Developer</span>
                </motion.div>
              </motion.div>

              <p className="font-body text-sm text-foreground/80 mb-6">
                Passionate tech innovator with expertise spanning web development, artificial intelligence, and software engineering. Deepak leads the FLOCTET team with a vision to blend cutting-edge technology with creative solutions.
              </p>

              <div className="p-4 rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--secondary))]/20 animate-data-flow mb-4">
                <p className="font-code text-xs text-foreground/80 italic">
                  We are a collective of six talented individuals, with Deepak as our visible representative. The other five members prefer to maintain their privacy while working behind the scenes due to personal reasons. This collaborative approach allows our diverse team to focus on delivering exceptional solutions while respecting individual preferences for public visibility.
                </p>
              </div>

              <div className="flex space-x-4">
                <motion.a 
                  href="https://www.linkedin.com/in/deepak-raj-r-290856235/" 
                  target="_blank" 
                  className="inline-flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className="ri-linkedin-box-fill text-xl mr-2"></i>
                  <span className="font-code text-sm">LinkedIn</span>
                </motion.a>

                <motion.a 
                  href="https://www.instagram.com/dee_pakrajr/" 
                  target="_blank" 
                  className="inline-flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className="ri-instagram-fill text-xl mr-2"></i>
                  <span className="font-code text-sm">Instagram</span>
                </motion.a>

                <motion.a 
                  href="https://x.com/Venom021830" 
                  target="_blank" 
                  className="inline-flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className="ri-twitter-x-fill text-xl mr-2"></i>
                  <span className="font-code text-sm">Twitter</span>
                </motion.a>

                <motion.a 
                  href="https://github.com/deepakraj-sys" 
                  target="_blank" 
                  className="inline-flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className="ri-github-fill text-xl mr-2"></i>
                  <span className="font-code text-sm">GitHub</span>
                </motion.a>
              </div>

              <div className="mt-4">
                <motion.a 
                  href="tel:+916381687588" 
                  className="inline-flex items-center text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <i className="ri-phone-fill text-xl mr-2"></i>
                  <span className="font-code text-sm">+91 6381687588</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 text-center">
            <motion.a
              href="https://www.xpecto.org/competitions/frosthack"
              className="inline-block gradient-border bg-[hsl(var(--card))] px-6 py-3 rounded font-pixel text-sm text-[hsl(var(--accent))] hover:shadow-[0_0_20px_rgba(255,255,0,0.5)] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW TEAM'S PORTFOLIO
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;