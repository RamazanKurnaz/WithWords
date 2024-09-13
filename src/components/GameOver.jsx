import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const GameOver = ({ score, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Game Over!</h1>
        <p className="text-2xl mb-8 text-gray-700">
          You completed <span className="font-bold text-yellow-500">{score}</span> words in 1 minute!
        </p>
        <Button onClick={onRestart} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
          Play Again
        </Button>
      </motion.div>
    </div>
  );
};

export default GameOver;