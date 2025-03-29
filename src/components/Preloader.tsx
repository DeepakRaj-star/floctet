import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const loadingMessages = [
  "LOADING SYSTEM",
  "INITIALIZING INTERFACE",
  "CALIBRATING DISPLAY",
  "ESTABLISHING CONNECTION",
  "ACCESSING DATABASE",
  "RENDERING GRAPHICS",
  "LAUNCHING APPLICATION",
];

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        
        // Update message based on progress
        const newIndex = Math.min(
          Math.floor(newProgress / (100 / (loadingMessages.length - 1))),
          loadingMessages.length - 1
        );
        
        if (newIndex > messageIndex) {
          setMessageIndex(newIndex);
          setCurrentMessage(loadingMessages[newIndex]);
        }
        
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [messageIndex]);

  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex flex-col justify-center items-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-pixel text-[hsl(var(--primary))] text-2xl mb-6 crt-flicker"
      >
        FLOCTET TECH
      </motion.div>
      <div className="h-2 w-48 bg-[hsl(var(--muted))] overflow-hidden rounded">
        <motion.div
          className="h-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>
      <div className="mt-4 font-code text-sm text-[hsl(var(--secondary))]">
        <span>{currentMessage}</span>
        <span className="animate-blink">_</span>
      </div>
    </motion.div>
  );
};

export default Preloader;
