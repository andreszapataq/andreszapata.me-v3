"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HighlightProps {
  children: React.ReactNode;
  icon: string;
}

export default function Highlight({ children, icon }: HighlightProps) {
  const [isVisible, setIsVisible] = useState(false);
  const spanRef = useRef<HTMLSpanElement>(null);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  // Click outside para cerrar en móviles
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (e: TouchEvent | MouseEvent) => {
      if (spanRef.current && !spanRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener("touchstart", handleClickOutside);
    
    return () => {
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <span
      ref={spanRef}
      className="font-semibold cursor-help border-b border-dotted border-foreground/40 relative"
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <span
        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-11 h-11 bg-foreground rounded-lg pointer-events-none z-10 transition-opacity flex items-center justify-center ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={icon}
          alt=""
          width={28}
          height={28}
          className="w-6 h-6 object-contain"
        />
        {/* Arrow/punta del tooltip */}
        <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-foreground" />
      </span>
    </span>
  );
}
