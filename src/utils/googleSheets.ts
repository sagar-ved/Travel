export async function fetchCitiesFromGoogleSheet(
  sheetUrl: string
): Promise<{ name: string; visited: boolean; lat: number; lng: number; imageLink?: string }[]> { // lat and lng are now required
  try {
    const sheetId = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];

    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL');
    }

    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    console.log('Fetching cities from:', csvUrl);

    // Add timeout to prevent infinite loading
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(csvUrl, { signal: controller.signal });
    clearTimeout(timeoutId); // Clear timeout on successful fetch

    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }

    const csvText = await response.text();
    console.log('CSV data fetched, parsing...');
    const lines = csvText.split('\n').filter((line) => line.trim());

    const citiesData: { name: string; visited: boolean; lat: number; lng: number; imageLink?: string }[] = [];

    // Assuming first line is header, start from the second line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const parts = line.split(',');
        const name = (parts[0] || '').replace(/"/g, '').trim();
        const latText = (parts[1] || '').replace(/"/g, '').trim();
        const lngText = (parts[2] || '').replace(/"/g, '').trim();
        // parts[3] is state, parts[4] is visited status
        const visitedText = (parts[4] || '').replace(/"/g, '').trim();
        const imageLink = (parts[5] || '').replace(/"/g, '').trim();

        if (name) {
          const visited = visitedText.toLowerCase() === 'true' || visitedText.toLowerCase() === 'yes';

          let lat: number;
          let lng: number;
          let isValidCoords = false;

          const parsedLat = parseFloat(latText);
          const parsedLng = parseFloat(lngText);

          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            lat = parsedLat;
            lng = parsedLng;
            isValidCoords = true;
          }

          if (!isValidCoords) {
            console.warn(`City "${name}" from Google Sheet has invalid or missing coordinates. Skipping city: "${line}"`);
            continue; // Skip this city if coordinates are invalid
          }

          citiesData.push({
            name,
            visited,
            lat,
            lng,
            imageLink: imageLink !== '' ? imageLink : undefined,
          });
        }
      }
    }

    console.log(`Parsed ${citiesData.length} valid cities from Google Sheet`);

    // Validate that we have at least some cities
    if (citiesData.length === 0) {
      throw new Error('No valid cities found in Google Sheet. Please check that your sheet has data with valid coordinates.');
    }

    return citiesData;
  } catch (error: any) {
    console.error('Error fetching cities from Google Sheets:', error);

    // Provide more specific error messages
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Unable to fetch data from Google Sheet. Please check your internet connection.');
    }

    throw new Error(error.message || 'Failed to fetch cities from Google Sheet');
  }
}
