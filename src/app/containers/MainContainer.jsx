import ReactJson from 'react-json-view';
import React, { Component } from 'react';
import VisualizationContainer from './VisualizationContainer';

import {
  Grid,
  Menu,
  Segment,
  Icon,
  Image,
  Sidebar,
  Form,
  Label,
  Button
} from 'semantic-ui-react';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      rewindElHeight: 0,
      menuHeight: 0,
      visible: false,
      storageData: {}
    };

    this.handleSidebarClick = this.handleSidebarClick.bind(this);
    this.handleRewindSlider = this.handleRewindSlider.bind(this);
    this.handleRewindButton = this.handleRewindButton.bind(this);
    this.handleForwardButton = this.handleForwardButton.bind(this);
  }

  handleSidebarClick() {
    this.setState({
      visible: !this.state.visible
    });
  }

  handleRewindSlider(e, { value }) {
    this.setState({ currentIndex: value });
  }

  // handleRewindButton() {
  //   this.setState({ currentIndex: this.state.currentIndex - 1 });
  // }

  // handleForwardButton() {
  //   this.setState({ currentIndex: this.state.currentIndex + 1 });
  // }

  handleForwardButton() {
    this.setState((prevState, props) => {
      if (prevState.currentIndex < props.index) {
        console.log(
          'in handleForwardButton, about to increment currentIndex',
          prevState.currentIndex
        );
        return { currentIndex: prevState.currentIndex + 1 };
      } else {
        // #TODO make the button inactive
        // index is now out of range
        console.log('in handleForwardButton, index out of range');
        return { currentIndex: props.index };
      }
    });
  }

  handleRewindButton() {
    this.setState((prevState, props) => {
      if (prevState.currentIndex > 1) {
        console.log(
          'in handleRewindButton, about to decrement currentIndex',
          prevState.currentIndex
        );
        return { currentIndex: prevState.currentIndex - 1 };
      } else {
        // #TODO make the button inactive
        // the user shouldn't be able to go back once the index reaches 0
        console.log('in handleRewindButton, index out of range');
        return { currentIndex: prevState.currentIndex };
      }
    });
  }

  componentDidMount() {
    // get height of menubar
    const menuHeight = this.divElement.clientHeight;
    this.setState({ menuHeight });
    const rewindElHeight = this.rewindElement.clientHeight;
    this.setState({ rewindElHeight });

    // fetch data from Chrome storage, set in the App component
    chrome.storage.local.get([`${this.props.index}`], res => {
      if (chrome.runtime.lastError) {
        console.error(
          'Error fetching data from Chrome storage:',
          chrome.runtime.lastError
        );
      }
      this.setState(
        {
          storageData: res[`${this.props.index}`]
        },
        () =>
          console.log(
            'data fetched from store',
            res[`${this.props.index}`],
            'this.props.index',
            this.props.index,
            'this.state',
            this.state
          )
      );
    });
  }

  componentDidUpdate(prevProps) {
    console.log('in cDU, prevProps', prevProps);
    if (prevProps.index !== this.props.index) {
      chrome.storage.local.get([`${this.props.index}`], res => {
        this.setState({
          storageData: res[`${this.props.index}`]
          // currentIndex: this.props.index
        });
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.shouldUpdate !== nextProps.shouldUpdate ||
      this.props.index !== nextProps.currentIndex
    );
  }

  render() {
    const schemeColor = '#00CCCC';

    const {
      currentIndex,
      storageData,
      visible,
      menuHeight,
      rewindElHeight
    } = this.state;

    let viewHeight = window.innerHeight - menuHeight - rewindElHeight;
    return (
      <div style={{ height: viewHeight }}>
        <div ref={divElement => (this.divElement = divElement)}>
          <Menu
            attached='top'
            tabular
            inverted
            style={{
              // backgroundColor: 'indigo',
              backgroundImage: `linear-gradient(to bottom right, teal,${schemeColor})`
            }}
          >
            <Menu.Item header>
              <img
                src='../../assets/lyra_chrome_logo_med.png'
                alt='Lyra logo'
                height='20'
              />
            </Menu.Item>

            <Menu.Item name='JSON' onClick={this.handleSidebarClick}>
              view JSON data
            </Menu.Item>
          </Menu>
        </div>
        <Sidebar.Pushable style={{ margin: 0 }} as={Segment} attached='bottom'>
          <Sidebar
            direction='left'
            animation='push'
            icon='labeled'
            visible={visible}
            inverted='true'
            vertical='true'
            width='wide'
          >
            <ReactJson
              enableClipboard={false}
              indentWidth={2}
              displayDataTypes={false}
              theme='threezerotwofour'
              src={storageData}
              collapsed={true}
            />
          </Sidebar>

          <Sidebar.Pusher>
            <Grid
              style={{
                height: '100%',
                marginTop: '0%'
              }}
            >
              <Grid.Row
                style={{
                  height: viewHeight,
                  padding: '0',
                  margin: '0'
                }}
                column={1}
              >
                <Grid.Column
                  style={{
                    margin: '0',
                    height: '100%',
                    overflow: 'scroll'
                  }}
                >
                  <VisualizationContainer treeData={storageData} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <div
          style={{ textAlign: 'center' }}
          ref={rewindElement => (this.rewindElement = rewindElement)}
        >
          <Segment
            style={{
              backgroundImage: `linear-gradient(to bottom right, teal, ${schemeColor})`
            }}
            basic
            inverted
          >
            <Button.Group size='large' inverted color='black' icon>
              <Button onClick={this.handleRewindButton}>
                {/* <Icon name='shuffle' /> */}
                rewind
              </Button>
              <Button style={{ margin: 0 }} as='div' labelPosition='right'>
                {/* <Button color="teal">
                  <Icon name="heart" />
                  STEPS
                </Button> */}
                <Label style={{ margin: 0 }} as='a' basic inverted='true'>
                  steps: {this.props.index}
                </Label>
              </Button>
              <Button onClick={this.handleForwardButton}>
                fast-forward
                {/* <Icon name='pause' /> */}
              </Button>
            </Button.Group>
            <Form inverted size='large'>
              <Form.Input
                // label={`Rewind: ${currentIndex} steps `}
                min={0}
                max={this.props.index}
                name='currentIndex'
                onChange={this.handleRewindSlider}
                step={1}
                type='range'
                value={currentIndex}
              />
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}

export default MainContainer;
