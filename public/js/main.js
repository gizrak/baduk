(function(window) {

	// config requirejs
	require.config({
		paths : {
			'jquery' : ['//code.jquery.com/jquery-1.12.4.min'],
			'jquery-ui' : ['//code.jquery.com/ui/1.12.1/jquery-ui.min']
		},
		shim : {
			'jquery-ui' : {
				exports : '$',
				deps : [ 'jquery' ]
			},
			'bootstrap' : [ 'jquery' ]
		},
		onError : function() {
			console.error('error occurred.');
		}
	});

	// change css when orientation changed
	document.addEventListener('orientationchange', function(e) {
		switch (window.orientation) {
		case -90:
		case 90:
			console.log('LANDSCAPE MODE');
			break;

		case 0:
		default:
			console.log('PORTRAIT MODE');
			break;
		}

		var width = window.innerWidth - 20; // 20px : for margin
		var min_size = (width > 800) ? 800 : width;
		console.log('width: ' + width + 'px, min_size: ' + min_size + 'px');

		window.board.resizeBoard(min_size);
	});

	// add initial event listeners
	require([ 'jquery' ], function($) {
		$('#resize400').click(function(event) { board.resizeBoard(400); });
		$('#resize600').click(function(event) { board.resizeBoard(600); });
		$('#resize800').click(function(event) { board.resizeBoard(800); });

		$('#moveBack').click(function(event) {
			board.moveBack();
		});

		$('#showStone').click(function(event) {
			if (board.option.isStoneVisible()) {
				board.option.setStoneVisiblity(false);
				$('canvas#stone').hide();
				$('canvas#gridtext').hide();
				$('#showStone').text('Show stones');
			} else {
				board.option.setStoneVisiblity(true);
				$('canvas#stone').show();
				if (board.option.isTextVisible()) {
					$('canvas#gridtext').show();
				}
				$('#showStone').text('Hide stones');
			}

		});

		$('#showText').click(function(event) {
			if (board.option.isTextVisible()) {
				board.option.setTextVisiblity(false);
				$('canvas#gridtext').hide();
				$('#showText').text('Show seq.');
			} else {
				board.option.setTextVisiblity(true);
				$('canvas#stone').show();
				$('canvas#gridtext').show();
				$('#showText').text('Hide seq.');
			}
		});

		$(':input:radio[name=color]').click(function(event) {
			board.option.setColor($(this).val());
			console.log(board.option.getColor());
		});
	});

	// init board
	require([ 'board-draw' ], function(Board) {
		var width = window.innerWidth - 20; // 20px : for margin
		var min_size = (width > 800) ? 800 : width;
		console.log('width: ' + width + 'px, min_size: ' + min_size + 'px');

		window.board = new Board(min_size);
		board.drawBoard();
		board.option.reload();
	});
})(this);
