const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('dist'));

app.get('/', (req, res) => res.render('home'));

app.listen(process.env.PORT || 3000, () => console.log('started!'));

// https://github.com/peers/peerjs-server

const http = require('http');

const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/myapp'
});

app.use('/peerjs', peerServer);

server.listen(9000);
