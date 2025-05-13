import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllUsers, updateUserAdmin, getVisitCount, createAnnouncement } from '../lib/supabase';
import { Search, Shield, CreditCard, Ban, Users, Crown, Bell, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import type { User } from '../types';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visitCount, setVisitCount] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [isAnnouncementLoading, setIsAnnouncementLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchVisitCount();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    const allUsers = await getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    setIsLoading(false);
  };

  const fetchVisitCount = async () => {
    const count = await getVisitCount();
    setVisitCount(count);
  };

  const handleUserUpdate = async (userId: string, updates: Partial<User>) => {
    const success = await updateUserAdmin(userId, updates);
    if (success) {
      toast.success('User updated successfully');
      fetchUsers();
    } else {
      toast.error('Failed to update user');
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcement.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }

    setIsAnnouncementLoading(true);

    try {
      const success = await createAnnouncement(announcement);
      if (success) {
        toast.success('Announcement sent to all users');
        setAnnouncement('');
      } else {
        throw new Error('Failed to create announcement');
      }
    } catch (error) {
      toast.error('Failed to send announcement');
    } finally {
      setIsAnnouncementLoading(false);
    }
  };

  const premiumUsersCount = users.filter(user => user.is_premium).length;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl shadow-lg p-6 border border-purple-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Total Users</h2>
          </div>
          <p className="text-4xl font-bold text-purple-400">{users.length}</p>
          <p className="text-purple-300/70 mt-1">Active accounts</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 rounded-xl shadow-lg p-6 border border-pink-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Premium Users</h2>
          </div>
          <p className="text-4xl font-bold text-pink-400">{premiumUsersCount}</p>
          <p className="text-pink-300/70 mt-1">Paying subscribers</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl shadow-lg p-6 border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Total Visits</h2>
          </div>
          <p className="text-4xl font-bold text-blue-400">{visitCount}</p>
          <p className="text-blue-300/70 mt-1">App interactions</p>
        </motion.div>
      </div>

      <motion.div 
        className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-xl shadow-lg p-6 mb-6 border border-indigo-500/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Bell className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Announcements</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Enter announcement message..."
            className="flex-1 px-4 py-3 bg-gray-800/50 border border-indigo-500/30 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-indigo-300/50"
          />
          <motion.button
            onClick={handleSendAnnouncement}
            disabled={isAnnouncementLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell className="w-4 h-4" />
            {isAnnouncementLoading ? 'Sending...' : 'Send Announcement'}
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="bg-gradient-to-br from-gray-900 to-gray-800/80 rounded-xl shadow-lg p-6 border border-gray-700/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700/30 rounded-lg">
              <Shield className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/30 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-700/30">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{user.email}</div>
                      <div className="text-sm text-gray-400">
                        Replies: {user.replies_generated}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {user.is_premium && (
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 rounded-full flex items-center gap-1 border border-pink-500/30">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                      {user.is_admin && (
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 rounded-full flex items-center gap-1 border border-blue-500/30">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.is_banned && (
                        <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 rounded-full flex items-center gap-1 border border-red-500/30">
                          <Ban className="w-3 h-3" />
                          Banned
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleUserUpdate(user.id, { is_premium: !user.is_premium })}
                        className={`p-2 rounded-lg ${
                          user.is_premium 
                            ? 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30' 
                            : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={user.is_premium ? 'Remove Premium' : 'Make Premium'}
                      >
                        <CreditCard className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleUserUpdate(user.id, { is_admin: !user.is_admin })}
                        className={`p-2 rounded-lg ${
                          user.is_admin 
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                            : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      >
                        <Shield className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleUserUpdate(user.id, { is_banned: !user.is_banned })}
                        className={`p-2 rounded-lg ${
                          user.is_banned 
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                            : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={user.is_banned ? 'Unban User' : 'Ban User'}
                      >
                        <Ban className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;