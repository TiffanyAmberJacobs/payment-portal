const httpsRedirect = (req, res, next) => {
  // Only redirect in production and if not already https
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }
  next();
};

module.exports = httpsRedirect;