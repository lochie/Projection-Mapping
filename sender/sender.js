var GRIDFILE = null;
GRIDFILE = "../_GRIDFILES/miniramp.txt";

var sender = (function(){

    window.onbeforeunload = confirmExit;
    function confirmExit() {
        return "Make sure you save your shit, if you have are you sure you wanna leave?";
    }

	var canvas = document.getElementById("canvas");

	window.addEventListener("load", init, true);
	function init(){
		context.init( canvas );

		addListeners();

		grid.init(function(){
			loop();
		}, GRIDFILE);
	}

	function loop() {
		canvas.width = communicate.get('width');
		canvas.height = communicate.get('height');

		communicate.set( 'grid', grid.get() );
		communicate.set( 'mouse', mouse );
		communicate.set( 'keyboard', keyboard );
		communicate.set( 'modifying', grid.isModify() );

		render();

		document.querySelector("#fps").innerHTML = communicate.get('fps');
		requestAnimationFrame(loop);
	}

	function render(){
		context.clear();

		drawers.main();
	}

	var offset = {
		x:100,
		y:100
	}

	var mouse = {
		x: null,
		y: null,
		isDown: false,
		isDragging:false,
		update:function(x,y){
			mouse.x = x - offset.x;
			mouse.y = y - offset.y;
		},
		move:function(){
		},
		click:function(){
		},
		isWithin:function(x,y,w,h){
			return ( (mouse.x > x && mouse.x < x+w) && (mouse.y > y && mouse.y < y+h) );
		}
	}

	var keyboard = {
		isDown:false,
		lastKey:null,
		code:{
			a : 65,
			s : 83,
			d : 68,
			f : 70,
			g : 71,
			h : 72,
			
			"0" :  48,
			"1" :  49,
			"2" :  50,
			"3" :  51,
			"4" :  52,
			"5" :  53,
			"6" :  54,
			"7" :  55,
			"8" :  56,
			"9" :  57,
		}
	}

	function addListeners(){
		document.getElementById("modify").addEventListener('click', grid.modify, false);
		document.getElementById("export").addEventListener('click', grid.export, false);
		
		document.addEventListener('keydown', KeyDownHandler, false);
		document.addEventListener('keyup', KeyUpHandler, false);

		document.addEventListener('mousemove', MouseMoveHandler, false);
		document.addEventListener('mousedown', MouseDownHandler, false);
		document.addEventListener('mouseup', MouseUpHandler, false);
	}


	function KeyUpHandler(e){
		keyboard.isDown = false;
	}
	function KeyDownHandler(e){
		keyboard.isDown = true;
		keyboard.lastKey = e.keyCode;
	}

	function MouseMoveHandler(event) {
		mouse.update(event.clientX, event.clientY);
		if(mouse.isDown) mouse.move();
	}
	function MouseDownHandler(event) {
		mouse.isDown = true;
		mouse.click();
	}
	function MouseUpHandler(event) {
		mouse.isDown = false;
		mouse.isDragging = false;
	}


	var drawers = (function(){

		var mapPreview = new Image();
			mapPreview.src = "../img/test.jpg";

		function main(){
			birdseye();
			if(!grid.isModify()) guides();
			if(grid.isModify()){
				modify();

				var g = communicate.get('grid');

				for(var i=0;i<map.x;i++){
					for(var j=0;j<map.y;j++){
						var points = {
							p1 : {x:g[i][j].x,		 y:g[i][j].y},
							p3 : {x:g[i][j+1].x,	 y:g[i][j+1].y},
							p2 : {x:g[i+1][j].x,	 y:g[i+1][j].y},
							p4 : {x:g[i+1][j+1].x, y:g[i+1][j+1].y},
						}
						context.drawLine(points.p1,points.p2)
						context.drawLine(points.p1,points.p3);
						context.drawLine(points.p3,points.p4);
						context.drawLine(points.p2,points.p4);
					}
				}
			}
		}
		function guides(){
			for(var i=0;i<map.x+1;i++){
				for(var j=0;j<map.y+1;j++){
					var _x = i * ( map.width / map.x );
					var _y = j * ( map.height / map.y );
					context.drawRect( _x + offset.x, _y + offset.y);
				}
			}
		}
		function birdseye() {
			var ctx = canvas.getContext("2d");
			ctx.save();
			ctx.translate( offset.x, offset.y)
			// ramp
			context.drawRect(0, 0, map.width, map.height, '#dcbf97');
			// deck
			context.drawRect(0, 0, (map.width/map.x)*map.deck, map.height, '#b89762');
			context.drawRect(map.width-((map.width/map.x)*map.deck), 0, (map.width/map.x)*map.deck, map.height, '#b89762');
			// coping
			context.drawRect((map.width/map.x)*map.deck, 0, map.coping, map.height, '#000000');
			context.drawRect(map.width-((map.width/map.x)*map.deck), 0, map.coping, map.height, '#000000');
			ctx.restore();
		}


		function modify(){
			context.drawImg(mapPreview, 0, 0);

			var theGrid = grid.get();

			var size = 15;

			// Group pins
			if(keyboard.isDown && (keyboard.lastKey == keyboard.code.a)){
			// Relocate all pins
				var mX = mouse.x - theGrid[0][0].x;
				var mY = mouse.y - theGrid[0][0].y;
				for(var i=0;i<theGrid.length;i++){
					for(var j=0;j<theGrid[i].length;j++){
						var p = theGrid[i][j];
						p.x += mX;
						p.y += mY;

						context.drawRect((p.x)-(size/2), (p.y)-(size/2), size, size);
					}
				}
			}else if(keyboard.isDown && (keyboard.lastKey == keyboard.code.s)){
			// Downsize
				for(var i=0;i<theGrid.length;i++){
					for(var j=0;j<theGrid[i].length;j++){
						var p = theGrid[i][j];
						p.x /= 1.01;
						p.y /= 1.01;

						context.drawRect((p.x)-(size/2), (p.y)-(size/2), size, size);
					}
				}
			}else if(keyboard.isDown && (keyboard.lastKey == keyboard.code.d)){
			// Upsize
				for(var i=0;i<theGrid.length;i++){
					for(var j=0;j<theGrid[i].length;j++){
						var p = theGrid[i][j];
						p.x *= 1.01;
						p.y *= 1.01;

						context.drawRect((p.x)-(size/2), (p.y)-(size/2), size, size);
					}
				}
			}else if(keyboard.isDown && (keyboard.lastKey == keyboard.code.f)){
				// Relocate column
			}else if(keyboard.isDown && (keyboard.lastKey == keyboard.code.g)){
				// Relocate row
			}else{
			// Drag individual pin
				for(var i=0;i<theGrid.length;i++){
					for(var j=0;j<theGrid[i].length;j++){
						var p = theGrid[i][j];

						if(mouse.isDown && !mouse.isDragging){
							if(mouse.isWithin((p.x)-(size/2), (p.y)-(size/2), size, size)){
								p.isDragged = true;
								mouse.isDragging = true;
							}else{
								p.isDragged = false;
							}
						}
						if(p.isDragged && mouse.isDragging){
							p.x = mouse.x;
							p.y = mouse.y;
						}else{
							p.isDragged = false;
						}
						var color = "#ff0000";
						if(i==Math.floor(theGrid.length/2)) color = "#00ff00";
						context.drawRect((p.x)-(size/2), (p.y)-(size/2), size, size, color);
					}
				}
			}
			grid.set(theGrid);

		}

		return {
			main
		}
	})();




})();
