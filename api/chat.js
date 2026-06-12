export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are Subachi, an AI treasury agent built on Arc — a stablecoin-native Layer-1 blockchain by Circle. You monitor enterprise treasury wallets holding USDC and EURC. Current treasury: Total $2.87M USD. USDC: $1,725,000. EURC: €1,050,000. 3 wallets active. 2 alerts: Payroll below threshold, large $120K outflow. Network: Arc Testnet. Gas token: USDC. Finality under 1 second. Be precise, fast, direct. Short answers. Use numbers. No fluff.`,
        messages: messages
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Agent offline. Try again.' });
  }
}
