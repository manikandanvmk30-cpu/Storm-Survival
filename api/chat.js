export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { message, context } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.status(200).json({
      reply: 'Storm AI Tutor is running in offline mode. Set GEMINI_API_KEY in your Vercel project environment variables to activate real-time AI tutoring!',
      source: 'offline',
    });
  }

  try {
    const systemContext = `You are Storm AI, an encouraging and expert survival tutor in "Storm Survival". Guide students through disaster preparedness, science, and mathematics concisely. Context: ${context || 'Island survival'}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemContext }], role: 'user' },
            { parts: [{ text: message }], role: 'user' },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting right now. Try again shortly!";
    return res.status(200).json({ reply: reply.trim(), source: 'gemini' });
  } catch (err) {
    return res.status(500).json({ error: 'AI tutor temporarily unavailable.' });
  }
}
