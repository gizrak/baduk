import React, { useEffect, useRef } from 'react';
import Stone from './board/Stone';
import Table from './board/Table';

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
    <div ref={drawingRef}>
      <Table size={tableSize} grid={gridCount} />
      <Stone tableSize={tableSize} gridCount={gridCount} />
    </div>
  );
};

export default Board;
