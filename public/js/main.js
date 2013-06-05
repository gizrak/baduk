(function(window) {
    var width = window.outerWidth;
    var height = window.outerHeight - 20;	// 20px : for margin
    var min_size = (width < height) ? width : height;
    var min_size = 480;
    console.log('width: ' + width + 'px, height: ' + height + 'px, min_size: ' + min_size + 'px');

    // require config
    require.config({
    	paths: {
    		jquery: 'libs/jquery-1.8.0.min'
    	},
    	shim: {
    		jquery: {
    			exports: '$'
    		}
    	},
    	onError: function() {
    		console.error('error occured.');
    	}
    });

    // init events
    (function() {
		$("#accordion").accordion({
			header : "h3"
		});

		// Tabs
		$('#tabs').tabs();

		$('#moveBack').click(function(event) {
			board.moveBack();
		});

		$('#showStone').click(function(event) {
			if (board.option.isStoneVisible()) {
				board.option.setStoneVisiblity(false);
				$('canvas#stone').hide();
				$('canvas#gridtext').hide();
				$('#showStone').text('돌 보이기');
			} else {
				board.option.setStoneVisiblity(true);
				$('canvas#stone').show();
				if (board.option.isTextVisible()) {
					$('canvas#gridtext').show();
				}
				$('#showStone').text('돌 숨기기');
			}
			
		});
		
		$('#showText').click(function(event) {
			if (board.option.isTextVisible()) {
				board.option.setTextVisiblity(false);
				$('canvas#gridtext').hide();
				$('#showText').text('순서 보이기');
			} else {
				board.option.setTextVisiblity(true);
				$('canvas#stone').show();
				$('canvas#gridtext').show();
				$('#showText').text('순서 숨기기');
			}
		});

		$(':input:radio[name=color]').click(function(event) {
			board.option.setColor($(this).val());
			console.log(board.option.getColor());
		});
    })();

	// init board
	require(['board-draw'], function(Board) {
		window.board = new Board(min_size, 19);
		board.drawBoard();
		board.option.reload();
	});
})(this);
