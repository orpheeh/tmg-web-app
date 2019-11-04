import { getToken } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";
import { TMG } from "../common/role.js";

let users = [];

export function onAddStationButtonPressed() {
    addStation('Nouvelle station');
}

export function onUpdateStationButtonPressed() {

}

function addStation(nom) {

    const token = getToken();
    fetch(IP + '/tmg/station/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nom,
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        clearList();
        loadAllStation();
    });
}

function updateStation(nom, admin, id) {
    const token = getToken();
    fetch(IP + '/tmg/station/update/' + id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            nom,
            admin
        })
    }).then(response => {
        if (response.status === 200) {
            clearList();
            loadAllStation();
        }
    });
}

function clearList() {
    const stations = document.querySelectorAll('.station-list .station');
    const container = document.querySelector('.station-list');

    stations.forEach(station => container.removeChild(station));
}

export function setUsersList(pUsers) {
    users = pUsers;
    loadAllStation();
}

export function loadAllStation() {
    const token = getToken();

    const container = document.querySelector('.station-list');
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
            data.stations.forEach(station => {
                fetch(IP + '/tmg/station/objectif/' +
                    station._id, {
                        method: 'GET',
                        headers: {
                            'content-type': 'application/json',
                            'authorization': 'Bearer ' + token
                        }
                    }).then(response => response.json()).then(data => {
                    console.log(data.objectifs.length);
                    const objButton = data.objectifs.length == 0 ? `<button class="add-objectif-station" title="ajouter un objectif"><i class="material-icons">add</i></button>` : "";
                    const template = `
                            <div class="station">
                                <i class="material-icons">ev_station</i>
                                <div class="form-group">
                                    <label>Nom de la station</label>
                                    <input type="text" class="station-name" value="Nouvelle station" />
                                </div>

                                <div class="form-group">
                                    <label>Responsable siège</label>
                                    <select class="station-tmg"></select>
                                </div>

                                <div class="actions">
                                <button class="update-station" title="Enregistrer la modification"><i class="material-icons">edit</i></button>
                                <button class="delete-station" title="Supprimer la station"><i class="material-icons">delete</i></button>
                                ${objButton}
                                </div>
                            </div>
                            `;
                    const newDocument = new DOMParser().parseFromString(template, 'text/html');
                    const element = newDocument.querySelector('.station');
                    element.querySelector('.update-station').addEventListener('click', () => {
                        const nom = element.querySelector('.station-name').value;
                        const tmg = element.querySelector('.station-tmg').value;
                        if (tmg === 'none') {
                            tmg === undefined;
                        }
                        updateStation(nom, tmg, station._id);
                    });
                    element.querySelector('.delete-station').addEventListener('click', () => {
                        deleteStation(station._id);
                    });
                    element.querySelector('.station-name').value = station.nom;

                    if (data.objectifs.length == 0) {
                        element.querySelector('.add-objectif-station').addEventListener('click', () => {
                            showObjectifModal();
                            document.querySelector('.modal-obj-station').innerHTML = station._id;
                        });
                    }

                    const tmgSelected = element.querySelector('.station-tmg');

                    const option = document.createElement('option');
                    option.value = 'none';
                    option.innerHTML = 'Aucun responsable';
                    tmgSelected.append(option);
                    users.forEach(u => {
                        if (u.role === TMG) {
                            const option = document.createElement('option');
                            option.value = u._id;
                            option.innerHTML = u.nom + ' ' + u.prenom;
                            tmgSelected.append(option);
                        }
                    });
                    if (station.admin !== undefined && station.admin !== null) {
                        tmgSelected.value = station.admin._id;
                    } else {
                        tmgSelected.value = 'none';
                    }
                    container.appendChild(element);
                });
            });
        }
    });
}

function addObjectifStation(station, carburant, lubrifiant, sfs, gpl) {
    const token = getToken();
    const annee = new Date().getFullYear();
    fetch(IP + '/tmg/station/objectif/create', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            annee,
            station,
            janvier: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            fevrier: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            mars: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            avril: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            mai: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            juin: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            juillet: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            aout: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            janvier: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            septembre: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            octobre: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            novembre: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            },
            decembre: {
                carburant: { objectif: carburant },
                lubrifiant: { objectif: lubrifiant },
                sfs: { objectif: sfs },
                gpl: { objectif: gpl },
            }
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Impossible de créer l'objectif pour cette année");
        }
    }).then(objectif => {
        if (objectif !== undefined) {
            console.log(objectif);
            alert("Objectif créer pour l'année " + annee);
        }
    });
}

function deleteStation(id) {
    const token = getToken();
    fetch(IP + '/tmg/station/delete/' + id, {
        method: 'DELETE',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            clearList();
            loadAllStation();
        } else {
            alert("Error " + response.status);
        }
    });
}

export function saveObjectif() {
    const carburant = document.getElementById('carburant').value;
    const lubrifiant = document.getElementById('lubrifiant').value;
    const sfs = document.getElementById('sfs').value;
    const gpl = document.getElementById('gpl').value;
    const station = document.querySelector('.modal-obj-station').innerHTML;
    addObjectifStation(station, carburant, lubrifiant, sfs, gpl);
}

export function showObjectifModal() {
    document.querySelector('.objectif-modal').classList.add('show-modal');
}

export function hideObjectifModal() {
    document.querySelector('.objectif-modal').classList.remove('show-modal');
}