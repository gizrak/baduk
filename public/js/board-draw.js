define(['jquery', 'board-option', 'board-event', 'message'], function($, BoardOption, BoardEvent, message) {

    /**
     * Board Class
     * 
     * @param boardSize
     * @param gridCount
     */
    var Board = function(boardSize, gridCount) {
        this.boardSize = (typeof(boardSize) !== 'undefined') ? boardSize : 800;
        this.gridCount = (typeof(gridCount) !== 'undefined') ? gridCount : 19;
        console.log('boardSize: ' + boardSize + ', gridCount: ' + this.gridCount);

        this.width = boardSize;
        this.height = boardSize;
        this.stoneSize = boardSize / (this.gridCount + 1);
        this.gridSize = this.stoneSize;
        this.marginSize = this.stoneSize;
        console.log('stoneSize: ' + this.stoneSize + 'px, gridSize: ' + this.gridSize + 'px, marginSize: ' + this.marginSize + 'px');

        this.option = new BoardOption();
        this.eventHandler = new BoardEvent();

        this.stoneColor = 'black';
        this.stoneMap = ( function(parent) {
            var stones = [];
            for(var i = 0; i < parent.gridCount; i++) {
                stones[i] = [];
                for(var j = 0; j < parent.gridCount; j++) {
                    stones[i][j] = 0;
                }
            }
            return stones;
        }(this));
        this.stoneHistory = [];

        this.option.isTextVisible() ? $('canvas#gridtext').show() : $('canvas#gridtext').hide();

        message.print('Start game.');
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
                for(var i = 0; i < parent.gridCount; i++) {
                    stones[i] = [];
                    for(var j = 0; j < parent.gridCount; j++) {
                        stones[i][j] = 0;
                    }
                }
                return stones;
            }(this));

            this.option.isTextVisible() ? $('canvas#gridtext').show() : $('canvas#gridtext').hide();
        },

        resizeBoard : function(boardSize) {
            this.boardSize = boardSize;

            this.width = boardSize;
            this.height = boardSize;
            this.stoneSize = boardSize / (this.gridCount + 1);
            this.gridSize = this.stoneSize;
            this.marginSize = this.stoneSize;
            console.log('stoneSize: ' + this.stoneSize + 'px, gridSize: ' + this.gridSize + 'px, marginSize: ' + this.marginSize + 'px');

            this.drawBoard();

            for (var i=0; i<this.stoneHistory.length; i++) {
                var stone = this.stoneHistory[i];
                this._drawStone(stone.row, stone.col, stone.color, i+1);
            }
        },
        
        /**
         * Draws board
         */
        drawBoard : function() {
            // canvas for 'board'
            var canvas = document.getElementById('board');
            canvas.width = this.width;
            canvas.height = this.height;
            this.gridContext = canvas.getContext('2d');
            
            // canvas for 'stone'
            var canvas2 = document.getElementById('stone');
            canvas2.width = this.width;
            canvas2.height = this.height;
            this.stoneContext = canvas2.getContext('2d');

            // canvas for 'text'
            var canvas3 = document.getElementById('gridtext');
            canvas3.width = this.width;
            canvas3.height = this.height;
            this.gridtextContext = canvas3.getContext('2d');

            // Draw x, y lines
            this._drawLines(this.gridCount * this.gridSize);

            // Create new image object to use as pattern
            this._drawPattern(this.width, this.marginSize);

            // Draw the guideline text
            this._drawGuidelineText();

            // Draw points
            var point = [];
            if (this.gridCount === 19) {
                point = [[4, 4], [10, 4], [16, 4], [4, 10], [10, 10], [16, 10], [4, 16], [10, 16], [16, 16]];
            }

            for(var i = 0; i < point.length; i++) {
                this._drawPoints(point[i][0], point[i][1]);
            }

            // drawing attributes
            $('#drawing').attr('style', 'position: relative; width: ' + this.width + 'px; height: ' + this.height + 'px');
        },
        
        /**
         * Put a stone
         *
         * @param row
         * @param col
         * @param color
         */
        putStone : function(row, col, color) {
            if(row < 0 || col < 0 || row >= this.gridCount || col >= this.gridCount) {
                throw 'Wrong cell position (' + row + ', ' + col + ')';
            }

            // check whether if occupied position or not
            if(this.stoneMap[row][col] !== 0) {
                throw "Stone is already occupied by other stone. (" + row + ", " + col + ")";
            } else {
                console.log("drawStone (" + row + ', ' + col + ', ' + color + ")");
            }

            try {
                this._drawStone(row, col, color);
            } catch(e) {
                console.error(e);
                return;
            }

            this.stoneHistory.push({row: row, col: col, color: color});
            message.print('Seq. ' + this.stoneHistory.length + ', Placement ' + this.stoneColor + ' (' + row + ', ' + col + ', ' + color + ')');

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

            message.print('Seq. ' + this.stoneHistory.length + ', Retract ' + this.stoneColor + ' (' + row + ', ' + col + ')');
        },
        
        /**
         * Serializes current stone status
         *
         * @return
         */
        serialize : function() {
            var b = {};
            b.size = this.gridCount;
            b.stoneMap = this.stoneMap;
            b.stoneHistory = this.stoneHistory;
            b.timestamp = new Date().getTime();
            b.screenshot = canvas.toDataURL('image/jpeg', 0.1);

            var json = JSON.stringify(b);
            console.log(b, json.substring(0, 1000) + '...');
            return json;
        },
        
        _drawStone : function(ix, iy, color, sequence) {
            var putx = this.stoneSize * (iy + 1);
            var puty = this.stoneSize * (ix + 1);

            // check whether if valid position or not
            if(ix < 0 || iy < 0) {
                throw "Position is wrong. (" + ix + ', ' + iy + ', ' + this.stoneColor + ")";
            }

            // set sequence number on stone matrix
            this.stoneMap[ix][iy] = (this.stoneHistory.length+1);

            // draw stone shape and fill color
            this.stoneContext.beginPath();
            this.stoneContext.globalCompositeOperation = 'source-over';
            this.stoneContext.arc(putx, puty, this.stoneSize / 2 - 3, 0, 2 * Math.PI, true);
            this.stoneContext.fillStyle = this.stoneColor;

            // fill gradient for shining effect (not work now)
            var radius = this.stoneSize / 2;
            var rg;
            if(color === "black") {
                rg = this.stoneContext.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 0.7);
            } else {
                rg = this.stoneContext.createRadialGradient(putx - (radius / 3), puty - (radius / 3), radius / 50, putx - (radius / 3), puty - (radius / 3), radius * 3);
            }
            rg.addColorStop(0, "white");
            rg.addColorStop(1, "black");
            this.stoneContext.fillStyle = rg;
            this.stoneContext.fill();

            // fill sequence text
            this.gridtextContext.globalCompositeOperation = 'source-over';
            this.gridtextContext.strokeStyle = (color == 'black') ? 'white' : 'black';
            this.gridtextContext.font = 'italic bold ' + (this.stoneSize / 2.5) + 'px sans-serif';
            this.gridtextContext.textBaseline = 'bottom';
            var seq = (typeof(sequence) !== 'undefined') ? sequence : this.stoneHistory.length + 1;
            var adjustment = 2.2;
            if(seq < 10) {
                adjustment = 5.5;
            } else if(seq < 100) {
                adjustment = 3.2;
            } else {
                adjustment = 2.2;
            }
            this.gridtextContext.strokeText(seq, putx - (this.stoneSize / adjustment), puty + (this.stoneSize / 3.5));
        },
        
        _eraseStone : function(ix, iy) {
            var putx = this.stoneSize * (iy + 1);
            var puty = this.stoneSize * (ix + 1);
            
            if(ix < 0 || iy < 0 || ix >= this.gridCount || iy >= this.gridCount) {
                throw 'Wrong cell position (' + ix + ', ' + iy + ')';
            }

            // check whether if occupied position or not
            if(this.stoneMap[ix][iy] == 0) {
                throw "Stone is not located in that position. (" + ix + ", " + iy + ")";
            }
            
            // set sequence number on stone matrix
            this.stoneMap[ix][iy] = 0;  // 0 means no stone
            
            // erase stone and text
            this.stoneContext.beginPath();
            this.stoneContext.globalCompositeOperation = 'destination-out';
            this.stoneContext.rect(putx - this.stoneSize / 2, puty - this.stoneSize / 2, this.stoneSize, this.stoneSize);
            this.stoneContext.fillStyle = this.stoneColor;
            this.stoneContext.fill();

            this.gridtextContext.beginPath();
            this.gridtextContext.globalCompositeOperation = 'destination-out';
            this.gridtextContext.rect(putx - this.stoneSize / 2, puty - this.stoneSize / 2, this.stoneSize, this.stoneSize);
            this.gridtextContext.fillStyle = this.stoneColor;
            this.gridtextContext.fill();

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
            this.gridContext.beginPath();
            for(var x = xStart; x <= xEnd - this.marginSize; x += this.gridSize) {
                this.gridContext.moveTo(x, yStart);
                this.gridContext.lineTo(x, yEnd - this.marginSize);
            }

            // Draw the board y lines
            for(var y = yStart; y <= yEnd - this.marginSize; y += this.gridSize) {
                this.gridContext.moveTo(xStart, y);
                this.gridContext.lineTo(xEnd - this.marginSize, y);
            }

            this.gridContext.strokeStyle = 'black';
            this.gridContext.stroke();
            this.gridContext.closePath();
        },
        
        _drawPattern : function(gridSize, marginSize) {
            var self = this;

            // Create new image object to use as pattern
            var img = new Image();
            img.src = 'images/bg_wood.jpg';
            img.onload = function() {
                var boardBG = self.gridContext.createPattern(img, 'repeat');
                self.gridContext.fillStyle = boardBG;
                self.gridContext.globalAlpha = 0.7;
                self.gridContext.globalCompositeOperation = 'destination-over';
                self.gridContext.fillRect(0, 0, gridSize + marginSize * 2, gridSize + marginSize * 2);
                self.gridContext.globalAlpha = 1.0;
            }
        },
        
        _drawGuidelineText : function() {
            var modify = 5;
            this.gridContext.font = "20px";
            this.gridContext.textBaseline = "bottom";

            var gridSize = this.gridCount * this.gridSize;
            var textX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
            var textY = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

            for(var i = 0; i < this.gridCount; i++) {
                this.gridContext.fillText(textX[i], this.gridSize * (i + 1) - 5, this.marginSize / 2 + 5);
                this.gridContext.fillText(textX[i], this.gridSize * (i + 1) - 5, gridSize + this.marginSize - (this.marginSize / 2) + 5);

                this.gridContext.fillText(textY[i], this.marginSize / 2 - 5, this.gridSize * (i + 1) + 5);
                this.gridContext.fillText(textY[i], gridSize + this.marginSize - (this.marginSize / 2) - 5, this.gridSize * (i + 1) + 5);
            }
        },
        
        _drawPoints : function(x, y) {
            this.gridContext.moveTo(this.gridSize * x, this.gridSize * y);
            this.gridContext.arc(this.gridSize * x, this.gridSize * y, this.gridSize / 7, 0, 2 * Math.PI, true);
            // this.gridContext.fillStyle = "#00f";
            this.gridContext.fill();
        }
    };

    return Board;
});
