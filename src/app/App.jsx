import React, { Component } from 'react';
import MainContainer from './containers/MainContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      index: 0,
      shouldUpdate: false
    };

    this.portToScripts = null;

    const onPanelShown = () => {
      // chrome.runtime.sendMessage('lyra-panel-shown');
      // this.setState({ panelShown: true });
      const { tabId } = chrome.devtools.inspectedWindow;

      if (this.state.initialized) {
        return;
      }
      this.portToScripts.postMessage({
        tabId: tabId,
        message: 'initialize devtool'
      });
      this.setState({ initialized: true });
    };

    // const onPanelHidden = () => {
    //   chrome.runtime.sendMessage('lyra-panel-hidden');
    //   this.setState({ panelShown: false });
    // };

    chrome.devtools.panels.create('Lyra', null, 'devtools.html', panel => {
      panel.onShown.addListener(onPanelShown);
      // panel.onHidden.addListener(onPanelHidden);
    });
  }

  componentDidMount() {
    const portToScripts = chrome.runtime.connect({ name: 'devtool' }); // returns a port object
    this.portToScripts = portToScripts;

    portToScripts.onMessage.addListener(message => {
      console.log('app receiving messages', message.message);
      // filter incoming messages
      if (message.type === 'toRender' && message.message) {
        chrome.storage.local.set(
          { [`${this.state.index}`]: message.message.inspector },
          () => {
            // handle errors in setting Chrome storage
            if (chrome.runtime.lastError)
              console.error(
                'Error setting Chrome storage',
                chrome.runtime.lastError
              );
            this.setState({ index: this.state.index + 1, shouldUpdate: true });
          }
        );
      } else if (message.type === 'tabUpdate') {
        // listen for a message from background script triggering a refresh
        // of the app once the user refreshes
        const { tabId } = message;
        const panelId = chrome.devtools.inspectedWindow.tabId;
        if (tabId === panelId) this.resetApp();
      }
    });
    // flush Chrome storage once the port disconnects
    portToScripts.onDisconnect.addListener(() => {
      chrome.storage.local.clear(() =>
        console.info('Chrome storage has been cleared.')
      );
    });
  }

  resetApp() {
    console.log('reset app in app component is firing');
    this.setState({ shouldUpdate: true });
  }

  render() {
    return (
      <MainContainer
        index={this.state.index}
        shouldUpdate={this.state.shouldUpdate}
      />
    );
  }
}

export default App;
