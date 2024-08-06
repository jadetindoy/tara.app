const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

let localStream;
let peerConnection;

// Configuration for the WebRTC connection
const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

// Function to start local video stream
async function startLocalStream() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
}

// Function to create and set up the peer connection
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(config);
    peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send ICE candidate to the remote peer
        }
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
}

// Function to handle chat messages
function handleChat() {
    sendButton.addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            chatBox.innerHTML += `<div>${message}</div>`;
            chatInput.value = '';
        }
    });
}

// Initialize the application
async function init() {
    await startLocalStream();
    createPeerConnection();
    handleChat();
}

// Call init to start the application
init();
