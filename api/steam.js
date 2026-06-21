export default async function handler(req, res) {
  try {
    const appid = req.query.appid;

    const response = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: "No se pudo obtener información"
    });
  }
}