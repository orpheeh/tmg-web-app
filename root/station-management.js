import { getToken } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";
import { TMG } from "../common/role.js";
import { hideBigLoadingScreen, showBigLoadingScreen } from "../common/loading-screen.js";

let users = [];

export function onAddStationButtonPressed() {
    showBigLoadingScreen();
    addStation('Nouvelle station', () => {
        hideBigLoadingScreen();
    });
}

export function importStation() {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/station/import', {
        method: 'GET',
        headers: {
            'authorization': 'Beare ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.blob();
        } else {
            response.alert("Error " + response.status);
        }
    }).then(blob => {
        if (blob !== null && blob !== undefined) {
            download(blob, "station-service-" + new Date().getFullYear() + ".xlsx");
        }
        hideBigLoadingScreen();
    });
}

export function exportStationForUpdate(excelFile) {
    showBigLoadingScreen();
    const token = getToken();
    const formData = new FormData();
    formData.append('excel', excelFile, "station-service.xlsx");
    fetch(IP + '/tmg/station/export', {
        method: 'POST',
        headers: {
            'authorization': 'Bearer ' + token
        },
        body: formData
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert('Error ' + response.status);
        }
    }).then(json => {
        //Reload all station
        if (json !== undefined && json !== null) {
            console.log(json);
            clearList();
            loadAllStation(() => hideBigLoadingScreen());
        } else {
            hideBigLoadingScreen();
        }
    });
}

function addStation(nom, callback = () => {}) {

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
            hideBigLoadingScreen();
        }
    }).then(data => {
        clearList();
        loadAllStation(callback);
    });
}

function updateStation(nom, admin, id, callback = () => {}) {
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
            loadAllStation(callback);
        } else {
            hideBigLoadingScreen();
            alert("Erreur " + response.status);
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

export function loadAllStation(callback = () => {}) {
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
            hideBigLoadingScreen();
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
                        showBigLoadingScreen();
                        updateStation(nom, tmg, station._id, () => {
                            hideBigLoadingScreen();
                        });
                    });
                    element.querySelector('.delete-station').addEventListener('click', () => {
                        showBigLoadingScreen();
                        deleteStation(station._id, () => {
                            hideBigLoadingScreen();
                        });
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
            callback();
        }
    });
}

function addObjectifStation(station, carburant, lubrifiant, sfs, gpl) {
    const token = getToken();
    const annee = new Date().getFullYear();
    if (carburant == "" || lubrifiant == "" || sfs == "" || gpl == "") {
        alert("Erreur, Aucun champ ne doit être vide !");
        return;
    }
    showBigLoadingScreen();
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
            hideObjectifModal();
        }
        hideBigLoadingScreen();
    });
}

function deleteStation(id, callback = () => {}) {
    const token = getToken();
    fetch(IP + '/tmg/station/delete/' + id, {
        method: 'DELETE',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            clearList();
            loadAllStation(callback);
        } else {
            alert("Error " + response.status);
            hideBigLoadingScreen();
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