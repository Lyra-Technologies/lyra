import React, { Component } from 'react';
import MainContainer from './containers/MainContainer';
import VisualizationContainer from './containers/VisualizationContainer';

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

  //   const onPanelShown = () => {
  //     // chrome.runtime.sendMessage('lyra-panel-shown');
  //     // this.setState({ panelShown: true });
  //     const { tabId } = chrome.devtools.inspectedWindow;

  //     if (!this.state.initialized) {
  //       this.portToScripts.postMessage({
  //         tabId: tabId,
  //         message: 'initialize devtool',
  //       });
  //       this.setState({ initialized: true });
  //     }
  //   };

  //   // const onPanelHidden = () => {
  //   //   chrome.runtime.sendMessage('lyra-panel-hidden');
  //   //   this.setState({ panelShown: false });
  //   // };

  componentDidMount() {
    const { tabId } = chrome.devtools.inspectedWindow;
    const portToScripts = chrome.runtime.connect({ name: 'devtool' }); // returns a port object
    this.portToScripts = portToScripts;

    portToScripts.onMessage.addListener(message => {
      // filter incoming messages
      if (message.type === 'toRender' && message.message) {
        chrome.storage.local.set(
          { [this.state.index]: message.message },
          () => {
            if (chrome.runtime.lastError)
              console.log(
                'Error setting Chrome storage',
                chrome.runtime.lastError
              );
            this.setState({ index: this.state.index + 1 }, () =>
              console.log('Chrome storage set, index has been incremented')
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
