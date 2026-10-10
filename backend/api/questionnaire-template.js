/**
 * Serverless API Endpoint: Questionnaire Template Manager
 * GET  /api/questionnaire-template  -> Public/Client: Returns active questionnaire template
 * POST /api/questionnaire-template  -> Admin Only: Updates and saves questionnaire template
 */

import { db } from './lib/db.js';
import { auth } from './lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const template = await db.getQuestionnaireTemplate();
      return res.status(200).json({
        success: true,
        template
      });
    } catch (err) {
      console.error('Error fetching questionnaire template:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve questionnaire template.'
      });
    }
  }

  if (req.method === 'POST') {
    // Authenticate Admin
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const user = auth.verifyToken(token);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: Clinical Admin privileges required to modify questionnaire template.'
      });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ success: false, error: 'Invalid JSON body.' });
        }
      }

      const { template } = body || {};
      if (!template || !Array.isArray(template.sections)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid template structure. Expected template object with sections array.'
        });
      }

      const updated = await db.updateQuestionnaireTemplate(template);

      return res.status(200).json({
        success: true,
        message: 'Questionnaire template updated and published successfully!',
        template: updated
      });
    } catch (err) {
      console.error('Error updating questionnaire template:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to save questionnaire template changes.'
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
