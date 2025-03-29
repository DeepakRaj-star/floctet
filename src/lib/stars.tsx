import { useEffect, useRef } from "react";

const Stars = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const shootingStarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create regular stars
    const stars = starsRef.current;
    if (!stars) return;

    const starsCount = 150; // Increased star count
    stars.innerHTML = "";

    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement("div");
      
      // Random color - mostly white/blue tints for a futuristic feel
      const colors = [
        "rgba(255, 255, 255, 0.8)",
        "rgba(180, 230, 255, 0.8)",
        "rgba(140, 220, 255, 0.8)",
        "rgba(200, 240, 255, 0.8)",
        "rgba(170, 220, 255, 0.8)"
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size with some larger stars
      const size = Math.random() < 0.9 ? Math.random() * 2 + 0.5 : Math.random() * 4 + 2;
      
      // Random opacity
      const opacity = Math.random() * 0.9 + 0.1;
      
      // Add the star class based on size
      if (size > 2) {
        star.classList.add(
          "absolute",
          "rounded-full",
          "animate-glow"
        );
      } else {
        star.classList.add(
          "absolute",
          "rounded-full"
        );
      }
      
      // Apply styles
      star.style.left = `${posX}%`;
      star.style.top = `${posY}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = `${opacity}`;
      star.style.backgroundColor = color;
      
      // Random animation
      star.style.animation = `glow ${Math.random() * 4 + 2}s ease-in-out infinite alternate`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      stars.appendChild(star);
    }

    // Create shooting stars at intervals
    const shootingStars = shootingStarsRef.current;
    if (!shootingStars) return;

    const createShootingStar = () => {
      const shootingStar = document.createElement("div");
      
      // Random starting position (top edge, random x)
      const startX = Math.random() * 100;
      const startY = Math.random() * 30;
      
      // Add classes
      shootingStar.classList.add(
        "absolute",
        "w-0.5",
        "h-0.5",
        "bg-white",
        "rounded-full"
      );
      
      // Set position
      shootingStar.style.left = `${startX}%`;
      shootingStar.style.top = `${startY}%`;
      shootingStar.style.boxShadow = "0 0 20px 2px rgba(255, 255, 255, 0.7), 0 0 40px 6px rgba(0, 210, 255, 0.7)";
      
      // Set animation
      const duration = Math.random() * 2 + 1;
      const angle = Math.random() * 20 + 20; // 20-40 degrees
      
      // Create trail
      shootingStar.style.transform = `rotate(${angle}deg)`;
      shootingStar.style.width = `${Math.random() * 100 + 50}px`;
      
      // Animation
      shootingStar.animate(
        [
          { opacity: 1, transform: `rotate(${angle}deg) translateX(0)` },
          { opacity: 0, transform: `rotate(${angle}deg) translateX(${Math.random() * 200 + 100}px)` }
        ],
        {
          duration: duration * 1000,
          easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
          fill: 'forwards'
        }
      );
      
      // Remove after animation
      setTimeout(() => {
        shootingStar.remove();
      }, duration * 1000 + 100);
      
      shootingStars.appendChild(shootingStar);
    };
    
    // Create a shooting star randomly
    const shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every interval
        createShootingStar();
      }
    }, 3000);

    return () => {
      if (stars) stars.innerHTML = "";
      if (shootingStars) shootingStars.innerHTML = "";
      clearInterval(shootingStarInterval);
    };
  }, []);

  return (
    <>
      <div 
        ref={starsRef} 
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
      />
      <div 
        ref={shootingStarsRef} 
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
      />
    </>
  );
};

export default Stars;
