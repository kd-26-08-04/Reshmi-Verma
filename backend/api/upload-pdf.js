/**
 * Serverless API: PDF & Lab Report Upload Handler
 * Saves uploaded patient lab reports (PDF/Images) securely
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON body' });
      }
    }

    const { fileName, fileData, fileType = 'application/pdf' } = body || {};

    if (!fileData) {
      return res.status(400).json({ success: false, error: 'No file data received' });
    }

    // Extract base64 content
    let base64String = fileData;
    if (fileData.includes(';base64,')) {
      base64String = fileData.split(';base64,')[1];
    }

    const buffer = Buffer.from(base64String, 'base64');

    // Limit to 25MB
    if (buffer.length > 25 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: 'File size exceeds maximum 25MB limit' });
    }

    // Generate safe unique filename
    const cleanName = (fileName || 'lab_report.pdf')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80);
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}_${cleanName}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFileName}`;

    return res.status(200).json({
      success: true,
      message: 'Lab report uploaded successfully!',
      fileUrl,
      fileName: fileName || cleanName,
      fileSize: buffer.length,
      fileType
    });
  } catch (err) {
    console.error('Error uploading PDF report:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to upload report. Please try again.'
    });
  }
}
