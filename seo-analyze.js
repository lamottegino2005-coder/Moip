module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Clé API non configurée' });

  try {
    const { url, description } = req.body;
    if (!url) return res.status(400).json({ error: 'URL requise' });

    const prompt = `Tu es expert SEO. Analyse ce site web et donne des conseils concrets.
URL : ${url}
${description ? 'Description : ' + description : ''}
Secteur : Rénovation bâtiment dans le Nord de la France.
Réponds UNIQUEMENT en JSON valide :
{"score":<0-100>,"mention":"<Excellent|Très bien|Bien|Moyen|À améliorer>","couleur":"<#4ecdc4|#74b9ff|#f5a623|#ff6b6b>","criteres":[{"titre":"...","icone":"...","detail":"Conseil concret en 1-2 phrases","score":<0-10>,"statut":"<ok|attention|probleme>"}]}
Analyse : 1.Titre/meta (🏷️) 2.Mots-clés locaux (📍) 3.Vitesse mobile (⚡) 4.Google My Business (⭐) 5.Contenu services (📝) 6.Backlinks (🔗)`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('');
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Format invalide');
    return res.json(JSON.parse(match[0]));

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur analyse SEO' });
  }
};
