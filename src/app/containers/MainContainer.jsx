import Tree from '../components/Tree';
import ReactJson from 'react-json-view';
import { Link, Route, Switch } from 'react-router-dom';
import state from '../displayComponents/state';
import cache from '../displayComponents/cache';
import React, { Component } from 'react';

import {
  Grid,
  Menu,
  Segment,
  Icon,
  Input,
  Divider,
  Image,
  Container,
  Label
} from 'semantic-ui-react';
import VisualizationContainer from './VisualizationContainer';

// const treeObject = data => {
//   <Tree treeData={data} />;
// };

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'None',
      initialData: {},
      storageData: null
    };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  componentDidMount() {
    // fetch the data from local storage, set in the App component
    chrome.storage.local.get(['data'], res => {
      this.setState({ storageData: res['data'] });
    });
  }

  render() {
    const { activeItem, storageData, initialData } = this.state;
    let currentData = initialData;
    if (activeItem === 'CACHE') {
      // currentData = storageData;
      currentData = variable;
    }
    if (activeItem === 'STATE') {
      // currentData = storageData;
      currentData = variable;
    }

    const cacheVisualizationContainer = () => (
      <VisualizationContainer treeData={currentData} />
    );
    const stateVisualizationContainer = () => (
      <VisualizationContainer treeData={currentData} />
    );

    return (
      <Grid style={{ marginTop: '0%' }}>
        <Grid.Column color='teal' style={{ padding: 0 }} width={2}>
          <Menu fluid vertical inverted pointing color='teal' icon='labeled'>
            <Menu.Item>
              <Image
                verticalAlign='middle'
                centered
                src='https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fadventuresofelguapo.files.wordpress.com%2F2014%2F06%2Ftroll-face.png&f=1'
                circular
                size='small'
              />
              {/* <Label
                inverted
                circular
                color="orange"
                size="huge"
                attached="bottom"
              >
                LYRA
              </Label> */}
            </Menu.Item>

            <Link to='/cache'>
              <Menu.Item
                name='Dog'
                icon='database'
                active={activeItem === 'CACHE'}
                onClick={this.handleItemClick}
              />
            </Link>

            <Link to='/state'>
              <Menu.Item
                icon='database'
                name='STATE'
                active={activeItem === 'STATE'}
                onClick={this.handleItemClick}
              />
            </Link>
          </Menu>
        </Grid.Column>

        <Grid.Column style={{ padding: 0 }} width={5}>
          <Segment
            inverted
            style={{
              margin: 0,
              height: window.innerHeight,
              overflow: 'scroll'
            }}
            attached='bottom'
          >
            <Divider fitted hidden />
            <ReactJson
              style={{ height: window.innerHeight }}
              enableClipboard='false'
              indentWidth='2'
              displayDataTypes={'false'}
              theme='tomorrow'
              src={{ currentData }}
            />
          </Segment>
        </Grid.Column>
        <Grid.Column
          style={{ padding: 0, height: window.innerHeight, overflow: 'scroll' }}
          width={9}
        >
          <Divider />
          <Segment basic>
            <Switch>
              <Route path='/cache' component={cacheVisualizationContainer} />
              <Route path='/state' component={stateVisualizationContainer} />
            </Switch>
            <hr />
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default MainContainer;
