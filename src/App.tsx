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

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:h-screen flex flex-col">
        <header className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 mb-2">
            <Radar className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 ${textColor} animate-pulse`} />
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-thin tracking-[0.2em] sm:tracking-[0.25em] lg:tracking-[0.3em] ${textColor} uppercase text-center`}
            >
              Travel Command
            </h1>
          </div>
          <p className="text-center text-gray-400 font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-wider">
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
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:overflow-hidden">
            <div className="lg:col-span-3 space-y-4 lg:overflow-y-auto">
              <StatsPanel citiesCount={cities.length} cities={cities} theme={theme} />
            </div>

            <div className="lg:col-span-6">
              <GlassPanel className="h-[50vh] sm:h-[60vh] lg:h-full p-3 sm:p-4" glowColor={themeColor}>
                <IndiaMap
                  cities={cities}
                  selectedCity={selectedCity}
                  onCityClick={setSelectedCity}
                  theme={theme}
                />
              </GlassPanel>
            </div>

            <div className="lg:col-span-3 lg:overflow-hidden">
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
