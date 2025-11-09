
import React from 'react';
import { TestStatus } from '../types';

interface ControlsProps {
    status: TestStatus;
    onStartTest: () => void;
    selectedProvider: string;
    onProviderChange: (provider: string) => void;
    isVpnConnected: boolean;
    onVpnToggle: (isConnected: boolean) => void;
}

const providers = ['Your ISP', 'Comcast Xfinity', 'Verizon Fios', 'AT&T Fiber', 'Spectrum', 'Google Fiber'];

const VPNToggle: React.FC<{ isConnected: boolean; onToggle: (isConnected: boolean) => void }> = ({ isConnected, onToggle }) => (
    <button
        onClick={() => onToggle(!isConnected)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent ${isConnected ? 'bg-accent' : 'bg-dark-gray'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isConnected ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);


const Controls: React.FC<ControlsProps> = ({
    status,
    onStartTest,
    selectedProvider,
    onProviderChange,
    isVpnConnected,
    onVpnToggle,
}) => {
    const isTesting = status === TestStatus.TESTING_DOWNLOAD || status === TestStatus.TESTING_UPLOAD;

    const buttonText = () => {
        switch (status) {
            case TestStatus.TESTING_DOWNLOAD:
            case TestStatus.TESTING_UPLOAD:
                return 'TESTING';
            case TestStatus.FINISHED:
                return 'AGAIN';
            case TestStatus.FAILED:
                return 'RETRY';
            case TestStatus.IDLE:
            default:
                return 'START';
        }
    };

    return (
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                    <select
                        value={selectedProvider}
                        onChange={(e) => onProviderChange(e.target.value)}
                        disabled={isTesting}
                        className="w-full sm:w-48 appearance-none bg-secondary border-2 border-dark-gray text-white rounded-lg py-2 px-4 pr-8 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                    >
                        {providers.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-light-gray">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>

                <div className="flex items-center space-x-3 p-2 bg-secondary rounded-lg">
                    <span className="text-light-gray font-medium">VPN</span>
                    <VPNToggle isConnected={isVpnConnected} onToggle={onVpnToggle} />
                </div>
            </div>
            <div className="w-full md:w-auto flex justify-center">
                <button
                    onClick={onStartTest}
                    disabled={isTesting}
                    className="relative w-48 h-48 rounded-full bg-secondary border-4 border-dark-gray text-white font-black text-3xl transition-all duration-300 ease-in-out
                               hover:border-accent hover:shadow-[0_0_25px_rgba(0,224,198,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-dark-gray disabled:hover:shadow-none
                               flex items-center justify-center group"
                >
                    <span className={`transition-transform duration-300 group-hover:scale-110 ${isTesting ? 'animate-pulse-fast' : ''}`}>
                        {buttonText()}
                    </span>
                </button>
            </div>
             <div className="w-full md:w-auto opacity-0 md:visible" style={{width: '280px'}}>
                {/* This is a spacer to balance the layout with flexbox justify-between on larger screens */}
             </div>
        </div>
    );
};

export default Controls;
