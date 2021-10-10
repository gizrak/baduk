import React from 'react';
import Board from '../components/Board';

const Home = () => {
  const width = window.innerWidth - 20; // 20px : for margin
  const min_size = (width > 800) ? 800 : width;
  console.log('width: ' + width + 'px, min_size: ' + min_size + 'px');

  return (
    <React.Fragment>
      <Board width={min_size} />
    </React.Fragment>
  );
};

export default Home;
