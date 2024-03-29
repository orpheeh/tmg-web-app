import { GERANT, TMG } from '../../common/role.js';
import { IP } from '../../common/tmg-web-service.js';
import { getToken } from '../../common/session.js';
import { userGerant } from './messagerie/messageData.js';
import { showBigLoadingScreen, hideBigLoadingScreen } from './loading-screen.js';

let _attachments = [];
export let gerants = [];
let _myMessages = [];
export let _tmg = [];
let messageSource = undefined;


export function addAttachmentMsg(file) {
    _attachments.push(file);
    const last = displayFiles();
    last.querySelector('.remove-attachment').addEventListener('click', () => removeAttachment(file));
}

function removeAttachment(file) {
    for (let i = 0; i < _attachments.length; i++) {
        if (_attachments[i] === file) {
            _attachments.splice(i, 1);
        }
    }
    displayFiles();
}

function displayFiles() {
    const list = document.querySelector('.attachment-list');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    let last = null;

    _attachments.forEach(attachment => {
        const type = attachment.type.split('/')[1];
        const inner = `<span>${Math.round(attachment.size / 1024)}Ko </span> <span class="remove-attachment">&times;</span>
        `;
        const p = document.createElement('p');
        p.classList.add('attachment');
        p.innerHTML = inner;
        p.title = ` ${attachment.name}`;
        list.appendChild(p);
        last = p;
    });
    return last;
}

function clearAttachment() {
    _attachments = [];
    displayFiles();
}

function clearDstList() {
    const dstList = document.querySelectorAll('.dst');
    while (dstList.firstChild) {
        dstList.removeChild(dstList.firstChild);
    }
}

function clearMessageModal() {
    //Clear dst list
    clearDstList();
    //Clear attachment
    clearAttachment();
    //Remove object
    document.getElementById('message-objet').value = "";
    //Clear content
    document.getElementById('the-message').value = "";
}

export function addDst() {
    const select = document.querySelector('.gerant-list');
    const value = select.value;
    const inner = select.querySelector('option[value="' + value + '"]').innerHTML;
    addDstFrom(inner, value);
}

export function addAllDst() {
    clearDstList();
    gerants.forEach(gerant => addDstFrom(gerant.nom + ' ' + gerant.prenom, gerant._id));
}

function addDstFrom(inner, value) {
    const dstList = document.querySelector('.dst-list');
    const template = `<div class="dst">
        <h1 class="dst-name">${inner}</h1>
        <span class="remove-dst">&times;</span>
        <p class="dst-id">${value}</p>
    </div>`;
    const dst = new DOMParser().parseFromString(template, 'text/html');
    const element = dst.querySelector('.dst');
    element.querySelector('.remove-dst').addEventListener('click', () => {
        dstList.removeChild(element);
    });

    dstList.appendChild(element);
}

export function loadGerant(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/user/find', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            gerants = [];
            _tmg = [];
            data.users.forEach(user => {
                if (user.role == GERANT) {
                    gerants.push(user);
                } else if (user.role == TMG) {
                    _tmg.push(user);
                }
            });
            loadGerantListComponent();
        }
        callback();
    });
}

export function loadTMG(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/user/find', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            _tmg = [];
            data.users.forEach(user => {
                if (user.role == TMG) {
                    _tmg.push(user);
                }
            });
        }
        callback();
    });
}

function loadGerantListComponent() {
    const select = document.querySelector('.gerant-list');
    gerants.forEach(gerant => {
        const option = document.createElement('option');
        option.value = gerant._id;
        option.innerHTML = gerant.nom + ' ' + gerant.prenom;
        select.appendChild(option);
    });
}

export function showCreateMessageModal() {
    document.querySelector('.create-message-modal').classList.add('show-modal');
}

export function hideCreateMessageModal() {
    messageSource = undefined;
    clearMessageModal();
    document.querySelector('.create-message-modal').classList.remove('show-modal');
}

export function sendMessage(destinataires = []) {
    const objet = document.getElementById('message-objet').value;
    const content = document.getElementById('the-message').value;

    if (destinataires == [] || destinataires.length === 0) {
        const dstDocuments = document.querySelectorAll('.dst');
        dstDocuments.forEach(dst => {
            destinataires.push(dst.querySelector('.dst-id').innerHTML);
        });
    }
    const token = getToken();
    const formData = new FormData();
    _attachments.forEach(attachment => formData.append('attachment', attachment));
    formData.append('objet', objet);
    formData.append('content', content);
    formData.append('destinataires', JSON.stringify(destinataires));

    //Verification
    if (destinataires.length == 0) {
        alert("Il faut au moins un destinateire");
        return;
    }
    if (objet == "") {
        alert("Le message ne peut être envoyé sans objet");
        return;
    }

    showBigLoadingScreen();
    const api = messageSource === undefined ? '/tmg/messagerie/send' : '/tmg/messagerie/send/response/' + messageSource;
    fetch(IP + api, {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + token
        },
        body: formData
    }).then(response => {
        messageSource = undefined;
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            hideCreateMessageModal();
            loadAllMessage();
        }
        hideBigLoadingScreen();
    });
}

