const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath)); 

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.emit('newMessage', generateMessage('Amin', 'Welcome to the caht app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); 

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // Broadcast to everyone that is connected 
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});