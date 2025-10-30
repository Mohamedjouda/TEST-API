
import React from 'react';
import { User } from '../types';

interface UserProfileCardProps {
  user: User;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-b-0">
    <p className="text-sm text-slate-400">{label}</p>
    <p className="text-sm font-medium text-slate-200 text-right">{value}</p>
  </div>
);

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm p-6 w-full animate-fade-in">
      <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-slate-700/50">
        <img
          className="h-16 w-16 rounded-full border-2 border-indigo-500 object-cover"
          src={user.rendered.avatars.l}
          alt={`${user.username}'s avatar`}
        />
        <div>
          <h2 className="text-xl font-bold text-white">{user.username}</h2>
          <p className="text-sm text-slate-400">User ID: {user.user_id}</p>
        </div>
      </div>
      <div className="space-y-1">
        <InfoRow label="Balance" value={`${user.balance} ${user.currency.toUpperCase()}`} />
        <InfoRow label="Hold" value={`${user.hold} ${user.currency.toUpperCase()}`} />
        <InfoRow label="Active Listings" value={user.active_items_count} />
        <InfoRow label="Items Sold" value={user.sold_items_count} />
        <InfoRow label="Registration Date" value={new Date(user.register_date * 1000).toLocaleDateString()} />
        <InfoRow label="Last Activity" value={new Date(user.last_activity * 1000).toLocaleString()} />
      </div>
    </div>
  );
};

export default UserProfileCard;
