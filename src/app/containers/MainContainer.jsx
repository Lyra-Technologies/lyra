import React from 'react';
import VisualizationContainer from '../containers/VisualizationContainer';

// const styles = theme => ({
//   progress: {
//     margin: theme.spacing.unit * 2,
//   },
// });

// function CircularIndeterminate(props) {
//   const { classes } = props;
//   return (
//     <div>
//       <CircularProgress className={classes.progress} />
//     </div>
//   );
// }

// CircularIndeterminate.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

const MainContainer = ({ payload }) => {
  return (
    <div id="graphContainer">
      {/* {payload ? ( */}
      <VisualizationContainer /*data={props.payload}*/ />
      {/* // ) : (
      //   <div>
      //     <CircularIndeterminate />
      //     <p> loading...</p>
      //   </div>
      // )} */}
    </div>
  );
};

export default MainContainer;
