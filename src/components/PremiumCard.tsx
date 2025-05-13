import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Sparkles, MessageCircle, Zap } from 'lucide-react';
import { redirectToCheckout } from '../lib/stripe';
import toast from 'react-hot-toast';

interface PremiumCardProps {
  userId: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ userId }) => {
  const handleUpgrade = async () => {
    try {
      toast.loading('Preparing checkout...');
      await redirectToCheckout(userId);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to start checkout process');
      console.error('Checkout error:', error);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-xl border border-pink-500/30 mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="text-pink-400" size={22} />
          <h2 className="text-2xl font-bold text-white">Go Premium</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Unlock unlimited replies and all tones for just $9.99/month
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <MessageCircle className="text-pink-400 mr-3 mt-0.5" size={18} />
            <div>
              <p className="text-white font-medium">Unlimited Replies</p>
              <p className="text-gray-400 text-sm">Never run out of replies again</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Zap className="text-pink-400 mr-3 mt-0.5" size={18} />
            <div>
              <p className="text-white font-medium">All Premium Tones</p>
              <p className="text-gray-400 text-sm">Access to Savage and Crazy tones</p>
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={handleUpgrade}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-red-500 text-white font-medium rounded-lg flex items-center justify-center space-x-2 shadow-lg hover:from-pink-700 hover:to-red-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard size={18} />
          <span>Upgrade Now - $9.99/month</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PremiumCard;