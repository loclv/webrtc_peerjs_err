import playVideo from './playVideo';
import openStream from './openStream';
import getPeerId from './getPeerId';
import peerServerConf from './peerServerConf';
import Peer from 'peerjs';
import $ from 'jquery';
import socket from './socket';

function addPeer() {
    const peerId = getPeerId();

    // https://www.npmjs.com/package/peerjs
    const peer = new Peer(peerId, peerServerConf);

    peer.on('open', id => {
        $('#my-peer-id').append(id);
        $('#btnSignUp').click(() => {
            const name = $('#txtUsername').val();
            socket.emit('USER_REGISTER', { name: name, peerId: id });
        });
    });

    // caller
    $('#btnCall').click(() => {
        const friendId = $('#txtFriendId').val();
        openStream()
        .then(stream => {
            playVideo(stream, 'localStream');
            const call = peer.call(friendId, stream);
            call.on('stream', remoteStream => {
                playVideo(remoteStream, 'remoteStream');
            });
        })
        .catch(error => console.log(error));
    });

    // answer
    peer.on('call', call => {
        answer(call);
    });
}

function answer(call) {
    openStream()
    .then(stream => {
        playVideo(stream, 'localStream');
        call.answer(stream);
        call.on('stream', remoteStream => {
            playVideo(remoteStream, 'remoteStream');
        });
    })
    .catch(error => console.log(error));
}

export default addPeer;
