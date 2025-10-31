import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { User, ApiError } from './types.ts';
import UserProfileCard from './components/UserProfileCard.tsx';
import { KeyIcon, XCircleIcon, EyeIcon, EyeOffIcon, SparklesIcon, RefreshIcon } from './components/icons.tsx';

const API_BASE_URL = 'https://api.lzt.market';

type ProfileState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; user: User }
  | { status: 'error'; message: string };

type AnalysisState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; text: string }
  | { status: 'error'; message: string };

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md'; message?: string }> = ({ size = 'md', message }) => {
    const sizeClasses = size === 'sm' ? 'h-5 w-5' : 'h-10 w-10';
    return (
        <div className="flex flex-col justify-center items-center p-4 text-center animate-fade-in">
            <div className={`animate-spin rounded-full border-b-2 border-cyan-400 ${sizeClasses}`}></div>
            {message && <p className="text-gray-400 text-sm mt-3">{message}</p>}
        </div>
    );
};

const ErrorDisplay: React.FC<{ title: string; message: string }> = ({ title, message }) => (
    <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg w-full flex items-start space-x-3 animate-fade-in">
        <XCircleIcon />
        <div>
            <p className="font-bold">{title}</p>
            <p className="text-sm mt-1">{message}</p>
        </div>
    </div>
);

const App: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [isTokenVisible, setIsTokenVisible] = useState<boolean>(false);
  const [profileState, setProfileState] = useState<ProfileState>({ status: 'idle' });
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });

  const handleVerifyToken = useCallback(async () => {
    if (!token) {
      setProfileState({ status: 'error', message: 'Please enter an API token.' });
      return;
    }

    setProfileState({ status: 'loading' });
    setAnalysisState({ status: 'idle' });

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        const errorData = data as ApiError;
        throw new Error(errorData.errors?.[0] || `HTTP error! Status: ${response.status}`);
      }
      setProfileState({ status: 'success', user: data.user });
    } catch (e: any) {
      setProfileState({ status: 'error', message: e.message || 'An unknown error occurred.' });
      console.error(e);
    }
  }, [token]);
  
  const handleAnalyzeProfile = useCallback(async () => {
    if (profileState.status !== 'success') return;

    setAnalysisState({ status: 'loading' });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a helpful assistant for an online marketplace. Based on the following user profile data in JSON format, provide a brief (2-3 sentences), encouraging analysis of their activity and one actionable tip for them to be more successful. Keep the tone friendly and positive. Do not use markdown formatting.

User Data: ${JSON.stringify(profileState.user, null, 2)}`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });
      setAnalysisState({ status: 'success', text: response.text });
    } catch (e: any) {
      setAnalysisState({ status: 'error', message: e.message || 'Failed to get analysis from AI.' });
      console.error(e);
    }
  }, [profileState]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleVerifyToken();
  };

  const renderProfileContent = () => {
    switch (profileState.status) {
      case 'loading':
        return <LoadingSpinner />;
      case 'error':
        return <ErrorDisplay title="Verification Failed" message={profileState.message} />;
      case 'success':
        return <UserProfileCard user={profileState.user} />;
      case 'idle':
      default:
        return <div className="text-center text-gray-500"><p>Your profile information will appear here.</p></div>;
    }
  };
  
  const renderAnalysisContent = () => {
    if (profileState.status !== 'success') return null;

    return (
        <div className="mt-6 border-t border-white/10 pt-6">
            {(() => {
                switch (analysisState.status) {
                    case 'loading':
                        return <LoadingSpinner size="sm" message="AI is thinking..." />;
                    case 'error':
                        return <ErrorDisplay title="AI Analysis Failed" message={analysisState.message} />;
                    case 'success':
                        return (
                            <div className="bg-black/20 rounded-lg p-4 sm:p-6 w-full animate-fade-in space-y-3">
                                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                                    <SparklesIcon className="h-5 w-5" />
                                    AI Analysis
                                </h3>
                                <p className="text-gray-300 leading-relaxed">{analysisState.text}</p>
                            </div>
                        );
                    case 'idle':
                    default:
                        return (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handleAnalyzeProfile}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 rounded-lg font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <SparklesIcon className="h-5 w-5" />
                                    <span>Analyze with AI</span>
                                </button>
                                <button
                                    onClick={handleVerifyToken}
                                    className="w-full sm:w-auto px-5 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center space-x-2"
                                >
                                    <RefreshIcon className="h-5 w-5" />
                                    <span>Refresh Data</span>
                                </button>
                            </div>
                        );
                }
            })()}
        </div>
    );
};

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 pb-2">
            TEST API LZT
          </h1>
          <p className="mt-2 text-gray-400 max-w-md mx-auto">
            Verify your Lolzteam Market API token and get AI-powered insights.
          </p>
        </header>

        <main className="bg-black/30 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 backdrop-blur-md border border-white/10">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <KeyIcon />
              </span>
              <input
                type={isTokenVisible ? "text" : "password"}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your API Token"
                aria-label="API Token"
                className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setIsTokenVisible(!isTokenVisible)}
                aria-label={isTokenVisible ? "Hide token" : "Show token"}
              >
                {isTokenVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <button
              onClick={handleVerifyToken}
              disabled={profileState.status === 'loading' || !token}
              className="w-full sm:w-auto px-6 py-3 bg-cyan-600 rounded-lg font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-cyan-800/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shrink-0"
            >
              {profileState.status === 'loading' ? (
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
            {renderProfileContent()}
          </div>
            
          {renderAnalysisContent()}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-xs px-4">
            <p>This is an unofficial tool. Your API token is only used to make a direct request to the lzt.market API from your browser and is not stored or transmitted elsewhere.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;