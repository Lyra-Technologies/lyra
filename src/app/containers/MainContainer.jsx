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
      duration: 0,
      rewindElHeight: 0,
      menuHeight: 0,
      visible: false,
      storageData: {}
    };

    // this.handleForwardClick = this.handleForwardClick.bind(this);
    // this.handleBackClick = this.handleBackClick.bind(this);
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
    this.setState({ duration: value });
  }

  handleRewindButton() {
    this.setState({ duration: this.state.duration - 1 });
  }

  handleForwardButton() {
    this.setState({ duration: this.state.duration + 1 });
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
    // get height of menubar
    const menuHeight = this.divElement.clientHeight;
    this.setState({ menuHeight });
    const rewindElHeight = this.rewindElement.clientHeight;
    this.setState({ rewindElHeight });

    // fetch data from Chrome storage, set in the App component
    chrome.storage.local.get([`${this.props.index}`], res => {
      if (chrome.runtime.lastError) {
        console.error(
          'Error getting from Chrome storage:',
          chrome.runtime.lastError
        );
      }
      this.setState(
        {
          storageData: res[`${this.props.index}`],
          currentIndex: this.props.index
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
          storageData: res[`${this.props.index}`],
          currentIndex: this.props.index
        });
      });
    }
  }

  render() {
    const schemeColor = '#7113b9';
    const {
      duration,
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
              {/* <img src='https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fadventuresofelguapo.files.wordpress.com%2F2014%2F06%2Ftroll-face.png&f=1' /> */}
            </Menu.Item>
            {/* REMOVED FROM COMPONENT DIRECTLY BELOW: active={activeItem === 'JSON'} */}

            <Menu.Item name='JSON' onClick={this.handleSidebarClick}>
              Display JSON Data
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
                <Icon name='shuffle' />
                REWIND
              </Button>
              <Button style={{ margin: 0 }} as='div' labelPosition='right'>
                {/* <Button color="teal">
                  <Icon name="heart" />
                  STEPS
                </Button> */}
                <Label style={{ margin: 0 }} as='a' basic inverted='true'>
                  STEPS: {duration}
                </Label>
              </Button>
              <Button onClick={this.handleForwardButton}>
                FAST-FORWARD
                <Icon name='pause' />
              </Button>
            </Button.Group>
            <Form inverted size='large'>
              <Form.Input
                // label={`Rewind: ${duration} steps `}
                min={0}
                max={15}
                name='duration'
                onChange={this.handleRewindSlider}
                step={1}
                type='range'
                value={duration}
              />
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}

export default MainContainer;
