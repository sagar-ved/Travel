import * as d3 from 'd3-geo';
import indiaGeoJson from '../data/india.json'; // Adjust path if needed

interface GeoFeature {
  type: string;
  properties: {
    district: string;
    dt_code: string;
    st_nm: string; // State name
    st_code: string;
    year: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface GeoJsonData {
  type: string;
  features: GeoFeature[];
}

const geoJsonData: GeoJsonData = indiaGeoJson as GeoJsonData;

// Define projection - using geoMercator as it's common for web maps
// The .fitSize method will scale and translate the projection to fit a given bounding box.
const projection = d3.geoMercator();
const pathGenerator = d3.geoPath().projection(projection);

// Function to initialize the projection and path generator based on desired SVG dimensions
export const initializeMapProjection = (width: number, height: number) => {
  projection.fitSize([width, height], geoJsonData);
  return { projection, pathGenerator };
};

// Function to get all state paths
export const getStatePaths = (width: number, height: number) => {
  initializeMapProjection(width, height); // Ensure projection is fitted
  return geoJsonData.features.map((feature, index) => ({
    id: `${feature.properties.st_nm}-${feature.properties.district}-${index}`,
    stateName: feature.properties.st_nm,
    districtName: feature.properties.district,
    path: pathGenerator(feature as any) || '', // d3.geoPath expects GeoJSON.Feature
  }));
};

// Function to convert lat/lng to SVG x/y coordinates
export const convertCoordinatesToSvg = (lat: number, lng: number) => {
  const [x, y] = projection([lng, lat]) || [0, 0];
  return { x, y };
};
