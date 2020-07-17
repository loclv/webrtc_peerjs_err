import playVideo from './playVideo';
import openStream from './openStream';
import getPeerId from './getPeerId';
import peerServerConf from './peerServerConf';
import Peer from 'peerjs';
import $ from 'jquery';
import socket from './socket';

function signUp(id) {
    const name = $('#txtUsername').val();
    socket.emit('USER_REGISTER', { name: name, peerId: id });
}

function addPeer() {
    const peerId = getPeerId();

    // https://www.npmjs.com/package/peerjs
    const peer = new Peer(peerId, peerServerConf);

    peer.on('open', id => {
        $('#my-peer-id').append(id);
        $('#btnSignUp').click(() => {
            signUp(id);
        });
        $('#txtUsername').keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                signUp(id);
            }
        });
    });

    // answer
    peer.on('call', call => {
        answer(call);
    });

    $('#ulUser').on('click', 'li', function() {
        const friendId = $(this).attr('id');
        handleCall(peer, friendId);
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

function handleCall(peer, friendId) {
    openStream()
    .then(stream => {
        playVideo(stream, 'localStream');
        const call = peer.call(friendId, stream);
        call.on('stream', remoteStream => {
            playVideo(remoteStream, 'remoteStream');
        });
    })
    .catch(error => console.log(error));
}

export default addPeer;
