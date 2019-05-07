import React, { Component } from 'react';
import MainContainer from './containers/MainContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      index: 0
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
    const { tabId } = chrome.devtools.inspectedWindow;
    const portToScripts = chrome.runtime.connect({ name: 'devtool' }); // returns a port object
    this.portToScripts = portToScripts;

    portToScripts.onMessage.addListener(message => {
      // filter incoming messages
      if (message.type === 'toRender' && message.message) {
        console.log('app receiving message', message.message);
        chrome.storage.local.set(
          { [this.state.index]: message.message },
          () => {
            console.log('chrome runtime error', chrome.runtime.lastError);
            this.setState({ index: this.state.index + 1 }, () =>
              console.log('state after setting storage', this.state)
            );
          }
        );
      }
    });
    // flush chrome storage once the port disconnects
    portToScripts.onDisconnect.addListener(() => {
      chrome.storage.local.clear(() =>
        console.log('Chrome storage has been cleared.')
      );
    });
  }

  render() {
    return <MainContainer index={this.state.index} />;
  }
}

export default App;
