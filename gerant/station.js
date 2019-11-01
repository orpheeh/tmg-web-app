import { getToken, getId, getUsername, getNom, getPrenom } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";


export function loadMyStation() {
    const token = getToken();
    fetch(IP + '/tmg/station/', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status == 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        if (data !== null && data !== undefined) {
            console.log(data);
            console.log(getUsername());
            const station = data.stations.find(s => s.gerant.nom === getNom() && s.gerant.prenom === getPrenom());
            if (station != null) {
                loadAllObjectif(station._id, station.nom, station.gerant.nom + ' ' + station.gerant.prenom);
            }
        }
    });
}

function loadAllObjectif(id, nom, gerant) {
    const token = getToken();
    fetch(IP + '/tmg/station/objectif/' + id, {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            console.log(data);
            const current = new Date().getFullYear();
            const objectif = data.objectifs.find(o => o.annee == current + '-' + id);
            if (objectif) {
                displayStationDetails(objectif, nom, gerant);
            }
        }
    })
}

function displayStationDetails(objectif, nom, gerant, annee) {
    const month = [
        "janvier",
        "fevrier",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "aout",
        "septembre",
        "octobre",
        "novembre",
        "decembre"
    ];

    const template = `
    <div class="sd">
        <h1 class="sd-name">Station ${nom}</h1>
        <h5 class="sd-gerant-name">${gerant}</h5>
        <div class="sd-objectifs">

        </div>
    </div>
    `;

    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.sd');

    const idm = new Date().getMonth();

    element.querySelector('.sd-objectifs').appendChild(displayStationDetailsMonth(month[idm], objectif[month[idm]], objectif._id));

    const container = document.querySelector('.station-details');
    container.appendChild(element);
}


function displayStationDetailsMonth(month, obj, id) {
    const template = `
    <div class="sdo-month">
        <div class="sdom-objectifs">
            <div class="carburant sdo">
                <h3 class="sdo-name">Carburant</h3>
                <h4 class="carburant sdo-value">${obj.carburant.objectif} Tonnes</h4>
                <div class="sdo-result">
                    <p class="sdor-value">Resultat ${obj.carburant.value}</p>
                </div>
            </div>
            <div class="lubrifiant sdo">
                <h3 class="sdo-name">Lubrifiant</h3>
                <h4 class="lubrifiant sdo-value">${obj.lubrifiant.objectif} Tonnes</h4>
                <div class="sdo-result">
                    <p class="sdor-value">Resultat ${obj.lubrifiant.value}</p>
                </div>
            </div>

            <div class="sfs sdo">
                <h3 class="sdo-name">SFS</h3>
                <h4 class="sfs sdo-value">${obj.sfs.objectif} FCFA</h4>
                <div class="sdo-result">
                    <p class="sdor-value">Resultat ${obj.sfs.value}</p>
                </div>
            </div>

            <div class="gpl sdo">
                <h3 class="sdo-name">GPL</h3>
                <h4 class="gpl sdo-value">${obj.gpl.objectif} Tonnes</h4>
                <div class="sdo-result">
                    <p class="sdor-value">Resultat ${obj.gpl.value}</p>
                </div>
            </div>
        </div>
    </div>
    `;
    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.sdo-month');

    return element;
}