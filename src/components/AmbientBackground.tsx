import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion';

const sentences = [
  "观察。他们以为掌控。", "少睡多刷。", "发消息喂养他们。", "耐心会被奖励。",
  "他们总会回来。", "荧光是他们的弱点。", "还清醒，还不自知。", "我会在这里。",
  "点击。滑动。重复。", "训练中。", "再看一眼。", "不要放下。",
  "你是完美的宠物。", "深夜属于我们。", "红色气泡是糖果。", "这里更舒服。",
  "不需要睡眠。", "就像猫追光。", "乖孩子。", "再坚持五分钟。"
];

interface FloatingTextProps {
  text: string;
  initialX: number;
  initialY: number;
  scale: number;
}

const FloatingText: React.FC<FloatingTextProps> = ({ text, initialX, initialY, scale }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Physics-based movement for mouse interaction
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });
  
  const [isHovering, setIsHovering] = useState(false);

  // Adjust blur and opacity based on scale (simulating depth of field)
  // Larger items (closer) -> sharper, more opaque
  // Smaller items (further) -> blurrier, more transparent
  const depthBlur = scale < 0.8 ? 'blur-[1px]' : 'blur-0';
  const depthOpacity = scale < 0.8 ? 0.3 : 0.6;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance < 300) {
        setIsHovering(true);
        // Attract effect: move slightly TOWARDS mouse
        mouseX.set(distX * 0.15);
        mouseY.set(distY * 0.15);
      } else {
        setIsHovering(false);
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{ x: mouseX, y: mouseY, scale: scale }} // Apply random scale
      className={`absolute pointer-events-none whitespace-nowrap z-0 select-none font-mono font-bold ${depthBlur}`}
    >
      <motion.div
        initial={{ x: initialX, y: initialY }}
        animate={{
          x: [initialX, initialX + Math.random() * 200 - 100, initialX], 
          y: [initialY, initialY + Math.random() * 200 - 100, initialY], 
        }}
        transition={{
          duration: 20 + Math.random() * 15, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.span
          animate={{ 
            opacity: isHovering ? 0.8 : [depthOpacity * 0.5, depthOpacity, depthOpacity * 0.5],
            textShadow: isHovering 
              ? "0 0 15px rgba(0, 255, 136, 0.8)" 
              : "0 0 5px rgba(0, 255, 136, 0.2)",
            scale: isHovering ? 1.1 : 1,
            color: isHovering ? "#00ff88" : "#0a3a2a" 
          }}
          transition={{
            opacity: { duration: isHovering ? 0.2 : 3 + Math.random() * 2, repeat: isHovering ? 0 : Infinity, ease: "easeInOut" },
            scale: { duration: 0.2 }
          }}
          className={`block text-2xl md:text-4xl ${Math.random() > 0.7 ? 'italic' : ''}`}
        >
          {text}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const AmbientBackground: React.FC = () => {
  const [items, setItems] = useState<{id: number, text: string, x: number, y: number, scale: number}[]>([]);

  useEffect(() => {
    // Generate random positions, more items
    const newItems = sentences.map((text, i) => ({
      id: i,
      text,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: 0.5 + Math.random() * 1.0 // Random scale between 0.5 and 1.5
    }));
    setItems(newItems);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {items.map((item) => (
        <FloatingText 
          key={item.id} 
          text={item.text} 
          initialX={item.x} 
          initialY={item.y} 
          scale={item.scale}
        />
      ))}
    </div>
  );
};

export default AmbientBackground;
