
import React from 'react';

interface HeaderProps {
    provider: string;
    isVpnConnected: boolean;
}

const WifiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.47-5.47 14.384-5.47 19.854 0a1 1 0 01-1.414 1.414zM10 14.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM6.97 11.03a4.5 4.5 0 016.364 0 1 1 0 01-1.414 1.414 2.5 2.5 0 00-3.536 0 1 1 0 01-1.414-1.414z" clipRule="evenodd" />
    </svg>
);

const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 002.5 6h15A11.954 11.954 0 0010 1.944zM8.707 14.293a1 1 0 001.414 0L14 10.414V6H6v4.414l2.707 2.879z" clipRule="evenodd" />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ provider, isVpnConnected }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                Gemini Speed Test
            </h1>
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-light-gray">
                    <WifiIcon className="text-accent" />
                    <span>{provider}</span>
                </div>
                <div className="flex items-center space-x-2 text-light-gray">
                    <ShieldCheckIcon className={isVpnConnected ? 'text-accent' : 'text-medium-gray'} />
                    <span>VPN {isVpnConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
