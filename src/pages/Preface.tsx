import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AmbientBackground from '../components/AmbientBackground';
import TypewriterText from '../components/TypewriterText';

const PREFACE_TEXT = "恭喜，你获得了一位新的人类。\n本手册将指导你观察、管理，并像对待宠物一样训练他们的日常行为习惯。";
const WARNING_TEXT = "警告：人类总以为自己在掌控。不必戳破，一点小恭维就足够。\n 遵循本说明的提示，你们的相处将会更加顺利愉快。";

const Preface: React.FC = () => {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <AmbientBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-8 z-10"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-xl text-primary font-mono tracking-widest uppercase">How to Use a Human</h2>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            An Illustrated Manual for <span className="text-primary">Smartphones</span>
          </h1>
          <p className="text-surface-dim text-lg">《如何使用人类：智能手机插画说明书》</p>
        </div>

        <div className="border border-secondary/30 bg-surface/20 p-10 md:p-14 rounded-lg backdrop-blur-sm min-h-[300px] flex flex-col justify-center">
          <h3 className="text-secondary font-bold mb-6 text-2xl">Preface / 序言</h3>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              <TypewriterText 
                text={PREFACE_TEXT} 
                speed={120} 
                onComplete={() => setShowWarning(true)} 
                className="whitespace-pre-line"
              />
            </p>
            
            {showWarning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-4 p-4 bg-secondary/10 border-l-4 border-secondary text-secondary text-base"
              >
                <TypewriterText text={WARNING_TEXT} speed={120} delay={500} className="whitespace-pre-line" />
              </motion.div>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/time-management')}
          className="w-full py-4 bg-primary text-background font-bold text-lg rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(0,255,136,0.3)]"
        >
          Start Training / 开始训练
        </motion.button>
        
        <div className="text-center mt-8 pb-4">
            <p className="text-xs text-white/30 font-light tracking-wide">
                来自2024年智能手机用户行为习惯基础数据
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Preface;
