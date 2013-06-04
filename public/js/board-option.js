var LS_OPTION = 'option';

define([''], function() {

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

    return BoardOption;
});

