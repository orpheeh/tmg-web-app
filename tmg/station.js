import { getToken, getId } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";
import { gerants } from "../common/common-message.js";
import { hideBigLoadingScreen, showBigLoadingScreen } from "../common/loading-screen.js";

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

export function loadAllStation(callback = () => {}) {
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
            const container = document.querySelector('.station-list');
            data.stations.forEach(station => {
                if (station.admin !== undefined && station.admin !== null && station.admin._id === getId()) {
                    const g = station.gerant === undefined || station.gerant === null ? 'Aucun gerant' : station.gerant.nom + ' ' + station.gerant.prenom;
                    displayStation(station._id, station.nom, g, container, station);
                }
            });
        }
        callback();
    });
}

function displayStation(id, nom, gerant, container, station) {
    const template = `
    <div class="station">
        <h4 class="station-name-a"><i class="material-icons">local_gas_station</i> ${nom}</h4>
    </div>
    `;
    const element = new DOMParser()
        .parseFromString(template, 'text/html').querySelector('.station');
    element.addEventListener('click', () => {
        showBigLoadingScreen();
        loadAllObjectif(id, nom, gerant, station, () => {
            hideBigLoadingScreen();
        });
    });
    container.appendChild(element);
}

let objectifId;
let stationId;

let updateStationActionCount = 2;

function onUpdateStationActionFinish() {
    updateStationActionCount--;
    if (updateStationActionCount <= 0) {
        hideBigLoadingScreen();
        updateStationActionCount = 2;
    }
}

export function updateStationConfig(callback = () => {}) {
    const updateButton = document.getElementById('update-station');
    updateButton.addEventListener('click', function() {
        showBigLoadingScreen();
        const idm = new Date().getMonth();

        const stationObjectifCarburant = document.getElementById('obj-carburant');
        const stationObjectifLubrifiant = document.getElementById('obj-lubrifiant');
        const stationObjectifSFS = document.getElementById('obj-sfs');
        const stationObjectifGPL = document.getElementById('obj-gpl');

        const stationValueCarburant = document.getElementById('val-carburant');
        const stationValueLubrifiant = document.getElementById('val-lubrifiant');
        const stationValueSFS = document.getElementById('val-sfs');
        const stationValueGPL = document.getElementById('val-gpl');

        const stationNameInput = document.getElementById('st-name');
        const stationVilleInput = document.getElementById('st-ville');
        const stationContactInput = document.getElementById('st-contact');
        const stationLieuInput = document.getElementById('st-lieu');
        const stationGerantInput = document.getElementById('st-gerant-list');

        const stationTopServiceInput = document.getElementById('top-service');
        const stationIndicateurFiliale = document.getElementById('indicateur-filiale');
        const stationObjectifTopService = document.getElementById('obj-top-service');

        //Mettre à jour les objectifs
        updateObjectifsStation(
            stationObjectifCarburant.value,
            stationObjectifLubrifiant.value,
            stationObjectifSFS.value,
            stationObjectifGPL.value,
            month[idm],
            stationValueCarburant.value,
            stationValueLubrifiant.value,
            stationValueSFS.value,
            stationValueGPL.value,
            objectifId, () => {
                onUpdateStationActionFinish();
            });

        //Mettre à jour les informations de la station
        updateStation(
            stationNameInput.value,
            stationVilleInput.value,
            stationLieuInput.value,
            stationContactInput.value,
            stationTopServiceInput.value,
            stationIndicateurFiliale.value,
            stationGerantInput.value,
            stationId,
            stationObjectifTopService.value, () => {
                onUpdateStationActionFinish();
            });
    });
}

