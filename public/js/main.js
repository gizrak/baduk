(function(window) {
    var width = window.outerWidth;
    var height = window.outerHeight - 20;	// 20px : for margin
    var min_size = (width < height) ? width : height;
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

	// init board
	require(['board-main'], function(Board) {
		window.board = new Board(min_size, 19);
		board.drawBoard();
		board.option.reload();
	});
})(this);

$(function() {
	// Accordion
	$("#accordion").accordion({
		header : "h3"
	});

	// Tabs
	$('#tabs').tabs();

	// Dialog
	$('#dialog').dialog({
		autoOpen : false,
		width : 600,
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});

	// Dialog Link
	$('#dialog_link').click(function() {
		$('#dialog').dialog('open');
		return false;
	});

	// Datepicker
	$('#datepicker').datepicker({
		inline : true
	});

	// Slider
	$('#slider').slider({
		range : true,
		values : [ 17, 67 ]
	});

	// Progressbar
	$("#progressbar").progressbar({
		value : 20
	});

	//hover states on the static widgets
	$('#dialog_link, ul#icons li').hover(function() {
		$(this).addClass('ui-state-hover');
	}, function() {
		$(this).removeClass('ui-state-hover');
	});

	$('#remove_stone').click(function(event) {
		board.removeStone();
	});

	$('#show_stone').click(function(event) {
		$('canvas#stone').show();
	});

	$('#hide_stone').click(function(event) {
		$('canvas#stone').hide();
		$('canvas#gridtext').hide();
	});
	
	$('#show_text').click(function(event) {
		$('canvas#stone').show();
		$('canvas#gridtext').show();
	});

	$('#hide_text').click(function(event) {
		$('canvas#gridtext').hide();
	});

	$(':input:radio[name=color]').click(function(event) {
		board.option.setColor($(this).val());
		console.log(board.option.getColor());
	});
});