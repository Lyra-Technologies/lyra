import React, { Component } from 'react';
import {
  Grid,
  Menu,
  Segment,
  Icon,
  Input,
  Divider,
  Image,
} from 'semantic-ui-react';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeItem: 'bio' };
    this.handleItemClick = this.handleItemClick.bind(this);
  }
  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  render() {
    const { activeItem } = this.state;

    return (
      <Grid style={{ marginTop: '0%' }}>
        <Grid.Column style={{ padding: 0 }} width={2}>
          <Menu fluid vertical inverted pointing color="teal" icon="labeled">
            <Menu.Item>
              LYRA TECHNOLOGIES
              <Image
                verticalAlign="middle"
                centered
                src="https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fadventuresofelguapo.files.wordpress.com%2F2014%2F06%2Ftroll-face.png&f=1"
                size="small"
                circular
              />
            </Menu.Item>
            <Menu.Item
              name="CACHE"
              active={activeItem === 'CACHE'}
              onClick={this.handleItemClick}
            >
              {' '}
              <Icon name="gamepad" />
              CACHE
            </Menu.Item>
            <Menu.Item
              icon="database"
              name="STATE"
              active={activeItem === 'STATE'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="COMPARE STATE CACHE"
              active={activeItem === 'COMPARE STATE CACHE'}
              onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column style={{ padding: 0 }} width={4}>
          <Segment inverted style={{ margin: 0 }} attached="bottom">
            <Menu position="right">
              <Input
                transparent
                icon={{ name: 'search', link: true }}
                placeholder="search users..."
              />
            </Menu>
            <Divider fitted hidden />
            Data/JSON Object will go here (will need another component to show
            dynamic ). .............Also another visualization with dropdowns
            Also another visualization with dropdowns Also another visualization
            with dropdowns Also another visualization with dropdowns Also
            another visualization with dropdowns Also another visualization with
            dropdowns
          </Segment>
        </Grid.Column>
        <Grid.Column style={{ padding: 0 }} width={10}>
          <Segment basic>
            <h2>Payload:</h2>
            {this.props.payload ? (
              Object.entries(this.props.payload).map(storage => {
                return <code key={storage[0]}>{storage}</code>;
              })
            ) : (
              <p>Waiting for local storage...</p>
            )}
            Insert Cache/State/ both component here
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

// const MainContainer = ({ payload }) => {
//   return (
//     <div id="graphContainer">
//       {payload ? (
//         Object.entries(payload).map(storage => {
//           return <code key={storage[0]}>{storage}</code>;
//         })
//       ) : (
//         <p>Waiting for local storage...</p>
//       )}
//       <Menu attached="top">
//         <Menu.Menu position="right">
//           <div className="ui right aligned category search item">
//             <div className="ui transparent icon input">
//               <input
//                 className="prompt"
//                 type="text"
//                 placeholder="Search animals..."
//               />
//               <i className="search link icon" />
//             </div>
//             <div className="results" />
//           </div>
//         </Menu.Menu>
//       </Menu>
//       <Grid>
//         <Grid.Row>
//           <Grid.Column width={5}>
//             <Tab
//               menu={{
//                 attached: true,
//                 tabular: true,
//                 inverted: true,
//                 color: 'teal',
//               }}
//               menuPosition="left"
//               panes={panes}
//             />
//           </Grid.Column>
//           <Grid.Column width={11}>
//             <Segment style={{ height: '100%' }}>hi</Segment>
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     </div>
//   );
// };

export default MainContainer;
