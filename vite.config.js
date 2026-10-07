import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import createOrderHandler from './api/create-order.js';
import verifyPaymentHandler from './api/verify-payment.js';

export default defineConfig(({ mode }) => {
  // Load environment variables based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env for local API route simulation
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
      open: true
    },
    plugins: [
      {
        name: 'vite-plugin-local-api-endpoints',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/api/create-order' || url === '/api/verify-payment') {
              let bodyText = '';
              req.on('data', chunk => {
                bodyText += chunk;
              });
              req.on('end', async () => {
                let parsedBody = {};
                try {
                  parsedBody = bodyText ? JSON.parse(bodyText) : {};
                } catch (e) {
                  parsedBody = {};
                }

                const mockReq = {
                  method: req.method,
                  body: parsedBody,
                  headers: req.headers
                };

                const mockRes = {
                  setHeader(name, val) {
                    res.setHeader(name, val);
                  },
                  status(code) {
                    res.statusCode = code;
                    return {
                      json(data) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                      }
                    };
                  }
                };

                try {
                  if (url === '/api/create-order') {
                    await createOrderHandler(mockReq, mockRes);
                  } else {
                    await verifyPaymentHandler(mockReq, mockRes);
                  }
                } catch (err) {
                  console.error('API middleware error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Local server error' }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          breathe: resolve(__dirname, 'breathe.html'),
          nutrition: resolve(__dirname, 'nutrition.html'),
          assessment: resolve(__dirname, 'assessment.html'),
          booking: resolve(__dirname, 'booking.html'),
          contact: resolve(__dirname, 'contact.html'),
          notFound: resolve(__dirname, '404.html')
        }
      }
    }
  };
});
