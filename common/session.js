const LS_TOKEN_KEY = "tmg-web-app-token";
const LS_ROLE_KEY = "tmg-web-app-role";
const LS_NOM_KEY = "tmg-web-app-nom";
const LS_PRENOM_KEY = "tmg-web-app-prenom";

export function hasToken() {
    return window.localStorage.getItem(LS_TOKEN_KEY) !== null;
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

export function saveToken(token, nom, prenom, role) {
    window.localStorage.setItem(LS_TOKEN_KEY, token);
    window.localStorage.setItem(LS_ROLE_KEY, role);
    window.localStorage.setItem(LS_NOM_KEY, nom);
    window.localStorage.setItem(LS_PRENOM_KEY, prenom);
}

export function removeToken() {
    window.localStorage.removeItem(LS_TOKEN_KEY);
    window.localStorage.removeItem(LS_ROLE_KEY);
    window.localStorage.removeItem(LS_NOM_KEY);
    window.localStorage.removeItem(LS_PRENOM_KEY);
}