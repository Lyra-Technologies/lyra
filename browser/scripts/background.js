const connections = {};
let initialized = false;

chrome.runtime.onConnect.addListener(port => {
  console.log({ connections });
  if (port.name === 'devtool') {
    // listen for the 'initialize devtool' message and store the port object
    // in the connections object with the tabId as the key
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
  // listen for a message from the content script
  if (message.type === 'content') {
    if (sender.tab) {
      // if the tabId that dispatched the message is in the connections object
      const tabId = sender.tab.id;
      if (tabId in connections) {
        // send the data to the devtool
        console.log('sending data to devtool, in toRender', message);
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
chrome.tabs.onRemoved.addListener(tabId => {
  delete connections[tabId];
  // clear Chrome storage
  chrome.storage.local.clear();
});

// chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
//   if (!connections[tabId]) return;
//   else if (info.status === 'complete') {
//     console.log('tab refreshed, tabID, ', tabId, 'info', info, 'TAB', tab);
//     connections[tabId].postMessage({ type: 'tabUpdate', tabId: tabId });
//     // const message = { type: 'tabUpdate' };
//     // chrome.tabs.sendMessage(tabId, message);
//   }
// });

// add an event listener for tab refreshes
chrome.webNavigation.onCommitted.addListener(event => {
  const { tabId, transitionType } = event;
  // only listen to events fired on watched tabs
  if (!connections[tabId]) return;
  if (transitionType === 'reload') {
    connections[tabId].postMessage({ type: 'tabUpdate', tabId: tabId });
  }
});
