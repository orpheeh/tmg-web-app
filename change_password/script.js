import { IP } from "../common/tmg-web-service.js";
import { getToken } from "../common/session.js";

window.addEventListener('load', () => {
    document.querySelector('button').addEventListener('click', () => changePasswordButtonPressed());
});

function changePasswordButtonPressed() {
    const password = document.getElementById('password').value;
    const newpassword = document.getElementById('newpassword').value;
    const confpassword = document.getElementById('confnewpassword').value;

    if (newpassword === confpassword) {
        changePassword(password, newpassword);
    }
}

function changePassword(password, newpassword) {
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
        } else {
            alert('error ' + response.status);
        }
    }).then(data => {
        console.log(data);
        if (data !== undefined) {
            window.location = "../index.html";
        }
    });
}