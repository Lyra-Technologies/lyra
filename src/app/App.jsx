import React, { Component, Fragment } from 'react';
// import Header from './components/Header';
import MainContainer from './containers/MainContainer';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };

    this.portToScripts = null;

    const onPanelShown = () => {
      // chrome.runtime.sendMessage('lyra-panel-shown');
      // this.setState({ panelShown: true });
      const { tabId } = chrome.devtools.inspectedWindow;

      if (!this.state.initialized) {
        this.portToScripts.postMessage({
          tabId: tabId,
          message: 'initialize devtool'
        });
        this.setState({ initialized: true });
      }
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
      // filter incoming messages
      if (message.type === 'toRender' && message.message) {
        // parse the data received from injected script
        const parsed = JSON.parse(message.message);
        chrome.storage.local.set({ ['data']: parsed }, () => {
          console.log('storage set');
        });
      }
    });
  }

  render() {
    return (
      <Fragment>
        <MainContainer />
      </Fragment>
    );
  }
}

export default App;
