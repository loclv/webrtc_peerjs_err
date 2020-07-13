import playVideo from './playVideo';
import openStream from './openStream';
import getPeerId from './getPeerId';
import peerServerConf from './peerServerConf';
import Peer from 'peerjs';

const peerId = getPeerId();
const peerId2 = getPeerId();

// https://github.com/peers/peerjs-server

console.log(peerId);

function addPeer() {
    openStream()
    .then(stream => {
        playVideo(stream, 'localStream');

        // https://www.npmjs.com/package/peerjs
        const peer = new Peer(peerId, peerServerConf);
        const peer2 = new Peer(peerId2, peerServerConf);

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
