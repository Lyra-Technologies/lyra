// ,devtoolsPanel => {
//   const backgroundPageConnection = chrome.runtime.connect({
//     name: 'devtools'
//   });

// devtoolsPanel.onShown.addListener(function tmp(panelWindow) {
//   // this only runs once
//   devtoolsPanel.onShown.removeListener(tmp);

//   const windowP = panelWindow;
//   windowP.backgroundPort = backgroundPageConnection;

//   backgroundPageConnection.onMessage.addListener(message => {
//     // handle responses from the background page
//     // listens for `refresh_devtool` message from the background
//     // and sends it to the app via window.PostMessage()
//     if (message.action === 'refresh_devtool') windowP.postMessage(message);
//   });
// });
// }
// );
