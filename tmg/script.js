import { removeToken, getNom, getPrenom, getUsername } from "../common/session.js";
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
import { loadAllStation } from "./station.js";

window.addEventListener('load', () => {

    //Load initial
    const initial = document.querySelectorAll('.initial');
    initial.forEach(ini => ini.innerHTML = getNom().charAt(0) + ' ' + getPrenom().charAt(0));

    //Load personal data
    document.querySelector('.username').innerHTML = getUsername();
    document.querySelector('.fullname').innerHTML = getNom() + ' ' + getPrenom();

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

    wiki();
    messagerie();
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
    loadAllCategorie();
}

function messagerie() {
    loadGerant();
    loadAllMessage();
    loadAllStation();
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