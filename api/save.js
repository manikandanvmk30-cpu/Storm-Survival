const gameSaves = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    const { username, saveData } = req.body || {};
    if (!username || !saveData) {
      return res.status(400).json({ error: 'Username and saveData are required.' });
    }
    gameSaves.set(username.toLowerCase(), { ...saveData, savedAt: new Date().toISOString() });
    return res.status(200).json({ success: true, message: `Game saved for ${username}!` });
  }

  if (req.method === 'GET') {
    const username = req.query?.username || req.url.split('?username=')[1];
    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required.' });
    }
    const save = gameSaves.get(username.toLowerCase());
    if (!save) return res.status(404).json({ found: false, message: 'No save found.' });
    return res.status(200).json({ found: true, saveData: save });
  }

  if (req.method === 'DELETE') {
    const username = req.query?.username;
    if (username) gameSaves.delete(username.toLowerCase());
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
