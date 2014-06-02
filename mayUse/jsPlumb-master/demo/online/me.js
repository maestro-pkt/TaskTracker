jsPlumb.ready(function() {

	var i = 0;
	console.log('aa');
	$('#container').dblclick(function(e) {
		var newState = $('<div>').attr('id', 'state' + i).addClass('item');

		var title = $('<div>').addClass('title').text('State ' + i);
		var connect = $('<div>').addClass('connect');

		newState.css({
			'top' : e.pageY,
			'left' : e.pageX
		});

		jsPlumb.draggable(newState, {
			containment : 'parent'
		});

		newState.dblclick(function(e) {
			jsPlumb.detachAllConnections($(this));
			$(this).remove();
			e.stopPropagation();
		});

		jsPlumb.makeTarget(newState, {
			anchor : 'Continuous'
		});

		jsPlumb.makeSource(connect, {
			parent : newState,
			anchor : 'Continuous'
		});

		newState.append(title);
		newState.append(connect);

		$('#container').append(newState);

		i++;
	});
});