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
            const station = data.stations.find(s => s.gerant.nom === getNom() && s.gerant.prenom === getPrenom());
            if (station != null) {
                //Afficher top service
                let indicateur = `<i class="material-icons">arrow_downward</i>`;
                if (station.top_service >= station.objectif_top_service) {
                    indicateur = `<i class="material-icons">arrow_upward</i>`;
                }
                document.querySelector('#top-service').innerHTML = "Indicateur de votre station: <span>" + station.top_service + "</span>" + indicateur;
                document.querySelector('#obj-top-service').innerHTML = "Objectif top service: <span>" + station.objectif_top_service + "</span>";
                document.querySelector('#indicateur-fil').innerHTML = "Indicateur filiale:  <span>" + station.indicateur_filial + "</span>";

                //Afficher les informations sur la station
                document.querySelector('.st-name').innerHTML = station.nom;
                document.querySelector('.st-ville').innerHTML = station.ville;
                document.querySelector('.st-lieu').innerHTML = station.location;
                document.querySelector('.st-contact').innerHTML = station.service_client;

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
    const idm = new Date().getMonth();

    //Afficher le mois courant
    document.querySelector('.current-month').innerHTML = month[idm];

    //Afficher les objectifs de l'année
    document.querySelector('.obj-carburant').innerHTML = objectif["janvier"].carburant.objectif + "T";
    document.querySelector('.obj-lubrifiant').innerHTML = objectif["janvier"].lubrifiant.objectif + "T";
    document.querySelector('.obj-sfs').innerHTML = objectif["janvier"].sfs.objectif + "FCFA";
    document.querySelector('.obj-gpl').innerHTML = objectif["janvier"].gpl.objectif + "T";

    //Afficher les résultats du mois courant
    const currentObjectif = objectif[month[idm]];
    document.querySelector('.val-carburant').innerHTML = currentObjectif.carburant.value + "T";
    document.querySelector('.val-lubrifiant').innerHTML = currentObjectif.lubrifiant.value + "T";
    document.querySelector('.val-sfs').innerHTML = currentObjectif.sfs.value + "FCFA";
    document.querySelector('.val-gpl').innerHTML = currentObjectif.gpl.value + "T";

    console.log(objectif["janvier"].carburant.objectif);
    console.log(currentObjectif.carburant.value);

    document.querySelector('.ind-carburant').innerHTML = parseInt(objectif["janvier"].carburant.objectif, 10) <= parseInt(currentObjectif.carburant.value, 10) ?
        `<i class="material-icons">arrow_upward</i>` :
        `<i class="material-icons">arrow_downward</i>`;

    document.querySelector('.ind-lubrifiant').innerHTML = parseInt(objectif["janvier"].lubrifiant.objectif, 10) <= parseInt(currentObjectif.lubrifiant.value, 10) ?
        `<i class="material-icons">arrow_upward</i>` :
        `<i class="material-icons">arrow_downward</i>`;

    document.querySelector('.ind-sfs').innerHTML = parseInt(objectif["janvier"].sfs.objectif, 10) <= parseInt(currentObjectif.sfs.value, 10) ?
        `<i class="material-icons">arrow_upward</i>` :
        `<i class="material-icons">arrow_downward</i>`;

    document.querySelector('.ind-gpl').innerHTML = parseInt(objectif["janvier"].gpl.objectif, 10) <= parseInt(currentObjectif.gpl.value, 10) ?
        `<i class="material-icons">arrow_upward</i>` :
        `<i class="material-icons">arrow_downward</i>`;

    //afficher les 3 dernier mois possible de l'année
    for (let i = idm - 1; i >= 0 && i >= idm - 3; i--) {
        document.querySelector('.month-' + (idm - i)).innerHTML = month[i];
        document.querySelector('.month-carburant-' + (idm - i)).innerHTML = objectif[month[i]].carburant.value + "T";
        document.querySelector('.month-lubrifiant-' + (idm - i)).innerHTML = objectif[month[i]].lubrifiant.value + "T";
        document.querySelector('.month-sfs-' + (idm - i)).innerHTML = objectif[month[i]].sfs.value + "FCFA";
        document.querySelector('.month-gpl-' + (idm - i)).innerHTML = objectif[month[i]].gpl.value + "T";
    }

}