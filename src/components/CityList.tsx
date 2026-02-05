import { useState } from 'react';
import { City } from '../types';
import GlassPanel from './GlassPanel';
import { MapPin, Search, SortAsc } from 'lucide-react';

interface CityListProps {
  cities: City[];
  onCityClick: (cityName: string) => void;
  selectedCity: string | null;
  theme: 'neon-blue' | 'cyber-purple';
}

export default function CityList({ cities, onCityClick, selectedCity, theme }: CityListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredCities = cities
    .filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });

  const themeColor = theme === 'neon-blue' ? 'cyan' : 'purple';
  const textColor = theme === 'neon-blue' ? 'text-cyan-400' : 'text-purple-400';
  const bgColor = theme === 'neon-blue' ? 'bg-cyan-500/10' : 'bg-purple-500/10';
  const borderColor = theme === 'neon-blue' ? 'border-cyan-500/30' : 'border-purple-500/30';

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glowColor={themeColor}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-thin tracking-wider uppercase ${textColor}`}>
          Cities Visited
        </h2>
        <div className={`${textColor} font-mono text-2xl`}>{cities.length}</div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${textColor}`} />
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 bg-black/50 border ${borderColor} rounded ${textColor} placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-${themeColor}-500 font-mono text-sm`}
          />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className={`flex items-center space-x-2 ${textColor} hover:${bgColor} px-3 py-2 rounded border ${borderColor} transition-all text-sm font-mono`}
        >
          <SortAsc className="w-4 h-4" />
          <span>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {filteredCities.map((city, index) => (
          <div
            key={city.name}
            onClick={() => onCityClick(city.name)}
            className={`
              flex items-center space-x-3 p-3 rounded cursor-pointer
              transition-all duration-300 border ${borderColor}
              ${selectedCity === city.name ? bgColor : 'bg-black/20'}
              hover:${bgColor} hover:border-${themeColor}-500/50
              group
            `}
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            <MapPin className={`w-4 h-4 ${textColor} group-hover:animate-pulse`} />
            <div className="flex-1">
              <div className={`font-mono text-sm ${textColor}`}>{city.name}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </GlassPanel>
  );
}
