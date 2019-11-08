import { IP } from "../common/tmg-web-service.js";
import { getToken } from "../common/session.js";
import { showBigLoadingScreen, hideBigLoadingScreen } from "../common/loading-screen.js";

let _categorieList = [];

export function createCategorie(nom) {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/wiki/categorie/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            nom
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            _categorieList.push(data.newCategorie);
            console.log(data);
            loadAllWikiCategorie(() => hideBigLoadingScreen());
        }
    });
}

function displayCategorie(categorie) {
    const h1 = document.createElement('h1');
    h1.innerHTML = `${categorie.nom} <span class="del-wiki-cat">&times;</span>`;
    h1.querySelector('.del-wiki-cat').addEventListener('click', () => {
        deleteCategorie(categorie._id);
    });
    const container = document.querySelector('.wm-list');
    container.appendChild(h1);
}

export function deleteCategorie(id) {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/wiki/categorie/' + id, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token,
        },
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            loadAllWikiCategorie(() => hideBigLoadingScreen());
        }
    });
}

function clearCatWikiList() {
    const container = document.querySelector('.wm-list');

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

export function loadAllWikiCategorie(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/wiki/categories', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token,
        },
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            clearCatWikiList();
            data.categories.forEach(c => {
                displayCategorie(c);
            })
            callback();
        }
    });
}