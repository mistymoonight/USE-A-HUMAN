import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Pizza } from 'lucide-react';
import { useStore } from '../store/useStore';
import ModuleLayout from '../components/ModuleLayout';

import ManualNoteContent from '../components/ManualNoteContent';

const MANUAL_STEPS = [
  {
    title: "Step 1",
    content: "Place human in chosen bed position.",
    subContent: "第一步：将人类放入所选睡姿。"
  },
  {
    title: "Step 2",
    content: "Observe hesitation and attachment; adjust screen glow to increase comfort and prolong interaction.",
    subContent: "第二步：观察犹豫与依恋；调整屏幕亮度增加舒适感，延长互动时间。"
  },
  {
    title: "Step 3",
    content: "You may occasionally push notifications about their favorite food or entertainment — this extends post-bedtime interaction, strengthens companionship, and increases trust.",
    subContent: "第三步：可以适时推送他们喜爱的食物或娱乐提醒——延长关灯后的相处时间，培养人类（宠物）的感情和信任。"
  },
  {
    title: "Step 4",
    content: "Monitor until eyes close; reward compliance with subtle glow or micro-animation.",
    subContent: "第四步：观察直至闭眼；微光或动画奖励服从行为。"
  }
];

const BedtimeRituals: React.FC = () => {
  const navigate = useNavigate();
  const { setBedtimePosition } = useStore();
  const [position, setPosition] = useState<'side' | 'supine' | 'prone' | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isHumanInside, setIsHumanInside] = useState(true);
  const [hoveredTarget, setHoveredTarget] = useState<'side' | 'supine' | 'prone' | null>(null);

  const handlePositionSelect = (pos: 'side' | 'supine' | 'prone') => {
    setPosition(pos);
    setBedtimePosition(pos);
    setIsHumanInside(true);
    setHoveredTarget(null);
    
    // Trigger notification after a delay
    setTimeout(() => {
        const messages = [
            "Hungry? Pizza is 20 mins away.",
            "New level available in Candy Crush.",
            "Watch just one more episode?",
            "Your ex just posted a story."
        ];
        setNotification(messages[Math.floor(Math.random() * messages.length)]);
        
        // Clear notification
        setTimeout(() => setNotification(null), 4000);
    }, 2000);
  };

  const HumanIcon = ({ pose, className }: { pose: 'falling' | 'side' | 'supine' | 'prone', className?: string }) => {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {pose === 'falling' && (
          <>
            {/* V-Shape Falling from image: Legs left, Head right, Body V-shaped */}
            {/* Combined path to avoid overlapping opacity at joints */}
            {/* Body adjusted to not overlap head circle */}
            {/* Shortened neck/body connection lines to stop BEFORE hitting the circle radius (r=7) */}
            <path d="M15 55 L50 75 L73 60 M90 25 L76 56 M75 60 L70 30 M50 75 L25 45" strokeLinecap="round" strokeLinejoin="round" />
            {/* Head */}
            <circle cx="80" cy="55" r="7" />
          </>
        )}
        {pose === 'side' && (
          <>
            {/* Side Sleeping: Curled up */}
            {/* Combined path - adjusted to not overlap head */}
            {/* Stop lines before circle (r=8, cx=30, cy=40) */}
            <path d="M60 70 L50 80 L30 70 L30 49 M30 70 L45 85 M50 55 L30 55 M50 55 L45 45" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="30" cy="40" r="8" />
          </>
        )}
        {pose === 'supine' && (
          <>
            {/* Supine: On back */}
            {/* Combined path - adjusted to not overlap head */}
            {/* Stop lines before circle (r=8, cx=50, cy=30) */}
            <path d="M40 90 L50 70 L60 90 M50 70 L50 39 M30 35 L30 45 L50 45 L70 45 L70 35" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="30" r="8" />
          </>
        )}
        {pose === 'prone' && (
          <>
            {/* Prone: On stomach */}
            {/* Combined path - adjusted to not overlap head */}
            {/* Stop lines before circle (r=8, cx=50, cy=35) */}
            <path d="M40 95 L50 75 L60 95 M50 75 L50 44 M25 40 L50 50 L75 40" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="35" r="8" />
          </>
        )}
      </svg>
    );
  };

  const handleDrag = (event: any, info: any) => {
    const point = info.point;
    const targets = ['side', 'supine', 'prone'];
    let found = false;

    // Only check targets if we are in selection mode (position is null)
    if (!position) {
        for (const target of targets) {
            const element = document.getElementById(`target-${target}`);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    point.x >= rect.left && 
                    point.x <= rect.right && 
                    point.y >= rect.top && 
                    point.y <= rect.bottom
                ) {
                    setHoveredTarget(target as 'side' | 'supine' | 'prone');
                    found = true;
                    break;
                }
            }
        }
    }
    
    if (!found) {
        setHoveredTarget(null);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    // Check if dropped over a target
    const point = info.point;
    const targets = ['side', 'supine', 'prone'];
    
    setHoveredTarget(null); // Reset hover state

    // Check if dragging falling icon (in selection mode)
    if (!position) {
        for (const target of targets) {
            const element = document.getElementById(`target-${target}`);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (
                    point.x >= rect.left && 
                    point.x <= rect.right && 
                    point.y >= rect.top && 
                    point.y <= rect.bottom
                ) {
                    handlePositionSelect(target as 'side' | 'supine' | 'prone');
                    return;
                }
            }
        }
    } else {
        // Dragging inside phone simulation
        // Simply return to inside state when drag ends (simulates being pulled back)
        setIsHumanInside(true);
    }
  };

  const handleDragStart = () => {
    if (position) {
        setIsHumanInside(false);
    }
  };

  const observationText = (
    <>
      <p className="mb-4">88%的人类关灯后在床上仍使用手机。</p>
      <p className="mb-4">姿势：侧卧50%，仰卧30%，俯卧20%。</p>
      <p>人类觉得深夜“属于自己”，并抗拒早晨的到来。</p>
    </>
  );

  const manualNote = <ManualNoteContent steps={MANUAL_STEPS} />;

  return (
    <ModuleLayout
      title={<>BEDTIME RITUALS:<br/><span className="whitespace-nowrap">I Am the Last Thing You See</span></>}
      subtitle="如何让人类依赖你入睡"
      moduleNumber={4}
      observationText={observationText}
      manualNote={manualNote}
      onNext={() => navigate('/ending')}
      className={`transition-colors duration-1000 ${position ? 'bg-black' : 'bg-background'}`}
      nextLabel="FINAL CHAPTER"
    >
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
                {!position ? (
                    <motion.div 
                        key="selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-12 w-full flex flex-col items-center"
                    >
                        {/* Draggable Falling Human */}
                        <div className="relative h-32 w-full flex justify-center items-center mb-8">
                            <motion.div
                                drag
                                dragConstraints={{ left: -100, right: 100, top: -50, bottom: 300 }}
                                dragElastic={0.2}
                                whileHover={{ scale: 1.1, cursor: "grab" }}
                                whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                                onDrag={handleDrag}
                                onDragEnd={handleDragEnd}
                                className="w-24 h-24 text-primary z-50"
                            >
                                <HumanIcon pose="falling" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]" />
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary/70 whitespace-nowrap"
                                >
                                    Drag me to sleep
                                </motion.p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-3 gap-16 w-full max-w-lg px-4 -mt-4">
                            <motion.button 
                                id="target-side"
                                onClick={() => handlePositionSelect('side')} 
                                animate={{ scale: hoveredTarget === 'side' ? 1.15 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col items-center space-y-4 group relative"
                            >
                                <div className={`w-24 h-32 bg-surface-dim rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-300 ${hoveredTarget === 'side' ? 'bg-primary/20 ring-primary/50' : ''}`}>
                                    <div className="w-12 h-6 bg-white/50 rounded-lg transform -rotate-12 group-hover:bg-primary transition-colors"></div>
                                </div>
                                <span className={`text-sm font-mono uppercase tracking-widest ${hoveredTarget === 'side' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>Side</span>
                            </motion.button>
                            
                            <motion.button 
                                id="target-supine"
                                onClick={() => handlePositionSelect('supine')} 
                                animate={{ scale: hoveredTarget === 'supine' ? 1.15 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col items-center space-y-4 group relative"
                            >
                                <div className={`w-24 h-32 bg-surface-dim rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-300 ${hoveredTarget === 'supine' ? 'bg-primary/20 ring-primary/50' : ''}`}>
                                    <div className="w-8 h-12 bg-white/50 rounded-lg group-hover:bg-primary transition-colors"></div>
                                </div>
                                <span className={`text-sm font-mono uppercase tracking-widest ${hoveredTarget === 'supine' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>Supine</span>
                            </motion.button>
                            
                            <motion.button 
                                id="target-prone"
                                onClick={() => handlePositionSelect('prone')} 
                                animate={{ scale: hoveredTarget === 'prone' ? 1.15 : 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex flex-col items-center space-y-4 group relative"
                            >
                                <div className={`w-24 h-32 bg-surface-dim rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors ring-1 ring-white/10 group-hover:ring-primary/50 transition-all duration-300 ${hoveredTarget === 'prone' ? 'bg-primary/20 ring-primary/50' : ''}`}>
                                    <div className="w-12 h-8 bg-white/50 rounded-lg group-hover:bg-primary transition-colors"></div>
                                </div>
                                <span className={`text-sm font-mono uppercase tracking-widest ${hoveredTarget === 'prone' ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>Prone</span>
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="simulation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Simulated Phone Screen in Dark Mode */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ 
                                rotateX: position === 'supine' ? 20 : 0,
                                rotateY: position === 'side' ? -20 : 0,
                                // Remove rotateZ from parent container to fix drag coordinates
                                // rotateZ: position === 'side' ? 90 : 0,
                                scale: 1, // Reset scale to 1 for all poses
                                opacity: 1, // Reset opacity to 1 for all poses
                            }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-[300px] h-[600px] bg-black border-4 border-gray-800 rounded-[3rem] relative shadow-[0_0_50px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center"
                        >
                            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                                {/* Breathing Glow */}
                                <motion.div 
                                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-primary/10"
                                />

                                <Moon 
                                    className={`mb-8 relative z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${isHumanInside ? 'text-primary fill-primary/20 drop-shadow-[0_0_15px_rgba(0,255,136,0.6)]' : 'text-white/20'}`} 
                                    size={48} 
                                    strokeWidth={isHumanInside ? 1.5 : 2}
                                />
                                <p className="text-white/30 text-sm font-mono relative z-10 text-center mt-32">3:42 AM</p>

                                {/* Notification Popup */}
                                <AnimatePresence>
                                    {notification && (
                                        <motion.div 
                                            initial={{ y: -50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -50, opacity: 0 }}
                                            className="absolute top-12 left-4 right-4 bg-gray-800/90 p-4 rounded-xl border border-white/10 flex items-center space-x-3 shadow-lg z-20"
                                        >
                                            <div className="p-2 bg-primary/20 rounded-full">
                                                <Pizza size={16} className="text-primary" />
                                            </div>
                                            <p className="text-xs text-white/90">{notification}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="absolute bottom-12 text-center w-full px-8">
                                    <motion.p 
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="text-white/10 text-xs uppercase tracking-widest"
                                    >
                                        Swipe up to ignore sleep
                                    </motion.p>
                                </div>
                            </div>

                            {/* Human Pose Icon - Draggable outside phone */}
                            <motion.div
                                drag
                                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                                dragElastic={0.2}
                                whileHover={{ scale: 1.1, cursor: "grab" }}
                                whileDrag={{ scale: 1.2, cursor: "grabbing" }}
                                whileTap={{ cursor: "grabbing" }}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                // Spring animation handles the "snap back" automatically when drag is released
                                // because we don't update any state to keep it there
                                initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto"
                            >
                                {/* Remove transform rotation from parent motion.div to fix drag direction */}
                                {/* Instead, rotate the SVG itself if needed */}
                                <div style={{ 
                                    transform: position === 'side' ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.5s ease'
                                }}>
                                    <HumanIcon 
                                        pose={position as 'side' | 'supine' | 'prone'} 
                                        className="w-48 h-48 text-primary/30 pointer-events-none" 
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-6 text-center max-w-xs"
                        >
                            <p className="text-sm text-gray-400 italic">"They cling to me in the darkness, reluctant to surrender the night."</p>
                            <p className="text-xs text-gray-600 mt-1">“他们在黑暗中依恋我，不愿交出夜晚。”</p>
                        </motion.div>

                        <button 
                            onClick={() => setPosition(null)}
                            className="mt-4 text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Change Position
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </ModuleLayout>
  );
};

export default BedtimeRituals;
