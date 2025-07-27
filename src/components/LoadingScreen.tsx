import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        const increment = prev < 70 ? 10 : 1;
        return Math.min(prev + increment, 95);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/logo-default.png" 
              alt="FutureLink Logo" 
              className="w-44 h-32 mx-auto"
            />
          </div>
          
          <div className="flex justify-center items-center space-x-2 mb-6">
            <p className="text-gray-500 text-sm font-medium">Loading</p>
            <div className="w-2 h-2 bg-custom-teal rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-custom-teal rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-custom-teal rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>    
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-custom-teal h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-gray-500 text-xs">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;