var receiver = (function(){

	var canvas =  document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	var fxCanvas = document.createElement("canvas");
	var fxCtx = fxCanvas.getContext('2d');

	var prevM = null;

	window.addEventListener("load", init, true);
	function init(){
		context.init( canvas );
		projection.init();
		fx.init();

		window.addEventListener("resize", resize, true);

		resize();
		loop();
	}


	function loop() {

		// set info
		communicate.set( 'fps', fps.getFPS()+"/60" );

		// interactivity
		if( !communicate.get( 'modifying' ) ) {
			var m = communicate.get('mouse');
			if( m.isDown && ( m.x != prevM.x || m.y != prevM.y ) ){
				fx.move();
			}
			if( m.isDown ){
				fx.click();
			}
			prevM = m;
		}

		// use
		render();

		if( communicate.get( 'modifying' ) ) {
			guides();

			var m = communicate.get('mouse');
			context.drawCircle( m.x, m.y, 10, '#ffffff' )
			context.drawCircle( m.x, m.y, 5, '#000000' )
		}
		// loop
		requestAnimationFrame(loop);
	}

	function render(){
		//context.clear();
		context.drawRect(0, 0, canvas.width, canvas.height, 'rgba(0,0,0,1)');

		fxCtx.clearRect(0, 0, canvas.width, canvas.height)

		fx.update(fxCtx);
		projection.update(canvas, ctx, fxCanvas);
	}

	function guides(){	
		var m = communicate.get('grid');

		var size = 15;

		for(var i=0;i<m.length;i++){
			for(var j=0;j<m[i].length;j++){
				var _x = m[i][j].x;
				var _y = m[i][j].y;
				context.drawRect( _x-(size/2), _y-(size/2), size, size );
			}
		}
	}



	function resize(){

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		fxCanvas.width = window.innerWidth;
		fxCanvas.height = window.innerHeight;

		communicate.set( 'width', canvas.width );
		communicate.set( 'height', canvas.height );
	}

})();