import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;

      const target = e.target as HTMLElement;
      const isClickable = target.tagName.toLowerCase() === 'button' || 
                         target.tagName.toLowerCase() === 'a' ||
                         target.closest('[role="button"]') ||
                         target.closest('.clickable');

      if (isClickable) {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-dot-hover');
      } else {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-dot-hover');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  );
};

export default CustomCursor;