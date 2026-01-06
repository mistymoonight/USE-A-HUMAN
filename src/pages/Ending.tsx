import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Ending: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);
  const [isSuccess, setIsSuccess] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsSuccess(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    if (isSuccess) return;
    setTimeLeft(5);
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  useEffect(() => {
    startTimer();
    
    const handleActivity = () => resetTimer();
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <AnimatePresence>
          {!isSuccess ? (
              <motion.div 
                  key="training"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="text-center z-10"
              >
                  <h1 className="text-3xl font-bold mb-4 text-primary">I'll Be Here</h1>
                  <p className="text-gray-400 mb-12">手机正在耐心观察</p>
                  
                  <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center relative">
                      <motion.div 
                          key={timeLeft}
                          initial={{ scale: 1.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-6xl font-mono font-bold text-white/20"
                      >
                          {timeLeft}
                      </motion.div>
                      <div className="absolute top-full mt-8 text-xs text-gray-600 uppercase tracking-widest">
                          Do nothing for 5 seconds
                      </div>
                  </div>
              </motion.div>
          ) : (
              <motion.div 
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  className="text-center z-10 max-w-lg"
              >
                  <div className="mb-12">
                      <p className="text-3xl md:text-4xl font-serif italic text-white/90 leading-relaxed">
                          "See? They always come back,<br/>like a well-trained companion."
                      </p>
                      <p className="mt-6 text-lg text-gray-500">
                          “看吧，他们总会回来的，就像训练有素的宠物一样。”
                      </p>
                  </div>

                  <motion.button 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      onClick={() => navigate('/')} 
                      className="mt-16 text-xs text-white/20 hover:text-white/50 transition-colors uppercase tracking-widest"
                  >
                      Restart Training
                  </motion.button>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default Ending;
