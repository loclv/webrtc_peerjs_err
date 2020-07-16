const io = require('socket.io')(process.env.PORT || 3000);

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
