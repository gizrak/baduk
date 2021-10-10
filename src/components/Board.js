import React, { createRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledBoard = styled.canvas`
  z-index:1;
  position:absolute;
`;
const StyledStone = styled.canvas`
  z-index:2;
  position:absolute;
`;
const StyledGridText = styled.canvas`
  z-index:3;
  position:absolute;
`;

const Board = ({ boardSize, gridCount }) => {

  let boardRef = createRef();

  useEffect(() => {
    var boardSize = (typeof(boardSize) !== 'undefined') ? boardSize : 800;
    var gridCount = (typeof(gridCount) !== 'undefined') ? gridCount : 19;
    console.log('boardSize: ' + boardSize + 'px, gridCount: ' + gridCount);
  
    const width = boardSize;
    const height = boardSize;
    const stoneSize = boardSize / (gridCount + 1);
    const gridSize = stoneSize;
    const marginSize = stoneSize;
    console.log('stoneSize: ' + stoneSize + 'px, gridSize: ' + gridSize + 'px, marginSize: ' + marginSize + 'px');
    
    let boardCanvas = boardRef.current;
    boardCanvas.width = width;
    boardCanvas.height = height;
    let boardContext = boardCanvas.getContext('2d');

    drawLines(boardContext, gridCount, gridSize, marginSize);
  });
  
  function drawLines(boardContext, gridCount, gridSize, marginSize) {
    const drawSize = gridCount * gridSize;
    const xStart = marginSize;
    const yStart = marginSize;
    const xEnd = xStart + drawSize;
    const yEnd = yStart + drawSize;

    // Draw the board x lines
    boardContext.beginPath();
    for(var x = xStart; x <= xEnd - marginSize; x += gridSize) {
      boardContext.moveTo(x, yStart);
      boardContext.lineTo(x, yEnd - marginSize);
    }

    // Draw the board y lines
    for(var y = yStart; y <= yEnd - marginSize; y += gridSize) {
      boardContext.moveTo(xStart, y);
      boardContext.lineTo(xEnd - marginSize, y);
    }

    boardContext.strokeStyle = 'black';
    boardContext.stroke();
    boardContext.closePath();
  }
  
  return (
    <div id="drawing">
      <h2>{boardSize}</h2>
      <StyledBoard ref={boardRef} />
      <StyledStone />
      <StyledGridText />
    </div>
  );
};

export default Board;
