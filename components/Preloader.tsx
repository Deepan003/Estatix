// components/Preloader.tsx
'use client';

import { motion } from 'framer-motion';
import { Loader } from 'lucide-react'; // Using lucide for a spinner icon

export const Preloader = () => (
  <motion.div
    className="fixed inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 z-[100] flex flex-col items-center justify-center text-white"
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }} // Stays visible until removed by AnimatePresence
    exit={{ opacity: 0 }} // Fades out when removed
    transition={{ duration: 0.5 }} // Fade-out duration
  >
    {/* Animated Logo/Title */}
    <motion.div
      className="text-4xl font-bold mb-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
    >
      EstatiX
    </motion.div>
    {/* Spinning Loader Icon */}
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
    >
        <Loader className="h-8 w-8 animate-spin" />
    </motion.div>
  </motion.div>
);