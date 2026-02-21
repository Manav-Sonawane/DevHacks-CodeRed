import { io } from 'socket.io-client';

/**
 * Single shared Socket.IO client instance.
 * Connects to the same origin it is served from.
 */
const BACKEND_URL = window.BACKEND_URL || '';

console.log('🔌 Connecting to Multiplayer Server at:', BACKEND_URL || window.location.origin);

export const socket = io(BACKEND_URL, {
    autoConnect: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    path: '/darkroom/socket.io'
});
