function chatFormSubmittedWsIp(event) {
    event.preventDefault();
    const msg = event.currentTarget.chatInput.value;
    if (msg) {
        console.log('Sending msg to server: ' + msg);
        _sendMessage(msg);
        event.currentTarget.chatInput.value = '';
    } else {
        console.log('Nothing to say.');
    }
}

const names = [
    "Gisela",
    "Ana",
    "Benedicto",
    "Oseas",
    "Magdalena",
    "Primo",
    "Abel",
    "Donato",
    "Leonardo",
    "Rebeca",
    "Inocencio",
    "Isaac"
];
const from = names[Math.floor(Math.random() * names.length)];
const urls = {
    "wsIp": "http://127.0.0.1:8080/chat",
    "wssIp": "https://127.0.0.1:8443/chat",
    "wsLocalhost": "http://localhost:8080/chat",
    "wssLocalhost": "https://localhost:8443/chat"
};
let stompClient = null;

function setConnected(connected) {
    const connectBtn = document.getElementById('connectBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');
    const submitBtn = document.getElementById('chatFormSubmit');
    connectBtn.disabled = connected;
    disconnectBtn.disabled = !connected;
    submitBtn.disabled = !connected;
    if (connected) {
        if (!connectBtn.classList.contains('disabled')) {
            connectBtn.classList.add('disabled');
        }
        disconnectBtn.classList.remove('disabled');
        submitBtn.classList.remove('disabled');
    } else {
        if (!disconnectBtn.classList.contains('disabled')) {
            disconnectBtn.classList.add('disabled');
        }
        connectBtn.classList.remove('disabled');
        submitBtn.classList.add('disabled');
    }

    // document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    // document.getElementById('response').innerHTML = '';
}

function connect(type) {
    const url = urls[type];
    console.log('Connecting to ' + url + ".");
    const socket = new SockJS(url);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (messageOutput) {
            showMessageOutput(JSON.parse(messageOutput.body));
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function _sendMessage(msg) {
    stompClient.send("/app/chat", {}, JSON.stringify({ 'from': from, 'text': msg }));
}

function showMessageOutput(messageOutput) {
    var response = document.getElementById('chatResponses');
    var p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.appendChild(document.createTextNode(messageOutput.from + ": "
        + messageOutput.text + " (" + messageOutput.time + ")"));
    response.appendChild(p);
}