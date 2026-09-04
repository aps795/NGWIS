import { config } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowed = config.allowedOrigins.some(allowedOrigin => {
      return origin === allowedOrigin || origin.endsWith('.github.io') || origin.endsWith('.vercel.app');
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
