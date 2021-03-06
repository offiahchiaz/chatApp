const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));  

io.on('connection', (socket) => {
    console.log('New User connected');

    socket.on('join', (params, callback) => {
        let room = (params.room).toLocaleLowerCase();
        if (!isRealString(params.name) || !isRealString(room)) {
            return callback('Name and room name are required');
        } else {
            let nameCheck = users.getUserList(room);

            if (nameCheck.includes(params.name)) {
                return callback('A user with same name already exists.');
            }
        }

        // To join a room
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, room);

        io.to(room).emit('updateUserList', users.getUserList(room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} just joined`)); 
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }    
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});