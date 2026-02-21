const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { setupSocketHandlers } = require('./sockets/handler');

// ── Express + Socket.io Setup ──
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// ── Health check endpoint ──
app.get('/', (req, res) => {
    res.json({ status: 'Survival Sandbox server running', rooms: 'Use socket events to manage rooms' });
});

// ── Setup Socket Handlers ──
setupSocketHandlers(io);

// ── Start Server (bind to 0.0.0.0 for LAN access) ──
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Survival Sandbox server listening on http://0.0.0.0:${PORT}`);
    console.log(`   Players can connect from LAN via your machine's IP address`);
});
