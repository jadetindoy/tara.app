const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

let localStream;
let peerConnection;
const signalingServerUrl = 'YOUR_SIGNALING_SERVER_URL'; // Replace with your signaling server URL
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const socket = io(signalingServerUrl); // Using Socket.IO for signaling

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
            socket.emit('ice-candidate', event.candidate);
        }
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
}

// Function to handle incoming signaling messages
socket.on('offer', async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

socket.on('answer', async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', (candidate) => {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

// Function to handle chat messages
function handleChat() {
    sendButton.addEventListener('click', () => {
        const message = chatInput.value;
        if (message) {
            chatBox.innerHTML += `<div>${message}</div>`;
            chatInput.value = '';
            socket.emit('chat-message', message);
        }
    });
}

// Function to handle incoming chat messages
socket.on('chat-message', (message) => {
    chatBox.innerHTML += `<div>${message}</div>`;
});

// Initialize the application
async function init() {
    await startLocalStream();
    createPeerConnection();
    handleChat();
}

// Call init to start the application
init();
