// emulate browser dependencies
const Blob = require("cross-blob");
const Canvas = require("canvas");
const { JSDOM } = require("jsdom");
global.Blob = Blob;
global.window = new JSDOM().window;
global.self = global.window;
global.document = global.window.document;
global.Image = Canvas.Image;
global.XMLSerializer = global.window.XMLSerializer;
// swallow not implemented location changes (https://github.com/jsdom/jsdom/issues/2112#issuecomment-673540137)
const listeners = window._virtualConsole.listeners('jsdomError');
const originalListener = listeners && listeners[0];
window._virtualConsole.removeAllListeners('jsdomError');
window._virtualConsole.addListener('jsdomError', error => {
    if (error.type !== 'not implemented' &&
        error.message !== 'Not implemented: navigation (except hash changes)' &&
        originalListener) {
        originalListener(error);
    }
    // swallow error
});
