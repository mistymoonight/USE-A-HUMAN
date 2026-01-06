import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModuleLayoutProps {
  title: React.ReactNode;
  subtitle: string;
  moduleNumber: number;
  observationText: React.ReactNode;
  manualNote: React.ReactNode;
  children: React.ReactNode;
  onNext: () => void;
  className?: string;
  nextLabel?: string;
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  subtitle,
  moduleNumber,
  observationText,
  manualNote,
  children,
  onNext,
  className = "bg-background",
  nextLabel = "NEXT MODULE"
}) => {
  const [showIntro, setShowIntro] = useState(true);

  // Helper to extract string from ReactNode title for the header
  const getHeaderTitle = (titleNode: React.ReactNode): string => {
    if (typeof titleNode === 'string') {
        return titleNode.split(':')[0].toUpperCase();
    }
    // If it's a complex node (fragment with br), try to extract the first part
    // This is a simple approximation for our specific use case
    // In a real app, we might want a separate prop for the header title
    try {
        if (React.isValidElement(titleNode)) {
             // For fragments <>{...}</>
             if (titleNode.props && titleNode.props.children) {
                 const children = React.Children.toArray(titleNode.props.children);
                 if (children.length > 0 && typeof children[0] === 'string') {
                     return children[0].split(':')[0].toUpperCase();
                 }
             }
        }
    } catch (e) {
        return `MODULE ${moduleNumber}`;
    }
    return `MODULE ${moduleNumber}`;
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col relative text-white font-sans ${className}`}>
      {/* Header - Always visible or only in interaction mode? Let's keep it visible but maybe dim in intro */}
      <div className="absolute top-0 left-0 right-0 p-6 z-40 flex justify-between items-center pointer-events-none">
        <h2 className="text-primary font-mono text-sm md:text-base tracking-wider opacity-80">
            MODULE {moduleNumber} | {getHeaderTitle(title)}
        </h2>
        <div className="text-xs text-gray-500 font-mono">{moduleNumber}/5</div>
      </div>

      {/* Intro Overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            onClick={() => setShowIntro(false)}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-8 cursor-pointer text-center"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary leading-tight">{title}</h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-12 font-serif">{subtitle}</p>
              
              <div className="border-l-2 border-primary/50 pl-6 text-left mb-16">
                <h3 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">Observation / 观察</h3>
                <div className="text-lg md:text-xl leading-relaxed text-gray-200 whitespace-pre-line">
                  {observationText}
                </div>
              </div>

              <motion.p 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm text-gray-500 font-mono uppercase tracking-widest"
              >
                Click anywhere to interact
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex h-full pt-20 pb-6 px-6 gap-8">
        
        {/* Left Side: Manual Note */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: showIntro ? 0 : 1, x: showIntro ? -50 : 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex w-1/3 flex-col justify-center border-r border-white/5 pr-8"
        >
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-primary uppercase tracking-widest mb-2 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Manual Note / 教程式指南
            </h3>
            <div className="space-y-6 text-sm md:text-base text-gray-400 leading-relaxed">
              {!showIntro && manualNote}
            </div>
          </div>
        </motion.div>

        {/* Right/Center Side: Interactive Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.95 : 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex-1 relative flex flex-col items-center justify-center min-w-0"
        >
          {children}
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
         transition={{ delay: 0.5 }}
         className="absolute bottom-6 right-6 z-40"
      >
        <button 
            onClick={onNext} 
            className="flex items-center space-x-2 text-primary hover:text-white transition-colors group px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 hover:border-primary/30"
        >
            <span className="font-mono text-sm tracking-widest">{nextLabel}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </motion.div>
    </div>
  );
};

export default ModuleLayout;
