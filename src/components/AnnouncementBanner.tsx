import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { supabase, getLatestAnnouncement, dismissAnnouncement } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Announcement, User } from '../types';

interface AnnouncementBannerProps {
  user?: User | null;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ user }) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const latest = await getLatestAnnouncement();
      if (latest) {
        setAnnouncement(latest);
      }
    };

    fetchAnnouncement();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('announcements_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAnnouncement(payload.new as Announcement);
          } else if (payload.eventType === 'UPDATE' && !(payload.new as Announcement).active) {
            setAnnouncement(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDismiss = async () => {
    if (!announcement) return;
    
    try {
      const success = await dismissAnnouncement(announcement.id);
      if (success) {
        setAnnouncement(null);
        toast.success('Announcement dismissed');
      }
    } catch (error) {
      toast.error('Failed to dismiss announcement');
    }
  };

  if (!announcement) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white py-3 px-4 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Bell className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm md:text-base">{announcement.message}</p>
          </div>
          {user?.is_admin && (
            <button
              onClick={handleDismiss}
              className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Dismiss announcement"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;