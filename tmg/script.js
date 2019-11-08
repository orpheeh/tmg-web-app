import { removeToken, getNom, getPrenom, getUsername, getToken } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";
import {
    loadAllCategorie
} from "./wiki/wiki.js";
import {
    loadGerant,
    addDst,
    addAllDst,
    addAttachmentMsg,
    showCreateMessageModal,
    sendMessage,
    hideCreateMessageModal,
    loadAllMessage,
    displaySendMessage,
    displayReceiveMessage
} from "../common/common-message.js";
import { loadAllStation, updateStationConfig } from "./station.js";
import { loadAllActu } from "../common/loading.js";
import { showBigLoadingScreen, hideBigLoadingScreen } from "../common/loading-screen.js";

let initialLoadingItemCount = 5;

function onItemLoaded() {
    initialLoadingItemCount--;
    if (initialLoadingItemCount <= 0) {
        hideBigLoadingScreen();
    }
}

window.addEventListener('load', () => {
    showBigLoadingScreen();
    //Load initial
    const initial = document.querySelectorAll('.initial');
    initial.forEach(ini => ini.innerHTML = getNom().charAt(0) + ' ' + getPrenom().charAt(0));

    //Load personal data
    document.querySelector('.username').innerHTML = getUsername();
    document.querySelector('.fullname').innerHTML = getNom() + ' ' + getPrenom();

    //
    document.querySelector('#nav-bar-btn').addEventListener('click', () => {
        console.log('click');
        document.querySelector('.nav-bar').classList.toggle('show-responsive-nav');
    });

    document.getElementById('display-fn').innerHTML = getNom() + ' ' + getPrenom();
    document.getElementById('down').addEventListener('click', () => {
        document.querySelector('.dropdown-menu').classList.toggle('show-dropdown-menu');
    });
    document.getElementById('sign-out').addEventListener('click', () => {
        removeToken();
        window.location = "../index.html";
    });

    document.querySelector('.home-item').addEventListener('click', () => changeMenuItem(0));
    document.querySelector('.message-item').addEventListener('click', () => changeMenuItem(1));
    document.querySelector('.wiki-station-item').addEventListener('click', () => changeMenuItem(2));
    document.querySelector('.actu-item').addEventListener('click', () => changeMenuItem(3));

    document.querySelector('.actu-form-header').addEventListener('click', () => {
        document.querySelector('.actu-form-content').classList.toggle('hide-form');
    });

    wiki();
    messagerie();
    actu();
    updateStationConfig();

    document.getElementById('publish-actu').addEventListener('click', () => {
        const title = document.querySelector('.actu-title').value;
        const details = document.querySelector('.actu-details').value;
        publishActu(title, details);
    })
});


function changeMenuItem(index) {
    const navItems = document.querySelectorAll('.nav-bar-item');
    navItems.forEach(item => item.classList.remove('selected-item'));

    const contents = document.querySelectorAll('.content');
    contents.forEach(item => item.classList.remove('selected-item'));

    console.log(contents);
    navItems[index].classList.add('selected-item');
    contents[index].classList.add('selected-item');
}

function wiki() {
    loadAllCategorie(() => { onItemLoaded() });
}

function messagerie() {
    loadGerant(() => onItemLoaded());
    loadAllMessage(() => onItemLoaded());
    loadAllStation(() => onItemLoaded());
    document.querySelector('.add-gerant').addEventListener('click', () => addDst());
    document.querySelector('.add-all-gerant').addEventListener('click', () => addAllDst());
    document.getElementById('add-attachment-msg').addEventListener('change', (e) => {
        if (e.target.files[0] !== null) {
            addAttachmentMsg(e.target.files[0]);
        }
    });
    document.getElementById('new-message-button').addEventListener('click', () => showCreateMessageModal());
    document.getElementById('send-message').addEventListener('click', () => sendMessage());
    document.getElementById('cancel-message').addEventListener('click', () => hideCreateMessageModal());

    document.querySelector('.msg-item-receives').addEventListener('click', (e) => {
        document.querySelector('.msg-item-send').classList.remove('msg-selected');
        document.querySelector('.msg-item-receives').classList.add('msg-selected');
        displayReceiveMessage();
    });

    document.querySelector('.msg-item-send').addEventListener('click', (e) => {
        document.querySelector('.msg-item-receives').classList.remove('msg-selected');
        document.querySelector('.msg-item-send').classList.add('msg-selected');
        displaySendMessage();
    });
}

function actu() {
    const container = document.getElementById("actu-container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    loadAllActu((data) => {
        data.actus = data.actus.reverse();
        data.actus.forEach(a => {
            displayActu(a.title, a.details, a.date, a._id);
        });
        onItemLoaded();
    });
}

function displayActu(title, details, d, id) {
    const container = document.getElementById("actu-container");

    const date = new Date(d);

    const template = `
        <div class="actu">
            <h1>${title}</h1>
            <h3>Publié le ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</h3>
            <h2>${details}</h2>
            <button class="delete-actu">supprimer</button>
        </div>
    `;
    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.actu');
    element.querySelector('.delete-actu').addEventListener('click', () => {
        deleteActu(id);
    })
    container.appendChild(element);
}

function deleteActu(id) {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/actu/' + id, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
    }).then(response => {
        if (response.status === 200) {
            actu();
        }
        hideBigLoadingScreen();
    })
}

function publishActu(title, details) {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/actu/publish', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            title,
            details
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            actu();
        }
        hideBigLoadingScreen();
    });
}