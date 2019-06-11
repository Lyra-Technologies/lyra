import React, { Component } from 'react';
import MainContainer from './containers/MainContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      index: 0,
      shouldUpdate: false,
      data: [],
    };

    this.portToScripts = null;

    const onPanelShown = () => {
      const { tabId } = chrome.devtools.inspectedWindow;
      const { initialized } = this.state;

      if (initialized) {
        return;
      }
      this.portToScripts.postMessage({
        tabId,
        message: 'initialize devtool',
      });
      this.setState({ initialized: true });
    };

    chrome.devtools.panels.create('Lyra', null, 'devtools.html', panel => {
      panel.onShown.addListener(onPanelShown);
    });
  }

  componentDidMount() {
    const { index } = this.state;
    const portToScripts = chrome.runtime.connect({ name: 'devtool' }); // returns a port object
    this.portToScripts = portToScripts;

    portToScripts.onMessage.addListener(message => {
      console.log('app receiving messages', message.message);
      // filter incoming messages
      if (message.type === 'toRender' && message.message) {
        chrome.storage.local.set(
          { [`${index}`]: message.message.inspector },
          () => {
            // handle errors in setting Chrome storage
            if (chrome.runtime.lastError)
              console.error(
                'Error setting Chrome storage',
                chrome.runtime.lastError
              );
            this.setState({
              index: index + 1,
            });
          }
        );
      }
      // else if (message.type === 'tabUpdate') {
      //   // listen for a message from background script triggering a refresh
      //   // of the app once the user refreshes
      //   const { tabId } = message;
      //   const panelId = chrome.devtools.inspectedWindow.tabId;
      //   // if (tabId === panelId) this.resetApp();
      // }
    });
    // flush Chrome storage once the port disconnects
    portToScripts.onDisconnect.addListener(() => {
      chrome.storage.local.clear(() =>
        console.info('Chrome storage has been cleared.')
      );
    });
  }

  render() {
    const { index } = this.state;
    return <MainContainer index={index} />;
  }
}

export default App;
