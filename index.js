const express = require('express');
const createPeerServer = require('./peer');
const app = express();
const http = require('http');

const socketServer = http.createServer(app);
const io = require('socket.io')(socketServer);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('dist'));

app.get('/', (req, res) => res.render('home'));

createPeerServer(app, http);

// socket

const userArr = [];

io.on('connection', socket => {
    socket.on('USER_REGISTER', user => {
        const isExist = userArr.some(e => e.name === user.name);

        socket.peerId = user.peerId;

        if (isExist) return socket.emit('USER_NAME_EXISTS');

        userArr.push(user);
        socket.emit('USER_LIST_UPDATE', userArr);
        socket.broadcast.emit('NEW_USER_ONLINE', user);
    });

    socket.on('disconnect', () => {
        const index = userArr.findIndex(user => user.peerId === socket.peerId);
        userArr.splice(index, 1);
        io.emit('USER_DISCONNECT', socket.peerId);
    });
});

socketServer.listen(process.env.PORT || 3000, () => console.log('started!'));
