define([], function() {

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

    return BoardEvent;
});
