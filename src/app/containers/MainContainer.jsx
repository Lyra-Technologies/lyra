import ReactJson from 'react-json-view';
import { Link, Route, Switch } from 'react-router-dom';
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

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'CACHE',
      initialData: {},
      storageData: {},
      currentIndex: null
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    // this.handleForwardClick = this.handleForwardClick.bind(this);
    // this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  // handleForwardClick() {
  //   this.setState((prevState, props) => {
  //     if (prevState.currentIndex <= props.index) {
  //       console.log(
  //         'in handleForwardClick, about to increment currentIndex',
  //         prevState.currentIndex
  //       );
  //       return { currentIndex: prevState.currentIndex + 1 };
  //     } else {
  //       // #TODO make the button inactive
  //       // index is now out of range
  //       console.log('in handleForwardClick, index out of range');
  //       return { currentIndex: props.index };
  //     }
  //   });
  // }

  // handleBackClick() {
  //   this.setState((prevState, props) => {
  //     if (prevState.currentIndex > 1) {
  //       console.log(
  //         'in handleBackClick, about to decrement currentIndex',
  //         prevState.currentIndex
  //       );
  //       return { currentIndex: prevState.currentIndex - 1 };
  //     } else {
  //       // #TODO make the button inactive
  //       // the user shouldn't be able to go back once the index reaches 0
  //       console.log('in handleBackClick, index out of range');
  //       return { currentIndex: props.index };
  //     }
  //   });
  // }

  componentDidMount() {
    // fetch data from Chrome storage, set in the App component
    console.log('in cDM in MainCointainer, this.props.index', this.props.index);
    chrome.storage.local.get([`${this.props.index}`], res => {
      this.setState({
        storageData: res[`${this.props.index}`],
        currentIndex: this.props.index
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      chrome.storage.local.get([`${this.props.index}`], res => {
        this.setState({
          storageData: res[`${this.props.index}`],
          currentIndex: this.props.index
        });
      });
    }
  }

  render() {
    const { activeItem, storageData, initialData } = this.state;
    let currentData = initialData;
    if (activeItem === 'CACHE') {
      currentData = storageData;
    }
    if (activeItem === 'STATE') {
      // currentData = variable;
    }

    const cacheVisualizationContainer = () => (
      <VisualizationContainer treeData={storageData} />
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
                name='Cache'
                icon='database'
                active={activeItem === 'CACHE'}
                onClick={this.handleItemClick}
              />
            </Link>

            <Link to='/state'>
              <Menu.Item
                icon='database'
                name='State'
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
              enableClipboard={false}
              indentWidth='2'
              displayDataTypes={false}
              theme='threezerotwofour'
              src={{ storageData }}
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
          </Segment>
          {/* <button onClick={this.handleBackClick}>Back</button>
          <button onClick={this.handleForwardClick}>Forward</button> */}
        </Grid.Column>
      </Grid>
    );
  }
}

export default MainContainer;
