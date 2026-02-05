import { useEffect, useState } from 'react';
import { Radar } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [scanText, setScanText] = useState('INITIALIZING TRAVEL LOG');

  useEffect(() => {
    const texts = [
      'INITIALIZING TRAVEL LOG',
      'SCANNING COORDINATES',
      'LOADING CITY DATA',
      'RENDERING MAP INTERFACE',
      'SYSTEM READY',
    ];

    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setScanText(texts[textIndex]);
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <Radar className="w-24 h-24 text-cyan-400" />
          </div>
          <Radar className="w-24 h-24 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-thin tracking-[0.3em] text-cyan-400 uppercase">
            Travel Command
          </h1>

          <div className="w-80 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-cyan-300 font-mono text-sm tracking-wider animate-pulse">
            {scanText}
          </p>

          <div className="flex space-x-1 mt-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
