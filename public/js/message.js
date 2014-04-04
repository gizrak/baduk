define([ 'jquery' ], function($) {

	return {
		print : function(msg) {
			$('#message').text(msg);
		}
	};
});
