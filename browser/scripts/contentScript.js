const port = chrome.runtime.connect({ name: 'content' });
let injected = false;

function injectScript(file) {
  const body = document.getElementsByTagName('body')[0];
  const injectedScript = document.createElement('script');
  injectedScript.id = 'injectedScript';
  injectedScript.setAttribute('type', 'text/javascript');
  injectedScript.setAttribute('src', file);
  body.appendChild(injectedScript);
  injected = true;
  // injectedScript.parentNode.removeChild(injectedScript);
}

chrome.runtime.onMessage.addListener((message, sender, res) => {
  // check if there's already an injected script tag and reinsert if needed
  if (message.message === 'initialize devtool' && !injected) {
    injectScript(chrome.extension.getURL('scripts/inject.js'));
  }
  // listen for tab changes and reinject script if needed
  if (message.message === 'tabUpdate' && !injected) {
    injectScript(chrome.extension.getURL('scripts/inject.js'));
  }
});

window.addEventListener('message', message => {
  if (!message.data) return;
  if (message.data.type == 'inject') {
    const apolloCache = message.data.message;
    chrome.runtime.sendMessage({
      type: 'content',
      message: apolloCache
    });
  } else {
    return;
  }
});
