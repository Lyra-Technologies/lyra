const port = chrome.runtime.connect({ name: 'content' });
let injected = false;
let prevData = [];

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

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
  const injected = document.getElementById('injectedScript');
  // check if there's already an injected script tag and reinsert if needed
  if (
    message.message === 'initialize devtool' ||
    (message.message === 'request data' && !injected)
  ) {
    injectScript(chrome.extension.getURL('scripts/inject.js'));
  }
  // listen for tab changes and reinject script if needed
  if (message.message === 'tabUpdate' && !injected) {
    injectScript(chrome.extension.getURL('scripts/inject.js'));
  }
});

// listen for data sent from injected script
window.addEventListener('message', message => {
  if (!message.data) return;
  if (message.data.type == 'inject') {
    console.log('receiving message from injected script', message);
    const apolloCache = message.data.message;
    // only send different data on to the devtool
    if (JSON.stringify(apolloCache) === JSON.stringify(prevData)) return;
    else {
      prevData = apolloCache;
      // send data to background script
      chrome.runtime.sendMessage({
        type: 'content',
        message: apolloCache
      });
    }
  } else {
    return;
  }
});

const target = document.body;

const config = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

function subscriber(mutations) {
  // let timeout;
  let shouldUpdate = true;

  if (mutations.length) {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        if (
          mutation.addedNodes[0].tagName === 'SCRIPT' &&
          mutation.addedNodes[0].getAttribute('id') === 'injectedScript'
        ) {
          shouldUpdate = false;
          return;
        }
      }
      if (mutation.removedNodes.length) {
        if (
          mutation.removedNodes[0].tagName === 'SCRIPT' &&
          mutation.removedNodes[0].getAttribute('id') === 'injectedScript'
        ) {
          shouldUpdate = false;
          return;
        }
      }
    });
  }
  if (shouldUpdate) {
    throttle(injectScript(chrome.extension.getURL('scripts/inject.js')), 1000);
    shouldUpdate = false;
  }
}

const observer = new MutationObserver(subscriber);

observer.observe(target, config);
