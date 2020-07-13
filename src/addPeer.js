import playVideo from './playVideo';
import openStream from './openStream';
import getPeerId from './getPeerId';
import peerServerConf from './peerServerConf';
import Peer from 'peerjs';
import $ from 'jquery';

const peerId = getPeerId();
const peerId2 = getPeerId();



function addPeer() {
    openStream()
    .then(stream => {
        playVideo(stream, 'localStream');

        // https://www.npmjs.com/package/peerjs
        const peer = new Peer(peerId, peerServerConf);

        // Connect
        const conn = peer.connect(peerId2);
        conn.on('open', () => {
            conn.send('hi!');
        });

        // Receive
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on('open', () => {
                conn.send('hello!');
            });
        });

        peer.on('open', id => {
            $('#my-peer-id').append(id);
        });
    })
    .catch(error => console.log(error));
}

export default addPeer;
