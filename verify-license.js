const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  try {
    const { key, deviceId } = req.body;
    if (!key || !deviceId) return res.status(400).json({ valid: false, reason: 'Données manquantes' });

    const existing = await kv.get('lic:' + key.toUpperCase());
    if (!existing) return res.json({ valid: false, reason: 'Clé invalide. Contactez GDT Rénovation.' });

    if (existing.expiresAt) {
      const now = new Date();
      const expiry = new Date(existing.expiresAt);
      if (now > expiry) {
        return res.json({ valid: false, expired: true, reason: `Licence expirée le ${expiry.toLocaleDateString('fr-FR')}. Contactez GDT Rénovation.` });
      }
      const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) existing._warning = `Licence expire dans ${daysLeft} jour${daysLeft > 1 ? 's' : ''}.`;
    }

    if (existing.deviceId && existing.deviceId !== deviceId) {
      return res.json({ valid: false, reason: 'Clé déjà utilisée sur un autre appareil.' });
    }

    if (!existing.deviceId) {
      await kv.set('lic:' + key.toUpperCase(), { ...existing, deviceId, activatedAt: new Date().toISOString() });
    }

    return res.json({ valid: true, clientName: existing.clientName || 'Client', plan: existing.plan || 'standard', expiresAt: existing.expiresAt || null, warning: existing._warning || null });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, reason: 'Erreur serveur' });
  }
};
