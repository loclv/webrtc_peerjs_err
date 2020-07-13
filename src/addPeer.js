import playVideo from './playVideo';
import openStream from './openStream';
import getPeerId from './getPeerId';
import Peer from 'peerjs';

const peerId = getPeerId();
const peerId2 = getPeerId();

// https://github.com/peers/peerjs-server
// http://127.0.0.1:9000/peerjs/myapp

const peerConf = {
    host: 'localhost',
    port: 9000,
    path: '/peerjs/myapp'
}

console.log(peerId);

function addPeer() {
    openStream()
    .then(stream => {
        playVideo(stream, 'localStream');

        // https://www.npmjs.com/package/peerjs
        const peer = new Peer(peerId, peerConf);
        const peer2 = new Peer(peerId2, peerConf);

        console.log(peer);

        // Connect
        const conn = peer.connect(peerId2);
        conn.on('open', () => {
            conn.send('hi!');
        });

        // Receive
        peer2.on('connection', (conn) => {
            conn.on('data', (data) => {
              // Will print 'hi!'
              console.log(data);
            });
            conn.on('open', () => {
              conn.send('hello!');
            });
          });
    })
    .catch(error => console.log(error));
}

export default addPeer;
