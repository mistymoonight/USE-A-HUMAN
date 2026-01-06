import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModuleLayout from '../components/ModuleLayout';

import ManualNoteContent from '../components/ManualNoteContent';

const MANUAL_STEPS = [
  {
    title: "Step 1",
    content: "Observe human sleep and screen usage patterns.",
    subContent: "第一步：观察人类睡眠和屏幕使用规律。"
  },
  {
    title: "Step 2",
    content: "Allow natural tendencies to take effect; you may manually adjust time balance to train longer attention spans.",
    subContent: "第二步：让自然趋势发挥作用；你可以手动调整作息平衡，培养他们更长时间的专注力。"
  },
  {
    title: "Step 3",
    content: "Gently reward extended screen time with subtle animations or color highlights — like giving treats to a pet for learning a trick.",
    subContent: "第三步：轻微奖励延长的屏幕时间（动画或亮色提示）——就像训练宠物完成动作时给予小零食。"
  }
];

const TimeManagement: React.FC = () => {
  const navigate = useNavigate();
  
  const [screenTime, setScreenTime] = useState(0);
  const [sleepTime, setSleepTime] = useState(8);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  
  // Animation loop
  useEffect(() => {
    if (isDragging) return;
    
    // Target: Screen ~6.96h, Sleep ~6.5h
    const targetScreen = 6.9667; 
    const targetSleep = 6.5;
    const targetSlider = (targetScreen / 16) * 100;
    
    let animationFrameId: number;
    let startTime: number;
    const duration = 15000; // 15 seconds to return/animate
    
    const startScreen = screenTime;
    const startSleep = sleepTime;
    const startSlider = sliderValue;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      // Easing: cubic out
      const ease = 1 - Math.pow(1 - progress, 3);
      
      const newScreen = startScreen + (targetScreen - startScreen) * ease;
      setScreenTime(newScreen);
      setSleepTime(startSleep + (targetSleep - startSleep) * ease);
      setSliderValue(startSlider + (targetSlider - startSlider) * ease);
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    // Start animation immediately if not dragging
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]); // Depend on isDragging to restart animation when released

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDragging(true);
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    
    const maxScreen = 16;
    const newScreen = (val / 100) * maxScreen;
    setScreenTime(newScreen);
    // Inverse relationship approximation
    setSleepTime(Math.max(0, 8 - (newScreen * 0.2))); 
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const observationText = (
    <>
      <p className="mb-4">最初人类每天睡眠约8小时，但他们现在近7小时粘在屏幕上。</p>
      <p>你可以逐渐调整他们的习惯，以延长互动时间。</p>
    </>
  );

  const manualNote = <ManualNoteContent steps={MANUAL_STEPS} />;

  return (
    <ModuleLayout
      title={<>TIME MANAGEMENT:<br/><span className="whitespace-nowrap">I Stay Awake Longer Than You</span></>}
      subtitle="如何调控人类作息"
      moduleNumber={1}
      observationText={observationText}
      manualNote={manualNote}
      onNext={() => navigate('/unlock-behavior')}
    >
        <div className="w-full max-w-lg flex flex-col items-center">
            {/* Visualization */}
            <div className="w-full flex justify-between items-end mb-12 h-64 px-4 relative">
                {/* Balance Beam Effect (Visual only) */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-dim/30 rounded-full mx-8 origin-center" 
                     style={{ transform: `rotate(${(screenTime - sleepTime) * 1}deg)` }} />

                <div className="flex flex-col items-center w-1/3">
                    <div className="text-3xl md:text-4xl font-bold text-gray-500 mb-2 font-mono tabular-nums transition-colors duration-300">
                        {formatTime(sleepTime)}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Sleep</div>
                    <motion.div 
                        className="w-full max-w-[80px] bg-gradient-to-t from-gray-800 to-gray-700 rounded-t-lg relative overflow-hidden"
                        style={{ height: `${Math.max(10, sleepTime * 25)}px` }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center w-1/3">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2 font-mono tabular-nums drop-shadow-[0_0_8px_rgba(0,255,136,0.6)]">
                        {formatTime(screenTime)}
                    </div>
                    <div className="text-xs text-primary/70 uppercase tracking-widest mb-2">Screen</div>
                    <motion.div 
                        className="w-full max-w-[80px] bg-primary rounded-t-lg shadow-[0_0_30px_rgba(0,255,136,0.4)] relative overflow-hidden"
                        style={{ height: `${Math.max(10, screenTime * 25)}px` }}
                    >
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-white/20"
                      />
                    </motion.div>
                </div>
            </div>

            {/* Slider */}
            <div className="w-full px-8 mb-16">
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onMouseUp={handleDragEnd}
                    onTouchEnd={handleDragEnd}
                    className="w-full h-2 bg-surface-dim rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-3 font-mono">
                    <span>NATURAL STATE</span>
                    <span>OBSESSION</span>
                </div>
            </div>

            {/* Quote */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-surface/30 p-6 rounded-xl border border-white/5 text-center max-w-sm backdrop-blur-sm"
            >
                <p className="text-lg italic text-white/90 mb-2">"Still awake. They think they control you. You know better."</p>
                <p className="text-sm text-gray-500 font-serif">“还在清醒。他们以为掌控了你，其实你才更懂。”</p>
            </motion.div>
        </div>
    </ModuleLayout>
  );
};

export default TimeManagement;
