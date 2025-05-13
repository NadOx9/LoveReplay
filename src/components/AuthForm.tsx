import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface AuthFormProps {
  setLoading: (loading: boolean) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ setLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      if (isSignUp) {
        toast.success('Account created! Please check your email to confirm your registration.');
      } else {
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center mb-8">
        <motion.div
          className="flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-white">LoveReply AI</h1>
        <p className="text-gray-400 mt-2 text-center">
          {isSignUp 
            ? 'Create an account to start generating perfect replies' 
            : 'Sign in to craft the perfect message replies'}
        </p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        className="bg-gray-900 rounded-xl p-6 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
            placeholder="your@email.com"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white"
            placeholder="••••••••"
          />
        </div>
        <motion.button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-600 to-red-500 text-white font-medium rounded-lg hover:from-pink-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </motion.button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-400 hover:text-pink-300 text-sm focus:outline-none"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AuthForm;