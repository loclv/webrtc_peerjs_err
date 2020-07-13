const config = { audio: false, video: true };

function openStream() {
    return navigator.mediaDevices.getUserMedia(config);
}

export default openStream;
