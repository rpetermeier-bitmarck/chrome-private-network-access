const modes = ['nocors', 'cors', 'corsPlus'];

function _urlInfixFor(mode) {
    if (mode === modes[0]) {
        return '';
    } else if (mode === modes[1]) {
        return 'exposed-by-cors/';
    } else if (mode === modes[2]) {
        return 'exposed-by-cors-new-headers/';
    } else {
        throw 'WTF?! Unknown mode: ' + mode;
    }
}

function loadFromIpUsingHttp(mode) {
    const url = 'http://127.0.0.1:8080/' + _urlInfixFor(mode) + 'resources/message-of-the-day';
    _doFetch(url);
}

function loadFromIpUsingHttps(mode) {
    const url = 'https://127.0.0.1:8443/' + _urlInfixFor(mode) + 'resources/message-of-the-day';
    _doFetch(url);
}

function loadFromLocalhostUsingHttp(mode) {
    const url = 'http://localhost:8080/' + _urlInfixFor(mode) + 'resources/message-of-the-day';
    _doFetch(url);
}

function loadFromLocalhostUsingHttps(mode) {
    const url = 'https://localhost:8443/' + _urlInfixFor(mode) + 'resources/message-of-the-day';
    _doFetch(url);
}

function _doFetch(url) {
    fetch(url)
        .then(function(response) {
            return response.text();
        })
        .then(function(text) {
            console.log(text);
            const node = document.createElement('li');
            node.appendChild(document.createTextNode(text + ' (' + new Date().toLocaleString('de-de', { weekday:"short", year:"numeric", month:"short", day:"numeric", hour: "numeric", minute: "numeric", second: "numeric"})  + ')'));
            document.querySelector('#server-responses').appendChild(node);
            return text;        
        });
}
