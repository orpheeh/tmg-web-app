import { IP } from "../common/tmg-web-service.js";
import { getToken, getNom, getPrenom, hasToken } from "../common/session.js";
import { showBigLoadingScreen, hideBigLoadingScreen } from "../common/loading-screen.js";

window.addEventListener('load', () => {
    if (hasToken() === false) {
        window.location = "../index.html";
    }
    document.querySelector('button').addEventListener('click', () => changePasswordButtonPressed());

    document.querySelector('.username').innerHTML = getNom() + ' ' + getPrenom();
});

function changePasswordButtonPressed() {
    const password = document.getElementById('password').value;
    const newpassword = document.getElementById('newpassword').value;
    const confpassword = document.getElementById('confnewpassword').value;

    if (newpassword === confpassword) {
        changePassword(password, newpassword);
    } else {
        document.getElementById('newpassword').value = "";
        document.getElementById('confnewpassword').value = "";
        alert("Resaissiez correctement le nouveau mot de passe dans les deux champs");
    }
}

function changePassword(password, newpassword) {
    showBigLoadingScreen();
    fetch(IP + '/tmg/user/chpwd', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify({
            password,
            newpassword
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else if (response.status === 401) {
            alert("Mot de passe actuel incorrecte, veuillez réessayer");
            document.getElementById('password').value = "";
        } else {
            alert('Erreur ' + response.status);
        }
    }).then(data => {
        if (data !== undefined) {
            window.location = "../index.html";
        } else {
            hideBigLoadingScreen();
        }

    });
}