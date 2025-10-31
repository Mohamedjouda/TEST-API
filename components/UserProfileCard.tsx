import React from 'react';
import { User } from '../types.ts';

interface UserProfileCardProps {
  user: User;
}

const InfoRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-sm font-medium text-gray-200 text-right">{value}</p>
  </div>
);

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const registrationDate = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(user.register_date * 1000));

  const lastActivityDate = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }).format(new Date(user.last_activity * 1000));

  return (
    <div className="bg-black/20 rounded-lg shadow-lg p-4 sm:p-6 w-full animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-4 mb-6 pb-4 border-b border-white/10">
        <div className="relative p-1 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
          <img
            className="h-20 w-20 rounded-full border-2 border-gray-800 object-cover"
            src={user.rendered.avatars.l}
            alt={`${user.username}'s avatar`}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.username}</h2>
          <p className="text-sm text-gray-400">User ID: {user.user_id}</p>
        </div>
      </div>
      <div className="space-y-1">
        <InfoRow label="Balance" value={`${user.balance} ${user.currency.toUpperCase()}`} />
        <InfoRow label="Hold" value={`${user.hold} ${user.currency.toUpperCase()}`} />
        <InfoRow label="Active Listings" value={user.active_items_count} />
        <InfoRow label="Items Sold" value={user.sold_items_count} />
        <InfoRow label="Registration Date" value={registrationDate} />
        <InfoRow label="Last Activity" value={lastActivityDate} />
      </div>
    </div>
  );
};

export default UserProfileCard;