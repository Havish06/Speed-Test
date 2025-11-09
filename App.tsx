
import React, { useState, useCallback } from 'react';
import { useSpeedTest } from './hooks/useSpeedTest';
import { TestStatus } from './types';
import SpeedDisplay from './components/SpeedDisplay';
import SpeedChart from './components/SpeedChart';
import Controls from './components/Controls';
import Header from './components/Header';

const App: React.FC = () => {
  const { status, speedData, currentSpeed, progress, startTest, resetTest, error } = useSpeedTest();
  const [provider, setProvider] = useState<string>('Your ISP');
  const [isVpnConnected, setIsVpnConnected] = useState<boolean>(false);

  const handleStartTest = useCallback(() => {
    if (status === TestStatus.IDLE || status === TestStatus.FINISHED || status === TestStatus.FAILED) {
      resetTest();
      startTest();
    }
  }, [status, startTest, resetTest]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      <div className="w-full max-w-5xl mx-auto">
        <Header provider={provider} isVpnConnected={isVpnConnected} />

        <main className="mt-8">
          <div className="relative p-8 bg-secondary rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/10 via-transparent to-transparent animate-gradient bg-[length:200%_200%]"></div>
            
            <SpeedDisplay 
              download={currentSpeed.download} 
              upload={currentSpeed.upload} 
              ping={currentSpeed.ping} 
              status={status} 
            />
            
            <div className="relative mt-8 h-64 sm:h-72 lg:h-80">
                <SpeedChart data={speedData} status={status} />
                {status === TestStatus.FAILED && (
                  <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-bold text-white">Connection Error</h3>
                    <p className="mt-1 text-light-gray max-w-sm">{error}</p>
                  </div>
                )}
            </div>

             {(status === TestStatus.TESTING_DOWNLOAD || status === TestStatus.TESTING_UPLOAD) && (
              <div className="w-full bg-dark-gray rounded-full h-2.5 mt-8 overflow-hidden">
                <div 
                  className="bg-accent h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
          
          <Controls
            status={status}
            onStartTest={handleStartTest}
            selectedProvider={provider}
            onProviderChange={setProvider}
            isVpnConnected={isVpnConnected}
            onVpnToggle={setIsVpnConnected}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
