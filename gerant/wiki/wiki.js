import { IP } from "../../common/tmg-web-service.js";
import { getToken } from "../../common/session.js";

export function displayCategorie(categorie) {
    console.log(categorie.nom + ' ' + categorie._id);
    const template = `
     <div class="wiki-cat i${categorie._id}">
        <div class="wiki-cat-header">
             <h1 class="wiki-cat-name">${categorie.nom}</h1>
        </div>   
        
        <div class="wiki-cat-container">
        </div>
     </div>
    `;
    const container = document.querySelector('.wiki-content');

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.wiki-cat');

    container.appendChild(element);
}


export function displayWiki(wiki) {
    if (wiki.files[0] === undefined) {
        return;
    }
    const template = `
     <div class="wiki">
        <a href="${wiki.files[0].url}" title="Il y' a deux jours"><i class="material-icons">image</i><span>${wiki.files[0].filename.split('-')[1]}</span></a>
        <p>${wiki.user.nom} ${ wiki.user.prenom}</p>
     </div>
    `;
    const container = document.querySelector('.i' + wiki.categorie._id + ' .wiki-cat-container');

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.wiki');
    container.appendChild(element);
}

export function loadAllWiki(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/wiki/', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            data.wikis.forEach(wiki => displayWiki(wiki));
        }
        callback();
    });
}

export function loadAllCategorie(callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/wiki/categories', {
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
            data.categories.forEach(c => {
                displayCategorie(c);
            })
            loadAllWiki(callback);
        }
    })
}