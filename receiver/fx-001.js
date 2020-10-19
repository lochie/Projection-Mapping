var fx = (function(){
	var version = 1;

	/* ORGANISATION */
	var thrusherLogo = new Image();
		thrusherLogo.src = "../img/thrusher.png";

	var video = document.createElement('video');
	video.src = "../video/kaleidoscope.mp4";
	var startTime = {
		minutes:3,
		seconds:43,
	}
	video.muted = true;
	video.loop = true;
//	video.currentTime = (startTime.minutes*60)+startTime.seconds;
	video.play();




	/* STUFF */
	function init(){
	}

	function update(ctx){
		var keyboard = communicate.get( 'keyboard' );

		switch (keyboard.lastKey){
			case keyboard.code['1']:
				updateVideo(ctx);
				updateLogo(ctx);
				break;
			case keyboard.code['2']:
				trippyDots.update(ctx);
				updateLogo(ctx);
				break;
			case keyboard.code['3']:
				brick.update(ctx);
				updateLogo(ctx);
				break;
			case keyboard.code['4']:
				updateLogo(ctx);
				ctx.fillStyle = "rgba(0,0,0,0.25)";
				tamponGame.update(ctx);
				break;
			case keyboard.code['5']:
				explosionVideo.update(ctx);
				break;
			default:
			//	ctx.fillStyle = "rgba(0,0,0,0.8)";
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(0,0,map.width,map.height);
				break;
		}

		explosions.update(ctx);
		wheelTrail.update(ctx);

	}
	function move(){
		var keyboard = communicate.get( 'keyboard' );
		switch (keyboard.lastKey){
			case keyboard.code['3']:
				brick.move();
				break;
			case keyboard.code['4']:
				tamponGame.move();
				break;
			case keyboard.code['5']:
				explosionVideo.move();
				break;
		}
		explosions.move();
		wheelTrail.move();
	}
	function click(){
		var keyboard = communicate.get( 'keyboard' );
		switch (keyboard.lastKey){
			case keyboard.code['3']:
				brick.click();
				break;
			case keyboard.code['4']:
				tamponGame.click();
				break;
			case keyboard.code['5']:
				explosionVideo.click();
				break;
		}
		explosions.click();
		wheelTrail.click();
	}



	/* STUFF */
	function updateLogo(ctx){
		ctx.save();
			ctx.drawImage( thrusherLogo, (map.width/2)-(thrusherLogo.width/2), (map.height/2)-(thrusherLogo.height/2) );
		ctx.restore();
	}
	function updateVideo(ctx){
		ctx.drawImage( video, 0, 0, map.width/2, map.height/2, 0, 0, map.width/2, map.height/2 );

		ctx.save();
			ctx.translate(map.width, 0);
			ctx.scale(-1, 1);
			ctx.drawImage( video, 0, 0, map.width/2, map.height/2, 0, 0, map.width/2, map.height/2 );
		ctx.restore();

		ctx.save();
			ctx.translate(map.width, map.height);
			ctx.scale(-1, -1);
			ctx.drawImage( video, 0, 0, map.width/2, map.height/2, 0, 0, map.width/2, map.height/2 );
		ctx.restore();

		ctx.save();
			ctx.translate(0, map.height);
			ctx.scale(1, -1);
			ctx.drawImage( video, 0, 0, map.width/2, map.height/2, 0, 0, map.width/2, map.height/2 );
		ctx.restore();
	}

	var brick = (function(){
		var particles = [];
		var amountX = 10;
		var amountY = 10;

		for (var i=0;i<amountX;i++){
			for (var j=0;j<amountY;j++){
				var p = new Particle();
				p.position.x = (map.width/amountX)*i;
				p.position.y = (map.height/amountY)*j;
				p.width = (map.width/amountX);
				p.height = (map.height/amountY);
				p.alpha = 0.5;
				p.released = false;
		    	p.color = "hsl("+((p.position.x/map.width + p.position.y/map.height) * 180) + ", 100%, 70%)";
				particles.push(p);
			}
		}


		function update(ctx){
			for (var i=0;i<particles.length;i++) {
				var p = particles[i];
				if(p.size <=0 || p.alpha <=0 || (p.position.y > map.height)){
					particles.splice(i,1);
				}

				p.position.x += p.velocity.x;
				p.position.y += p.velocity.y;

				if(p.released){
					p.velocity.y += 0.1;
				}

				ctx.save();
					ctx.globalAlpha = p.alpha;
					ctx.beginPath();
					ctx.fillStyle = p.color;
					ctx.rect(p.position.x, p.position.y, p.width, p.height);
					ctx.fill();
				ctx.restore();
			}
		}
		function move(){
			var m = communicate.get('mouse');
			m.isWithin = function(x,y,w,h){
				return ( (m.x > x && m.x < x+w) && (m.y > y && m.y < y+h) );
			}
			for (var i=0;i<particles.length;i++){
				var p = particles[i];
				if( !p.released && m.isWithin(p.position.x,p.position.y,p.width,p.height) ){
					p.velocity.x = -5 + Math.random()*10;
					p.velocity.y = -5 + Math.random()*10;
					p.released = true;
				}
			}
		}
		function click(){
			move();
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();


	var explosions = (function(){

		var particles = [];
		var amount = 20;
		var bigAmount = 100;
		var limit = 300;

		function update(ctx){
			for (i=0;i<particles.length;i++) {
				var p = particles[i];
				if(p.size <=0 || p.alpha <=0 || (p.position.x < 0 || p.position.y < 0) || (p.position.x > map.width || p.position.y > map.height)){
					particles.splice(i,1);
				}

				p.position.x += p.velocity.x;
				p.position.y += p.velocity.y;
				p.alpha -= p.fadeRate;
				p.size -= 0.1;

				ctx.save();
					ctx.globalAlpha = p.alpha;
					ctx.beginPath();
					ctx.fillStyle = p.color;
					ctx.arc(p.position.x, p.position.y, p.width/2, 0, Math.PI*2, true);
					ctx.fill();
				ctx.restore();
			}
		}
		function move() {
			//if(particles.length>limit) return false;
			for (var i=0;i<amount;i++) {
				var p = new Particle();
				p.width = 10;
				var force = 10;
				p.velocity = {x: (force/2) - Math.random()*force, y: (force/2) - Math.random()*force};
			    	p.color = "hsl("+((p.position.x/map.width + p.position.y/map.height) * 180) + ", 100%, 70%)";
				particles.push(p);
			}
		}
		function click() {
			if(particles.length>limit) return false;
			for (var i=0;i<bigAmount;i++) {
				var p = new Particle();
					p.width = 10 + Math.random()*15;
					p.height = p.width;
					var force = 10;
					p.velocity = {x: Math.random()*force-Math.random()*force, y: Math.random()*force-Math.random()*force};
					p.fade = 0.01;
			    	p.color = "hsl("+((p.position.x/map.width + p.position.y/map.height) * 180) + ", 100%, 70%)";
				particles.push(p);
			}
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();


	var wheelTrail = (function(){

		var particles = [];
		var amount = 20;

		function update(ctx){
			var m = communicate.get('mouse');
			var maxSize = 20;

			particles.unshift({x:m.x,y:m.y});
			if(particles.length > maxSize) particles.splice(particles.length-1,1);

			ctx.strokeStyle = "white";
			ctx.lineWidth = 3;

			var gap = 10;

			ctx.beginPath();
			for(var i=0;i<particles.length;i++){
				var p = particles[i];

				ctx.save();
					ctx.globalAlpha = 0.1;
					if(i==0){
						ctx.moveTo(p.x,p.y-gap);
					}else{
						ctx.lineTo(p.x,p.y-gap);
					}
					ctx.stroke();
				ctx.restore();
			}
			ctx.closePath();

			ctx.beginPath();
			for(var i=0;i<particles.length;i++){
				var p = particles[i];

				ctx.save();
					ctx.globalAlpha = 0.1;
					if(i==0){
						ctx.moveTo(p.x,p.y+gap);
					}else{
						ctx.lineTo(p.x,p.y+gap);
					}
					ctx.stroke();
				ctx.restore();
			}
			ctx.closePath();
		}
		function move() {
		}
		function click() {
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();


	var trippyDots = (function(){
		var particles = [];
		var size = 40;
		var rows = map.width/size;
		var columns = map.height/size;

		for(var i=0;i<rows+1;i++){
			for(var j=0;j<columns+1;j++){
				var a = {
					r:size,
					x:map.width/rows * i,
					y:map.height/columns * j,
				}
				particles.push(a);
			}
		}

		function update(ctx){
			var m = communicate.get('mouse');

			for(var i=0;i<particles.length;i++){
				var a = particles[i];

				ctx.save();
				ctx.beginPath();
				var threshold = 100;
				if ( (m.y > a.y - threshold && m.y < a.y + threshold) || (m.x > a.x - threshold && m.x < a.x + threshold) ){
					a.r += ((size/3) - a.r)/3;
				}else{
					a.r += (3 - a.r)/3;
				}
				ctx.arc(a.x, a.y, a.r, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fillStyle = "#ffffff";
				ctx.fill();
				ctx.restore();
			}
		}
		function move() {
		}
		function click() {
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();


	var tamponGame = (function(){
		var particles = [];

		var tampon = {
			x:0,
			y:0,
			width:150,
			height:150,
			rotation:0,
			rotateSpeed:0,
			gfx: new Image(),
		}
		tampon.gfx.src = "../img/tampon.png";

		function reposition(){
			tampon.x = Math.random()*(map.width-tampon.width);
			tampon.y = Math.random()*(map.height-tampon.height);
			tampon.rotation = Math.random()*360;
			tampon.rotateSpeed = 1 + Math.random()*4;
		}

		reposition();

		function update(ctx){
			var m = communicate.get('mouse');
			ctx.save();
				tampon.rotation -= tampon.rotateSpeed;
				ctx.translate(tampon.x,tampon.y);
				ctx.rotate(tampon.rotation * Math.PI/180);
				ctx.drawImage(tampon.gfx,-tampon.width/2,-tampon.height/2);
			ctx.restore();
		}
		function move() {
			var m = communicate.get('mouse');
		}
		function click() {
			var m = communicate.get('mouse');
			reposition();
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();




	var explosionVideo = (function(){

		var particles = [];
		var cells = {
			x:10,
			y:10,
		};
		var explode = false;

		for (var i=0;i<cells.x;i++) {
			for (var j=0;j<cells.y;j++) {
				var p = new Particle();
				p.position.origx = map.width/cells.x * i;
				p.position.origy = map.height/cells.y * j;
				p.position.x = p.position.origx;
				p.position.y = p.position.origy;

				p.rotation = 0;
				p.width = map.width/cells.x;
				p.height = map.height/cells.y;
				p.velocity = {
					x: 0,
					y: 0,
					rotation: 0
				};
				particles.push(p);
			}
		}

		function update(ctx){
			var i = 0;
				for (i=0;i<particles.length;i++) {
					var p = particles[i];
					p.position.x += p.velocity.x *= 0.99;
					p.position.y += p.velocity.y *= 0.99;
					p.rotation += p.velocity.rotation *= 0.99;
				}
			if(!explode){

			}else{
			}
			for (i=0;i<particles.length;i++) {
				var p = particles[i];

				ctx.save();
					ctx.translate(p.position.x, p.position.y)
					ctx.rotate(p.rotation * Math.PI/180)
					ctx.beginPath();
					ctx.fillStyle = "#FF0000";
					ctx.drawImage( thrusherLogo, p.position.origx, p.position.origy, p.width, p.height, 0, 0, p.width, p.height );
					ctx.fill();
				ctx.restore();
			}
		}
		function explosion() {
			explode = true;
			var f = 20;
			var m = communicate.get('mouse');
			for (i=0;i<particles.length;i++) {
				var p = particles[i];

				var force = {
					x: (m.x < p.position.x) ? f : -f,
					y: (m.y < p.position.y) ? f : -f
				};
				p.velocity = {
					x: Math.random()*force.x,
					y: Math.random()*force.y,
					rotation: Math.random()* Math.random()*f
				};
			}
		}
		function move() {
		}
		function click() {
			explosion();
		}
		return {
			update:update,
			move:move,
			click:click,
		}
	})();


	function Particle() {
		var m = communicate.get('mouse');
	    this.position = { x:m.x, y:m.y };
	    this.velocity = { x:0, y:0 };
		this.width = 0;
		this.height = 0;
	    this.color = "#ffffff";
	    this.alpha =  0.1 + Math.random()*0.9;

	    this.size = 2 + Math.random()*3;
		this.fadeRate = Math.random()*0.05;
	}
	return {
		init: init,
		update:update,
		move:move,
		click:click,
	}

})();
