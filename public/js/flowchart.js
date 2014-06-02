jsPlumb.ready(function() {

	
	// setup some defaults for jsPlumb.	
	var instance = window.instance = jsPlumb.getInstance({
		Endpoint : ["Dot", {radius:2}],
		HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
		ConnectionOverlays : [
			[ "Arrow", { 
				location:1,
				id:"arrow",
                length:14,
                foldback:0.8
			} ],
            [ "Label", { label:"FOO", id:"label", cssClass:"aLabel" }]
		],
		Container:"flowchart"
	});

	var windows = jsPlumb.getSelector(".window");
console.log( 'a');
    // initialise draggable elements.  
	instance.draggable(windows);
console.log('b');
    // bind a click listener to each connection; the connection is deleted. you could of course
	// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
	// happening.
	instance.bind("click", function(c) { 
		instance.detach(c); 
	});
console.log('c');
	// bind a connection listener. note that the parameter passed to this function contains more than
	// just the new connection - see the documentation for a full list of what is included in 'info'.
	// this listener sets the connection's internal
	// id as the label overlay's text.
    instance.bind("connection", function(info) {
		info.connection.getOverlay("label").setLabel(info.connection.id);
    });
console.log('d');

	// suspend drawing and initialise.
	instance.doWhileSuspended(function() {
		console.log( 'doWhileSuspended-start');
		var isFilterSupported = instance.isDragFilterSupported();
		// make each ".ep" div a source and give it some parameters to work with.  here we tell it
		// to use a Continuous anchor and the StateMachine connectors, and also we give it the
		// connector's paint style.  note that in this demo the strokeStyle is dynamically generated,
		// which prevents us from just setting a jsPlumb.Defaults.PaintStyle.  but that is what i
		// would recommend you do. Note also here that we use the 'filter' option to tell jsPlumb
		// which parts of the element should actually respond to a drag start.
		// here we test the capabilities of the library, to see if we
		// can provide a `filter` (our preference, support by vanilla
		// jsPlumb and the jQuery version), or if that is not supported,
		// a `parent` (YUI and MooTools). I want to make it perfectly
		// clear that `filter` is better. Use filter when you can.
		if (isFilterSupported) {
			console.log( 'filter supported');
			instance.makeSource(windows, {
				filter:".ep",
				anchor:"Continuous",
				connector:[ "StateMachine", { curviness:20 } ],
				connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
				maxConnections:5,
				onMaxConnections:function(info, e) {
					alert("Maximum connections (" + info.maxConnections + ") reached");
				}
			});
		}
		else {
			console.log( 'else');
			var eps = jsPlumb.getSelector(".ep");
			for (var i = 0; i < eps.length; i++) {
				var e = eps[i], p = e.parentNode;
				instance.makeSource(e, {
					parent:p,
					anchor:"Continuous",
					connector:[ "StateMachine", { curviness:20 } ],
					connectorStyle:{ strokeStyle:"#5c96bc",lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
					maxConnections:5,
					onMaxConnections:function(info, e) {
						alert("Maximum connections (" + info.maxConnections + ") reached");
					}
				});
			}
		}
		console.log( 'doWhileSuspended-end');

	});
console.log('e');
console.log( instance );
console.log( windows );
	// initialize all '.window' elements as connection targets.
	instance.makeTarget(windows, {
		dropOptions:{ hoverClass:"dragHover" },
		anchor:"Continuous"				
	});
console.log('f');	
	// and finally, make a couple of connections
	//instance.connect({ source:"opened", target:"flowchartWindow2" });
	//instance.connect({ source:"phone1", target:"phone1" });
	//instance.connect({ source:"phone1", target:"inperson" });

	
	

	

	var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
		console.log( 'addEndpoints: ' + toId );
		for ( var i = 0; i < sourceAnchors.length; i++) {
			var sourceUUID = toId + sourceAnchors[i];
			instance.addEndpoint( toId, sourceEndpoint, {
				anchor : sourceAnchors[i],
				uuid : sourceUUID
			});
		}
		for ( var j = 0; j < targetAnchors.length; j++) {
			var targetUUID = toId + targetAnchors[j];
			instance.addEndpoint(toId, targetEndpoint, {
				anchor : targetAnchors[j],
				uuid : targetUUID
			});
		}
	};

	var _addBox = function( id, title, x, y ) {
console.log( 'x: ' + x );
console.log( 'y: ' + y );

$('#myModal').modal('show');
console.log( $('#myModel') );


		var newState = $('<div>').attr('id', id ).addClass('window');

		var ep = $('<div>').addClass('ep');
		
		var title = $('<div>').addClass('title').text( title );
		// var connect = $('<div>').addClass('connect');

		newState.css({
			'top' : y,
			'left' : x
		});

		jsPlumb.draggable(newState, {
			containment : 'parent'
		});

		
		
		
		newState.dblclick(function(e) {
			jsPlumb.detachAllConnections($(this));
			$(this).remove();
			e.stopPropagation();
		});
		
		instance.makeSource(newState, {
			filter:".ep",
			anchor:"Continuous",
			connector:[ "StateMachine", { curviness:20 } ],
			connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
			maxConnections:5,
			onMaxConnections:function(info, e) {
				alert("Maximum connections (" + info.maxConnections + ") reached");
			}
		});		
		
		instance.makeTarget(newState, {
			dropOptions:{ hoverClass:"dragHover" },
			anchor:"Continuous"				
		});
		
		newState.append(ep);
		newState.append(title);
		// newState.append(connect);

		$('#flowchart').append(newState);
	}



console.log( 'a' );
console.log( $( '#flowchart' ) );
	var i = 0;
	$('#flowchart').dblclick(function(e) {
		console.log( e );
		
		_addBox( 'state' + i, 'State ' + i, e.pageX, e.pageY);

		//	_addEndpoints( WindowId, Sources, Sinks );

		//_addEndpoints("state" + i, [ "LeftMiddle", "RightMiddle" ], ["TopCenter", "BottomCenter" ]);

	
		i++;
	});

});

$('#myFormSubmit').click(function(e){
    e.preventDefault();
    $('#myModel').modal('hide');
    alert($('#myField').val());
    
    /*
    $.post('http://path/to/post', 
       $('#myForm').serialize(), 
       function(data, status, xhr){
         // do something here with response;
       });
    */
});