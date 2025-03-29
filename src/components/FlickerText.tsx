
import { useEffect, useState } from "react";

interface FlickerTextProps {
  text: string;
  className?: string;
}

export const FlickerText = ({ text, className = "" }: FlickerTextProps) => {
  const [visibleText, setVisibleText] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (visibleText.length < text.length) {
      timeout = setTimeout(() => {
        setVisibleText(text.substring(0, visibleText.length + 1));
      }, 100 + Math.random() * 50);
    }
    
    return () => clearTimeout(timeout);
  }, [visibleText, text]);
  
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <span className={`inline-block ${className}`}>
      {visibleText}
      {cursor && <span className="animate-blink">_</span>}
    </span>
  );
};
