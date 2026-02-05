import { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import SplashScreen from './components/SplashScreen';
import IndiaMap from './components/IndiaMap';
import CityList from './components/CityList';
import StatsPanel from './components/StatsPanel';
import ThemeToggle from './components/ThemeToggle';
import GlassPanel from './components/GlassPanel';
import { useCities } from './hooks/useCities';
import { Radar } from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/17qIOCxerf5C_YHIzUx6n4NFI3IorMJicLGxkAy35LQU/edit?usp=sharing';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [theme, setTheme] = useState<'neon-blue' | 'cyber-purple'>('neon-blue');

  const { cities, loading, error } = useCities(GOOGLE_SHEET_URL);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'neon-blue' | 'cyber-purple' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'neon-blue' ? 'cyber-purple' : 'neon-blue';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const themeColor = theme === 'neon-blue' ? 'cyan' : 'purple';
  const textColor = theme === 'neon-blue' ? 'text-cyan-400' : 'text-purple-400';

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />

      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        <header className="mb-6">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Radar className={`w-8 h-8 ${textColor} animate-pulse`} />
            <h1 className={`text-5xl font-thin tracking-[0.3em] ${textColor} uppercase`}>
              Travel Command
            </h1>
          </div>
          <p className="text-center text-gray-400 font-mono text-sm tracking-wider">
            INDIAN TRAVEL NAVIGATION SYSTEM
          </p>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Radar className={`w-16 h-16 ${textColor} animate-spin mx-auto`} />
              <p className={`${textColor} font-mono text-sm animate-pulse`}>
                LOADING TRAVEL DATA...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <GlassPanel className="p-8" glowColor={themeColor}>
              <p className="text-red-400 font-mono">ERROR: {error}</p>
            </GlassPanel>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
            <div className="lg:col-span-3 space-y-4 overflow-y-auto">
              <StatsPanel citiesCount={cities.length} cities={cities} theme={theme} />
            </div>

            <div className="lg:col-span-6">
              <GlassPanel className="h-full p-4" glowColor={themeColor}>
                <IndiaMap
                  cities={cities}
                  selectedCity={selectedCity}
                  onCityClick={setSelectedCity}
                  theme={theme}
                />
              </GlassPanel>
            </div>

            <div className="lg:col-span-3 overflow-hidden">
              <CityList
                cities={cities}
                onCityClick={setSelectedCity}
                selectedCity={selectedCity}
                theme={theme}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
