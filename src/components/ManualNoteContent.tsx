import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  content: string;
  subContent: string;
}

interface ManualNoteContentProps {
  steps: Step[];
}

// Animation variants for sliding in from left
const lineVariants = {
  hidden: { opacity: 0, x: -20, clipPath: 'inset(0 100% 0 0)' },
  visible: { 
    opacity: 1, 
    x: 0,
    clipPath: 'inset(0 0% 0 0)',
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] // Custom ease out
    }
  }
};

const StepItem = ({ step, startShowing, onComplete }: { step: Step, startShowing: boolean, onComplete: () => void }) => {
  const [showContent, setShowContent] = useState(false);
  const [showSubContent, setShowSubContent] = useState(false);
  
  // Use a ref for onComplete to avoid restarting effect when parent re-renders
  const onCompleteRef = React.useRef(onComplete);
  
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (startShowing) {
      // Sequence the animations
      const t1 = setTimeout(() => setShowContent(true), 600);
      const t2 = setTimeout(() => setShowSubContent(true), 1200);
      const t3 = setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
      }, 1800); // Signal next step to start

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [startShowing]); // Remove onComplete from dependencies

  if (!startShowing) return null;

  return (
    <div className="space-y-1">
      <motion.strong 
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="block text-primary mb-1"
      >
        {step.title}
      </motion.strong>
      
      {showContent && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        >
          {step.content}
        </motion.div>
      )}
      
      {showSubContent && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="text-gray-500 text-xs mt-1"
        >
          {step.subContent}
        </motion.div>
      )}
    </div>
  );
};

const ManualNoteContent: React.FC<ManualNoteContentProps> = ({ steps }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  return (
    <ul className="list-none space-y-8">
      {steps.map((step, index) => (
        <li key={index} className="min-h-[4rem]">
          <StepItem 
            step={step} 
            startShowing={index <= activeStepIndex} 
            onComplete={() => {
              if (index === activeStepIndex) {
                setActiveStepIndex(i => i + 1);
              }
            }} 
          />
        </li>
      ))}
    </ul>
  );
};

export default ManualNoteContent;
