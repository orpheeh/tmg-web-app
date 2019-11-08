import { IP } from "../common/tmg-web-service.js";


window.addEventListener('load', () => {
    const username = document.querySelector('#username').value;
    document.getElementById('reinit').addEventListener('click', () => {
        fetch(IP + '/tmg/user/reinitpasswd/' + 'ebibieyannick', {
            method: 'POST',
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                alert("Erreur " + response.status);
            }
        }).then(data => {
            if (data !== null && data !== undefined) {
                console.log(data);
            } else {}
        })
    });
});