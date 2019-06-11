import ReactJson from 'react-json-view';
import React, { Component } from 'react';
import {
  Grid,
  Menu,
  Segment,
  Sidebar,
  Form,
  Label,
  Button,
} from 'semantic-ui-react';
import VisualizationContainer from './VisualizationContainer';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDefinedIndex: 0,
      rewindElHeight: 0,
      menuHeight: 0,
      visible: false,
      storageData: {},
      currentIndex: this.props.index,
    };

    this.handleSidebarClick = this.handleSidebarClick.bind(this);
    this.handleRewindSlider = this.handleRewindSlider.bind(this);
    // this.handleRewindButton = this.handleRewindButton.bind(this);
    this.handleForwardButton = this.handleForwardButton.bind(this);
  }

  handleSidebarClick() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  handleRewindSlider(e, { value }) {
    this.setState({ userDefinedIndex: value });
  }

  handleForwardButton() {
    const { currentIndex, userDefinedIndex } = this.state;
    console.log(
      'in handleforwardbutton, current index',
      currentIndex,
      'userdefined',
      userDefinedIndex
    );

    // if (userDefinedIndex < currentIndex) {
    //   chrome.storage.local.get([`${userDefinedIndex + 1}`], res => {
    //     console.log('response from chrome storage', res);
    //     this.setState(
    //       {
    //         userDefinedIndex: userDefinedIndex + 1,
    //         storageData: res[`${userDefinedIndex + 1}`]
    //       },
    //       () => console.log('this.state in handleForwardButton', this.state)
    //     );
    //   });

    //   // else {
    //   //   // #TODO make the button inactive
    //   //   // index is now out of range
    //   //   console.log(
    //   //     'in handleForwardButton, index out of range',
    //   //     userDefinedIndex
    //   //   );
    //   //   return { userDefinedIndex: currentIndex };
    //   // }
    // }
  }

  // handleRewindButton() {
  // this.setState((prevState, props) => {
  //   if (prevState.userDefinedIndex > 1) {
  //     return { userDefinedIndex: prevState.userDefinedIndex - 1 };
  //   } else {
  //     // #TODO make the button inactive
  //     // the user shouldn't be able to go back once the index reaches 0
  //     console.log('in handleRewindButton, index out of range');
  //     return { userDefinedIndex: prevState.userDefinedIndex };
  //   }
  // });
  // }

  componentDidMount() {
    // get height of menubar
    const menuHeight = this.divElement.clientHeight;
    this.setState({ menuHeight });
    const rewindElHeight = this.rewindElement.clientHeight;
    this.setState({ rewindElHeight });

    // fetch data from Chrome storage, set in the App component
    chrome.storage.local.get(['0'], res => {
      if (chrome.runtime.lastError) {
        console.error(
          'Error fetching data from Chrome storage:',
          chrome.runtime.lastError
        );
      }
      this.setState({
        storageData: res['0'],
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('component did update fired in main container');
    if (prevState.currentIndex !== this.props.index) {
      chrome.storage.local.get([`${this.props.index}`], res => {
        this.setState(
          {
            storageData: res[`${this.props.index}`],
            currentIndex: this.props.index,
          },
          () => 'cDU fetched data ',
          res[`${this.props.index}`]
        );
      });
    }
  }

  render() {
    console.log(
      'this.state in main container',
      this.state,
      'this.props',
      this.props
    );
    const schemeColor = '#00CCCC';

    const {
      currentIndex,
      storageData,
      visible,
      menuHeight,
      rewindElHeight,
      userDefinedIndex,
    } = this.state;

    const viewHeight = window.innerHeight - menuHeight - rewindElHeight;
    return (
      <div style={{ height: viewHeight }}>
        <div ref={divElement => (this.divElement = divElement)}>
          <Menu
            attached="top"
            tabular
            inverted
            style={{
              backgroundImage: `linear-gradient(to bottom right, teal,${schemeColor})`,
            }}
          >
            <Menu.Item header>
              {/* <img alt='Lyra logo' height='20' /> */}
            </Menu.Item>

            <Menu.Item name="JSON" onClick={this.handleSidebarClick}>
              view JSON data
            </Menu.Item>
          </Menu>
        </div>
        <Sidebar.Pushable style={{ margin: 0 }} as={Segment} attached="bottom">
          <Sidebar
            direction="left"
            animation="push"
            icon="labeled"
            visible={visible}
            inverted="true"
            vertical="true"
            width="wide"
          >
            <ReactJson
              enableClipboard={false}
              indentWidth={2}
              displayDataTypes={false}
              theme="threezerotwofour"
              src={storageData}
              collapsed
            />
          </Sidebar>

          <Sidebar.Pusher>
            <Grid
              style={{
                height: '100%',
                marginTop: '0%',
              }}
            >
              <Grid.Row
                style={{
                  height: viewHeight,
                  padding: '0',
                  margin: '0',
                }}
                column={1}
              >
                <Grid.Column
                  style={{
                    margin: '0',
                    height: '100%',
                    overflow: 'scroll',
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
              backgroundImage: `linear-gradient(to bottom right, teal, ${schemeColor})`,
            }}
            basic
            inverted
          >
            <Button.Group size="large" inverted color="black" icon>
              <Button onClick={this.handleRewindButton}>rewind</Button>
              <Button style={{ margin: 0 }} as="div" labelPosition="right">
                <Label style={{ margin: 0 }} as="a" basic inverted="true">
                  steps: {userDefinedIndex}
                </Label>
              </Button>
              <Button onClick={this.handleForwardButton}>fast-forward</Button>
            </Button.Group>
            <Form inverted size="large">
              <Form.Input
                min={0}
                max={currentIndex}
                name="userDefinedIndex"
                onChange={this.handleRewindSlider}
                step={1}
                type="range"
                value={userDefinedIndex}
              />
            </Form>
          </Segment>
        </div>
      </div>
    );
  }
}

export default MainContainer;
