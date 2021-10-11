import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  z-index:2;
  position:absolute;
`;

const Stone = ({ tableSize, gridCount }) => {
  const canvasRef = useRef(null);

  const stoneSize = tableSize / (gridCount + 1);
  const gridSize = stoneSize;
  const marginSize = stoneSize;
  console.log('stoneSize: ' + stoneSize + 'px, gridSize: ' + gridSize + 'px, marginSize: ' + marginSize + 'px');

  var stoneColor = 'black';
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
  var stoneHistory = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = tableSize;
    canvas.height = tableSize;

    const context = canvas.getContext('2d');
    putStone(context, 1, 1, 'white');
    try {
      putStone(context, 1, 1, 'black');  // conflict
    } catch(e) {
      console.error(e);
    }
    putStone(context, 3, 1, 'black');
  }, []);

  const putStone = (context, row, col, color) => {
    if (row < 0 || col < 0 || row >= gridCount || col >= gridCount) {
        throw 'Wrong cell position (' + row + ', ' + col + ')';
    }

    // check whether if occupied position or not
    if (stoneMap[row][col] !== 0) {
        throw "Stone is already occupied by other stone. (" + row + ", " + col + ")";
    } else {
        console.log("drawStone (" + row + ', ' + col + ', ' + color + ")");
    }

    try {
        drawStone(context, row, col, color);
    } catch(e) {
        console.error(e);
        return;
    }

    stoneHistory.push({row: row, col: col, color: color});
    console.log('#' + stoneHistory.length + ' Put ' + color + ' (' + row + ', ' + col + ')');

    stoneColor = (stoneColor == 'black') ? 'white' : 'black';
  }

  const drawStone = (context, ix, iy, color, sequence) => {
    var putx = stoneSize * (iy + 1);
    var puty = stoneSize * (ix + 1);

    // check whether if valid position or not
    if(ix < 0 || iy < 0) {
        throw "Position is wrong. (" + ix + ', ' + iy + ', ' + stoneColor + ")";
    }

    // set sequence number on stone matrix
    stoneMap[ix][iy] = (stoneHistory.length+1);

    // draw stone shape and fill color
    context.beginPath();
    context.globalCompositeOperation = 'source-over';
    context.arc(putx, puty, stoneSize / 2 - 3, 0, 2 * Math.PI, true);
    context.fillStyle = color;

    // fill gradient for shining effect (not work now)
    var radius = stoneSize / 2;
    var rg;
    if(color === "black") {
        rg = context.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 0.7);
    } else {
        rg = context.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 3);
    }
    rg.addColorStop(0, "white");
    rg.addColorStop(1, "black");
    context.fillStyle = rg;
    context.fill();

    // fill sequence text
    // this.gridtextContext.globalCompositeOperation = 'source-over';
    // this.gridtextContext.strokeStyle = (color == 'black') ? 'white' : 'black';
    // this.gridtextContext.font = 'italic bold ' + (this.stoneSize / 2.5) + 'px sans-serif';
    // this.gridtextContext.textBaseline = 'bottom';
    // var seq = (typeof(sequence) !== 'undefined') ? sequence : this.stoneHistory.length + 1;
    // var adjustment = 2.2;
    // if(seq < 10) {
    //     adjustment = 5.5;
    // } else if(seq < 100) {
    //     adjustment = 3.2;
    // } else {
    //     adjustment = 2.2;
    // }
    // this.gridtextContext.strokeText(seq, putx - (this.stoneSize / adjustment), puty + (this.stoneSize / 3.5));
  }
  
  return (
    <StyledCanvas ref={canvasRef} />
  );
};

export default Stone;
