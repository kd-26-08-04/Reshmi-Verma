import { db } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const config = await db.getWhatsappConfig();
      // Mask token for frontend display
      const safeConfig = {
        ...config,
        hasToken: Boolean(config.token && config.token.trim().length > 0),
        tokenMasked: config.token ? (config.token.slice(0, 4) + '••••••••' + config.token.slice(-4)) : ''
      };
      return res.status(200).json({ success: true, config: safeConfig });
    } catch (err) {
      console.error('Error fetching WhatsApp config:', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve WhatsApp configuration.' });
    }
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const updates = req.body || {};
      const current = await db.getWhatsappConfig();

      // If user submitted without changing a masked token, preserve original token
      if (updates.token === undefined || updates.token === 'KEEP_EXISTING' || updates.token === '') {
        if (updates.token !== '') {
          updates.token = current.token;
        }
      }

      const updated = await db.updateWhatsappConfig(updates);
      return res.status(200).json({
        success: true,
        message: 'WhatsApp Business gateway configuration saved successfully!',
        config: {
          ...updated,
          hasToken: Boolean(updated.token && updated.token.trim().length > 0)
        }
      });
    } catch (err) {
      console.error('Error updating WhatsApp config:', err);
      return res.status(500).json({ success: false, error: 'Failed to save WhatsApp configuration.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
