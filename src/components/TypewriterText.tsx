import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, // Default speed
  onComplete,
  className = "",
  cursorClassName = "bg-primary",
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  
  useEffect(() => {
    isMountedRef.current = true;
    
    // If text changes, reset (unless it's the same text we already finished?)
    // For simplicity, we restart if text changes.
    setDisplayedText('');
    setIsTyping(false);
    hasStartedRef.current = false;
    
    // Clear any existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      setIsTyping(true);
      hasStartedRef.current = true;
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (!isMountedRef.current) return;

        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          // Add slight randomness to typing speed for realism
          const randomSpeed = speed + (Math.random() * 30 - 15);
          timeoutRef.current = setTimeout(typeNextChar, randomSpeed);
        } else {
          setIsTyping(false);
          if (onCompleteRef.current) onCompleteRef.current();
        }
      };
      
      typeNextChar();
    }, delay);

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className={`inline-block w-[2px] h-[1.2em] align-text-bottom ml-1 ${cursorClassName} ${isTyping ? 'animate-pulse' : 'hidden'}`}></span>
      )}
    </span>
  );
};

export default TypewriterText;
