import React, { useEffect, useRef } from 'react';
import Option from './Option';
import Stone from './Stone';
import Table from './Table';

const Board = () => {
  const drawingRef = useRef(null);

  const width = window.innerWidth - 20; // 20px : for margin
  const tableSize = (width > 800) ? 800 : width;
  const gridCount = 19;
  console.log('width: ' + width + 'px, tableSize: ' + tableSize + 'px, gridCount: ' + gridCount);

  useEffect(() => {
    const drawing = drawingRef.current;
    drawing.style = 'position: relative; width: ' + tableSize + 'px; height: ' + tableSize + 'px'
  }, []);

  return (
    <React.Fragment>
      <div ref={drawingRef}>
        <Table size={tableSize} grid={gridCount} />
        <Stone tableSize={tableSize} gridCount={gridCount} />
      </div>
      <Option />
    </React.Fragment>
  );
};

export default Board;
