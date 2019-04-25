const connections = {};
let initialized = false;

chrome.runtime.onConnect.addListener(port => {
  console.log({ connections });
  if (port.name === 'devtool') {
    let extensionListener = message => {
      if (message.message === 'initialize devtool' && message.tabId) {
        initialized = true;
        chrome.tabs.sendMessage(message.tabId, message);
        connections[message.tabId] = port;
        return;
      }
    };

    port.onMessage.addListener(extensionListener);
  }
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type === 'content') {
    // && initialized ?
    if (sender.tab) {
      const tabId = sender.tab.id;
      if (tabId in connections) {
        connections[tabId].postMessage({
          type: 'toRender',
          message: message.message
        });
      } else {
        console.log('Tab is not in the list of connections');
      }
    } else {
      console.log('Sender tab is not defined');
    }
    return true;
  }
});

// remove closed connections from the connections object
chrome.tabs.onRemoved.addListener(tabId => delete connections[tabId]);

// add an event listener for tab changes
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (!connections[tabId]) return;
  else if (info.status === 'complete') {
    connections[tabId].postMessage({ type: 'tabUpdate' });
  }
});
