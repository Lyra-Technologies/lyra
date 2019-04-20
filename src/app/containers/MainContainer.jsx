import React from 'react';

const MainContainer = ({ payload }) => {
  return (
    <div id='graphContainer'>
      {payload ? (
        Object.entries(payload).map(storage => {
          return <p key={storage[0]}>{storage}</p>;
        })
      ) : (
        <p>Waiting for local storage</p>
      )}
    </div>
  );
};

export default MainContainer;
