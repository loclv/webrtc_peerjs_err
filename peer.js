const { ExpressPeerServer } = require('peer');

function createPeerServer(app, http) {
    // https://github.com/peers/peerjs-server

    const server = http.createServer(app);
    const peerServer = ExpressPeerServer(server, {
        debug: true,
        path: '/myapp'
    });

    app.use('/peerjs', peerServer);

    server.listen(9000);
}

module.exports = createPeerServer;
