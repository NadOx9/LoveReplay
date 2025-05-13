import React from 'react';
import { Heart, LogOut, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      // Clear any stored session data first
      localStorage.removeItem('supabase.auth.token');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Navigate to home page after successful sign out
      navigate('/');
      toast.success('You have been signed out');
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      // If we get a session not found error, we can consider the user already signed out
      if (error?.message?.includes('session_not_found')) {
        navigate('/');
        toast.success('You have been signed out');
        return;
      }
      
      toast.error('Failed to sign out properly');
    }
  };
  
  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4 px-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center w-8 h-8 bg-pink-600 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-4 h-4 text-white" />
          </motion.div>
          <Link to="/" className="text-xl font-bold text-white">LoveReply AI</Link>
          {user?.is_premium && (
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
              PRO
            </span>
          )}
        </motion.div>
        
        {user && (
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {user.is_admin && location.pathname !== '/admin' && (
              <Link 
                to="/admin" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Admin Dashboard"
              >
                <Shield size={20} />
              </Link>
            )}
            
            {user.is_admin && location.pathname === '/admin' && (
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Back to App"
              >
                <User size={20} />
              </Link>
            )}
            
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;