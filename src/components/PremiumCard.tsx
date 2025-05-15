import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Sparkles, MessageCircle, Zap } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../lib/stripe-config';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface PremiumCardProps {
  userId: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ userId }) => {
  const handleUpgrade = async () => {
    try {
      const { PREMIUM } = STRIPE_PRODUCTS;

      toast.loading('Retrieving user session...');
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.dismiss();
        toast.error('You must be logged in to subscribe.');
        return;
      }

      toast.success('Session retrieved ✅');
      toast.loading('Creating Stripe checkout session...');

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: PREMIUM.priceId,
          mode: PREMIUM.mode,
          success_url: `${window.location.origin}/?success=true`,
          cancel_url: `${window.location.origin}/?canceled=true`,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      toast.dismiss();

      if (error) {
        console.error('❌ Supabase function error:', error);
        toast.error('Failed to create payment session.');
        return;
      }

      if (!data?.url) {
        console.error('❌ No Stripe URL returned:', data);
        toast.error('No payment URL returned.');
        return;
      }

      toast.success('Redirecting to Stripe...');
      window.location.href = data.url;

    } catch (error: any) {
      toast.dismiss();
      console.error('Checkout error:', error);
      toast.error(`Unexpected error: ${error.message}`);
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
          Stop getting left on read. Start sending replies that actually work.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start">
            <MessageCircle className="text-pink-400 mr-3 mt-0.5" size={18} />
            <div>
              <p className="text-white font-medium">Unlimited AI Replies</p>
              <p className="text-gray-400 text-sm">Never run out of smart answers again.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Zap className="text-pink-400 mr-3 mt-0.5" size={18} />
            <div>
              <p className="text-white font-medium">Savage, Crazy & More</p>
              <p className="text-gray-400 text-sm">Unlock wild tones to stand out instantly.</p>
            </div>
          </div>

          <div className="flex items-start">
            <Sparkles className="text-pink-400 mr-3 mt-0.5" size={18} />
            <div>
              <p className="text-white font-medium">VIP Experience</p>
              <p className="text-gray-400 text-sm">Priority speed + future feature drops.</p>
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
          <span>Go Premium - $9.99/month</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PremiumCard;
