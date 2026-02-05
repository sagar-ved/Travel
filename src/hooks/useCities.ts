import { useEffect, useState } from 'react';
import { City } from '../types';
import { fetchCitiesFromGoogleSheet } from '../utils/googleSheets';

export function useCities(sheetUrl: string) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCities() {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading cities from Google Sheet...');

        const sheetData = await fetchCitiesFromGoogleSheet(sheetUrl);

        const mappedCities: City[] = sheetData.map((sheetCity) => ({
          name: sheetCity.name,
          lat: sheetCity.lat,
          lng: sheetCity.lng,
          visited: sheetCity.visited,
          imageLink: sheetCity.imageLink,
        }));

        console.log(`Successfully loaded ${mappedCities.length} cities`);
        setCities(mappedCities);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load cities from Google Sheet';
        setError(errorMessage);
        console.error('Error loading cities:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCities();
  }, [sheetUrl]);

  return { cities, loading, error };
}
