import React from 'react';
import type { SpeedDataPoint } from '../types';
import { TestStatus } from '../types';

interface SpeedChartProps {
    data: SpeedDataPoint[];
    status: TestStatus;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const download = payload.find((p: any) => p.dataKey === 'download');
    const upload = payload.find((p: any) => p.dataKey === 'upload');
    
    return (
      <div className="bg-dark-gray/80 backdrop-blur-sm p-3 rounded-lg border border-medium-gray shadow-lg">
        {download && download.value > 0 && <p className="text-accent">{`Download: ${download.value.toFixed(2)} Mbps`}</p>}
        {upload && upload.value > 0 && <p className="text-yellow-400">{`Upload: ${upload.value.toFixed(2)} Mbps`}</p>}
      </div>
    );
  }
  return null;
};

const SpeedChart: React.FC<SpeedChartProps> = ({ data, status }) => {
    const Recharts = (window as any).Recharts;

    if (!Recharts) {
        return <div className="flex items-center justify-center h-full text-light-gray">Loading Chart...</div>;
    }

    const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } = Recharts;
    const showChart = status !== TestStatus.IDLE;

    return (
        <div className={`transition-opacity duration-500 w-full h-full ${showChart ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2C33" />
                    <XAxis 
                        dataKey="time" 
                        tick={false} 
                        axisLine={false}
                        label={{ value: 'Time', position: 'insideBottomRight', offset: -5, fill: '#4B5563' }}
                    />
                    <YAxis 
                        stroke="#4B5563"
                        axisLine={false}
                        tick={{ fill: '#9CA3AF' }} 
                        unit=" Mbps"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                    <Line 
                        type="monotone" 
                        dataKey="download" 
                        stroke="#00E0C6" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6, fill: '#00E0C6', stroke: '#1A1B20', strokeWidth: 2 }}
                        name="Download"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="upload" 
                        stroke="#FFD700" 
                        strokeWidth={3} 
                        dot={false}
                        activeDot={{ r: 6, fill: '#FFD700', stroke: '#1A1B20', strokeWidth: 2 }}
                        name="Upload"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SpeedChart;