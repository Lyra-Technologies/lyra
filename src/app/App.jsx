import React, { Component, Fragment } from 'react';
import Header from './components/Header';
import MainContainer from './containers/MainContainer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: null,
      panelShown: false
    };

    const onPanelShown = () => {
      chrome.runtime.sendMessage('lyra-panel-shown');
      this.setState({ panelShown: true });
    };

    const onPanelHidden = () => {
      chrome.runtime.sendMessage('lyra-panel-hidden');
      this.setState({ panelShown: false });
    };

    chrome.devtools.panels.create('Lyra', null, 'devtools.html', panel => {
      panel.onShown.addListener(onPanelShown);
      panel.onHidden.addListener(onPanelHidden);
    });
  }

  componentDidMount() {
    chrome.runtime.connect({ name: 'devtool' }); // returns a port object
    const { tabId } = chrome.devtools.inspectedWindow;
    chrome.runtime.onConnect.addListener(port => {
      port.postMessage({
        tabId: tabId,
        message: 'initialize devtool',
        target: 'content'
      });

      port.onMessage.addListener(message => {
        this.setState({ payload: message.payload });
      });
    });

    chrome.runtime.onConnect.removeListener(() =>
      console.log('Listener removed')
    );
  }

  render() {
    return (
      <Fragment>
        <Header />
        <MainContainer payload={this.state.payload} />
      </Fragment>
    );
  }
}

export default App;
