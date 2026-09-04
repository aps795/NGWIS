import { config } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, '');
    const allowed = config.allowedOrigins.some(allowedOrigin => {
      return cleanOrigin === allowedOrigin ||
        origin.endsWith('.github.io') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com');
    });

    if (allowed || config.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
