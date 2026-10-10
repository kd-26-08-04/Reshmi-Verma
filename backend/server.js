import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API handlers
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';
import authRegisterHandler from './api/auth-register.js';
import authLoginHandler from './api/auth-login.js';
import authMeHandler from './api/auth-me.js';
import submitQuestionnaireHandler from './api/submit-questionnaire.js';
import myBookingsHandler from './api/my-bookings.js';
import adminBookingsHandler from './api/admin-bookings.js';
import adminUpdateBookingHandler from './api/admin-update-booking.js';
import questionnaireTemplateHandler from './api/questionnaire-template.js';
import pricingTiersHandler from './api/pricing-tiers.js';
import adminPricingTiersHandler from './api/admin-pricing-tiers.js';
import reelsHandler from './api/reels.js';
import adminReelsHandler from './api/admin-reels.js';
import uploadPdfHandler from './api/upload-pdf.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsing middleware (allows high-resolution PDF and bloodwork uploads up to 35MB)
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Helper to bridge serverless handler signature (req, res) to Express
const wrapHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (err) {
    console.error('API Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
};

// ==============================================================================
// MERN API ROUTES
// ==============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HealthwithReshmi™ MERN Backend'
  });
});

// Authentication endpoints
app.post('/api/auth-register', wrapHandler(authRegisterHandler));
app.post('/api/auth/register', wrapHandler(authRegisterHandler));

app.post('/api/auth-login', wrapHandler(authLoginHandler));
app.post('/api/auth/login', wrapHandler(authLoginHandler));

app.get('/api/auth-me', wrapHandler(authMeHandler));
app.get('/api/auth/me', wrapHandler(authMeHandler));

// Booking & Razorpay endpoints
app.post('/api/create-order', wrapHandler(createOrderHandler));
app.post('/api/verify-payment', wrapHandler(verifyPaymentHandler));
app.get('/api/my-bookings', wrapHandler(myBookingsHandler));

// Admin portal endpoints
app.get('/api/admin-bookings', wrapHandler(adminBookingsHandler));
app.post('/api/admin-update-booking', wrapHandler(adminUpdateBookingHandler));
app.put('/api/admin-update-booking', wrapHandler(adminUpdateBookingHandler));

// Clinical Intake Questionnaire endpoints
app.get('/api/questionnaire-template', wrapHandler(questionnaireTemplateHandler));
app.post('/api/submit-questionnaire', wrapHandler(submitQuestionnaireHandler));
app.post('/api/upload-pdf', wrapHandler(uploadPdfHandler));

// Consultation Tiers & Fees endpoints
app.get('/api/pricing-tiers', wrapHandler(pricingTiersHandler));
app.post('/api/admin-pricing-tiers', wrapHandler(adminPricingTiersHandler));
app.put('/api/admin-pricing-tiers', wrapHandler(adminPricingTiersHandler));

// Instagram Reels endpoints
app.get('/api/reels', wrapHandler(reelsHandler));
app.post('/api/admin-reels', wrapHandler(adminReelsHandler));
app.put('/api/admin-reels', wrapHandler(adminReelsHandler));

// ==============================================================================
// Static file serving & SPA production fallback
// ==============================================================================
// Serve uploaded lab report PDFs securely
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Also serve public assets directly if accessed
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
app.use('/css', express.static(path.resolve(__dirname, 'css')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  const indexPath = path.resolve(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If dist is not yet built, inform user gracefully
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>HealthwithReshmi™ MERN Backend</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>HealthwithReshmi™ MERN Express Server is running on port ${PORT}!</h2>
          <p>Please run the React frontend with <code>npm run client</code> or build it with <code>npm run build</code>.</p>
        </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HealthwithReshmi™ Express MERN Server running on http://localhost:${PORT}`);
});

export default app;
