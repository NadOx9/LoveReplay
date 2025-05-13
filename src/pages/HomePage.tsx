import React from 'react';
import Generator from '../components/Generator';
import PremiumCard from '../components/PremiumCard';
import type { User } from '../types';

interface HomePageProps {
  user: User;
  onRepliesUpdated: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onRepliesUpdated }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Generator user={user} onRepliesUpdated={onRepliesUpdated} />
        </div>
        
        {!user.is_premium && (
          <div className="md:col-span-1">
            <PremiumCard userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;