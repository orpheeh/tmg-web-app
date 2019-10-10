import { IP } from "../common/tmg-web-service.js";
import { saveToken } from "../common/session.js";
import { ROOT, TMG, GERANT } from "../common/role.js";

window.addEventListener('load', () => {
    document.getElementById('login-button').addEventListener('click', onLoginButtonPressed);
});

function onLoginButtonPressed() {
    hideAllError();
    const username = document.getElementById("username").value;
    const passeword = document.getElementById("password").value;

    login(username, passeword);
}

function login(username, password) {
    fetch(IP + '/tmg/user/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            onLoginError(response.status);
        }
    }).then(data => {
        if (data !== null && data !== undefined) {
            onLoginSuccess(data);
        }
    });
}

function onLoginError(status) {
    if (status === 404) {
        document.getElementById("username-error").classList.add('show-error');
    } else if (status === 401) {
        document.getElementById("password-error").classList.add('show-error');
    } else {
        alert("Problème de connexion avec le serveur, ces une version teste donc vous pouvez juste noté cette erreur merci,");
    }
}

function onLoginSuccess(data) {
    saveToken(data.token, data.user.nom, data.user.prenom, data.user.role);
    let location = "../root/index.html";

    if (data.user.role === TMG) {
        location = "../tmg/index.html";
    } else if (data.user.role === GERANT) {
        location = "../gerant/index.html";
    }
    window.location = location;
}

function hideAllError() {
    const errorMessages = document.querySelectorAll('.error');
    errorMessages.forEach(element => {
        element.classList.remove('show-error');
    })
}