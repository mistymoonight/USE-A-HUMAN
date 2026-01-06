import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThumbsUp, Mountain } from 'lucide-react';
import { useStore } from '../store/useStore';
import ModuleLayout from '../components/ModuleLayout';

import ManualNoteContent from '../components/ManualNoteContent';

const MANUAL_STEPS = [
  {
    title: "Step 1",
    content: "Track thumb activity during scrolling.",
    subContent: "第一步：追踪拇指滚动活动。"
  },
  {
    title: "Step 2",
    content: "Encourage frequent scrolling to build habit and engagement.",
    subContent: "第二步：鼓励频繁滑动以培养习惯和参与度。"
  },
  {
    title: "Step 3",
    content: "Reward high activity with micro-interactions — small popups, color flashes, sounds — like praising a pet for persistence.",
    subContent: "第三步：给予微小奖励（弹窗、颜色闪烁、提示音）——就像表扬宠物坚持完成任务一样。"
  }
];

const ThumbPilgrimage: React.FC = () => {
    const navigate = useNavigate();
    
    // New State for "Feeding" interaction
    const [feedCount, setFeedCount] = useState(0);
    const [depth, setDepth] = useState(0); // Sinking depth (negative altitude)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isCompleted, setIsCompleted] = useState(false);
    const [bubbles, setBubbles] = useState<{ id: number, x: number, y: number, content: React.ReactNode }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const TARGET_DEPTH = 8848; // Inverted Everest

    // Feeding Interaction: Track mouse/touch to move light source
    const handleMove = (clientX: number, clientY: number) => {
        if (containerRef.current && !isCompleted) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            setMousePos({ x, y });
            
            // Calculate resistance based on depth
            // As we get closer to 8848m, it becomes harder to scroll (less increment per move)
            const progress = depth / TARGET_DEPTH;
            const resistance = Math.pow(progress, 2); // Non-linear resistance
            const increment = Math.max(0.5, 5 * (1 - resistance * 0.8)); // Minimum 0.5 increment
            
            // Increase feed count / depth simply by moving (being active)
            setFeedCount(prev => prev + 1);
            
            // Randomly spawn bubbles (simulating notifications/content)
            if (Math.random() < 0.1) {
                const bubbleContent = Math.random() > 0.5 ? "❤️" : (Math.random() > 0.5 ? "💬" : "🔥");
                const newBubble = {
                    id: Date.now(),
                    x: (Math.random() - 0.5) * 100, // Relative x offset from stickman
                    y: (Math.random() - 0.5) * 50,  // Relative y offset
                    content: bubbleContent
                };
                setBubbles(prev => [...prev, newBubble]);
                
                // Remove bubble after animation
                setTimeout(() => {
                    setBubbles(prev => prev.filter(b => b.id !== newBubble.id));
                }, 1500);
            }
            
            const newDepth = Math.min(TARGET_DEPTH, depth + increment);
            setDepth(newDepth);

            if (newDepth >= TARGET_DEPTH) {
                handleCompletion();
            }
        }
    };

    const handleCompletion = () => {
        setIsCompleted(true);
        // Reset sequence
        setTimeout(() => {
            // Reset state
            setDepth(0);
            setIsCompleted(false);
            setFeedCount(0);
        }, 8000); // Wait 8 seconds before reset
    };

    const onMouseMove = (e: React.MouseEvent) => {
        handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const observationText = (
        <p>人类每天滑动约100米 → 相当于一年爬一次珠穆朗玛峰（8848米）。</p>
    );

    const manualNote = <ManualNoteContent steps={MANUAL_STEPS} />;

    // Calculate visual values
    // Map 8848m to a reasonable pixel height. Further reduced to 400 to move tip higher up.
    const maxPixelHeight = 400;
    const currentHeight = (depth / TARGET_DEPTH) * maxPixelHeight;
    
    // Determine stickman state based on depth
    // No more fatigue/squatting. Just scaling down.
    // Scale starts at 1, goes down to 0.5 at max depth
    const scale = 1 - (depth / TARGET_DEPTH) * 0.5;
    
    return (
        <ModuleLayout
            title={<>THUMB PILGRIMAGE:<br/><span className="whitespace-nowrap">Your Thumb Travels for Me</span></>}
            subtitle="如何使用指尖陷阱诱捕人类"
            moduleNumber={3}
            observationText={observationText}
            manualNote={manualNote}
            onNext={() => navigate('/bedtime-rituals')}
        >
            <div 
                ref={containerRef}
                className={`w-full h-full flex flex-col items-center relative select-none overflow-hidden cursor-none transition-colors duration-1000 ${isCompleted ? 'bg-black' : ''}`}
                onMouseMove={onMouseMove}
                onTouchMove={onTouchMove}
            >
                {/* Light Source (Follows Mouse) */}
                <motion.div 
                    className={`absolute w-32 h-32 bg-primary/60 rounded-full blur-[60px] pointer-events-none z-0 mix-blend-screen transition-opacity duration-500 -translate-x-1/2 -translate-y-1/2 ${isCompleted ? 'opacity-0' : 'opacity-100'}`}
                    style={{ left: mousePos.x, top: mousePos.y }}
                />

                {/* Stats/Feedback - Real-time Altitude Above Baseline */}
                <div className={`absolute top-4 w-full text-center pointer-events-none z-30 transition-opacity duration-500 ${isCompleted ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col items-center">
                        <p className="text-primary/60 text-[10px] font-mono tracking-[0.3em] mb-1 uppercase">Current Altitude</p>
                        <p className="text-3xl md:text-4xl font-bold text-primary font-mono tabular-nums leading-none drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
                            -{Math.floor(depth)}m
                        </p>
                    </div>
                </div>

                {/* Ground Line (Baseline) */}
                <div className={`absolute top-48 w-full h-px bg-white/20 z-10 transition-opacity duration-500 ${isCompleted ? 'opacity-0' : 'opacity-100'}`}></div>

                {/* Inverted Mountain (Growing Downwards from Baseline) */}
                <div 
                    className="absolute top-48 w-full flex justify-center items-start pointer-events-none z-0"
                    style={{ height: 'calc(100% - 12rem)' }}
                >
                    <motion.div 
                        className="relative flex justify-center"
                        initial={{ height: 0 }}
                        animate={{ height: Math.max(0, currentHeight) }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {/* Inverted Mountain Shape */}
                        <svg width="600" height="100%" viewBox="0 0 600 100" preserveAspectRatio="none" className={`stroke-current stroke-[3] fill-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-1000 ${isCompleted ? 'text-white/20' : 'text-gray-500'}`}>
                            {/* Outer mountain (lighter green) */}
                            <path 
                                d="M0 0 L300 100 L600 0 Z" 
                                vectorEffect="non-scaling-stroke" 
                                className={`transition-colors duration-1000 ${isCompleted ? 'fill-white/10' : 'fill-primary/20'} stroke-none`} 
                            />
                            {/* Inner mountain layers (deeper green) */}
                            <path 
                                d="M100 0 L300 80 L500 0 Z" 
                                vectorEffect="non-scaling-stroke" 
                                className={`transition-colors duration-1000 ${isCompleted ? 'hidden' : 'fill-primary/40'} stroke-none`} 
                            />
                            <path 
                                d="M200 0 L300 50 L400 0 Z" 
                                vectorEffect="non-scaling-stroke" 
                                className={`transition-colors duration-1000 ${isCompleted ? 'hidden' : 'fill-primary/60'} stroke-none`} 
                            />
                        </svg>
                        
                        {/* Peak Label (Glows on completion) */}
                        <div className={`absolute bottom-0 translate-y-full text-xs font-mono mt-2 transition-all duration-1000 ${isCompleted ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-gray-400'}`}>
                            -{Math.floor(depth)}m / -8848m
                        </div>
                    </motion.div>
                </div>

                {/* Stickman (Sinking from Baseline, standing on tip) */}
                <div className="absolute top-48 w-full flex justify-center pointer-events-none z-20">
                    <motion.div
                        className="flex flex-col items-center origin-bottom"
                        animate={{ 
                            y: currentHeight - 100 * scale, // Adjust position based on scaled height (100 is svg height)
                            scale: scale 
                        }} 
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {/* Improved Minimal Stickman - Standard Pose */}
                        <svg width="60" height="100" viewBox="0 0 60 100" className={`stroke-white fill-none stroke-[2.5] filter drop-shadow-lg transition-all duration-500 ${isCompleted ? 'stroke-white/10' : ''}`} strokeLinecap="round" strokeLinejoin="round">
                            {/* Head */}
                            <circle cx="30" cy="18" r="8" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            
                            {/* Body */}
                            <path d="M30 26 L30 65" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            
                            {/* Legs - Standing straight */}
                            <path d="M30 65 L20 95" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            <path d="M30 65 L40 95" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            
                            {/* Arms - Holding phone */}
                            <path d="M30 35 L45 50" className={isCompleted ? 'stroke-white/10' : ''} /> {/* Right Arm */}
                            <path d="M45 50 L35 45" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            
                            <path d="M30 35 L15 50" className={isCompleted ? 'stroke-white/10' : ''} /> 
                            {/* Left Arm and Hand Group - Entire assembly swipes vertically */}
                            <motion.g 
                                style={{ transformOrigin: '15px 50px', transformBox: 'fill-box' }} 
                                animate={isCompleted ? { rotate: 0, x: 0, y: 0 } : { rotate: [-15, 0, -15], x: [0, 1, 0], y: [0, 4, 0] }} 
                                transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                            >
                                {/* Forearm */}
                                <path d="M15 50 L25 45" className={isCompleted ? 'stroke-white/10' : ''} />
                                
                                {/* Thumb/Finger sliding on screen */}
                                <motion.circle 
                                    cx="25" 
                                    cy="45" 
                                    r="1.3" 
                                    className={isCompleted ? 'fill-white/10' : 'fill-white'} 
                                    animate={isCompleted ? { cy: 45 } : { cy: [43, 48, 43] }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                                />
                            </motion.g>
                            
                            {/* Phone remains stationary relative to arm pivot, or could move slightly if held */}
                            <g className={`transition-all duration-1000 ${isCompleted ? 'opacity-100' : ''}`}>
                                <rect x="25" y="40" width="8" height="12" rx="2" className="fill-gray-500 stroke-none" />
                                <circle cx="28" cy="43" r="1.2" className="fill-gray-800 stroke-none" />
                            </g>
                        </svg>

                        {/* Bubbles Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
                            {bubbles.map(bubble => (
                                <motion.div
                                    key={bubble.id}
                                    className="absolute bg-white/90 text-black rounded-full px-2 py-1 text-xs shadow-sm flex items-center justify-center min-w-[20px] h-[20px]"
                                    initial={{ opacity: 0, y: bubble.y, x: bubble.x, scale: 0.5 }}
                                    animate={{ opacity: [0, 1, 0], y: bubble.y - 150, scale: [0.5, 1.5] }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                >
                                    {bubble.content}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Completion Overlay */}
                {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="text-center"
                        >
                            <motion.p 
                                className="text-base md:text-lg font-thin text-white mb-8 tracking-tight text-center leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            >
                                Diligent human! You climbed a "Geocentric Everest",<br/>
                                with your thumb!
                            </motion.p>
                        </motion.div>
                    </div>
                )}
            </div>

            <div className="mt-6 text-center max-w-xs mx-auto">
                <p className="text-sm text-gray-400 italic">"Feed them, and watch them climb… or fall."</p>
                <p className="text-xs text-gray-600 mt-1">“喂着他们，看他们攀爬… 或者陷落。”</p>
            </div>
        </ModuleLayout>
    );
};

export default ThumbPilgrimage;
