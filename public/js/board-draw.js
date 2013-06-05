var gridContext;
var stoneContext;
var gridtextContext;

define(['jquery', 'board-option', 'board-event', 'message'], function($, BoardOption, BoardEvent, message) {

    /**
     * Board Class
     * 
     * @param min_size
     * @param boardSize
     */
    var Board = function(min_size, boardSize) {
        if (boardSize) {
            this.boardSize = boardSize;
        } else {
            this.boardSize = 19;
            if(min_size <= 320) {
                this.boardSize = 8;
            } else if(min_size <= 400) {
                this.boardSize = 9;
            } else if(min_size <= 480) {
                this.boardSize = 11;
            } else if(min_size <= 640) {
                this.boardSize = 13;
            } else if(min_size <= 800) {
                this.boardSize = 15;
            }
        }
        console.log('boardSize: ' + this.boardSize);

        this.width = min_size;
        this.height = min_size;
        this.stoneSize = min_size / (this.boardSize + 1);
        this.gridSize = this.stoneSize;
        this.marginSize = this.stoneSize;
        console.log('stoneSize: ' + this.stoneSize + 'px, gridSize: ' + this.gridSize + 'px, marginSize: ' + this.marginSize + 'px');

        this.option = new BoardOption();
        this.eventHandler = new BoardEvent();

        this.stoneColor = 'black';
        this.stoneMap = [];
        this.stoneHistory = [];

        this.initBoard();
    };

    Board.prototype = {
        /**
         * Initializes current board
         *
         * @return
         */
        initBoard : function() {
            this.stoneColor = 'black';
            this.stoneMap = ( function(parent) {
                var stones = [];
                for(var i = 0; i < parent.boardSize; i++) {
                    stones[i] = [];
                    for(var j = 0; j < parent.boardSize; j++) {
                        stones[i][j] = 0;
                    }
                }
                return stones;
            }(this));

            this.option.isTextVisible() ? $('canvas#gridtext').show() : $('canvas#gridtext').hide();

            message.print('바둑 게임 시작');
        },
        
        /**
         * Draws board
         */
        drawBoard : function() {
            var gridSize = this.boardSize * this.gridSize;
            
            // canvas for 'board'
            var canvas = document.getElementById('board');
            canvas.width = this.width /*gridSize + this.marginSize*/;
            canvas.height = this.height /*gridSize + this.marginSize*/;
            gridContext = canvas.getContext('2d');
            
            // canvas for 'stone'
            var canvas2 = document.getElementById('stone');
            canvas2.width = gridSize + this.marginSize;
            canvas2.height = gridSize + this.marginSize;
            stoneContext = canvas2.getContext('2d');

            // canvas for 'text'
            var canvas3 = document.getElementById('gridtext');
            canvas3.width = gridSize + this.marginSize;
            canvas3.height = gridSize + this.marginSize;
            gridtextContext = canvas3.getContext('2d');

            // Draw x, y lines
            this._drawLines(gridSize);

            // Create new image object to use as pattern
            this._drawPattern(gridSize, this.marginSize);

            // Draw the guideline text
            this._drawGuidelineText();

            // Clear stone map
            this.initBoard();

            // Draw points
            var point = [[0, 0]];
            if(this.boardSize == 8) {
                point = [[3, 3], [6, 3], [3, 6], [6, 6]];
            } else if(this.boardSize == 9) {
                point = [[3, 3], [7, 3], [5, 5], [3, 7], [7, 7]];
            } else if(this.boardSize == 11) {
                point = [[3, 3], [6, 3], [9, 3], [3, 6], [6, 6], [9, 6], [3, 9], [6, 9], [9, 9]];
            } else if(this.boardSize == 13) {
                point = [[3, 3], [7, 3], [11, 3], [3, 7], [7, 7], [11, 7], [3, 11], [7, 11], [11, 11]];
            } else if(this.boardSize == 15) {
                point = [[4, 4], [8, 4], [12, 4], [4, 8], [8, 8], [12, 8], [4, 12], [8, 12], [12, 12]];
            } else if(this.boardSize == 19) {
                point = [[4, 4], [10, 4], [16, 4], [4, 10], [10, 10], [16, 10], [4, 16], [10, 16], [16, 16]];
            }

            for(var i = 0; i < point.length; i++) {
                this._drawPoints(point[i][0], point[i][1]);
            }

            // drawing attributes
            $('#drawing').attr('style', 'position: relative; width: ' + board.width + 'px; height: ' + board.height + 'px');
        },
        
        /**
         * Put a stone
         *
         * @param row
         * @param col
         * @param color
         */
        putStone : function(row, col, color) {
            if(row < 0 || col < 0 || row >= this.boardSize || col >= this.boardSize) {
                throw 'Wrong cell position (' + row + ', ' + col + ')';
            }

            try {
                this._drawStone(row, col, color);
            } catch(e) {
                console.error(e);
                return;
            }

            this.stoneHistory.push({row: row, col: col});
            message.print('순서 ' + this.stoneHistory.length + ', 포석 ' + this.stoneColor + ' (' + row + ', ' + col + ')');

            this.stoneColor = (this.stoneColor == 'black') ? 'white' : 'black';
        },
        
        /**
         * Move back stone
         *
         */
        moveBack : function(success, error) {
            if (this.stoneHistory.length < 1) {
                throw 'there is no stone.';
            }
            
            var lastStone = this.stoneHistory[this.stoneHistory.length - 1];
            this.stoneHistory.pop();
            
            this.stoneColor = (this.stoneColor === 'black') ? 'white' : 'black';
            
            try {
                this._eraseStone(lastStone.row, lastStone.col)
            } catch(e) {
                console.error(e);
                return;
            }

            message.print('순서 ' + this.stoneHistory.length + ', 무르기 ' + this.stoneColor + ' (' + row + ', ' + col + ')');
        },
        
        /**
         * Serializes current stone status
         *
         * @return
         */
        serialize : function() {
            var b = {};
            b.size = this.boardSize;
            b.stoneMap = this.stoneMap;
            b.stoneHistory = this.stoneHistory;
            b.timestamp = new Date().getTime();
            b.screenshot = canvas.toDataURL('image/jpeg', 0.1);

            var json = JSON.stringify(b);
            console.log(b, json.substring(0, 1000) + '...');
            return json;
        },
        
        _drawStone : function(ix, iy, color) {
            var putx = this.stoneSize * (iy + 1);
            var puty = this.stoneSize * (ix + 1);

            // check whether if valid position or not
            if(ix < 0 || iy < 0) {
                throw "Position is wrong. (" + ix + ', ' + iy + ', ' + this.stoneColor + ")";
            }

            // check whether if occupied position or not
            if(this.stoneMap[ix][iy] != 0) {
                throw "Stone is already occupied by other stone. (" + ix + ", " + iy + ")";
            } else {
                console.log("drawStone (" + ix + ', ' + iy + ', ' + this.stoneColor + ")");
            }

            // set sequence number on stone matrix
            this.stoneMap[ix][iy] = (this.stoneHistory.length+1);

            // draw stone shape and fill color
            stoneContext.beginPath();
            stoneContext.globalCompositeOperation = 'source-over';
            stoneContext.arc(putx, puty, this.stoneSize / 2 - 3, 0, 2 * Math.PI, true);
            stoneContext.fillStyle = this.stoneColor;

            // fill gradient for shining effect (not work now)
            var radius = this.stoneSize / 2;
            var rg;
            if(color === "black") {
                rg = stoneContext.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 0.7);
            } else {
                rg = stoneContext.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 3);
            }
            rg.addColorStop(0, "white");
            rg.addColorStop(1, "black");
            stoneContext.fillStyle = rg;
            stoneContext.fill();

            // fill sequence text
            gridtextContext.globalCompositeOperation = 'source-over';
            gridtextContext.strokeStyle = (color == 'black') ? 'white' : 'black';
            gridtextContext.font = 'italic bold ' + (this.stoneSize / 2.5) + 'px sans-serif';
            gridtextContext.textBaseline = 'bottom';
            var seq = this.stoneHistory.length + 1;
            var adjustment = 2.2;
            if(seq < 10) {
                adjustment = 5.5;
            } else if(seq < 100) {
                adjustment = 3.2;
            } else {
                adjustment = 2.2;
            }
            gridtextContext.strokeText(seq, putx - (this.stoneSize / adjustment), puty + (this.stoneSize / 3.5));
        },
        
        _eraseStone : function(ix, iy) {
            var putx = this.stoneSize * (iy + 1);
            var puty = this.stoneSize * (ix + 1);
            
            if(ix < 0 || iy < 0 || ix >= this.boardSize || iy >= this.boardSize) {
                throw 'Wrong cell position (' + ix + ', ' + iy + ')';
            }

            // check whether if occupied position or not
            if(this.stoneMap[ix][iy] == 0) {
                throw "Stone is not located in that position. (" + ix + ", " + iy + ")";
            }
            
            // set sequence number on stone matrix
            this.stoneMap[ix][iy] = 0;  // 0 means no stone
            
            // erase stone and text
            stoneContext.beginPath();
            stoneContext.globalCompositeOperation = 'destination-out';
            stoneContext.rect(putx - this.stoneSize / 2, puty - this.stoneSize / 2, this.stoneSize, this.stoneSize);
            stoneContext.fillStyle = this.stoneColor;
            stoneContext.fill();

            gridtextContext.beginPath();
            gridtextContext.globalCompositeOperation = 'destination-out';
            gridtextContext.rect(putx - this.stoneSize / 2, puty - this.stoneSize / 2, this.stoneSize, this.stoneSize);
            gridtextContext.fillStyle = this.stoneColor;
            gridtextContext.fill();

            console.log('eraseStone (' + ix + ', ' + iy + ')');
        },
        
        _drawLines : function(gridSize) {
            //var xStart = (window.innerWidth / 2) - (gridSize / 2) + 0.5;
            //var yStart = (window.innerHeight / 2) - (gridSize / 2) + 0.5;
            var xStart = this.marginSize;
            var yStart = this.marginSize;
            var xEnd = xStart + gridSize;
            var yEnd = yStart + gridSize;

            // Draw the board x lines
            gridContext.beginPath();
            for(var x = xStart; x <= xEnd - this.marginSize; x += this.gridSize) {
                gridContext.moveTo(x, yStart);
                gridContext.lineTo(x, yEnd - this.marginSize);
            }

            // Draw the board y lines
            for(var y = yStart; y <= yEnd - this.marginSize; y += this.gridSize) {
                gridContext.moveTo(xStart, y);
                gridContext.lineTo(xEnd - this.marginSize, y);
            }

            gridContext.strokeStyle = 'black';
            gridContext.stroke();
            gridContext.closePath();
        },
        
        _drawPattern : function(gridSize, marginSize) {
            // Create new image object to use as pattern
            var img = new Image();
            img.src = '/images/bg_wood.jpg';
            img.onload = function() {
                var boardBG = gridContext.createPattern(img, 'repeat');
                gridContext.fillStyle = boardBG;
                gridContext.globalAlpha = 0.7;
                gridContext.globalCompositeOperation = 'destination-over';
                gridContext.fillRect(0, 0, gridSize + marginSize * 2, gridSize + marginSize * 2);
                gridContext.globalAlpha = 1.0;
            }
        },
        
        _drawGuidelineText : function() {
            var modify = 5;
            gridContext.font = "20px";
            gridContext.textBaseline = "bottom";

            var gridSize = this.boardSize * this.gridSize;
            var textX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
            var textY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

            for(var i = 0; i < this.boardSize; i++) {
                gridContext.fillText(textX[i], this.gridSize * (i + 1) - 5, this.marginSize / 2 + 5);
                gridContext.fillText(textX[i], this.gridSize * (i + 1) - 5, gridSize + this.marginSize - (this.marginSize / 2) + 5);

                gridContext.fillText(textY[i], this.marginSize / 2 - 5, this.gridSize * (i + 1) + 5);
                gridContext.fillText(textY[i], gridSize + this.marginSize - (this.marginSize / 2) - 5, this.gridSize * (i + 1) + 5);
            }
        },
        
        _drawPoints : function(x, y) {
            gridContext.moveTo(this.gridSize * x, this.gridSize * y);
            gridContext.arc(this.gridSize * x, this.gridSize * y, this.gridSize / 7, 0, 2 * Math.PI, true);
            // gridContext.fillStyle = "#00f";
            gridContext.fill();
        }
    };

    return Board;
});

