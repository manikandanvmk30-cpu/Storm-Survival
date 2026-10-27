const leaderboard = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    const { username, xp, rank, completedLevels } = req.body || {};
    if (!username) return res.status(400).json({ error: 'Username required.' });

    const idx = leaderboard.findIndex(e => e.username.toLowerCase() === username.toLowerCase());
    const entry = {
      username,
      xp: xp || 0,
      rank: rank || 'Bronze',
      completedLevels: completedLevels || 0,
      updatedAt: new Date().toISOString(),
    };

    if (idx >= 0) leaderboard[idx] = entry;
    else leaderboard.push(entry);

    leaderboard.sort((a, b) => b.xp - a.xp);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ leaderboard: leaderboard.slice(0, 20) });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
