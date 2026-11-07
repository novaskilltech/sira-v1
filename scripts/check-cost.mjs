import fs from 'node:fs';

let apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey && fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('OPENROUTER_API_KEY=')) {
      apiKey = trimmed.slice('OPENROUTER_API_KEY='.length).trim().replace(/^["']|["']$/g, '');
    }
  }
}

if (!apiKey) {
  console.log('No OPENROUTER_API_KEY found.');
  process.exit(0);
}

try {
  const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  const data = await res.json();
  console.log('API Key Data:', JSON.stringify(data, null, 2));
} catch (err) {
  console.error('Error fetching key info:', err);
}
