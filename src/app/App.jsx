import React, { Component, Fragment } from 'react';
// import Header from './components/Header';
import MainContainer from './containers/MainContainer';
import VisualizationContainer from './containers/VisualizationContainer';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
    };
  }
  //   this.portToScripts = null;

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

  //   chrome.devtools.panels.create('Lyra', null, 'devtools.html', panel => {
  //     panel.onShown.addListener(onPanelShown);
  //     // panel.onHidden.addListener(onPanelHidden);
  //   });
  // }

  // componentDidMount() {
  //   const portToScripts = chrome.runtime.connect({ name: 'devtool' }); // returns a port object
  //   this.portToScripts = portToScripts;

  //   portToScripts.onMessage.addListener(message => {
  //     // filter incoming messages
  //     if (message.type === 'toRender' && message.message) {
  //       // parse the data received from injected script
  //       const parsed = JSON.parse(message.message);
  //       chrome.storage.local.set({ ['data']: parsed }, () => {
  //         console.log('storage set');
  //       });
  //     }
  //   });
  // }

  render() {
    let variable = {
      object1: {
        _id: '5cc7abc198b6bf0b7f6ccd21',
        index: 0,
        guid: '6fdb83ce-6ca7-4b6e-944d-505437dd06e1',
        isActive: false,
        balance: '$3,007.95',
        picture: 'http://placehold.it/32x32',
        age: 39,
        eyeColor: 'blue',
        name: 'Luella Horn',
        gender: 'female',
        company: 'GREEKER',
        email: 'luellahorn@greeker.com',
        phone: '+1 (983) 561-3794',
        address: '141 Herkimer Court, Tyhee, Rhode Island, 7004',
        about:
          'Labore enim ad ipsum et anim reprehenderit ea deserunt Lorem laboris in. Ut officia et do eu enim reprehenderit est nulla esse. Dolor Lorem dolore dolor nostrud. Cillum proident velit ipsum irure enim est irure enim et ipsum. Nostrud dolore ad labore nulla veniam nisi aliqua consectetur consequat eu excepteur fugiat tempor nisi. Ut cupidatat duis magna ipsum laborum.\r\n',
        registered: '2018-12-06T03:07:46 +05:00',
        latitude: -57.022298,
        longitude: -38.829733,
        tags: [
          'voluptate',
          'excepteur',
          'Lorem',
          'sint',
          'consequat',
          'occaecat',
          'excepteur',
        ],
        friends: [
          {
            id: 0,
            name: 'Kerr Whitfield',
          },
          {
            id: 1,
            name: 'Taylor Orr',
          },
          {
            id: 2,
            name: 'Sanford Rios',
          },
        ],
        greeting: 'Hello, Luella Horn! You have 2 unread messages.',
        favoriteFruit: 'banana',
      },
      object2: {
        _id: '5cc7abc15dd35dac8b130be2',
        index: 1,
        guid: 'cd5c5c55-5f91-4391-abe2-57a27c03c093',
        isActive: true,
        balance: '$2,209.61',
        picture: 'http://placehold.it/32x32',
        age: 23,
        eyeColor: 'green',
        name: 'Byers Silva',
        gender: 'male',
        company: 'INVENTURE',
        email: 'byerssilva@inventure.com',
        phone: '+1 (877) 423-2494',
        address: '197 Highland Place, Nash, Northern Mariana Islands, 3177',
        about:
          'Duis sint voluptate et et est fugiat do dolor reprehenderit et aliquip nisi amet. Cupidatat eu cupidatat id labore proident culpa irure cillum. Ut ut esse magna sit culpa dolor qui excepteur. Laborum esse officia enim sint sunt qui anim aliquip enim fugiat eu laboris elit. Cillum eiusmod est ipsum elit sit aute mollit ex esse elit cillum.\r\n',
        registered: '2014-10-17T05:14:10 +04:00',
        latitude: 61.515239,
        longitude: 55.89077,
        tags: [
          'consectetur',
          'dolore',
          'cupidatat',
          'commodo',
          'commodo',
          'dolor',
          'deserunt',
        ],
        friends: [
          {
            id: 0,
            name: 'Ruby Stone',
          },
          {
            id: 1,
            name: 'Rollins Hensley',
          },
          {
            id: 2,
            name: 'Jennie Clarke',
          },
        ],
        greeting: 'Hello, Byers Silva! You have 4 unread messages.',
        favoriteFruit: 'strawberry',
      },
    };

    return (
      <Fragment>
        {/* <MainContainer /> */}
        <VisualizationContainer treeData={variable} />
      </Fragment>
    );
  }
}

export default App;
