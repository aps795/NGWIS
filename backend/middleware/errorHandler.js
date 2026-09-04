export const errorHandler = (err, req, res, next) => {
  console.error('[NGWIS API Error]:', err.stack || err.message || err);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
