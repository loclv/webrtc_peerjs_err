const express = require('express');
const createPeerServer = require('./peer');
const app = express();
const http = require('http');

const socketServer = http.createServer(app);
const handleIo = require('./handleIo');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('dist'));

app.get('/', (req, res) => res.render('home'));

createPeerServer(app, http);

// socket.io
handleIo(socketServer);

socketServer.listen(process.env.PORT || 3000, () => console.log('started!'));
