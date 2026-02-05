export interface City {
  name: string;
  lat: number;
  lng: number;
  state?: string;
  visited: boolean;
  visitedDate?: string;
  imageLink?: string; // URL for an image of the city
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Theme {
  name: 'neon-blue' | 'cyber-purple';
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}
