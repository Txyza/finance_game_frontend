/**
 * Simple Node.js server for serving React SPA
 * For production use
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
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "mc.yandex.ru"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.cash-lvl.ru", "https://cash-lvl.ru", "mc.yandex.ru"],
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('healthy\n')
})

// Handle client-side routing - serve index.html for all routes
app.use((req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Serving static files from ${DIST_DIR}`)
})