import { getToken, getId } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";

google.charts.load('current', { packages: ['corechart', 'bar'] });

export function loadAllStation() {
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
                if (station.admin._id === getId()) {
                    const g = station.gerant === undefined || station.gerant === null ? 'Aucun gerant' : station.gerant.nom + ' ' + station.gerant.prenom;
                    displayStation(station._id, station.nom, g, container);
                }
            });
        }
    });
}

function displayStation(id, nom, gerant, container) {
    const template = `
    <div class="station">
        <h4 class="station-name-a"><i class="material-icons">local_gas_station</i> ${nom}</h4>
    </div>
    `;
    const element = new DOMParser()
        .parseFromString(template, 'text/html').querySelector('.station');
    element.addEventListener('click', () => {
        const container = document.querySelector('.station-details');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        loadAllObjectif(id, nom, gerant);
    });
    container.appendChild(element);
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
    }).
    then(data => {
        if (data !== undefined) {
            console.log(data);
            const current = new Date().getFullYear();
            const objectif = data.objectifs.find(o => o.annee == current + '-' + id);
            if (objectif !== undefined) {
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

    const carburants = [];
    const lubrifiants = [];
    const sfs = [];
    const gpl = [];
    month.forEach(m => {
        carburants.push(objectif[m].carburant.value);
        lubrifiants.push(objectif[m].lubrifiant.value);
        sfs.push(objectif[m].sfs.value);
        gpl.push(objectif[m].gpl.value);
    });
    const template = `
    <div class="sd">
        <h1 class="sd-name">Station ${nom}</h1>
        <h5 class="sd-year">${objectif.annee.split('-')[0]}</h5>
        <div class="sd-objectifs">

        </div>

        <div class="charts">
            <div class="chart" id="chart-carburant">
            </div>
            <div class="chart" id="chart-lubrifiant">
            </div>
            <div class="chart" id="chart-sfs">
            </div>
            <div class="chart" id="chart-gpl">
            </div>
        </div>
    </div>
    `;
    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.sd');
    const idm = new Date().getMonth();
    element.querySelector('.sd-objectifs').appendChild(displayStationDetailsMonth(month[idm], objectif[month[idm]], objectif._id));
    const container = document.querySelector('.station-details');
    container.appendChild(element);

    drawChart(carburants, document.getElementById('chart-carburant'), "Carburant");
    drawChart(lubrifiants, document.getElementById('chart-lubrifiant'), "Lubrifiant");
    drawChart(sfs, document.getElementById('chart-sfs'), "SFS");
    drawChart(gpl, document.getElementById('chart-gpl'), "GPL");
}

function drawChart(values, element, title) {
    // Define the chart to be drawn.
    var data = google.visualization.arrayToDataTable([
        ['Mois', title],
        ['Janvier', values[0]], // RGB value
        ['Fevrier', values[1]], // English color name
        ['Mars', values[2]],
        ['Avril', values[3]],
        ['Mai', values[4]], // CSS-style declaration
        ['Juin', values[5]], // CSS-style declaration
        ['Juillet', values[6]], // CSS-style declaration
        ['Aout', values[7]], // CSS-style declaration
        ['Septembre', values[8]], // CSS-style declaration
        ['Octobre', values[9]], // CSS-style declaration
        ['Novembre', values[10]], // CSS-style declaration
        ['Decembre', values[11]], // CSS-style declaration
    ]);

    var options = {
        title: 'Motivation and Energy Level Throughout the Day',
        hAxis: {
            title: 'Time of Day',
            format: 'h:mm a',
            viewWindow: {
                min: [7, 30, 0],
                max: [17, 30, 0]
            }
        },
        vAxis: {
            title: 'Rating (scale of 1-10)'
        }
    };

    // Instantiate and draw the chart.
    var materialChart = new google.charts.Bar(element);
    materialChart.draw(data, options);
}


function updateObjectifsStation(carburant, lubrifiant, sfs, gpl, month, vc, vl, vs, vg, id) {
    const token = getToken();
    const json = `{
        "${month}": {
            "carburant": { "objectif": "${carburant}", "value": "${vc}" },
            "lubrifiant": { "objectif": "${lubrifiant}", "value": "${vl}" },
            "sfs": { "objectif": "${sfs}", "value": "${vs}" },
            "gpl": { "objectif": "${gpl}", "value": "${vg}" }
        }}`;
    console.log(json);
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
    });
}

function displayStationDetailsMonth(month, obj, id) {
    const template = `
    <div class="sdo-month">
        <button class="sd-update">update</button>
        <div class="sdom-objectifs">
            <div class="carburant sdo">
                <h3 class="sdo-name">Carburant</h3>
                <input type="text" class="carburant sdo-value" value="${obj.carburant.objectif}" />
                <div class="sdo-result">
                    <span class="sdor-value">Resultat ${obj.carburant.value}</span>
                    <input type="text" value="${obj.carburant.value}"/>
                </div>
            </div>
            <div class="lubrifiant sdo">
                <h3 class="sdo-name">Lubrifiant</h3>
                <input class="lubrifiant sdo-value" type="text" value="${obj.lubrifiant.objectif}" />
                <div class="sdo-result">
                    <span class="sdor-value">Resultat ${obj.lubrifiant.value}</span>
                    <input type="text" value="${obj.lubrifiant.value}"/>
                </div>
            </div>

            <div class="sfs sdo">
                <h3 class="sdo-name">SFS</h3>
                <input class="sfs sdo-value" type="text" value="${obj.sfs.objectif}" />
                <div class="sdo-result">
                    <span class="sdor-value">Resultat: </span>
                    <input type="text" value="${obj.sfs.value}"/>
                </div>
            </div>

            <div class="gpl sdo">
                <h3 class="sdo-name">GPL</h3>
                <input class="gpl sdo-value" type="text" value="${obj.gpl.objectif}" />
                <div class="sdo-result">
                    <span class="sdor-value">Resultat ${obj.gpl.value}</span>
                    <input type="text" value="${obj.gpl.value}"/>
                </div>
            </div>
        </div>
    </div>
    `;
    const element = new DOMParser().parseFromString(template, 'text/html').querySelector('.sdo-month');
    element.querySelector('.sd-update').addEventListener('click', () => {
        const carburant = element.querySelector('.sdo .carburant').value;
        const lubrifiant = element.querySelector('.sdo .lubrifiant').value;
        const sfs = element.querySelector('.sdo .sfs').value;
        const gpl = element.querySelector('.sdo .gpl').value;
        const vc = document.querySelector('.carburant .sdo-result input').value;
        const vl = document.querySelector('.lubrifiant .sdo-result input').value;
        const vs = document.querySelector('.sfs .sdo-result input').value;
        const vg = document.querySelector('.gpl .sdo-result input').value;

        updateObjectifsStation(carburant, lubrifiant, sfs, gpl, month, vc, vl, vs, vg, id);
    });
    return element;
}