export function loadAllMessage(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/messagerie/myMessages', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
    }).then(data => {
        if (data !== undefined) {
            console.log(data);
            _myMessages = data;
            _myMessages.messages_receive = _myMessages.messages_receive.reverse();
            _myMessages.messages_send = _myMessages.messages_send.reverse();
            displayReceiveMessage();
        }
        callback();
    })
}

function clearMessageList() {
    const container = document.querySelector('.col-2');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function clearMessageDetails() {
    const container = document.querySelector('.col-3');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function displayMessage(objet, content, date, attachments, source, userSource, messageId) {
    const container = document.querySelector('.col-3');
    const template = `
        <div class="msg-snap">
            <h1 class="msg-snap-objet">${objet}</h1>
            <h5 class="msg-snap-date">${normalizeDate(date)}</h5>
            <p class="msg-snap-content">${content}</p>
        </div>
    `;
    const doc = new DOMParser().parseFromString(template, 'text/html');
    const element = doc.querySelector('.msg-snap');
    element.querySelector('.msg-snap-objet').addEventListener('click', () => {
        clearMessageDetails();
        container.appendChild(displayMessageDetails(objet, content, date, attachments, source, userSource._id, messageId));
    });
    return element;
}

function normalizeDate(d) {
    const month = ["jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Juil", "Aout", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date(d);
    return date.getDate() + ' ' + month[date.getMonth()] + ' ' + date.getFullYear() + ' à ' + date.getHours() + ':' + date.getMinutes();
}

let responseSourceId = undefined;

function displayMessageDetails(objet, content, date, attachments, source, sourceId, messageId) {
    document.querySelector('.col-3').classList.add('col-3-show');
    const template = `
    <div class="msg">
        <i class="material-icons msg-go-back">arrow_backward</i>
        <h2 class="msg-src">${source}</h2>
        <h5 class="msg-date">${normalizeDate(date)}</h5>
        <h1 class="msg-objet">${objet}</h1>
        <textarea class="msg-content" rows="10" cols="100" readonly>${content}</textarea>
        <div class="msg-a-list">
        </div>
        <button class="message-response">Répondre</button>
    </div>
`;
    const doc = new DOMParser().parseFromString(template, 'text/html');
    const element = doc.querySelector('.msg');

    const attachmentList = element.querySelector('.msg-a-list');
    attachments.forEach(att => {
        const a = document.createElement('a');
        a.href = att.url;
        a.innerHTML = 'Télécharger ' + Math.round(att.size / 1024) + 'Ko';
        a.title = att.url.split('/')[att.url.split('/').length - 1];
        attachmentList.appendChild(a);
    });

    //Responsive retour à la liste
    element.querySelector('.msg-go-back').addEventListener('click', () => {
        document.querySelector('.col-3').classList.remove('col-3-show');
    });

    //Envoyer une réponse au message
    element.querySelector('.message-response').addEventListener('click', () => {
        const select = document.querySelector('.gerant-list');
        if (select !== null) {
            select.value = sourceId;
            clearMessageModal();
            addDst();
        }
        showCreateMessageModal();
        messageSource = messageId;
        responseSourceId = sourceId;
    });

    return element;
}

export function displayReceiveMessage() {
    clearMessageList();
    const container = document.querySelector('.col-2');
    if (_myMessages.messages_receive !== undefined) {
        _myMessages.messages_receive.forEach(m => {
            let source = m.source.nom + ' ' + m.source.prenom;
            if (m.source.role == TMG) {
                source = 'Total Marketing Gabon';
            }
            container.appendChild(displayMessage(m.objet, m.content, m.date, m.attachments, source, m.source, m._id));
        });
    }
}


export function displaySendMessage() {
    clearMessageList();
    const container = document.querySelector('.col-2');
    if (_myMessages.messages_send !== undefined) {
        _myMessages.messages_send.forEach(m => {
            let source = m.source.nom + ' ' + m.source.prenom;
            if (m.source.role == TMG) {
                source = 'Total Marketing Gabon';
            }
            container.appendChild(displayMessage(m.objet, m.content, m.date, m.attachments, source, m.source, m._id));
        });
    }
}

export function sendTMGMessage() {
    const destinataires = [];
    if (messageSource !== undefined) {
        destinataires.push(responseSourceId);
    } else {
        _tmg.forEach(tmg => destinataires.push(tmg._id));
    }
    sendMessage(destinataires);
}