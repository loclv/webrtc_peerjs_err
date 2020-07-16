import io from 'socket.io-client';
import $ from 'jquery';

const socket = io('http://localhost:3000/');

socket.on('USER_NAME_EXISTS', () => 
    alert('Username has already been taken!')
);

socket.on('USER_LIST_UPDATE', userArr => {
    $('#div-chat').show();
    $('#divSignUp').hide();

    userArr.forEach(user => {
        const { name, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    });

    socket.on('NEW_USER_ONLINE', user => {
        const { name, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${name}</li>`);
    });

    socket.on('USER_DISCONNECT', peerId => {
        $(`#${peerId}`).remove();
    });
});

export default socket;
