export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { endpoint, appid, steamid, key, vanityurl } = req.query;

    let url = 'https://api.steampowered.com';

    // Rutas soportadas
    if (endpoint === 'players' && appid) {
      url += `/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`;
    } else if (endpoint === 'summary' && steamid && key) {
      url += `/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamid}`;
    } else if (endpoint === 'games' && steamid && key) {
      url += `/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true&format=json`;
    } else if (endpoint === 'recent' && steamid && key) {
      url += `/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${steamid}&count=20&format=json`;
    } else if (endpoint === 'resolve' && vanityurl && key) {
      url += `/ISteamUser/ResolveVanityURL/v1/?key=${key}&vanityurl=${encodeURIComponent(vanityurl)}`;
    } else {
      return res.status(400).json({ error: 'Endpoint inválido', received: { endpoint, appid, steamid, key, vanityurl } });
    }

    console.log('API Call:', url);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Steam API returned ' + response.status });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Error obteniendo datos de Steam API: ' + error.message });
  }
}
