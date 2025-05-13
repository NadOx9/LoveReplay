import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Sparkles, Share2, Ban, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateReply } from '../lib/openai';
import { incrementRepliesGenerated, markAsShared } from '../lib/supabase';
import type { ToneOption, User } from '../types';

interface GeneratorProps {
  user: User;
  onRepliesUpdated: () => void;
}

const Generator: React.FC<GeneratorProps> = ({ user, onRepliesUpdated }) => {
  if (user.is_banned) {
    return (
      <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
        <motion.div 
          className="w-full max-w-md mx-auto p-8 bg-red-900/30 border border-red-500/30 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Account Banned</h2>
        </motion.div>
      </div>
    );
  }

  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [tone, setTone] = useState<ToneOption>('Romantic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [canGenerate, setCanGenerate] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(3);

  useEffect(() => {
    const checkLimit = () => {
      if (user.is_premium) {
        setCanGenerate(true);
        return;
      }
      const limit = user.shared_once ? 6 : 3;
      setDailyLimit(limit);
      setCanGenerate(user.replies_generated < limit);
    };
    
    checkLimit();
  }, [user]);

  const handleGenerateReply = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message first');
      return;
    }

    if (!canGenerate) {
      toast.error("You've reached your daily limit");
      return;
    }

    if (user.is_banned) {
      toast.error('Your account has been banned');
      return;
    }

    setIsGenerating(true);
    setReply('');

    try {
      const generatedReply = await generateReply({
        message,
        tone,
      });

      setReply(generatedReply);
      await incrementRepliesGenerated(user.id);
      onRepliesUpdated();
      
      if (!user.is_premium && user.replies_generated + 1 >= dailyLimit) {
        setCanGenerate(false);
      }
    } catch (error) {
      toast.error('Failed to generate reply. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyReply = () => {
    if (!reply) return;
    navigator.clipboard.writeText(reply);
    toast.success('Reply copied to clipboard!');
  };

  const handleShare = async () => {
    if (user.shared_once) {
      toast.error('You have already used your share bonus');
      return;
    }

    try {
      const shareUrl = `${window.location.origin}?ref=${encodeURIComponent(user.email)}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'LoveReply AI - Craft Perfect Message Replies',
          text: 'Generate the perfect reply to any message with AI-powered tone selection. Try it now!',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      }

      await markAsShared(user.id);
      onRepliesUpdated();
      toast.success('Thanks for sharing! 3 bonus replies added');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled the share
        return;
      }
      toast.error('Failed to process share bonus');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 relative min-h-[calc(100vh-12rem)]">
      <div className="space-y-6 pb-24 md:pb-0">
        {user.is_premium && (
          <motion.div 
            className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-xl p-4 border border-amber-500/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <Crown className="text-amber-400 w-6 h-6" />
              <div>
                <h3 className="text-white font-semibold">Premium Account</h3>
                <p className="text-gray-300 text-sm">Unlimited replies & all premium tones</p>
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <label htmlFor="message" className="block text-lg font-medium text-white mb-2">
            Paste the message you received 👇
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter the message you want to reply to..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white h-32 resize-none"
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-lg font-medium text-white mb-2">
            Select your reply tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneOption)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23FFFFFF\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="Romantic">Romantic</option>
            <option value="Cheeky">Cheeky</option>
            <option value="Distant">Distant</option>
            {user.is_premium ? (
              <>
                <option value="Savage">Savage ✨</option>
                <option value="Crazy">Crazy ✨</option>
              </>
            ) : (
              <>
                <option value="Savage" disabled>Savage (Premium Only)</option>
                <option value="Crazy" disabled>Crazy (Premium Only)</option>
              </>
            )}
          </select>
        </div>

        {!user.is_premium && (
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-gray-300 text-sm">
                Daily Replies: <span className="text-white font-bold">{user.replies_generated} / {dailyLimit}</span>
              </p>
              {!canGenerate && (
                <p className="text-red-400 text-xs mt-1">You've reached your daily limit</p>
              )}
            </div>
            {!user.shared_once && (
              <motion.button
                onClick={handleShare}
                className="flex items-center space-x-1 text-sm px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={14} />
                <span>Share for +3</span>
              </motion.button>
            )}
          </div>
        )}

        {reply && (
          <motion.div 
            className={`p-5 rounded-xl shadow-lg relative ${
              user.is_premium 
                ? 'bg-gradient-to-r from-gray-800 to-gray-800/80 border border-amber-500/30' 
                : 'bg-gray-800 border border-gray-700'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button 
              onClick={handleCopyReply}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              aria-label="Copy reply"
            >
              <Copy size={16} />
            </button>
            <h3 className="text-white font-medium mb-2 text-lg">Your {tone} Reply:</h3>
            <p className="text-gray-300 whitespace-pre-line">{reply}</p>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 md:px-0 md:relative md:bottom-auto md:mt-6">
        <motion.button
          onClick={handleGenerateReply}
          className={`w-full max-w-xl mx-auto py-3 px-6 flex items-center justify-center space-x-2 text-white font-medium rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            user.is_premium 
              ? 'bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-600 hover:to-purple-600' 
              : 'bg-gradient-to-r from-pink-600 to-red-500 hover:from-pink-700 hover:to-red-600'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isGenerating || !canGenerate || !message.trim()}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate Reply</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default Generator;