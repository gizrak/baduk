import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  z-index:1;
  position:absolute;
`;

const Table = ({ play }) => {
  const canvasRef = useRef(null);

  const tableSize = play.table.size;
  const gridCount = play.grid.count;
  const gridSize = play.grid.size;
  const gridMargin = play.grid.margin;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = tableSize;
    canvas.height = tableSize;

    const context = canvas.getContext('2d');
    drawLines(context);
    drawPattern(context);
    drawGuidelineText(context);
    drawDots(context);
  }, []);

  const drawLines = (context) => {
    const drawSize = gridCount * gridSize;
    const xStart = gridMargin;
    const yStart = gridMargin;
    const xEnd = xStart + drawSize;
    const yEnd = yStart + drawSize;

    // Draw the board x lines
    context.beginPath();
    for(var x = xStart; x <= xEnd - gridMargin; x += gridSize) {
      context.moveTo(x, yStart);
      context.lineTo(x, yEnd - gridMargin);
    }

    // Draw the board y lines
    for(var y = yStart; y <= yEnd - gridMargin; y += gridSize) {
      context.moveTo(xStart, y);
      context.lineTo(xEnd - gridMargin, y);
    }

    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
  }

  const drawPattern = (context) => {
    // Create new image object to use as pattern
    const img = new Image();
    img.src = require('../../img/pvc_wood_pattern_sheet.jpg');
    img.onload = () => {
        const boardBG = context.createPattern(img, 'repeat');
        context.fillStyle = boardBG;
        context.globalAlpha = 0.7;
        context.globalCompositeOperation = 'destination-over';
        context.fillRect(0, 0, tableSize + gridMargin * 2, tableSize + gridMargin * 2);
    };
  }

  const drawGuidelineText = (context) => {
    context.font = "20px";
    context.textBaseline = "bottom";

    const drawSize = gridCount * gridSize;
    var textX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    var textY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

    for(var i = 0; i < gridCount; i++) {
      context.fillText(textX[i], gridSize * (i + 1) - 5, gridMargin / 2 + 5);
      context.fillText(textX[i], gridSize * (i + 1) - 5, drawSize + gridMargin - (gridMargin / 2) + 5);

      context.fillText(textY[i], gridMargin / 2 - 5, gridSize * (i + 1) + 5);
      context.fillText(textY[i], drawSize + gridMargin - (gridMargin / 2) - 5, gridSize * (i + 1) + 5);
    }
  }

  const drawDots = (context) => {
    var point = [];
    if (gridCount === 19) {
      point = [[4, 4], [10, 4], [16, 4], [4, 10], [10, 10], [16, 10], [4, 16], [10, 16], [16, 16]];
    }

    for(var i = 0; i < point.length; i++) {
      const x = point[i][0];
      const y = point[i][1];
      context.moveTo(gridSize * x, gridSize * y);
      context.arc(gridSize * x, gridSize * y, gridSize / 7, 0, 2 * Math.PI, true);
      // context.fillStyle = "#00f";
      context.fill();
    }
  }
  
  return (
    <StyledCanvas ref={canvasRef} />
  );
};

export default Table;
