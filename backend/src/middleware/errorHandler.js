export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: err.message || 'Something went wrong.',
  });
}

export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found.' });
}
