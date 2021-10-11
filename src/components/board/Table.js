import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  z-index:1;
  position:absolute;
`;

const Table = ({ size, grid }) => {
  const canvasRef = useRef(null);

  const stoneSize = size / (grid + 1);
  const gridSize = stoneSize;
  const marginSize = stoneSize;
  console.log('stoneSize: ' + stoneSize + 'px, gridSize: ' + gridSize + 'px, marginSize: ' + marginSize + 'px');

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    drawLines(context, grid, gridSize, marginSize);
    drawPattern(context, size, marginSize);
    drawGuidelineText(context, grid, gridSize, marginSize);
    drawDots(context, grid, gridSize);
  }, []);

  const drawLines = (context, grid, gridSize, marginSize) => {
    const drawSize = grid * gridSize;
    const xStart = marginSize;
    const yStart = marginSize;
    const xEnd = xStart + drawSize;
    const yEnd = yStart + drawSize;

    // Draw the board x lines
    context.beginPath();
    for(var x = xStart; x <= xEnd - marginSize; x += gridSize) {
      context.moveTo(x, yStart);
      context.lineTo(x, yEnd - marginSize);
    }

    // Draw the board y lines
    for(var y = yStart; y <= yEnd - marginSize; y += gridSize) {
      context.moveTo(xStart, y);
      context.lineTo(xEnd - marginSize, y);
    }

    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
  }

  const drawPattern = (context, size, marginSize) => {
    // Create new image object to use as pattern
    const img = new Image();
    img.src = require('../../img/pvc_wood_pattern_sheet.jpg');
    img.onload = () => {
        const boardBG = context.createPattern(img, 'repeat');
        context.fillStyle = boardBG;
        context.globalAlpha = 0.7;
        context.globalCompositeOperation = 'destination-over';
        context.fillRect(0, 0, size + marginSize * 2, size + marginSize * 2);
    };
  }

  const drawGuidelineText = (context, grid, gridSize, marginSize) => {
    context.font = "20px";
    context.textBaseline = "bottom";

    const drawSize = grid * gridSize;
    var textX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    var textY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

    for(var i = 0; i < grid; i++) {
      context.fillText(textX[i], gridSize * (i + 1) - 5, marginSize / 2 + 5);
      context.fillText(textX[i], gridSize * (i + 1) - 5, drawSize + marginSize - (marginSize / 2) + 5);

      context.fillText(textY[i], marginSize / 2 - 5, gridSize * (i + 1) + 5);
      context.fillText(textY[i], drawSize + marginSize - (marginSize / 2) - 5, gridSize * (i + 1) + 5);
    }
  }

  const drawDots = (context, grid, gridSize) => {
    var point = [];
    if (grid === 19) {
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
