import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { corsOptions } from './config/corsOptions.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// Trust reverse proxies (Render, Vercel, Cloudflare)
app.set('trust proxy', 1);

// Standard Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Health Check Endpoint (For Render, Uptime monitors, Vercel)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'NGWIS School API',
    environment: config.nodeEnv,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);

// Catch 404 for undefined /api routes (prefix match, no wildcard needed)
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route ${req.originalUrl} not found.`
  });
});

// Serve static frontend assets if built (Render full-stack web service mode)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Root Information Endpoint (when backend-only)
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      institution: 'New Global Wisdom International School (NGWIS)',
      location: 'Bhujehuan, Sauna, Saidpur, Ghazipur, UP - 233307',
      service: 'Official Institutional REST API',
      version: '1.0.0',
      documentation: '/api/health'
    });
  });
}

// Global Centralized Error Handler
app.use(errorHandler);

// Standalone Server Startup (Render / Local Development)
const isDirectRun = process.argv[1] && process.argv[1].endsWith('server.js');

if (isDirectRun || (!process.env.VERCEL && process.env.NODE_ENV !== 'test')) {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`NGWIS Official Backend Server`);
    console.log(`Environment : ${config.nodeEnv}`);
    console.log(`Listening on: http://0.0.0.0:${config.port}`);
    console.log(`Health Check: http://localhost:${config.port}/api/health`);
    console.log(`=======================================================`);
  });
}

export default app;
