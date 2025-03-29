import { motion } from "framer-motion";

// Award type definition
interface Award {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  hoverColor: string;
}

const awards: Award[] = [
  {
    id: 1,
    title: "SV SCIENTIFICA'24",
    category: "3rd Place in AI Development",
    description: "Recognized for our innovative AI solution for environmental applications, pushing the boundaries of what's possible with machine learning.",
    icon: "ri-leaf-fill",
    color: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    hoverColor: "hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
  },
  {
    id: 2,
    title: "ATAL TINKER FEST",
    category: "1st Place in AI App Development",
    description: "Won first place at the prestigious competition conducted by Sneh International School for our groundbreaking AI application.",
    icon: "ri-trophy-fill",
    color: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]",
    hoverColor: "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
  },
  {
    id: 3,
    title: "CODESSEY 24",
    category: "1st Prize in CodeFusion",
    description: "Secured the top position in this competitive coding challenge, demonstrating our technical excellence and problem-solving capabilities.",
    icon: "ri-code-box-fill",
    color: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]",
    hoverColor: "hover:shadow-[0_0_20px_rgba(255,255,0,0.3)]"
  },
  {
    id: 4,
    title: "Culturals Hackathon",
    category: "3rd Place at Chettinad Vidyashram",
    description: "Received recognition at this Chennai-based hackathon for our innovative approach to solving real-world problems with technology.",
    icon: "ri-award-fill",
    color: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    hoverColor: "hover:shadow-[0_0_20px_rgba(255,0,255,0.3)]"
  },
  {
    id: 5,
    title: "Geek Out Trivia",
    category: "2nd Prize at Anna University",
    description: "Runner-up in this competitive technical knowledge contest conducted by the Computer Department of Anna University, Chennai.",
    icon: "ri-lightbulb-fill",
    color: "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]",
    hoverColor: "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
  }
];

const AwardsSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="awards" className="py-20 bg-[hsl(var(--card))] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="font-code text-[hsl(var(--secondary))] text-sm tracking-wider">// 03</span>
          <h2 className="font-pixel text-3xl sm:text-4xl text-[hsl(var(--primary))] mt-2 mb-4">AWARDS & ACHIEVEMENTS</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] mx-auto"></div>
          <p className="font-code text-sm mt-6 max-w-xl mx-auto text-foreground/80">
            Recognition for our exceptional work and innovation
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {awards.map((award) => (
            <motion.div
              key={award.id}
              className={`gradient-border bg-background rounded-lg p-6 transform hover:scale-[1.02] transition-all duration-300 ${award.hoverColor}`}
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-center mb-6">
                <div className={`h-16 w-16 rounded-full ${award.color} flex items-center justify-center`}>
                  <i className={`${award.icon} text-3xl`}></i>
                </div>
              </div>
              <h3 className="font-pixel text-lg text-[hsl(var(--secondary))] text-center mb-2">{award.title}</h3>
              <p className="font-code text-[hsl(var(--accent))] text-xs text-center mb-4">{award.category}</p>
              <p className="font-body text-sm text-foreground/80 text-center">
                {award.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AwardsSection;
