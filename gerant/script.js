import { loadAllActu } from "../common/loading.js"
import { removeToken, getNom, getPrenom, getUsername, getPhoto, hasPhoto, setPhoto } from "../common/session.js";
import {
    addAttachmentMsg,
    showCreateMessageModal,
    hideCreateMessageModal,
    loadAllMessage,
    displaySendMessage,
    displayReceiveMessage,
    sendTMGMessage,
    loadTMG
} from "../common/common-message.js";
import { loadAllCategorie } from "./wiki/wiki.js";
import { loadMyStation } from "./station.js";
import { changePhoto } from "./photo.js";

window.addEventListener('load', () => {
    messagerie();
    wiki();
    loadMyStation();
    actu();

    //Load initial
    const initial = document.querySelectorAll('.initial');
    initial.forEach(ini => ini.innerHTML = getNom().charAt(0) + ' ' + getPrenom().charAt(0));

    //Load personal data
    document.querySelector('.username').innerHTML = getUsername();
    document.querySelector('.fullname').innerHTML = getNom() + ' ' + getPrenom();

    document.getElementById('sign-out').addEventListener('click', () => {
        removeToken();
        window.location = "../index.html";
    });

    document.getElementById('down').addEventListener('click', () => {
        document.querySelector('.dropdown-menu').classList.toggle('show-dropdown-menu');
    });

    document.getElementById('display-fn').innerHTML = 'Bienvenue, ' + getNom() + ' ' + getPrenom();

    document.querySelector('.home-item').addEventListener('click', () => changeMenuItem(0));
    document.querySelector('.message-item').addEventListener('click', () => changeMenuItem(1));
    document.querySelector('.wiki-station-item').addEventListener('click', () => changeMenuItem(2));
    document.querySelector('.actu-item').addEventListener('click', () => changeMenuItem(3));

    //Change photo
    document.getElementById('chphoto').addEventListener('change', (e) => {
        changePhoto(e.target.files[0]);
    });
    //Load photo
    const photoUrl = getPhoto();
    console.log(photoUrl);
    if (photoUrl !== 'undefined') {
        console.log("aaaa");
        document.getElementById('photo').src = photoUrl;
        document.querySelector('.user-informations').removeChild(document.querySelector('.initial'));
    } else {
        document.querySelector('.user-informations').removeChild(document.querySelector('#photo'));
    }
});

function changeMenuItem(index) {
    const navItems = document.querySelectorAll('.nav-bar-item');
    navItems.forEach(item => item.classList.remove('selected-item'));

    const contents = document.querySelectorAll('.content');
    contents.forEach(item => item.classList.remove('selected-item'));

    navItems[index].classList.add('selected-item');
    contents[index].classList.add('selected-item');
}

function messagerie() {
    loadAllMessage();
    loadTMG();
    displayReceiveMessage();

    document.getElementById('add-attachment-msg').addEventListener('change', (e) => {
        if (e.target.files[0] !== null) {
            addAttachmentMsg(e.target.files[0]);
        }
    });
    document.getElementById('new-message-button').addEventListener('click', () => showCreateMessageModal());
    document.getElementById('send-message').addEventListener('click', () => sendTMGMessage());
    document.getElementById('cancel-message').addEventListener('click', () => hideCreateMessageModal());

    document.querySelector('.msg-item-receives').addEventListener('click', (e) => {
        document.querySelector('.msg-item-send').classList.remove('msg-selected');
        document.querySelector('.msg-item-receives').classList.add('msg-selected');
        displayReceiveMessage();
    });

    //Remove dst fied
    const mainContainer = document.querySelector('.create-message-container');
    mainContainer.removeChild(document.querySelector('.dst-list'));
    mainContainer.removeChild(document.querySelector('.w-msg-h'));

    document.querySelector('.msg-item-send').addEventListener('click', (e) => {
        document.querySelector('.msg-item-receives').classList.remove('msg-selected');
        document.querySelector('.msg-item-send').classList.add('msg-selected');
        displaySendMessage();
    });
}

function wiki() {
    loadAllCategorie();
}

function actu() {
    const container = document.getElementById("actu-container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    loadAllActu((data) => {
        data.actus.forEach(a => {
            displayActu(a.title, a.details, a.date, a._id);
        });
    });
}

function displayActu(title, details, date, id) {
    const container = document.getElementById("actu-container");

    const template = `
        <div class="actu">
            <h1>${title}</h1>
            <h3>${date.toString()}</h3>
            <h2>${details}</h2>
        </div>
    `;
    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.actu');
    container.appendChild(element);
}