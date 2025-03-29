import { useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  isAuthenticated?: boolean;
  onOpenAuthModal?: (tab: "login" | "register") => void;
}

const Navigation = ({ isAuthenticated = false, onOpenAuthModal }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: 10 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[hsl(var(--card))] flex items-center justify-center border-2 border-[hsl(var(--secondary))] shadow-[0_0_15px_rgba(0,255,255,0.7)] hover:shadow-[0_0_25px_rgba(0,255,255,0.9)] transition-all duration-300"
      >
        <i className="ri-menu-line text-2xl text-[hsl(var(--secondary))]"></i>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute bottom-16 left-0 w-64 bg-[hsl(var(--card))] border-2 border-[hsl(var(--secondary))] p-4 rounded-lg shadow-[0_0_20px_rgba(0,255,255,0.4)]"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[hsl(var(--secondary))]/30">
              <span className="font-pixel text-sm text-[hsl(var(--primary))]">MENU:~/</span>
              <span className="text-[hsl(var(--secondary))] font-code text-xs animate-blink">▮</span>
            </div>
            <ul className="space-y-3">
              <motion.li variants={itemVariants}>
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-home-4-line mr-2"></i> <span className="font-code text-sm">HOME</span>
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link href="/#services" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-server-line mr-2"></i> <span className="font-code text-sm">SERVICES</span>
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link href="/#projects" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-code-box-line mr-2"></i> <span className="font-code text-sm">PROJECTS</span>
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link href="/#awards" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-trophy-line mr-2"></i> <span className="font-code text-sm">AWARDS</span>
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link href="/#team" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-team-line mr-2"></i> <span className="font-code text-sm">TEAM</span>
                </Link>
              </motion.li>
              <motion.li variants={itemVariants}>
                <Link href="/#contact" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                  <i className="ri-message-3-line mr-2"></i> <span className="font-code text-sm">CONTACT</span>
                </Link>
              </motion.li>
              
              <motion.li variants={itemVariants} className="pt-3 border-t border-[hsl(var(--secondary))]/30 mt-3">
                {isAuthenticated ? (
                  <>
                    <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-all duration-300">
                      <i className="ri-dashboard-line mr-2"></i> <span className="font-code text-sm">DASHBOARD</span>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAuthModal && onOpenAuthModal("login");
                    }}
                    className="flex items-center text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-all duration-300 w-full text-left"
                  >
                    <i className="ri-login-box-line mr-2"></i> <span className="font-code text-sm">LOGIN</span>
                  </button>
                )}
              </motion.li>
              
              {isAuthenticated ? (
                <motion.li variants={itemVariants}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-all duration-300 w-full text-left"
                  >
                    <i className="ri-logout-box-line mr-2"></i> <span className="font-code text-sm">LOGOUT</span>
                  </button>
                </motion.li>
              ) : (
                <motion.li variants={itemVariants}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenAuthModal && onOpenAuthModal("register");
                    }}
                    className="flex items-center text-[hsl(var(--accent))] hover:text-[hsl(var(--primary))] transition-all duration-300 w-full text-left"
                  >
                    <i className="ri-user-add-line mr-2"></i> <span className="font-code text-sm">REGISTER</span>
                  </button>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navigation;
