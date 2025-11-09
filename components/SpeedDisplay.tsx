
import React from 'react';
import type { TestStatus } from '../types';
import { TestStatus as TestStatusEnum } from '../types';

interface SpeedDisplayProps {
    download: number;
    upload: number;
    ping: number;
    status: TestStatus;
}

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

const PingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: string; unit: string; isActive: boolean }> = ({ icon, label, value, unit, isActive }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-4 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
            <div className={`flex items-center space-x-2 text-light-gray ${isActive ? 'text-accent' : ''}`}>
                {icon}
                <span className="text-lg font-medium">{label}</span>
            </div>
            <div className="flex items-baseline mt-1">
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                    {value}
                </span>
                <span className="text-xl font-bold text-medium-gray ml-2">{unit}</span>
            </div>
        </div>
    );
};

const SpeedDisplay: React.FC<SpeedDisplayProps> = ({ download, upload, ping, status }) => {
    const isTestingDownload = status === TestStatusEnum.TESTING_DOWNLOAD;
    const isTestingUpload = status === TestStatusEnum.TESTING_UPLOAD;
    const isFinished = status === TestStatusEnum.FINISHED;
    const isTesting = isTestingDownload || isTestingUpload;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-dark-gray">
            <Metric
                icon={<PingIcon />}
                label="Ping"
                value={ping > 0 ? ping.toFixed(0) : '...'}
                unit="ms"
                isActive={isTesting || isFinished}
            />
            <Metric
                icon={<DownloadIcon />}
                label="Download"
                value={download > 0 ? download.toFixed(2) : '0.00'}
                unit="Mbps"
                isActive={isTestingDownload || isFinished || isTestingUpload}
            />
            <Metric
                icon={<UploadIcon />}
                label="Upload"
                value={upload > 0 ? upload.toFixed(2) : '0.00'}
                unit="Mbps"
                isActive={isTestingUpload || isFinished}
            />
        </div>
    );
};

export default SpeedDisplay;
