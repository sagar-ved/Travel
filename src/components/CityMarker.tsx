interface CityMarkerProps {
  city: string;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  isVisited: boolean;
  imageLink?: string; // Renamed from 'link'
  onClick: (cityName: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  theme: 'neon-blue' | 'cyber-purple';
}

export default function CityMarker({
  city,
  x,
  y,
  isSelected,
  isHovered,
  isVisited,
  imageLink, // Destructure new prop
  onClick,
  onMouseEnter,
  onMouseLeave,
  theme,
}: CityMarkerProps) {
  const colors = {
    'neon-blue': {
      marker: 'bg-cyan-400',
      glow: 'shadow-cyan-400',
      ring: 'ring-cyan-400',
    },
    'cyber-purple': {
      marker: 'bg-purple-400',
      glow: 'shadow-purple-400',
      ring: 'ring-purple-400',
    },
  };

  const themeColors = colors[theme];

  // Define colors for visited vs. unvisited
  const visitedColor = '#EF4444'; // Red
  const unvisitedColor = '#84CC16'; // Green

  const themeColor = theme === 'neon-blue' ? '#06b6d4' : '#a855f7';

  const handleClick = () => {
    onClick(city); // For selecting the city in the UI
    if (imageLink) {
      window.open(imageLink, '_blank'); // Open link in new tab if available
    }
  };

  return (
    <g
      className="cursor-pointer transition-all duration-300"
      onClick={handleClick} // Use the new handleClick
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {(isSelected || isHovered) && (
        <>
          <circle
            cx={x}
            cy={y}
            r="12"
            fill="none"
            stroke={themeColor} // Use theme color
            strokeWidth="2"
            opacity="0.3"
            className="animate-ping"
          />
          <circle
            cx={x}
            cy={y}
            r="8"
            fill="none"
            stroke={themeColor} // Use theme color
            strokeWidth="1"
            opacity="0.5"
          />
        </>
      )}

      <circle
        cx={x}
        cy={y}
        r="4"
        fill={isVisited ? visitedColor : unvisitedColor} // Differentiate by visited status
        className="drop-shadow-lg"
        style={{
          filter: `drop-shadow(0 0 ${isHovered || isSelected ? '8px' : '4px'} ${
            isVisited ? visitedColor : unvisitedColor
          })`,
        }}
      />
      {/* New circle indicator */}
      <circle
        cx={x}
        cy={y}
        r="6" // Slightly larger radius
        fill="none" // No fill, just a stroke
        stroke={isVisited ? visitedColor : unvisitedColor}
        strokeWidth="1.5"
        opacity="0.8"
        className="transition-all duration-300"
      />

      {isHovered && (
        <g>
          <rect
            x={x + 10}
            y={y - 15}
            width={city.length * 8 + 16}
            height="30"
            fill="rgba(0, 0, 0, 0.9)"
            stroke={themeColor} // Use theme color
            strokeWidth="1"
            rx="4"
          />
          <text
            x={x + 18}
            y={y + 4}
            fill={themeColor} // Use theme color
            fontSize="12"
            fontFamily="monospace"
            fontWeight="300"
          >
            {city}
          </text>
        </g>
      )}
    </g>
  );
}
