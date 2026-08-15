export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

export function findNearestCity<T extends { latitude: number | null; longitude: number | null }>(
  cities: T[],
  lat: number,
  lon: number,
): T | null {
  let nearest: T | null = null
  let nearestDist = Infinity

  for (const city of cities) {
    if (city.latitude === null || city.longitude === null) continue
    const dist = haversineKm(lat, lon, city.latitude, city.longitude)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = city
    }
  }

  return nearest
}

async function fetchIpLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const response = await fetch('https://ipwho.is/')
    if (!response.ok) return null
    const data = await response.json()
    if (data.success === false || typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      return null
    }
    return { latitude: data.latitude, longitude: data.longitude }
  } catch {
    return null
  }
}

function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('geolocation unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 5 * 60 * 1000 })
  })
}

/**
 * Tries browser GPS/Wi-Fi geolocation first (most accurate); if that's unavailable, denied,
 * or times out (common on desktops without Wi-Fi/GPS), falls back to IP-based geolocation.
 */
export async function resolveLocation<T extends { latitude: number | null; longitude: number | null }>(
  cities: T[],
): Promise<T | null> {
  try {
    const position = await getBrowserPosition()
    const nearest = findNearestCity(cities, position.coords.latitude, position.coords.longitude)
    if (nearest) return nearest
  } catch {
    // fall through to IP-based lookup
  }

  const ipLocation = await fetchIpLocation()
  if (!ipLocation) return null
  return findNearestCity(cities, ipLocation.latitude, ipLocation.longitude)
}
