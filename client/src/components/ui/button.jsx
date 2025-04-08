// src/components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ icon, label, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-full py-6 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 hover:shadow-2xl focus:outline-none ${className}`}
    >
      <div className="flex items-center justify-center space-x-4">
        <span className="text-3xl">{icon}</span>
        <span>{label}</span>
      </div>
    </motion.button>
  );
};

export default Button;
