function loadScript(scriptName) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(scriptName);
    s.onload = function () {
        // this.remove();
    };
    (document.head || document.documentElement).appendChild(s);
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
loadScript('require.min.js');
loadScript('bundle.js');