function loadAllObjectif(id, nom, gerant, station, callback = () => {}) {
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
    }).
    then(data => {
        if (data !== undefined) {
            const current = new Date().getFullYear();
            const objectif = data.objectifs.find(o => o.annee == current + '-' + id);

            //Affichier les informations générale de la station
            const stationNameInput = document.getElementById('st-name');
            const stationVilleInput = document.getElementById('st-ville');
            const stationContactInput = document.getElementById('st-contact');
            const stationLieuInput = document.getElementById('st-lieu');

            //Charger la liste des gérants et choisir le gérant actuel automatiquement
            const stationGerantInput = document.getElementById('st-gerant-list');
            while (stationGerantInput.firstChild) {
                stationGerantInput.removeChild(stationGerantInput.firstChild);
            }
            const option1 = document.createElement('option');
            option1.value = "none";
            option1.innerHTML = "Aucun gérant";
            stationGerantInput.appendChild(option1);
            gerants.forEach(g => {
                const option = document.createElement('option');
                option.value = g._id;
                option.innerHTML = g.nom + ' ' + g.prenom;
                stationGerantInput.appendChild(option);
            });
            if (station.gerant === undefined || station.gerant === null) {
                stationGerantInput.value = "none";
            } else {
                stationGerantInput.value = station.gerant._id;
            }

            //Afficher le top service
            const stationTopServiceInput = document.getElementById('top-service');
            const stationIndicateurFiliale = document.getElementById('indicateur-filiale');
            const stationObjectifTopService = document.getElementById('obj-top-service');

            stationTopServiceInput.value = station.top_service;
            stationIndicateurFiliale.value = station.indicateur_filial;
            stationObjectifTopService.value = station.objectif_top_service;

            stationNameInput.value = station.nom;
            stationVilleInput.value = station.ville;
            stationLieuInput.value = station.location;
            stationContactInput.value = station.service_client;

            if (objectif !== undefined) {
                objectifId = objectif._id;
                stationId = station._id;
                const stationObjectifCarburant = document.getElementById('obj-carburant');
                const stationObjectifLubrifiant = document.getElementById('obj-lubrifiant');
                const stationObjectifSFS = document.getElementById('obj-sfs');
                const stationObjectifGPL = document.getElementById('obj-gpl');

                const stationValueCarburant = document.getElementById('val-carburant');
                const stationValueLubrifiant = document.getElementById('val-lubrifiant');
                const stationValueSFS = document.getElementById('val-sfs');
                const stationValueGPL = document.getElementById('val-gpl');

                //Afficher les objectifs de la station
                stationObjectifCarburant.value = objectif["janvier"].carburant.objectif;
                stationObjectifLubrifiant.value = objectif["janvier"].lubrifiant.objectif;
                stationObjectifSFS.value = objectif["janvier"].sfs.objectif;
                stationObjectifGPL.value = objectif["janvier"].gpl.objectif;

                const idm = new Date().getMonth();
                const current = objectif[month[idm]];

                //Afficher les resultats du mois en cours
                stationValueCarburant.value = current.carburant.value;
                stationValueLubrifiant.value = current.lubrifiant.value;
                stationValueSFS.value = current.sfs.value;
                stationValueGPL.value = current.gpl.value;
            }
        }
        callback();
    })
}

function updateStation(nom, ville, location, service_client, top_service, indicateur_filial, gerant, id, objectif_top_service, callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/station/update/' + id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nom,
            ville,
            location,
            service_client,
            top_service,
            indicateur_filial,
            gerant,
            objectif_top_service
        })
    }).then(response => {
        if (response.status === 200) {
            alert("Mise à jour effectué");
        }
        callback();
    });
}

function updateObjectifsStation(carburant, lubrifiant, sfs, gpl, month, vc, vl, vs, vg, id, callback = () => {}) {
    const token = getToken();
    const json = `{
        "${month}": {
            "carburant": { "objectif": "${carburant}", "value": "${vc}" },
            "lubrifiant": { "objectif": "${lubrifiant}", "value": "${vl}" },
            "sfs": { "objectif": "${sfs}", "value": "${vs}" },
            "gpl": { "objectif": "${gpl}", "value": "${vg}" }
        }}`;
    fetch(IP + '/tmg/station/objectif/update/' + id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: json
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            console.log(data);
            alert("Mise à jour, ok");
        }
        callback();
    });
}