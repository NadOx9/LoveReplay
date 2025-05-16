import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Sparkles, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <motion.div
        className="text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          Turn Awkward Messages into Perfect Replies 💬
        </h1>

        <p className="text-xl text-gray-300 mb-10">
          LoveReplay uses AI to craft the ideal response to any message – flirty, mysterious, savage, or smooth. Never be left on read again.
        </p>

        <a
          href="/app"
          className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg px-6 py-3 rounded-full shadow-md transition"
        >
          Generate My Reply
        </a>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          <motion.div className="bg-gray-900 rounded-xl p-6" whileHover={{ scale: 1.02 }}>
            <MessageCircle className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Choose Your Tone</h3>
            <p className="text-gray-400">Romantic, funny, cold or savage – tailor your vibe to match any situation.</p>
          </motion.div>

          <motion.div className="bg-gray-900 rounded-xl p-6" whileHover={{ scale: 1.02 }}>
            <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Powered by AI</h3>
            <p className="text-gray-400">Replies crafted by advanced AI trained to charm, intrigue and impress.</p>
          </motion.div>

          <motion.div className="bg-gray-900 rounded-xl p-6" whileHover={{ scale: 1.02 }}>
            <Zap className="w-8 h-8 text-pink-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant & Natural</h3>
            <p className="text-gray-400">Get your perfect message in seconds – smooth and ready to send.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
