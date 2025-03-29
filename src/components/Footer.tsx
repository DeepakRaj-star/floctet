import { motion } from "framer-motion";
import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="py-8 text-center relative z-10">
      <div className="container mx-auto">
        <div className="font-pixel text-sm mb-2">FLOCTET © 2025</div>
        <div className="text-xs font-code text-foreground/60">
          <Link href="/admin" className="hover:text-[hsl(var(--primary))] transition-colors">
            Admin Access
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;