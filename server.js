import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS headers for dev (Vite proxy handles this in production)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE',
    version: '1.0.0',
  });
});

// ─── Gemini AI Hint Endpoint ──────────────────────────────────────────────────
app.post('/api/hint', async (req, res) => {
  const { question, options, subject, difficulty } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.json({
      hint: generateStaticHint(question, subject, difficulty),
      source: 'static',
    });
  }

  try {
    const prompt = buildHintPrompt(question, options, subject, difficulty);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 200 },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return res.json({ hint: generateStaticHint(question, subject, difficulty), source: 'static_fallback' });
    }

    const data = await response.json();
    const hintText = data?.candidates?.[0]?.content?.parts?.[0]?.text || generateStaticHint(question, subject, difficulty);
    return res.json({ hint: hintText.trim(), source: 'gemini' });
  } catch (err) {
    console.error('Hint endpoint error:', err);
    return res.json({ hint: generateStaticHint(question, subject, difficulty), source: 'static_fallback' });
  }
});

// ─── Gemini AI Chat / Tutor Endpoint ─────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.json({
      reply: 'Storm AI Tutor is offline. Configure GEMINI_API_KEY in .env to activate AI tutoring.',
      source: 'offline',
    });
  }

  try {
    const systemContext = `You are Storm AI, an educational game tutor for "Storm Survival". Be encouraging, concise, and educational. Context: ${context || 'General gameplay'}`;

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
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble connecting. Try again!";
    return res.json({ reply: reply.trim(), source: 'gemini' });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'AI tutor temporarily unavailable.' });
  }
});

// ─── Game Save Endpoints (Server-side persistence) ────────────────────────────
const gameSaves = new Map();

app.post('/api/save', (req, res) => {
  const { username, saveData } = req.body;
  if (!username || !saveData) {
    return res.status(400).json({ error: 'Username and saveData are required.' });
  }
  gameSaves.set(username.toLowerCase(), { ...saveData, savedAt: new Date().toISOString() });
  console.log(`[SAVE] Game saved for: ${username}`);
  return res.json({ success: true, message: `Game saved for ${username}!` });
});

app.get('/api/save/:username', (req, res) => {
  const save = gameSaves.get(req.params.username?.toLowerCase());
  if (!save) return res.status(404).json({ found: false, message: 'No save found.' });
  return res.json({ found: true, saveData: save });
});

app.delete('/api/save/:username', (req, res) => {
  gameSaves.delete(req.params.username?.toLowerCase());
  return res.json({ success: true });
});

// ─── Leaderboard Endpoint ─────────────────────────────────────────────────────
const leaderboard = [];

app.post('/api/leaderboard', (req, res) => {
  const { username, xp, rank, completedLevels } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required.' });

  const idx = leaderboard.findIndex(e => e.username.toLowerCase() === username.toLowerCase());
  const entry = { username, xp: xp || 0, rank: rank || 'Bronze', completedLevels: completedLevels || 0, updatedAt: new Date().toISOString() };

  if (idx >= 0) leaderboard[idx] = entry;
  else leaderboard.push(entry);

  leaderboard.sort((a, b) => b.xp - a.xp);
  return res.json({ success: true });
});

app.get('/api/leaderboard', (req, res) => {
  return res.json({ leaderboard: leaderboard.slice(0, 20) });
});

// ─── Serve Static Frontend (Production Build) ─────────────────────────────────
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(
        '<h2 style="font-family:monospace">⚡ Storm Survival Backend Running ✅</h2><p>Run <code>npm run dev</code> for the frontend on port 3000.</p>'
      );
    }
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const geminiReady = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE';
  console.log('');
  console.log('  ⚡ Storm Survival Backend Server');
  console.log(`  ✅ Running at: http://localhost:${PORT}`);
  console.log(`  🤖 Gemini AI: ${geminiReady ? 'Connected ✅' : 'No API Key (static hints mode)'}`);
  console.log(`  📡 API Endpoints:`);
  console.log(`     GET    /api/health`);
  console.log(`     POST   /api/hint          - AI question hints`);
  console.log(`     POST   /api/chat          - AI tutor chat`);
  console.log(`     POST   /api/save          - Save game server-side`);
  console.log(`     GET    /api/save/:user    - Load game server-side`);
  console.log(`     DELETE /api/save/:user    - Delete save`);
  console.log(`     GET    /api/leaderboard`);
  console.log(`     POST   /api/leaderboard`);
  console.log('');
});

// ─── Helper Functions ─────────────────────────────────────────────────────────
function buildHintPrompt(question, options, subject, difficulty) {
  const optList = options?.length
    ? '\nOptions:\n' + options.map((o, i) => `  ${String.fromCharCode(65 + i)}) ${o}`).join('\n')
    : '';
  return `You are a tutor in "Storm Survival" — an educational survival game. A student is stuck on this ${difficulty || ''} ${subject || ''} question:\n\n"${question}"${optList}\n\nGive a SHORT hint (2-3 sentences) that helps them think through the answer WITHOUT giving it away. Be encouraging and themed around storm survival.`;
}

function generateStaticHint(question, subject, difficulty) {
  const hints = {
    mathematics: [
      '🧮 Break the problem into smaller steps. What operation should you apply first?',
      '📐 Think about the relationship between the numbers. Is there a pattern or formula that fits?',
      '🔢 Eliminate clearly wrong options first, then work through the remaining choices carefully.',
    ],
    science: [
      '🔬 Think about the cause-and-effect relationship described in the question.',
      '🌊 Recall the key scientific principle or law that governs this phenomenon.',
      '⚡ Connect this to a real-world example you already know.',
    ],
    default: [
      '💡 Read each option carefully. One is clearly wrong — eliminate it first!',
      '🎯 Focus on the key words in the question. What is it really asking you to identify?',
      '🧠 Trust your instincts, Storm Commander! Think through what you have learned so far.',
    ],
  };

  const cat = subject?.toLowerCase().includes('math')
    ? 'mathematics'
    : subject?.toLowerCase().includes('sci')
    ? 'science'
    : 'default';

  const pool = hints[cat];
  return pool[Math.floor(Math.random() * pool.length)];
}
