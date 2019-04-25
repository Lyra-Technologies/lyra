import React, { Component } from 'react';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    // fetch the data from local storage, set in the App component
    chrome.storage.local.get(['data'], res => {
      this.setState({ data: res['data'] });
    });
  }

  render() {
    return (
      <React.Fragment>
        <p>{JSON.stringify(this.state.data)}</p>
      </React.Fragment>
    );
  }
}

export default MainContainer;
