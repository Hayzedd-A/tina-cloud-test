export async function getCoordinates(address) {
  const params = new URLSearchParams({
    address: address,
    key: process.env.NEXT_PUBLIC_DISTANCE_MATRIX_API_KEY,
  });
  console.log(process.env.NEXT_PUBLIC_DISTANCE_MATRIX_API_KEY);
  if (!process.env.NEXT_PUBLIC_DISTANCE_MATRIX_API_KEY) {
    throw new Error('Distance matrix API key is not set');
  }
  const url = `https://api-v2.distancematrix.ai/maps/api/geocode/json?${params}`;

  try {
    console.log("initiating to fetch coordinates for address:", params);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
      cors: 'no-cors',
    });
    if (!response.ok) {
      throw new Error(`Error fetching coordinates: ${data.error_message || 'Unknown error'}`);
    }
    const data = await response.json();
    console.log(data)
    if (!data || !data.results || data.results.length === 0) {
      throw new Error('No results found');
    }
    const { lat, lon } = data.results[0].location;
    if (lat === undefined || lon === undefined) {
      throw new Error('Latitude or longitude not found in the response');
    }
    console.log(`Coordinates for ${address}: ${lat}, ${lon}`);
    // Return the coordinates as an object
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}
