import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Flame } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-16 flex flex-col items-center justify-center">
      <motion.div
        className="max-w-4xl w-full text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          AI That Replies to Your DMs So You Don’t Have To
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10">
          LoveReplay is an AI tool that helps you craft the perfect reply to any message —
          from your crush, ex, or someone who just left you on read.  
          Flirty, romantic, funny, cold, savage — you decide the tone. The AI does the magic.
        </p>

        <a
          href="/app"
          className="bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg"
        >
          💌 Generate Your Reply
        </a>

        <div className="mt-20 text-left">
          <h2 className="text-2xl font-semibold text-white text-center mb-10">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <MessageCircle className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">1. Paste Their Message</h3>
              <p className="text-gray-400">Drop the message you received — it could be dry, weird, or full of mixed signals.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <Sparkles className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">2. Choose the Vibe</h3>
              <p className="text-gray-400">Select a tone: romantic, savage, mysterious, cute, sarcastic... you name it.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <Zap className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">3. Copy & Send</h3>
              <p className="text-gray-400">Your reply is crafted instantly by AI — natural, spicy, and ready to impress.</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          Over 10,000 flirty comebacks generated 💘 Join the movement. Build by NadOx
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
