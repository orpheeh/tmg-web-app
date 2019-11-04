import { getToken, getId } from "../common/session.js";
import { IP } from "../common/tmg-web-service.js";

export function loadAllStation(callback = (data) => {}) {
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
            callback(data);
        }
    });
}

export function loadAllUser(callback = (data) => {}) {
    const token = getToken();
    fetch(IP + '/tmg/user/find', {
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
            callback(data);
        }
    });

}

export function loadAllMessage(callback = (data) => {}) {
    const token = getToken();
    fetch(IP + '/tmg/messagerie/myMessages', {
        method: 'GET',
        headers: {
            'authorization': 'Bearer ' + token
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        }
    }).then(data => {
        if (data !== undefined) {
            callback(data);
        }
    })
}

export function loadAllWiki(callback = (data) => {}) {
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
            callback(data);
        }
    });
}

export function loadAllActu(callback = (data) => {}) {
    const token = getToken();
    fetch(IP + '/tmg/actu/all', {
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
            callback(data);
        }
    });
}