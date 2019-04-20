import React from 'react';

const MainContainer = ({ payload }) => {
  return (
    <div id='graphContainer'>
      {payload ? (
        Object.entries(payload).map(storage => {
          return <code key={storage[0]}>{storage}</code>;
        })
      ) : (
        <p>Waiting for local storage...</p>
      )}
    </div>
  );
};

export default MainContainer;
