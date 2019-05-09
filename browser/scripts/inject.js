/* using __APOLLO_DEVTOOLS_GLOBAL_HOOK__ global window object */

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
    console.log('Install and/or enable Apollo devtools to run Lyra.');
  }
}

init();
