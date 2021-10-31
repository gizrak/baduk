import React, { createRef, useEffect, useRef, useState } from 'react';
import Option from './Option';
import Stone from './Stone';
import Table from './Table';

const Board = () => {
  const drawingRef = useRef(null);
  const stoneRef = useRef(null);

  const width = window.innerWidth - 20; // 20px : for margin
  const tableSize = (width > 800) ? 800 : width;
  const gridCount = 19;
  const stoneSize = tableSize / (gridCount + 1);
  const gridSize = stoneSize;
  const marginSize = stoneSize;
  console.log('width: ' + width + 'px, tableSize: ' + tableSize + 'px, gridCount: ' + gridCount);
  console.log('stoneSize: ' + stoneSize + 'px, gridSize: ' + gridSize + 'px, marginSize: ' + marginSize + 'px');

  const [play, setPlay] = useState({
    table : {
      size : tableSize
    },
    grid: {
      count: gridCount,
      size: gridSize,
      margin: marginSize
    },
    stone : {
      size: stoneSize,
      color: 'black',  // default first color
      map: ( function(parent) {
        var stones = [];
        for(var i = 0; i < gridCount; i++) {
            stones[i] = [];
            for(var j = 0; j < gridCount; j++) {
                stones[i][j] = 0;
            }
        }
        return stones;
      }(this)),
      history: []
    },
    data : {}
  });
  const [option, setOption] = useState({
    colorMode: 'auto',
    visibility: {
      stone : true,
      text : false
    }
  });

  useEffect(() => {
    const drawing = drawingRef.current;
    drawing.style = 'position: relative; width: ' + tableSize + 'px; height: ' + tableSize + 'px';
  }, []);

  const moveBack = () => {
    const history = play.stone.history;
    if (history.length < 1) {
      console.error('there is no stone.');
      return;
    }
    
    const lastStone = history[history.length - 1];
    stoneRef.current.eraseStone(lastStone.row, lastStone.col);
    console.info('#' + history.length + ' Retract ' + play.stone.color + ' (' + lastStone.row + ', ' + lastStone.col + ')');

    play.stone.history.pop();
    play.stone.color = (play.stone.color === 'black') ? 'white' : 'black';
  }

  return (
    <React.Fragment>
      <div ref={drawingRef}>
        <Table play={play} />
        <Stone play={play} option={option} ref={stoneRef} />
      </div>
      <div>
        <button onClick={moveBack}>Move back</button>
      </div>
      <Option play={play} option={option} />
    </React.Fragment>
  );
};

export default Board;
