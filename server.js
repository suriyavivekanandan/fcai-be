/* Package Imports */
import http from 'http';
import express from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import ip from 'ip';
import frameGuard from 'frameguard';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';

import connectDatabase from '@/database/connection';
import config from '@/config';
import router from '@/routes';

const app = express();
const server = http.createServer(app);

// CORS Setup
app.use(
  cors({
    origin: [config.API_HOST, config.CORS_ORIGIN],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);

// Middleware
app.use(json({ limit: '16kb' }));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(frameGuard({ action: 'deny' }));
app.use(morgan('dev'));

// Log Server IP
const serverIP = ip.address();
console.log(`\x1b[95mSERVER IP: ${serverIP}`);

// Routes
app.get('/', (req, res) => res.json({ status: 'UP', message: 'Server runs' }));
app.use('/api', router);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'ERROR', message: 'Something went wrong!' });
});

// Get PORT from env (Render sets it dynamically)
const PORT = process.env.PORT || config.PORT || 5000;

// Connect DB and Start Server
connectDatabase((isConnect) => {
  if (isConnect) {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\x1b[33mServer runs on port ${PORT}...`);
      console.log(
        `\x1b[38;5;201mAPI HOST - http://${serverIP}:${PORT} or http://127.0.0.1:${PORT} or ${config.API_HOST} \n`
      );
    });
  } else {
    console.error('Failed to connect to the database. Server not started.');
    process.exit(1);
  }
});

export { server };
