import { useState, useRef, useEffect, useMemo } from 'react';
import { City } from '../types';
import { getStatePaths, convertCoordinatesToSvg } from '../utils/mapUtils';
import CityMarker from './CityMarker';

interface IndiaMapProps {
  cities: City[];
  selectedCity: string | null;
  onCityClick: (cityName: string) => void;
  theme: 'neon-blue' | 'cyber-purple';
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 900;

export default function IndiaMap({ cities, selectedCity, onCityClick, theme }: IndiaMapProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const statePaths = useMemo(() => getStatePaths(MAP_WIDTH, MAP_HEIGHT), []);
  const projectedCities = useMemo(
    () =>
      cities.map((city) => {
        const { x, y } = convertCoordinatesToSvg(city.lat, city.lng);
        return { ...city, x, y };
      }),
    [cities],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMobile);
    } else {
      mediaQuery.addListener(updateMobile);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateMobile);
      } else {
        mediaQuery.removeListener(updateMobile);
      }
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const mapColor = theme === 'neon-blue' ? '#06b6d4' : '#a855f7';
  const mapGlow = theme === 'neon-blue' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(168, 85, 247, 0.3)';

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke={mapColor}
                strokeWidth="0.3"
                opacity="0.1"
              />
            </pattern>
          </defs>

          {!isMobile && <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />}

          {statePaths.map((state) => (
            <path
              key={state.id}
              d={state.path}
              fill="rgba(0, 0, 0, 0.6)"
              stroke={mapColor}
              strokeWidth={isMobile ? '0.8' : '1'}
              filter={isMobile ? undefined : 'url(#glow)'}
              className="transition-all duration-300 hover:fill-opacity-80"
            >
              <title>{state.stateName} - {state.districtName}</title>
            </path>
          ))}

          {projectedCities.map((city) => (
            <CityMarker
              key={city.name}
              city={city.name}
              x={city.x}
              y={city.y}
              isSelected={selectedCity === city.name}
              isHovered={hoveredCity === city.name}
              isVisited={city.visited}
              imageLink={city.imageLink}
              onClick={onCityClick}
              onMouseEnter={() => setHoveredCity(city.name)}
              onMouseLeave={() => setHoveredCity(null)}
              theme={theme}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
