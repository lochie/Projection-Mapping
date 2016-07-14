var projection = (function(){
	var version = 1;

	var fill = true;

	var preCanvas = document.createElement("canvas");
	var preCtx = preCanvas.getContext('2d');

	function init(){
		window.addEventListener("resize", resize, true);
		resize();
	}

	function resize(){
		preCanvas.width = communicate.get( 'width' );
		preCanvas.height = communicate.get( 'height' );
	}

	function update(canvas, ctx, effects){
		preCtx.clearRect(0, 0, preCanvas.width, preCanvas.height);

		var g = communicate.get('grid');
		for(var i=0;i<map.x;i++){
			for(var j=0;j<map.y;j++){
				var w = map.width/map.x;
				var h = map.height/map.y;
				var x = i*w;
				var y = j*h;
				
				var points = {
					p1 : {x:g[i][j].x,		 y:g[i][j].y},
					p3 : {x:g[i][j+1].x,	 y:g[i][j+1].y},
					p2 : {x:g[i+1][j].x,	 y:g[i+1][j].y},
					p4 : {x:g[i+1][j+1].x, y:g[i+1][j+1].y},
				}
				warp(effects, preCtx, x, y, w, h, points);

				if( communicate.get( 'modifying' ) ) {
					var ctx = preCtx;
						ctx.beginPath();
						ctx.moveTo(points.p1.x,points.p1.y);
						ctx.lineTo(points.p3.x,points.p3.y);
						ctx.lineTo(points.p4.x,points.p4.y);
						ctx.lineTo(points.p2.x,points.p2.y);
						ctx.closePath();
						ctx.lineWidth = 5;
						ctx.strokeStyle = 'rgba(255,0,0,0.25)';
						ctx.stroke();
				}
					
			}
		}

		context.drawImg(preCanvas, 0, 0);
	}


	function warp(img, ctx, _x, _y, _w, _h, points){
		var c = ctx;
		var w = communicate.get('width');
		var h = communicate.get('height');


		var x1 = points.p1.x;
		var y1 = points.p1.y;
		var x2 = points.p2.x;
		var y2 = points.p2.y;
		var x3 = points.p3.x;
		var y3 = points.p3.y;
		var x4 = points.p4.x;
		var y4 = points.p4.y;
		
		var xm = linearSolution(0, 0, x1, w, 0, x2, 0, h, x3);
		var ym = linearSolution(0, 0, y1, w, 0, y2, 0, h, y3);
		var xn = linearSolution(w, h, x4, w, 0, x2, 0, h, x3);
		var yn = linearSolution(w, h, y4, w, 0, y2, 0, h, y3);
		
		c.fillStyle = "#000000";

		var offsetX = 0;
		var offsetY = 0;

		c.save();
		c.setTransform(xm[0], ym[0], xm[1], ym[1], xm[2], ym[2]); // another matrix argument order bug?
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(w+offsetX, 0);
		c.lineTo(0, h+offsetY);
		c.closePath();
		if(fill) c.fill();
		c.clip();
		c.drawImage(img, _x, _y, _w, _h, 0, 0, w, h);
		c.restore();


		c.save();
		c.setTransform(xn[0], yn[0], xn[1], yn[1], xn[2], yn[2]); // another matrix argument order bug?
		c.beginPath();
		c.moveTo(w+offsetX, h);
		c.lineTo(w+offsetX, 0-offsetY);
		c.lineTo(0, h);
		c.closePath();
		if(fill) c.fill();
		c.clip();
		c.drawImage(img, _x, _y, _w, _h, 0, 0, w, h);
		c.restore();
	}
	function linearSolution(r1, s1, t1, r2, s2, t2, r3, s3, t3){
		r1 = parseFloat(r1);
		s1 = parseFloat(s1);
		t1 = parseFloat(t1);
		r2 = parseFloat(r2);
		s2 = parseFloat(s2);
		t2 = parseFloat(t2);
		r3 = parseFloat(r3);
		s3 = parseFloat(s3);
		t3 = parseFloat(t3);
		
		var a = (((t2 - t3) * (s1 - s2)) - ((t1 - t2) * (s2 - s3))) / (((r2 - r3) * (s1 - s2)) - ((r1 - r2) * (s2 - s3)));
		var b = (((t2 - t3) * (r1 - r2)) - ((t1 - t2) * (r2 - r3))) / (((s2 - s3) * (r1 - r2)) - ((s1 - s2) * (r2 - r3)));
		var c = t1 - (r1 * a) - (s1 * b);
		
		return [a, b, c];
	}


	return {
		init:init,
		update:update,
	}
})();