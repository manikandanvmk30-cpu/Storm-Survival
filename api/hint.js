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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { question, options, subject, difficulty } = req.body || {};

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return res.status(200).json({
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
      return res.status(200).json({
        hint: generateStaticHint(question, subject, difficulty),
        source: 'static_fallback',
      });
    }

    const data = await response.json();
    const hintText = data?.candidates?.[0]?.content?.parts?.[0]?.text || generateStaticHint(question, subject, difficulty);
    return res.status(200).json({ hint: hintText.trim(), source: 'gemini' });
  } catch (err) {
    return res.status(200).json({
      hint: generateStaticHint(question, subject, difficulty),
      source: 'static_fallback',
    });
  }
}
