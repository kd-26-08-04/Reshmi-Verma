/**
 * Serverless API: PDF & Lab Report Upload & Retrieval Handler
 * Stores patient lab reports directly in MongoDB / Database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists for secondary local disk caching if available
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // --- GET: RETRIEVE / STREAM PDF STORED IN DATABASE ---
  if (req.method === 'GET') {
    try {
      let reportId = null;
      if (req.query && (req.query.id || req.query.file)) {
        reportId = req.query.id || req.query.file;
      } else if (req.params && req.params.id) {
        reportId = req.params.id;
      } else {
        try {
          const parsed = new URL(req.url, 'http://localhost');
          reportId = parsed.searchParams.get('id') || parsed.searchParams.get('file');
        } catch (e) {}
      }

      if (!reportId) {
        return res.status(400).json({ success: false, error: 'Report ID parameter is required' });
      }

      // 1. Fetch from Database
      const report = await db.getPdfReportById(reportId);
      if (report && report.fileData) {
        let base64Content = report.fileData;
        if (base64Content.includes(';base64,')) {
          base64Content = base64Content.split(';base64,')[1];
        }
        const fileBuffer = Buffer.from(base64Content, 'base64');
        const mimeType = report.fileType || 'application/pdf';

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${report.fileName || 'lab_report.pdf'}"`);
        res.setHeader('Content-Length', fileBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.status(200).send(fileBuffer);
      }

      // 2. Secondary fallback: check local disk cache
      const diskPath = path.join(UPLOADS_DIR, path.basename(reportId));
      if (fs.existsSync(diskPath)) {
        const fileBuffer = await fs.promises.readFile(diskPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${path.basename(reportId)}"`);
        return res.status(200).send(fileBuffer);
      }

      return res.status(404).json({ success: false, error: 'Lab report document not found' });
    } catch (err) {
      console.error('Error serving PDF from DB:', err);
      return res.status(500).json({ success: false, error: 'Error retrieving lab report from database' });
    }
  }

  // --- POST: STORE PDF DIRECTLY IN DATABASE ---
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return res.status(400).json({ success: false, error: 'Invalid JSON body' });
        }
      }

      const { fileName, fileData, fileType = 'application/pdf', bookingId = '' } = body || {};

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

      // Generate unique ID and clean filename
      const cleanName = (fileName || 'lab_report.pdf')
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .slice(0, 80);
      const reportId = `rep_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const uniqueFileName = `${reportId}_${cleanName}`;

      // 1. SAVE DIRECTLY TO DATABASE (MongoDB & Local Fallback Store)
      const savedDoc = await db.savePdfReport({
        id: reportId,
        fileName: cleanName,
        uniqueFileName,
        fileData: base64String,
        fileType,
        fileSize: buffer.length,
        bookingId,
        uploadedAt: new Date().toISOString()
      });

      // 2. Also cache to disk if available
      try {
        const filePath = path.join(UPLOADS_DIR, uniqueFileName);
        await fs.promises.writeFile(filePath, buffer);
      } catch (diskErr) {
        // Disk write failure in serverless environment is non-fatal because doc is saved in DB!
      }

      // Safe URL pointing to database retriever
      const fileUrl = `/api/upload-pdf?id=${reportId}`;

      return res.status(200).json({
        success: true,
        message: 'Lab report securely saved in database!',
        reportId,
        fileUrl,
        fileName: cleanName,
        fileSize: buffer.length,
        fileType
      });
    } catch (err) {
      console.error('Error uploading PDF report to DB:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to upload and store report in database. Please try again.'
      });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
