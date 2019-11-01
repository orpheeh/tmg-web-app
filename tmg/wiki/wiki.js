import { IP } from "../../common/tmg-web-service.js";
import { getToken } from "../../common/session.js";

export function displayCategorie(categorie) {
    console.log(categorie.nom + ' ' + categorie._id);
    const template = `
     <div class="wiki-cat i${categorie._id}">
        <div class="wiki-cat-header">
             <h1 class="wiki-cat-name">${categorie.nom}</h1>
             <div></div>
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
            publishWiki(categorieId, file);
        }
    })

    container.appendChild(element);
}


export function displayWiki(wiki) {
    const template = `
     <div class="wiki">
        <a href="${wiki.files[0].url}" title="Il y' a deux jours"><i class="material-icons" width="100px" height="100px">image</i><span>${wiki.files[0].filename}</span></a>
        <p>${wiki.user.nom} ${ wiki.user.prenom}</p>
     </div>
    `;
    const container = document.querySelector('.i' + wiki.categorie._id + ' .wiki-cat-container');

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.wiki');
    console.log("WIki " + wiki);
    container.appendChild(element);
}

export function loadAllWiki() {
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
    });
}

export function loadAllCategorie() {
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
    })
}

export function publishWiki(categorie, file) {
    const formData = new FormData();
    formData.append('categorieId', categorie);
    formData.append('documents', file);

    const token = getToken();
    fetch(IP + '/tmg/wiki/create', {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + token
        },
        body: formData
    }).then(response => {
        if (response.status === 200) {
            console.log("Success");
            loadAllWiki();
        } else {
            alert("Error " + response.status);
        }
    })
}