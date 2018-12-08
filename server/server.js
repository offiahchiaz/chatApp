const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath)); 

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);

        // Broadcast to everyone that is connected 
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});