const port = chrome.runtime.connect({ name: 'content' });
const storage = window.localStorage;
let initialized = false;

port.onMessage.addListener(message => {
  if (message.message === 'initialize devtool') {
    initialized = true;
    port.postMessage({
      message: 'get local storage',
      payload: storage,
      target: 'devtool'
    });
  }
});
