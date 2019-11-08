import { IP } from "../common/tmg-web-service.js";
import { getToken, removeToken } from "../common/session.js";
import { setUsersList } from "./station-management.js";
import { showBigLoadingScreen, hideBigLoadingScreen } from "../common/loading-screen.js";

export function actualizeUsersList() {
    showBigLoadingScreen();
    const container = document.querySelector('.users-table-content');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    loadAllUser(() => {
        hideBigLoadingScreen();
    });
}

export function searchUser(e) {
    console.log(e.target.value);
    const container = document.querySelector('.users-table-content');
    const userElements = document.querySelectorAll('.user');

    userElements.forEach(element => {
        const str = element.querySelector('.nom').value + ' ' +
            element.querySelector('.prenom').value + ' ' +
            element.querySelector('.username').value;
        if (str.toLowerCase().search(e.target.value.toLowerCase()) < 0) {
            container.removeChild(element);
        }
    });
}

export function onCreateUserButtonPressed() {
    const template = `
            <div class="user user-creating">
                <div class="informations">
                    <div class="form-group">
                        <label>Nom</label>
                        <input class="nom" type="text" placeholder="nom">
                    </div>
                    <div class="form-group">
                        <label>Prénom</label>
                        <input class="prenom" type="text" placeholder="prenom">
                    </div>
                    <div class="form-group">
                        <label>Nom d'utilisateur</label>
                        <input class="username" type="text" placeholder="nom d'utilisateur">
                    </div>
                    <div class="form-group">
                        <label>Adresse email</label>
                        <input class="email" type="email" placeholder="Adresse email">
                    </div>
                    <div class="form-group">
                        <label>Téléphone</label>
                        <input class="tel" type="text" placeholder="téléphone">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select class="role" value="1">
                                <option value="1">TMG</option>
                                <option value="2">GERANT</option>
                            </select>
                    </div>
                </div>

                <div class="actions">
                    <button  class="cancel-create">Annuler</button>
                    <button class="create-user-button">Enregistrer</button>
                </div>
            </div>
    `;

    const newDocument = new DOMParser().parseFromString(template, 'text/html');
    const container = document.querySelector('.users-table-content');

    const user = newDocument.querySelector('.user');

    newDocument.querySelector('.create-user-button').addEventListener('click', () => {
        const nom = user.querySelector('.nom').value;
        const prenom = user.querySelector('.prenom').value;
        const tel = user.querySelector('.tel').value;
        const role = user.querySelector('.role').value;
        const username = user.querySelector('.username').value;
        const email = user.querySelector('.email').value;
        const password = 'changemoi';

        createUser(nom, prenom, tel, role, username, password, email);
        user.classList.remove('user-creating');
    });

    newDocument.querySelector('.cancel-create').addEventListener('click', () => {
        container.removeChild(user);
    });

    //container.appendChild(user);
    container.insertBefore(user, container.childNodes[0]);
}

export function loadAllUser(callback = () => {}) {
    const template = `
            <div class="user">
                <div class="informations">
                    <div class="form-group">
                        <label>Nom</label>
                        <input class="nom" type="text" placeholder="nom">
                    </div>
                    <div class="form-group">
                        <label>Prénom</label>
                        <input class="prenom" type="text" placeholder="prenom">
                    </div>
                    <div class="form-group">
                        <label>Nom d'utilisateur</label>
                        <input class="username" type="text" placeholder="nom d'utilisateur">
                    </div>
                    <div class="form-group">
                        <label>Adresse email</label>
                        <input class="email" type="text" placeholder="Adresse email">
                    </div>
                    <div class="form-group">
                        <label>Téléphone</label>
                        <input class="tel" type="text" placeholder="téléphone">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select class="role" value="1">
                                <option value="1">TMG</option>
                                <option value="2">GERANT</option>
                        </select>
                    </div>

                </div>

                <div class="actions">
                    <button title="enregistrer les modifications" class="small-button update-user"> <i class="material-icons">edit</i></button>
                    <button title="supprimer le compte de l' utilisateur" class="small-button delete-user"> <i class="material-icons">delete</i></button>
                </div>

            </div>
    `;

    const container = document.querySelector('.users-table-content');

    fetch(IP + '/tmg/user/find', {
        method: 'GET'
    }).then(response => {
        if (response.status == 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        if (data !== null && data !== undefined) {
            setUsersList(data.users);
            data.users.forEach(user => {
                if (user.username !== 'root') {
                    const newDocument = new DOMParser().parseFromString(template, 'text/html');
                    const element = newDocument.querySelector('.user');
                    element.querySelector('.nom').value = user.nom;
                    element.querySelector('.prenom').value = user.prenom;
                    element.querySelector('.username').value = user.username;
                    element.querySelector('.tel').value = user.telephone;
                    element.querySelector('.role').value = user.role;
                    element.querySelector('.email').value = user.email;
                    container.appendChild(element);

                    element.querySelector('.update-user').addEventListener('click', () => {
                        //Update user
                        const nom = element.querySelector('.nom').value;
                        const prenom = element.querySelector('.prenom').value;
                        const username = element.querySelector('.username').value;
                        const telephone = element.querySelector('.tel').value;
                        const role = element.querySelector('.role').value;
                        const email = element.querySelector('.email').value;
                        updateUser(nom, prenom, telephone, username, role, email);
                    });

                    element.querySelector('.delete-user').addEventListener('click', () => {
                        //Delete user
                        deleteUser(user._id, element, container);
                    });
                }
            });
            callback();
        }
    });
}

export function deleteUser(id, element, container) {
    showBigLoadingScreen();
    const token = getToken();
    fetch(IP + '/tmg/user/delete', {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            id
        })
    }).then(response => {
        if (response.status === 200) {
            container.removeChild(element);
            alert("Utilisateur supprimer");
        } else {
            alert("Error " + response.status);
        }
        hideBigLoadingScreen();
    })
}

export function updateUser(nom, prenom, telephone, username, role, email) {
    showBigLoadingScreen();
    const token = getToken();
    console.log(nom + ' ' + prenom);
    fetch(IP + '/tmg/user/update', {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            username,
            update: {
                nom,
                prenom,
                telephone,
                role,
                email
            }
        })
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            alert("Error " + response.status);
        }
    }).then(data => {
        if (data !== undefined && data !== null) {
            console.log(data);
            alert("Mise à jour enregistré");
        }
        hideBigLoadingScreen();
    });
}

export function createUser(nom, prenom, tel, role, username, password, email) {
    const token = getToken();

    fetch(IP + '/tmg/user/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            username,
            password,
            nom,
            prenom,
            telephone: tel,
            role,
            email
        })
    }).then(response => {
        if (response.status == 200) {
            return response.json();
        } else {
            console.log("Error, remove last user on list");
            onCreateUserError(status);
            alert("Il y'a eu une erreur lors de la création de l'utilisateur");
        }
    }).then(data => {});
}