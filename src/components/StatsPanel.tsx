import { useEffect, useState } from 'react';
import GlassPanel from './GlassPanel';
import { MapPin, Globe, TrendingUp, Download } from 'lucide-react';

interface StatsPanelProps {
  citiesCount: number;
  cities: { name: string; visited: boolean }[];
  theme: 'neon-blue' | 'cyber-purple';
}

export default function StatsPanel({ citiesCount, cities, theme }: StatsPanelProps) {
  const [animatedCount, setAnimatedCount] = useState(0);

  // Calculate visited and remaining cities
  const visitedCount = cities.filter(city => city.visited).length;
  const remainingCount = citiesCount - visitedCount;

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = visitedCount / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= visitedCount) {
        setAnimatedCount(visitedCount);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [visitedCount]);

  const totalIndianCities = 200;
  const progressPercentage = Math.min((visitedCount / totalIndianCities) * 100, 100);

  const themeColor = theme === 'neon-blue' ? 'cyan' : 'purple';
  const textColor = theme === 'neon-blue' ? 'text-cyan-400' : 'text-purple-400';
  const bgGradient =
    theme === 'neon-blue' ? 'from-cyan-500 to-blue-500' : 'from-purple-500 to-pink-500';

  const handleExport = () => {
    const data = JSON.stringify(cities, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel-history.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <GlassPanel className="p-6" glowColor={themeColor}>
      <div className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-thin ${textColor} mb-2 tabular-nums`}>
            {animatedCount}
          </div>
          <div className="text-sm text-gray-400 font-mono tracking-wider uppercase">
            Cities Visited
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 font-mono">India Explored</span>
            <span className={`${textColor} font-mono font-bold`}>
              {progressPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${bgGradient} transition-all duration-1000 ease-out`}
              style={{
                width: `${progressPercentage}%`,
                boxShadow: `0 0 10px ${theme === 'neon-blue' ? '#06b6d4' : '#a855f7'}`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-black/30 rounded border border-gray-700">
            <MapPin className={`w-5 h-5 ${textColor}`} />
            <div>
              <div className={`text-2xl font-thin ${textColor}`}>{citiesCount}</div>
              <div className="text-xs text-gray-400 font-mono">Total Cities</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-black/30 rounded border border-gray-700">
            <TrendingUp className={`w-5 h-5 ${textColor}`} />
            <div>
              <div className={`text-2xl font-thin ${textColor}`}>
                {remainingCount}
              </div>
              <div className="text-xs text-gray-400 font-mono">Remaining</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleExport}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded border ${
            theme === 'neon-blue' ? 'border-cyan-500/30' : 'border-purple-500/30'
          } ${textColor} hover:bg-${themeColor}-500/10 transition-all font-mono text-sm`}
        >
          <Download className="w-4 h-4" />
          <span>Export Travel Log</span>
        </button>
      </div>
    </GlassPanel>
  );
}
