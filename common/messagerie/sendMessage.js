import { IP } from '../../common/tmg-web-service.js';
import { getToken } from '../../common/session.js';

export function sendMessage(objet, content, destinataires, attachments, callback) {
    const token = getToken();
    const formData = new FormData();
    attachments.forEach(attachment => formData.append('attachment', attachment));
    formData.append('objet', objet);
    formData.append('content', content);
    formData.append('destinataires', JSON.stringify(destinataires));
    fetch(IP + '/tmg/messagerie/send', {
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
        if (data !== undefined) {
            callback(data);
        }
    });
}