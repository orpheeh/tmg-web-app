import { removeToken } from "../common/session.js";
import { onCreateUserButtonPressed, searchUser, actualizeUsersList, loadAllUser } from "./user-management.js";
import { onAddStationButtonPressed, showObjectifModal, hideObjectifModal, saveObjectif, importStation, exportStationForUpdate } from "./station-management.js";
import { createCategorie, loadAllWikiCategorie } from "./wiki-management.js";
import { hideBigLoadingScreen, showBigLoadingScreen } from "../common/loading-screen.js";

let initialLoadingItemCount = 2;

function onLoadingItemFinish() {
    initialLoadingItemCount--;
    if (initialLoadingItemCount === 0) {
        hideBigLoadingScreen();
    }
}

window.addEventListener('load', () => {
    showBigLoadingScreen();

    userManagement();
    stationManagement();
    wikiManagement();
    changeMenuItem('user');

    document.getElementById('user-management-item').addEventListener('click', () => changeMenuItem('user'));
    document.getElementById('station-management-item').addEventListener('click', () => changeMenuItem('station'));
    document.getElementById('wiki-management-item').addEventListener('click', () => changeMenuItem('wiki'));
});

function wikiManagement() {
    loadAllWikiCategorie(() => {
        onLoadingItemFinish();
    });
    document.getElementById('create-wiki-cat').addEventListener('click', () => {
        const element = element
        const nom = element.value;
        element.value = "";
        createCategorie(nom);
    });
}

function userManagement() {
    document.getElementById('add-user-button').addEventListener('click', () => onCreateUserButtonPressed());
    loadAllUser(() => {
        onLoadingItemFinish();
    });
    document.getElementById('search-bar-input').addEventListener('keyup', (e) => searchUser(e));
    document.getElementById('actualize-users-list').addEventListener('click', () => actualizeUsersList());
    document.getElementById('sign-out').addEventListener('click', () => {
        removeToken();
        window.location = "../index.html";
    });
    document.getElementById('down').addEventListener('click', () => {
        document.querySelector('.dropdown-menu').classList.toggle('show-dropdown-menu');
    });
}

function changeMenuItem(item) {
    const a = document.querySelectorAll('.nav-bar .nav-bar-item');
    a.forEach(e => e.classList.remove('selected-item'));

    const contents = document.querySelectorAll('.main-content .main-content-item');
    contents.forEach(e => e.classList.remove('selected-item'));

    if (item === 'user') {
        document.getElementById('user-management-item').classList.add('selected-item');
        document.querySelector('.users-table').classList.add('selected-item');

    } else if (item === 'station') {
        document.getElementById('station-management-item').classList.add('selected-item');
        document.querySelector('.station-table').classList.add('selected-item');
    } else if (item === 'wiki') {
        document.getElementById('wiki-management-item').classList.add('selected-item');
        document.querySelector('.wiki-table').classList.add('selected-item');
    }
}

function stationManagement() {
    document.getElementById('add-station-button').addEventListener('click', () => onAddStationButtonPressed());
    document.getElementById('import-excel').addEventListener('click', () => importStation());
    document.getElementById('export-excel').addEventListener('change', (e) => {
        if (e.target.files[0] !== undefined) {
            exportStationForUpdate(e.target.files[0]);
        }
    });

    document.querySelector('.save-obj').addEventListener('click', () => { saveObjectif(); });
    document.querySelector('.cancel-obj').addEventListener('click', () => { hideObjectifModal(); });
}