/* Package Imports */
import http from 'http'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import cookieParser from 'cookie-parser'
import ip from 'ip'
import frameGuard from 'frameguard'
import passport from 'passport'
import cors from 'cors'
import morgan from 'morgan'

import connectDatabase from '@/database/connection'
import config from '@/config'
import router from '@/routes'

const app = express()
const server = http.createServer(app)

// ✅ Parse allowed CORS origins
const allowedOrigins = config.CORS_ORIGIN.split(',').map(origin => origin.trim())

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
)

// ✅ Allow preflight
app.options('*', cors())

// ✅ Middleware
app.use(json({ limit: '16kb' }))
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(frameGuard({ action: 'deny' }))
app.use(morgan('dev'))

const serverIP = ip.address()
console.log(`\x1b[95mSERVER IP: ${serverIP}`)

// ✅ Test route
app.get('/', (req, res) => res.json({ status: 'UP', message: 'Server runs' }))
app.use('/api', router)

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ status: 'ERROR', message: err.message || 'Something went wrong!' })
})

// ✅ Connect DB and start server
connectDatabase((isConnect) => {
  if (isConnect) {
    server.listen(config.PORT || 5000, '0.0.0.0', () => {
      console.log(`\x1b[33mServer runs on port ${config.PORT}...`)
      console.log(
        `\x1b[38;5;201mAPI HOST - http://${serverIP}:${config.PORT} or ${config.API_HOST}\n`
      )
    })
  } else {
    console.error(' Failed to connect to the database. Server not started.')
    process.exit(1)
  }
})

export { server }
