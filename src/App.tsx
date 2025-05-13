import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { getUserProfile, createUserProfile } from './lib/supabase';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LandingPage from './components/LandingPage';
import AnnouncementBanner from './components/AnnouncementBanner';
import type { AppState, User } from './types';

function App() {
  const [state, setState] = useState<AppState>({
    user: null,
    loading: true,
    session: null,
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionChange = async (session: any) => {
    setState(prev => ({ ...prev, loading: true }));

    if (!session) {
      setState({ user: null, loading: false, session: null });
      return;
    }

    try {
      // Get or create user profile
      let userProfile = await getUserProfile(session.user.id);
      
      if (!userProfile) {
        // New user - create profile
        userProfile = await createUserProfile(
          session.user.id, 
          session.user.email
        );

        if (!userProfile) {
          throw new Error('Failed to create user profile');
        }
      }

      setState({
        user: userProfile,
        loading: false,
        session: session,
      });
    } catch (error) {
      console.error('Error handling session change:', error);
      setState({ user: null, loading: false, session: null });
    }
  };

  const refreshUserData = async () => {
    if (!state.session) return;
    
    try {
      const userProfile = await getUserProfile(state.session.user.id);
      if (userProfile) {
        setState(prev => ({ ...prev, user: userProfile }));
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#ff4e8d',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4e4e',
              secondary: '#fff',
            },
          },
        }}
      />

      <Router>
        {state.loading ? (
          <div className="min-h-screen flex justify-center items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-12 h-12 text-pink-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </motion.div>
          </div>
        ) : (
          <>
            {state.user && (
              <>
                <AnnouncementBanner user={state.user} />
                <Header user={state.user} />
              </>
            )}
            
            <Routes>
              <Route 
                path="/" 
                element={
                  state.user ? (
                    <HomePage user={state.user} onRepliesUpdated={refreshUserData} />
                  ) : showLogin ? (
                    <LoginPage setLoading={(loading) => setState(prev => ({ ...prev, loading }))} />
                  ) : (
                    <div>
                      <LandingPage />
                      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
                        <motion.button
                          onClick={() => setShowLogin(true)}
                          className="bg-gradient-to-r from-pink-600 to-red-500 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:from-pink-700 hover:to-red-600"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Get Started
                        </motion.button>
                      </div>
                    </div>
                  )
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  state.user && state.user.is_admin ? (
                    <AdminPage />
                  ) : (
                    <Navigate to="/" replace />
                  )
                } 
              />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;