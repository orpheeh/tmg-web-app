export function showBigLoadingScreen() {
    document.getElementById('loading-screen').classList.add('loading-modal-show');
}

export function hideBigLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('loading-modal-show');
}