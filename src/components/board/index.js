import React, { useEffect, useRef, useState } from 'react';
import Option from './Option';
import Stone from './Stone';
import Table from './Table';

const Board = () => {
  const drawingRef = useRef(null);

  const width = window.innerWidth - 20; // 20px : for margin
  const tableSize = (width > 800) ? 800 : width;
  const gridCount = 19;
  console.log('width: ' + width + 'px, tableSize: ' + tableSize + 'px, gridCount: ' + gridCount);

  var stoneMap = ( function(parent) {
      var stones = [];
      for(var i = 0; i < gridCount; i++) {
          stones[i] = [];
          for(var j = 0; j < gridCount; j++) {
              stones[i][j] = 0;
          }
      }
      return stones;
  }(this));

  const [play, setPlay] = useState({
    game : {
      boardsize : 19,
      stonenumber : 1
    },
    stone : {
      color: 'black',  // default first color
      history: []
    },
    data : {},
    visibility: {
        stone : true,
        text : false
    }
  });
  const [option, setOption] = useState({
    colorMode: 'auto'
  });

  useEffect(() => {
    const drawing = drawingRef.current;
    drawing.style = 'position: relative; width: ' + tableSize + 'px; height: ' + tableSize + 'px'
  }, []);

  return (
    <React.Fragment>
      <div ref={drawingRef}>
        <Table size={tableSize} grid={gridCount} />
        <Stone tableSize={tableSize} gridCount={gridCount} play={play} option={option} />
      </div>
      <Option option={option} />
    </React.Fragment>
  );
};

export default Board;
