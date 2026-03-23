const { kv } = require('@vercel/kv');

function generateKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `GDT-${seg()}-${seg()}-${seg()}`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' });
  }

  try {
    const { clientName, plan = 'standard', duration = 30 } = req.body;
    if (!clientName) return res.status(400).json({ error: 'clientName requis' });

    const key = generateKey();
    const now = new Date();
    let expiresAt = null;
    if (duration > 0) {
      const exp = new Date(now);
      exp.setDate(exp.getDate() + duration);
      expiresAt = exp.toISOString();
    }

    await kv.set('lic:' + key, { clientName, plan, duration, expiresAt, deviceId: null, createdAt: now.toISOString(), activatedAt: null });

    const expStr = expiresAt ? `expire le ${new Date(expiresAt).toLocaleDateString('fr-FR')}` : 'illimitée';
    return res.json({ key, clientName, plan, duration, expiresAt, expStr, message: `Clé créée pour ${clientName} — ${expStr}` });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
