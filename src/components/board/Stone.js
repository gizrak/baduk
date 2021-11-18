import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  z-index:2;
  position:absolute;
`;

const Stone = forwardRef(({ play, option }, stoneRef) => {
  const canvasRef = useRef(null);

  const gridCount = play.grid.count;
  const gridSize = play.grid.size;
  const stoneColor = play.stone.color;
  const stoneSize = play.stone.size;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = play.table.size;
    canvas.height = play.table.size;

    canvas.addEventListener('click', (event) => {
      handleMouseEvent(event);
    });
    canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (option.colorMode === 'mouse') {
        handleMouseEvent(event, 'black');
      }
    });
  }, []);

  useImperativeHandle (stoneRef, () => ({
    eraseStone (ix, iy) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      var putx = stoneSize * (iy + 1);
      var puty = stoneSize * (ix + 1);
      
      if (ix < 0 || iy < 0 || ix >= gridCount || iy >= gridCount) {
        throw 'Wrong cell position (' + ix + ', ' + iy + ')';
      }
  
      // check whether if occupied position or not
      if(play.stone.map[ix][iy] == 0) {
        throw "Stone is not located in that position. (" + ix + ", " + iy + ")";
      }
      
      // set sequence number on stone matrix
      play.stone.map[ix][iy] = 0;  // 0 means no stone
      
      // erase stone and text
      context.beginPath();
      context.globalCompositeOperation = 'destination-out';
      context.rect(putx - stoneSize / 2, puty - stoneSize / 2, stoneSize, stoneSize);
      context.fillStyle = stoneColor;
      context.fill();
  
      context.beginPath();
      context.globalCompositeOperation = 'destination-out';
      context.rect(putx - stoneSize / 2, puty - stoneSize / 2, stoneSize, stoneSize);
      context.fillStyle = stoneColor;
      context.fill();
    }
  }));
  
  const handleMouseEvent = (event, color) => {
    // get initial coord of canvas
      var x = event.offsetX;
      var y = event.offsetY;

      // set (0, 0) as outter guilde line +1 stone
      // this will be virtual outter line
      x -= (gridSize / 2);
      y -= (gridSize / 2);

      var row = Math.floor(y / gridSize);
      var col = Math.floor(x / gridSize);

      putStone(row, col, color || decideColor());
  }

  const putStone = (row, col, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (row < 0 || col < 0 || row >= gridCount || col >= gridCount) {
        throw 'Wrong cell position (' + row + ', ' + col + ')';
    }

    // check whether if occupied position or not
    if (play.stone.map[row][col] !== 0) {
        throw "Stone is already occupied by other stone. (" + row + ", " + col + ")";
    }

    try {
        drawStone(context, row, col, color);
    } catch(e) {
        console.error(e);
        return;
    }

    play.stone.history.push({row: row, col: col, color: color});
    console.log('#' + play.stone.history.length + ' Put ' + color + ' (' + row + ', ' + col + ')');
  }

  const decideColor = () => {
    const mode = option.colorMode;
    if (mode === 'mouse') {
      return 'white';  // mouse mode left click
    } else if (mode === 'black' || mode === 'white') {
      return mode;
    } else {
      const history = play.stone.history;
      if (history.length === 0) {
        return 'black';
      } else {
        return history[history.length - 1].color === 'white' ? 'black' : 'white';
      }
    }
  }

  const drawStone = (context, ix, iy, color, sequence) => {
    var putx = stoneSize * (iy + 1);
    var puty = stoneSize * (ix + 1);

    // check whether if valid position or not
    if(ix < 0 || iy < 0) {
        throw "Position is wrong. (" + ix + ', ' + iy + ")";
    }

    // set sequence number on stone matrix
    play.stone.map[ix][iy] = (play.stone.history.length+1);

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
    // this.gridtextContext.font = 'italic bold ' + (stoneSize / 2.5) + 'px sans-serif';
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
    // this.gridtextContext.strokeText(seq, putx - (stoneSize / adjustment), puty + (stoneSize / 3.5));
  }
  
  return (
    <StyledCanvas ref={canvasRef} />
  );
});

export default Stone;
