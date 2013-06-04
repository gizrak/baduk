var LS_OPTION = 'option';

var gridContext;
var stoneContext;
var gridtextContext;

define(['jquery'], function($) {

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

        this.stoneSize = Math.floor(min_size - (10 * 2)) / (this.boardSize + 1) - 1;
        this.gridSize = this.stoneSize;
        this.marginSize = this.stoneSize;
        console.log('stoneSize: ' + this.stoneSize + 'px, gridSize: ' + this.gridSize + 'px, marginSize: ' + this.marginSize + 'px');

        this.option = new BoardOption();
        this.eventHandler = new BoardEvent();

        this.stoneColor = 'black';
        this.stones = [];
        this.sequence = 1;

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
            this.stones = ( function(parent) {
                var stones = [];
                for(var i = 0; i < parent.boardSize; i++) {
                    stones[i] = [];
                    for(var j = 0; j < parent.boardSize; j++) {
                        stones[i][j] = 0;
                    }
                }
                return stones;
            }(this));
            this.sequence = 1;
        },
        
        /**
         * Gets board pixel length
         *
         * @return
         */
        getBoardLength : function() {
            return this.boardSize * (this.stoneSize + 2) + 50;
        },
        
        /**
         * Draws board
         */
        drawBoard : function() {
            var gridSize = this.boardSize * this.gridSize;
            
            // canvas for 'board'
            var canvas = document.getElementById('board');
            canvas.width = gridSize + this.marginSize;
            canvas.height = gridSize + this.marginSize;
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
            $('#drawing').attr('style', 'position: relative; width: ' + board.getBoardLength() + 'px; height: ' + board.getBoardLength() + 'px');
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
                console.warn('Wrong cell position (' + row + ', ' + col + ')');
                return;
            }

            var success = this._drawStone(row, col, color);
            if(success == true) {
                this.stoneColor = (this.stoneColor == 'black') ? 'white' : 'black';
            }
        },
        
        /**
         * Remove stone(s)
         *
         * @param row
         * @param col
         */
        removeStone : function(row, col) {
            if(row < 0 || col < 0 || row >= this.boardSize || col >= this.boardSize) {
                console.warn('Wrong cell position (' + row + ', ' + col + ')');
                return;
            }
            
            this._eraseStone(0, 0);
        },
        
        /**
         * Serializes current stone status
         *
         * @return
         */
        serialize : function() {
            var b = {};
            b.size = this.boardSize;
            b.stones = this.stones;
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
                console.error("Position is wrong. (" + ix + ', ' + iy + ', ' + this.stoneColor + ")");
                return false;
            }

            // check whether if occupied position or not
            if(this.stones[ix][iy] != 0) {
                console.warn("Stone is already occupied by other stone. (" + ix + ", " + iy + ")");
                return false;
            } else {
                console.log("drawStone(" + ix + ', ' + iy + ', ' + this.stoneColor + ")");
            }

            // set sequence number on stone matrix
            this.stones[ix][iy] = (this.sequence++);

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
            var seq = this.sequence - 1;
            var adjustment = 2.2;
            if(seq < 10) {
                adjustment = 5.5;
            } else if(seq < 100) {
                adjustment = 3.2;
            } else {
                adjustment = 2.2;
            }
            gridtextContext.strokeText(seq, putx - (this.stoneSize / adjustment), puty + (this.stoneSize / 3.5));

            return true;
        },
        
        _eraseStone : function(ix, iy) {
            var putx = this.stoneSize * (iy + 1);
            var puty = this.stoneSize * (ix + 1);
            
            // check whether if valid position or not
            if(ix < 0 || iy < 0) {
                console.error("Position is wrong. (" + ix + ', ' + iy + ', ' + this.stoneColor + ")");
                return false;
            }
            
            // check whether if occupied position or not
            if(this.stones[ix][iy] == 0) {
                console.warn("Stone is not located in that position. (" + ix + ", " + iy + ")");
                return false;
            } else {
                console.log('eraseStone(' + ix + ', ' + iy + ')');
            }
            
            // set sequence number on stone matrix
            this.stones[ix][iy] = 0;
            
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
            
            return true;
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
            gridContext.arc(this.gridSize * x, this.gridSize * y, 5, 0, 2 * Math.PI, true);
            // gridContext.fillStyle = "#00f";
            gridContext.fill();
        }
    };

    /**
     * Board Event Class
     */
    BoardEvent = function() {
        /**
         * Left click will be handled to put stone.
         * If option is 'mouse', right will be black color.
         */
        $("canvas#stone, canvas#gridtext").click(function(e) {
            if (board.option.getColor() === 'mouse') {
                handleEvent(e, 'white');
            } else {
                handleEvent(e);
            }
        });

        /**
         * Right click will be ignored except when color option is 'mouse'
         * If option is 'mouse', right will be black color.
         */
        $('canvas#stone, canvas#gridtext').bind('contextmenu', function(e) {
            e.preventDefault();
            if (board.option.getColor() === 'mouse') {
                handleEvent(e, 'black');
            }
        });

        $(window).resize(function() {
            console.log($(window).width(), $(window).height());
        });

        function handleEvent(e, color) {
            // get initial coord of canvas
            var x = e.offsetX;
            var y = e.offsetY;

            // set (0, 0) as outter guilde line +1 stone
            // this will be virtual outter line
            x -= (board.gridSize / 2);
            y -= (board.gridSize / 2);

            row = Math.floor(y / board.gridSize);
            col = Math.floor(x / board.gridSize);

            var stoneColor;
            var optionColor = board.option.getColor();
            if (color) {
                stoneColor = color;
            } else if (typeof optionColor === 'undefined' || optionColor === '' || optionColor === 'auto') {
                stoneColor = board.stoneColor;
            } else {
                stoneColor = optionColor;
            }

            board.putStone(row, col, stoneColor);
        };
    };

    /**
     * Board Option Class
     */
    BoardOption = function() {
        var option = {
            game : {
                boardsize : 19,
                stonenumber : 'hide'
            },
            data : {},
            color : 'auto'
        };

        this.save = function() {
            console.log(JSON.stringify(option));
            localStorage.setItem(LS_OPTION, JSON.stringify(option));
        };

        this.reload = function() {
            var lsOption = localStorage.getItem(LS_OPTION);
            if (lsOption !== null) {
                option = JSON.parse(lsOption);
                console.log('Reload board option... ', option, JSON.stringify(option));
            } else {
                localStorage.setItem(LS_OPTION, JSON.stringify(option));
                console.warn('Board option does not exist! Generates default setting.');
            }
        };

        this.setBoardSize = function(boardsize) {
            option.game.boardsize = boardsize;
        };

        this.getBoardSize = function() {
            return option.game.boardsize;
        };

        this.setStoneNumber = function(stonenumber) {
            option.game.stonenumber = stonenumber;
        };

        this.getStoneNumber = function() {
            return option.game.stonenumber;
        };
        
        this.setColor = function(color) {
            option.color = color;
        };
        
        this.getColor = function() {
            return option.color;
        };
    };

    return Board;
});

