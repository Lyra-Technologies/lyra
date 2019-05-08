// let started = false;
// let _timeout;
// let client;

// const init = () => {
//   if (window.__APOLLO_CLIENT__) {
//     client = window.__APOLLO_CLIENT__;
//     started = true;
//     return;
//   }
// TODO: console.log runs infinitely, fix!
//   console.log('Apollo Client needed to run this app.');
//   setTimeout(init, 500);
// };

// init();

// if (!started) {
//   _timeout = setTimeout(init, 500);
// } else {
//   clearTimeout(_timeout);

//   // send data to content script
//   window.postMessage({
//     type: 'inject',
//     message: JSON.stringify(client.cache.data.data)
//   });
// }

/* using __APOLLO_DEVTOOLS_GLOBAL_HOOK__ rather than the __APOLLO_CLIENT__ global window object */

function init() {
  let client;
  let devtoolHook;

  if (window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
    devtoolHook = window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__;
    client = devtoolHook.ApolloClient;
    if (client) {
      const data = {
        queries: client.queryManager
          ? client.queryManager.queryStore.getStore()
          : {},
        mutations: client.queryManager
          ? client.queryManager.mutationStore.getStore()
          : {},
        inspector: client.cache.extract(true)
      };
      // send data to content script
      window.postMessage({
        type: 'inject',
        message: data
      });
      return;
    }
  } else {
    console.log('Install Apollo devtools to run Lyra.');
  }
}

init();
