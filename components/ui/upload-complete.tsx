import React from 'react';
import { motion } from 'framer-motion';

const UploadCompleteAnimation: React.FC = () => {
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { 
        pathLength: { duration: 0.5, delay: 0.5 },
        opacity: { duration: 0.01, delay: 0.5 }
      }
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="6"
        variants={circleVariants}
      />
      <motion.path
        d="M30 50 L45 65 L70 35"
        fill="none"
        stroke="#4CAF50"
        strokeWidth="6"
        variants={checkVariants}
      />
    </motion.svg>
  );
};

export default UploadCompleteAnimation;