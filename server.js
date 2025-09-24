/**
 * Simple Node.js server for serving React SPA with proper 404 handling
 * For production use with PM2 or similar process manager
 */

const express = require('express')
const path = require('path')
const compression = require('compression')
const helmet = require('helmet')

const app = express()
const PORT = process.env.PORT || 3000
const DIST_DIR = path.join(__dirname, 'dist')

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.cash-lvl.ru", "https://cash-lvl.ru"],
      fontSrc: ["'self'", "data:"],
    },
  },
}))

// Compression middleware
app.use(compression())

// Serve static files with proper cache headers
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, filePath) => {
    // Service worker should not be cached
    if (filePath.endsWith('service-worker.js')) {
      res.setHeader('Cache-Control', 'no-cache')
    }
    // HTML files should have shorter cache
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }
}))

// API proxy (if needed)
app.use('/api', (req, res) => {
  // Proxy to backend API
  res.status(503).json({ error: 'API proxy not configured' })
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Handle client-side routing - MUST be last
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html')

  // Check if the route is supposed to be a 404
  const knownRoutes = [
    '/',
    '/shop',
    '/work',
    '/tasks',
    '/leaderboard',
    '/analytics',
    '/news',
    '/city',
    '/onboarding',
    '/work/2048',
    '/work/memory'
  ]

  const isKnownRoute = knownRoutes.some(route =>
    req.path === route || req.path.startsWith('/city/district/')
  )

  // Send index.html with appropriate status code
  if (!isKnownRoute && req.path !== '/404') {
    res.status(404)
  }

  res.sendFile(indexPath)
})

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).send('Internal Server Error')
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cash-lvl server running on port ${PORT}`)
  console.log(`📁 Serving files from ${DIST_DIR}`)
  console.log(`🌐 Visit http://localhost:${PORT}`)
})