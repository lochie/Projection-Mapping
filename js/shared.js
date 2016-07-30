var mapScale = 200;
var map = {
	x:2,
	y:2,

	//width:7.2*mapScale,
	width:3*mapScale,
	height:3*mapScale,

	deck:0,
	coping:0,
};

console.log(map.width,map.height);

// Animation Timer
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout;


// FPS Counter
var fps = {	startTime : 0,	frameNumber : 0,	getFPS : function(){		this.frameNumber++;		var d = new Date().getTime(),			currentTime = ( d - this.startTime ) / 1000,			result = Math.floor( ( this.frameNumber / currentTime ) );		if( currentTime > 1 ){			this.startTime = new Date().getTime();			this.frameNumber = 0;		}		return result;	}	};


// CANVAS DRAWING HELPERS
var context = (function(){
	var c, ctx;

	function init(arg){
		c = arg;
		ctx = c.getContext('2d');
	}
	function img(img, x, y){
		ctx.save();
			x = x || 0;
			y = y || 0;
			ctx.drawImage(img, x, y);
		ctx.restore();
	}
	function clear(){
		ctx.clearRect(0, 0, c.width, c.height);
	}
	function rect(x,y,w,h,fill){
		ctx.save();
			w = w || 15;
			h = h || 15;
			ctx.fillStyle = fill || "#ff0000";
			ctx.fillRect(x, y, w, h);
		ctx.restore();
	}
	function circle(x,y,r,fill){
		ctx.save();
		ctx.globalAlpha = 0.5;
			r = r || 15;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI*2, true); 
			ctx.closePath();
			ctx.fillStyle = fill || "#ffffff";
			ctx.fill();
		ctx.restore();
	}
	function line(p1,p2){
		ctx.save();
			ctx.beginPath();
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.closePath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = 'rgba(255,0,0,0.25)';
			ctx.stroke();
		ctx.restore();

	}
	return {
		init:init,
		clear:clear,
		drawRect:rect,
		drawCircle:circle,
		drawImg:img,
		drawLine:line,
	}
})();