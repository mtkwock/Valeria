function loadScript(scriptName) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(scriptName);
    s.onload = () => {};
    (document.head || document.documentElement).appendChild(s);
}
function loadImage(imageName) {
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(imageName);
    img.style.display = 'none';
    img.id = 'valeria-referenceable-img';
    document.documentElement.appendChild(img);
}
const screenShotter = document.createElement('button');
screenShotter.id = 'idc-screenshot-button';
screenShotter.style.display = 'none';
screenShotter.innerText = 'Save Team Screenshot';
screenShotter.onclick = () => {
    const teamBuilder = document.getElementById('team-builder');
    let rect = teamBuilder.getBoundingClientRect();
    chrome.runtime.sendMessage({
        width: rect.width,
        height: rect.height,
        offsetX: -1 * rect.left,
        offsetY: -1 * rect.top,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
    }, (_response) => { });
};
document.body.appendChild(screenShotter);
// Thanks to Allie for sending this.
loadImage('assets/UIPAT1.PNG');
loadScript('require.min.js');
// Thanks to DadGuide/Miru Bot for this info.
loadScript('assets/DungeonsAndEncounters.json');
loadScript('bundle.js');
