let started = false;
let _timeout;

const init = () => {
  if (window.__APOLLO_CLIENT__) {
    started = true;
    return;
  }
  console.log('Apollo Client needed to run this app.');
  setTimeout(init, 500);
};

init();

if (!started) {
  _timeout = setTimeout(init, 500);
} else {
  clearTimeout(_timeout);
  window.postMessage({
    type: 'inject',
    message: JSON.stringify(window.__APOLLO_CLIENT__.cache.data.data)
  });
}
