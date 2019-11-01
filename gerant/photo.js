import { IP } from "../common/tmg-web-service.js";
import { getToken, setPhoto, getPhoto } from "../common/session.js";

export function changePhoto(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append('photo', file);
    fetch(IP + '/tmg/user/photo', {
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
    }).then(data => {
        if (data !== undefined && data !== null) {
            setPhoto(data.photo);
            const photoUrl = getPhoto();
            if (photoUrl !== 'undefined') {
                document.getElementById('photo').src = photoUrl;
                const r = document.querySelector('.initial');
                if (r !== null && r !== undefined) {
                    console.log(r);
                    document.querySelector('.user-informations').removeChild(r);
                }
            } else {
                const r = document.querySelector('#photo');
                if (r !== null && r !== undefined) {
                    document.querySelector('.user-informations').removeChild(r);
                }
            }
        }
    })
}