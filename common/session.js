const LS_TOKEN_KEY = "tmg-web-app-token";
const LS_ROLE_KEY = "tmg-web-app-role";
const LS_NOM_KEY = "tmg-web-app-nom";
const LS_PRENOM_KEY = "tmg-web-app-prenom";
const LS_ID_KEY = "tmg-web-app-id";
const LS_USERNAME = "tmg-web-app-username";
const LS_PHOTO = "tmg-web-app-photo";

export function hasToken() {
    return window.localStorage.getItem(LS_TOKEN_KEY) !== null;
}

export function hasPhoto() {
    return window.localStorage.getItem(LS_PHOTO) !== null;
}

export function getToken() {
    return window.localStorage.getItem(LS_TOKEN_KEY);
}

export function getRole() {
    return window.localStorage.getItem(LS_ROLE_KEY);
}

export function getNom() {
    return window.localStorage.getItem(LS_NOM_KEY);
}

export function getPrenom() {
    return window.localStorage.getItem(LS_PRENOM_KEY);
}

export function getId() {
    return window.localStorage.getItem(LS_ID_KEY);
}

export function getUsername() {
    return window.localStorage.getItem(LS_USERNAME);
}

export function getPhoto() {
    return window.localStorage.getItem(LS_PHOTO);
}

export function saveToken(token, nom, prenom, role, id, username, photo) {
    window.localStorage.setItem(LS_TOKEN_KEY, token);
    window.localStorage.setItem(LS_ROLE_KEY, role);
    window.localStorage.setItem(LS_NOM_KEY, nom);
    window.localStorage.setItem(LS_PRENOM_KEY, prenom);
    window.localStorage.setItem(LS_ID_KEY, id);
    window.localStorage.setItem(LS_USERNAME, username);
    window.localStorage.setItem(LS_PHOTO, photo);
}

export function setPhoto(photo) {
    window.localStorage.setItem(LS_PHOTO, photo);
}

export function removeToken() {
    window.localStorage.removeItem(LS_TOKEN_KEY);
    window.localStorage.removeItem(LS_ROLE_KEY);
    window.localStorage.removeItem(LS_NOM_KEY);
    window.localStorage.removeItem(LS_PRENOM_KEY);
    window.localStorage.removeItem(LS_ID_KEY);
    window.localStorage.removeItem(LS_USERNAME);
    window.localStorage.removeItem(LS_PHOTO);
}