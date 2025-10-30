
import React, { useState, useCallback } from 'react';
import { User, ApiError } from './types';
import UserProfileCard from './components/UserProfileCard';
import { KeyIcon, XCircleIcon } from './components/icons';

const API_BASE_URL = 'https://api.lzt.market';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400"></div>
  </div>
);

const App: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerifyToken = useCallback(async () => {
    if (!token) {
      setError('Please enter an API token.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUserData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.errors?.[0] || `HTTP error! Status: ${response.status}`);
      }
      
      setUserData(data.user);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred. Check the console for more details.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleVerifyToken();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            TEST API LZT
          </h1>
          <p className="mt-2 text-slate-400">
            Verify your Lolzteam Market API token by fetching your profile.
          </p>
        </header>

        <main className="bg-slate-800/30 rounded-xl shadow-2xl p-6 md:p-8 backdrop-blur-md border border-slate-700">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeyIcon />
              </span>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your API Token"
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200"
              />
            </div>
            <button
              onClick={handleVerifyToken}
              disabled={isLoading || !token}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 rounded-lg font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-indigo-800/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Token</span>
              )}
            </button>
          </div>

          <div className="mt-6 min-h-[250px] flex items-center justify-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg w-full flex items-start space-x-3 animate-fade-in">
                <XCircleIcon />
                <div>
                  <p className="font-bold">Verification Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : userData ? (
              <UserProfileCard user={userData} />
            ) : (
              <div className="text-center text-slate-500">
                <p>Your profile information will appear here upon successful verification.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-xs">
            <p>This is an unofficial tool. Your API token is only used to make a direct request to the lzt.market API from your browser and is not stored or transmitted elsewhere.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
