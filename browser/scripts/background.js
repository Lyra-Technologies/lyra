const connections = {};
const acceptedPorts = ['content', 'devtool'];

chrome.runtime.onConnect.addListener(port => {
  // only listen for messages from accepted ports
  if (!acceptedPorts.includes(port.name)) return;

  port.onMessage.addListener(message => {
    const tabId = port.sender.tab ? port.sender.tab.id : message.tabId;

    if (
      message.message === 'initialize devtool' ||
      message.message === 'get local storage'
    ) {
      if (!connections[tabId]) {
        connections[tabId] = {};
      }
      connections[tabId][port.name] = port;
      return;
    }
    if (message.target) {
      const conn = connections[tabId][message.target];
      if (conn) {
        conn.postMessage(message);
      }
    }
  });
});
