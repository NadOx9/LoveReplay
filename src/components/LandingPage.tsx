import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, MessageCircle, Flame, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-6 py-12 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center shadow-xl">
            <Heart className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-4 leading-tight tracking-tight">
          AI Replies That Actually Make Them Want You 💘
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Stop overthinking. Paste any message, choose a tone, and let our AI write the perfect comeback — funny, romantic, savage, or smooth.
        </p>

        <a
          href="/app"
          className="bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg"
        >
          ✨ Try LoveReplay Now
        </a>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <MessageCircle className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Context-Aware Responses</h3>
            <p className="text-gray-400">
              LoveReplay understands the vibe of any message and adapts instantly.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <Sparkles className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Customizable Tones</h3>
            <p className="text-gray-400">
              Romantic? Savage? Dry? Choose the style and let the AI vibe with it.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 rounded-2xl p-6 shadow-lg">
            <Zap className="w-8 h-8 text-pink-400 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Replies in Seconds</h3>
            <p className="text-gray-400">
              Get instant replies ready to copy & paste — no more mental blocks.
            </p>
          </motion.div>
        </div>

        <div className="mt-16 text-gray-500 text-sm">
          Loved by over 10,000 hopeless romantics and savage flirters 💅
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
