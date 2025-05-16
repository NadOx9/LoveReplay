import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Craft Perfect Message Replies with AI
        </h1>
        
        <p className="text-xl text-gray-300 mb-12">
          Never struggle with message responses again. LoveReply AI helps you generate the perfect reply with the right tone, every time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <MessageCircle className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multiple Tones</h3>
            <p className="text-gray-300">Choose from romantic, cheeky, distant, and more tones for the perfect response</p>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-300">Advanced AI technology ensures natural and engaging responses every time</p>
          </motion.div>

          <motion.div
            className="bg-gray-800 rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
            <p className="text-gray-300">Get your perfectly crafted reply in seconds, ready to copy and send</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LandingPage