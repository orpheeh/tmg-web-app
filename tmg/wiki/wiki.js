import { IP } from "../../common/tmg-web-service.js";
import { getToken } from "../../common/session.js";
import { hideBigLoadingScreen, showBigLoadingScreen } from "../../common/loading-screen.js";

export function displayCategorie(categorie) {
    console.log(categorie.nom + ' ' + categorie._id);
    const template = `
     <div class="wiki-cat i${categorie._id}">
        <div class="wiki-cat-header">
             <h1 class="wiki-cat-name">${categorie.nom}</h1>
             <div class="wiki-feedback">
                <h1 class="progress-indicator"></h1>
             </div>
             <div class="file-form-group">
                <label for="new-wiki-${categorie._id}"><i class="material-icons">attach_file</i></label>
                <input type="file" class="publish-wiki-btn" id="new-wiki-${categorie._id}" />
             </div>
        </div>   
        <div class="wiki-cat-container">
        </div>
     </div>
    `;
    const container = document.querySelector('.wiki-content');

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.wiki-cat');
    element.querySelector('#new-wiki-' + categorie._id).addEventListener('change', e => {
        if (e.target.files != [] && e.target.files !== undefined && e.target.files !== null) {
            const categorieId = categorie._id;
            const file = e.target.files[0];
            publishWiki(categorieId, file, element.querySelector('.progress-indicator'));
        }
    })

    container.appendChild(element);
}


export function displayWiki(wiki) {
    if (wiki.files[0] === undefined) {
        return;
    }
    const template = `
     <div class="wiki">
        <a href="${wiki.files[0].url}"><i class="material-icons" width="100px" height="100px">image</i><span>${wiki.files[0].filename.split('-')[1]}</span></a>
        <p>${wiki.user.nom} ${wiki.user.prenom}</p>
     </div>
    `;
    const container = document.querySelector('.i' + wiki.categorie._id + ' .wiki-cat-container');

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.wiki');
    console.log("WIki " + wiki);
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
        const container = document.querySelectorAll('.wiki-cat-container');
        container.forEach(c => {
            while (c.firstChild) {
                c.removeChild(c.firstChild);
            }
        });
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
            loadAllWiki();
        }
        callback();
    })
}

let progress = 0;

export async function publishWiki(categorie, file, progressElement) {

    const token = getToken();

    var data = new FormData();

    var request = new XMLHttpRequest();

    // File selected by the user
    // In case of multiple files append each of them
    data.append('categorieId', categorie);
    data.append('documents', file);

    // AJAX request finished
    request.addEventListener('load', function(e) {
        // request.response will hold the response from the server
        progressElement.innerHTML = "";
        showBigLoadingScreen();
        loadAllWiki(() => {
            hideBigLoadingScreen();
        });
    });

    // Upload progress on request.upload
    request.upload.addEventListener('progress', function(e) {
        var percent_complete = (e.loaded / e.total) * 100;
        // Percentage of upload completed
        progressElement.innerHTML = "Téléchargement: " + Math.round(percent_complete) + "%";
    });

    // If server is sending a JSON response then set JSON response type
    request.responseType = 'json';

    // Send POST request to the server side script
    request.open('post', IP + '/tmg/wiki/create');
    request.setRequestHeader('Authorization', 'Bearer ' + token);
    request.send(data);
}