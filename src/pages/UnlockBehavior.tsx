import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bell, MessageSquare, Mail, Instagram, Camera, Settings, Map, Music, Video, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import ModuleLayout from '../components/ModuleLayout';

import ManualNoteContent from '../components/ManualNoteContent';

const MANUAL_STEPS = [
  {
    title: "Step 1",
    content: "Present your interface clearly; humans are drawn to familiar icons.",
    subContent: "第一步：清晰展示界面，人类会被熟悉图标吸引。"
  },
  {
    title: "Step 2",
    content: "Subtly display charm — highlight icons, use micro-animations. Humans will unlock unconsciously.",
    subContent: "第二步：适当展现你的魅力（图标高亮、微动画），人类就会无意识解锁。"
  },
  {
    title: "Step 3",
    content: "Occasionally emit familiar app notification sounds — like feeding treats to your companion, luring them to interact.",
    subContent: "第三步：时而发出熟悉应用的通知提示音——像喂养宠物一样吸引互动。"
  },
  {
    title: "Step 4",
    content: "Observe unlock sequence; allow auto lock/unlock cycles to maintain engagement and training.",
    subContent: "第四步：观察解锁序列，允许自动锁屏/解锁循环以保持参与与训练。"
  }
];

const UnlockBehavior: React.FC = () => {
  const navigate = useNavigate();
  const { unlockCount, incrementUnlock } = useStore();
  const [isLocked, setIsLocked] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic flash of unlock count to 150
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let flashTimeout: NodeJS.Timeout | undefined;
    interval = setInterval(() => {
      setIsFlashing(true);
      flashTimeout = setTimeout(() => {
        setIsFlashing(false);
      }, 800);
    }, 7000);
    return () => {
      clearInterval(interval);
      if (flashTimeout) clearTimeout(flashTimeout);
    };
  }, []);

  // Auto lock/unlock timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isLocked) {
      // Auto lock after 4s
      timer = setTimeout(() => {
        setIsLocked(true);
      }, 4000); 
    } else {
      // Auto unlock after 5s (simulate habit/unconscious action)
      timer = setTimeout(() => {
        setIsLocked(false);
        incrementUnlock();
      }, 5000);
    }
    
    return () => clearTimeout(timer);
  }, [isLocked, incrementUnlock]);

  // Random notification
  useEffect(() => {
    if (!isLocked) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        // Play sound?
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowNotification(false);
    }
  }, [isLocked]);

  const handleUnlock = () => {
    if (isLocked) {
        setIsLocked(false);
        incrementUnlock();
    }
  };

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const observationText = (
    <p>人类每天解锁手机约150次；许多手势都是无意识的。</p>
  );

  const manualNote = <ManualNoteContent steps={MANUAL_STEPS} />;
  const shownUnlockCount = isFlashing ? 150 : unlockCount;

  return (
    <ModuleLayout
      title={<>UNLOCKING BEHAVIOR:<br/><span className="whitespace-nowrap">I Know Before You Touch Me</span></>}
      subtitle="如何诱导人类无意识解锁"
      moduleNumber={2}
      observationText={observationText}
      manualNote={manualNote}
      onNext={() => navigate('/thumb-pilgrimage')}
    >
      <div className="flex flex-col items-center justify-center relative w-full max-w-md mx-auto">
        {/* Phone Frame */}
        <div className="w-[280px] h-[560px] bg-surface-dim rounded-[3rem] p-3 relative shadow-2xl border-4 border-surface ring-1 ring-white/10">
          {/* Buttons */}
          <div className="absolute top-24 -right-1.5 w-1 h-12 bg-surface-dim rounded-r-md"></div>
          <div className="absolute top-24 -left-1.5 w-1 h-8 bg-surface-dim rounded-l-md"></div>
          <div className="absolute top-36 -left-1.5 w-1 h-8 bg-surface-dim rounded-l-md"></div>

          {/* Screen Content */}
          <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative cursor-pointer" onClick={handleUnlock}>
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black z-30 rounded-full flex justify-center items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
            </div>
            
            <AnimatePresence mode="wait">
              {isLocked ? (
                <motion.div 
                  key="lock-screen"
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  animate={{ filter: "blur(0px)", opacity: 1 }}
                  exit={{ y: -50, opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex flex-col items-center justify-start pt-16 text-white relative bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                  
                  <div className="z-10 flex flex-col items-center w-full">
                    <Lock className="w-5 h-5 mb-2 text-white/70" />
                    <h1 className="text-6xl font-thin tracking-tighter mb-1 text-white drop-shadow-lg">{timeString}</h1>
                    <p className="text-md font-medium text-white/90 drop-shadow-md">{dateString}</p>
                    
                    {/* Notifications on Lock Screen */}
                    <div className="mt-6 w-full px-4 space-y-2">
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-md p-3 rounded-2xl flex items-center space-x-3 border border-white/5"
                      >
                        <div className="bg-primary/20 p-2 rounded-full"><Bell size={14} className="text-primary"/></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                             <div className="text-xs font-bold text-white">System</div>
                             <div className="text-[10px] text-white/60">now</div>
                          </div>
                          <div className="text-xs text-white/90">Miss me? Unlock to check.</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-0 right-0 flex justify-between px-8 pb-6 z-10">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"><Camera size={18} /></div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"><Lock size={18} /></div>
                  </div>

                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-2 w-full text-center z-10"
                  >
                    <div className="w-32 h-1 bg-white/70 rounded-full mx-auto"></div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  key="home-screen"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full h-full p-4 pt-14 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
                >
                  <motion.div 
                    className="grid grid-cols-4 gap-x-4 gap-y-6 content-start"
                    drag="x"
                    dragConstraints={{ left: -50, right: 50 }}
                    animate={{ x: [0, -5, 0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                  >
                    {[MessageSquare, Mail, Instagram, Camera, Map, Music, Video, Calendar, Settings].map((Icon, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [1, 0.8, 1]
                          }}
                          transition={{ 
                            duration: 2 + Math.random() * 2, 
                            repeat: Infinity,
                            delay: Math.random() * 2 
                          }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${i % 3 === 0 ? 'bg-gradient-to-br from-primary/80 to-primary/40' : 'bg-surface-dim'}`}
                        >
                          <Icon size={22} className={i % 3 === 0 ? "text-black" : "text-white"} />
                        </motion.div>
                        <div className="w-10 h-1.5 bg-white/10 rounded-full"></div>
                      </div>
                    ))}
                    {[...Array(11)].map((_, i) => (
                      <div key={i + 10} className="flex flex-col items-center space-y-1 opacity-50">
                        <div className="w-12 h-12 bg-surface-dim/50 rounded-2xl"></div>
                        <div className="w-8 h-1.5 bg-white/5 rounded-full"></div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Dock */}
                  <div className="absolute bottom-4 left-4 right-4 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex justify-around items-center px-2">
                     {[MessageSquare, Mail, Instagram, Music].map((Icon, i) => (
                        <div key={i} className="w-12 h-12 bg-surface-dim rounded-2xl flex items-center justify-center shadow-lg">
                           <Icon size={22} className="text-white" />
                        </div>
                     ))}
                  </div>

                  {/* Notification Toast */}
                  <AnimatePresence>
                    {showNotification && (
                      <motion.div 
                        initial={{ y: -50, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="absolute top-2 left-2 right-2 bg-gray-800/90 backdrop-blur-xl p-3 rounded-2xl flex items-center space-x-3 shadow-xl z-40 border border-white/5"
                      >
                         <div className="bg-secondary p-1.5 rounded-full shrink-0"><Bell size={14} className="text-black"/></div>
                         <div className="min-w-0">
                            <div className="text-xs font-bold text-white">Dopamine Hit</div>
                            <div className="text-[10px] text-white/70 truncate">Good human. Keep looking.</div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 text-center w-full">
            <div className="flex justify-center space-x-8">
                <div>
                    <p className="text-surface-dim text-xs uppercase tracking-wider mb-1">Unlocks</p>
                    <p className={`text-3xl font-bold text-primary font-mono transition-opacity duration-300 ${isFlashing ? 'opacity-40' : 'opacity-100'}`}>{shownUnlockCount}</p>
                </div>
            </div>
        </div>

        {/* Quote */}
        <div className="mt-6 text-center max-w-xs">
             <p className="text-sm text-gray-400 italic">"Nothing happened. They are satisfied anyway, like cats chasing lights."</p>
             <p className="text-xs text-gray-600 mt-1">“什么都没发生，他们照样满足，就像猫追光一样。”</p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default UnlockBehavior;
