import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Heart } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white px-6 py-16 flex flex-col items-center justify-center">
      <motion.div
        className="max-w-4xl w-full text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Icon top */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center shadow-xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title + Description */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          AI That Replies to Your DMs So You Don’t Have To
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12">
          LoveReplay is an AI tool that helps you craft the perfect reply to any message —
          from your crush, ex, or someone who just left you on read.  
          Flirty, romantic, funny, cold, savage — you decide the tone. The AI does the magic.
        </p>

        {/* How it works section */}
        <div className="mt-6 text-left">
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

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          Over 10,000 flirty comebacks generated 💘 Join the movement.Build by NadOx
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
