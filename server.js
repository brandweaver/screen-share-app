const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Handle WebRTC signaling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When someone offers to share their screen, broadcast it to everyone else
    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    // When someone answers the offer, broadcast it back
    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    // Exchange network route information (ICE candidates)
    socket.on('ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server on port 3000
server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});