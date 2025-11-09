import { useState, useCallback, useRef } from 'react';
import type { SpeedDataPoint } from '../types';
import { TestStatus } from '../types';

// Use Cloudflare's public speed test endpoints for more reliable results.
// A larger file provides a more accurate download speed measurement.
const TEST_URL_BASE = 'https://speed.cloudflare.com/__down?bytes=50000000'; // 50MB

// Durations for each test phase in milliseconds
const DOWNLOAD_DURATION = 10000;
const UPLOAD_DURATION = 8000;
const TOTAL_TEST_DURATION = DOWNLOAD_DURATION + UPLOAD_DURATION;

// Simulation for upload speed since we don't have a server endpoint to upload to.
const generateFluctuatingValue = (base: number, fluctuation: number): number => {
  return Math.max(0, base + (Math.random() - 0.5) * fluctuation);
};

export const useSpeedTest = () => {
  const [status, setStatus] = useState<TestStatus>(TestStatus.IDLE);
  const [speedData, setSpeedData] = useState<SpeedDataPoint[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState({ download: 0, upload: 0, ping: 0 });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const resetTest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
    setStatus(TestStatus.IDLE);
    setSpeedData([]);
    setCurrentSpeed({ download: 0, upload: 0, ping: 0 });
    setProgress(0);
    setError(null);
  }, []);

  const runPingTest = async (signal: AbortSignal) => {
    const pings: number[] = [];
    const pingCount = 3;
    const testUrl = `${TEST_URL_BASE}&_=${Date.now()}`; // Cache-busting

    for (let i = 0; i < pingCount; i++) {
        if (signal.aborted) return;
        const startTime = Date.now();
        await fetch(testUrl, { method: 'HEAD', cache: 'no-cache', signal, mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' });
        pings.push(Date.now() - startTime);
    }
    if (pings.length > 0) {
        const avgPing = pings.reduce((a, b) => a + b, 0) / pings.length;
        setCurrentSpeed(prev => ({ ...prev, ping: Math.round(avgPing) }));
    }
  };

  const runDownloadTest = (signal: AbortSignal) => new Promise<number>(async (resolve, reject) => {
    setStatus(TestStatus.TESTING_DOWNLOAD);
    let receivedLength = 0;
    const startTime = Date.now();
    let lastFinalSpeed = 0;
    
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));

    try {
      const testUrl = `${TEST_URL_BASE}&_=${Date.now()}`; // Cache-busting
      const response = await fetch(testUrl, { signal, mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' });
      if (!response.body) return reject(new Error("No response body"));
      const reader = response.body.getReader();

      while (true) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= DOWNLOAD_DURATION) {
            if (!reader.closed) reader.cancel();
            break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        receivedLength += value.length;
        const speedBps = receivedLength / (elapsedTime / 1000);
        const speedMbps = (speedBps * 8) / 1_000_000;
        lastFinalSpeed = speedMbps;
        
        setCurrentSpeed(prev => ({ ...prev, download: speedMbps }));
        setSpeedData(prevData => [...prevData, { time: prevData.length, download: speedMbps, upload: 0 }]);
      }
      resolve(lastFinalSpeed);
    } catch(e) {
      reject(e);
    }
  });
  
  const runUploadTest = (finalDownloadSpeed: number) => new Promise<void>((resolve, reject) => {
    setStatus(TestStatus.TESTING_UPLOAD);
    const startTime = Date.now();
    
    // This is a simulation.
    const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= UPLOAD_DURATION) {
            clearInterval(interval);
            resolve();
            return;
        }

        const uploadSpeed = generateFluctuatingValue(45, 20);
        setCurrentSpeed(prev => ({ 
            ...prev,
            download: finalDownloadSpeed, 
            upload: uploadSpeed 
        }));
        setSpeedData(prevData => [...prevData, { time: prevData.length, download: 0, upload: uploadSpeed }]);
    }, 250);

    abortControllerRef.current?.signal.addEventListener('abort', () => {
        clearInterval(interval);
        reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  const startTest = useCallback(async () => {
    resetTest();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    let progressInterval: number | undefined;
    try {
      const testStartTime = Date.now();
      progressInterval = window.setInterval(() => {
        const elapsed = Date.now() - testStartTime;
        setProgress(Math.min(100, (elapsed / TOTAL_TEST_DURATION) * 100));
      }, 100);

      signal.addEventListener('abort', () => {
        if (progressInterval) clearInterval(progressInterval);
      });

      // 1. Ping Test (quick, happens before progress starts)
      await runPingTest(signal);

      // 2. Download Test
      const finalDownloadSpeed = await runDownloadTest(signal);

      // 3. Upload Test (Simulated)
      await runUploadTest(finalDownloadSpeed);
      
      setStatus(TestStatus.FINISHED);
      setProgress(100);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Speed test failed:", error);
        setError('Test failed. This can be caused by a network issue, a browser extension (like an ad-blocker), or a firewall. Please check your connection and try again.');
        setStatus(TestStatus.FAILED);
        setProgress(0);
      }
    } finally {
        if (progressInterval) clearInterval(progressInterval);
        abortControllerRef.current = null;
    }
  }, [resetTest]);

  return { status, speedData, currentSpeed, progress, startTest, resetTest, error };
};
