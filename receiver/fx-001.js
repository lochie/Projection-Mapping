var fx = (function(){
	var version = 1;
	var draw = true;

	var thrusherLogo = new Image();
		thrusherLogo.src = "../img/thrusher.png";

	var awkwardLogoLeft = new Image();
		awkwardLogoLeft.src = "../img/awkward-left.png";

	var awkwardLogoRight = new Image();
		awkwardLogoRight.src = "../img/awkward-right.png";

	var video = document.createElement('video');
	video.src = "../video/kaleidoscope.mp4";
	video.muted = true;
	video.loop = true;

	video.play();

	video.addEventListener('play', function(e){
		var $this = this;
		(function loop(){
			if (!$this.paused && !$this.ended) {
				setTimeout(loop, 1000 / 30); // drawing at 30fps
			}
		})();
	}, 0);


	/* STUFF */
	var dots = {
		particles:[],
		amount:20,
		bigAmount:100,
	};
	var bricks = {
		particles:[],
		amountX:10,
		amountY:10,
	};

	var wheelTrails = {
		particles:[],
		amount:20,
	};

	/* STUFF */

	function init(){
		reset();
	}
	function reset(){
		brick.reset();
		dot.reset();
		wheelTrail.reset();
	}

	function update(ctx){
		ctx.drawImage(video, 0, 0, map.width, map.height);

		ctx.drawImage( thrusherLogo, (map.width/2)-(thrusherLogo.width/2), (map.height/2)-(thrusherLogo.height/2) );

		ctx.drawImage( awkwardLogoLeft, ((map.width/map.x)*map.deck), -100 );
		ctx.drawImage( awkwardLogoRight, map.width-((map.width/map.x)*map.deck)-awkwardLogoRight.width, -100 );

	//	brick.update(ctx);
		dot.update(ctx);
		wheelTrail.update(ctx);
	}
	function move(){
		brick.move();
		dot.move();
		wheelTrail.move();
	}
	function click(){
		brick.click();
		dot.click();
		wheelTrail.click();
	}



	/* STUFF */


	var brick = (function(){
		function reset(){
			bricks.particles = [];
			for (var i=0;i<bricks.amountX;i++){
				for (var j=0;j<bricks.amountY;j++){
					var p = new Particle();
					p.position.x = (map.width/bricks.amountX)*i;
					p.position.y = (map.height/bricks.amountY)*j;
					p.width = (map.width/bricks.amountX);
					p.height = (map.height/bricks.amountY);
					p.alpha = 0.5;
					p.released = false;
			    	p.color = "hsl("+((p.position.x/map.width + p.position.y/map.height) * 180) + ", 100%, 70%)";
					bricks.particles.push(p);
				}
			}
		}
		function update(ctx){
			for (var i=0;i<bricks.particles.length;i++) {
				var p = bricks.particles[i];
				if(p.size <=0 || p.alpha <=0 || (p.position.y > map.height)){
					bricks.particles.splice(i,1);
				}

				p.position.x += p.velocity.x;
				p.position.y += p.velocity.y;

				if(p.released){
					p.velocity.y += 0.1;
				}


				if(draw){
					ctx.save();
						ctx.globalAlpha = p.alpha;
						ctx.beginPath();
						ctx.fillStyle = p.color;
						ctx.rect(p.position.x, p.position.y, p.width, p.height);
						ctx.fill();
					ctx.restore();
				}
			}
		}
		function move(){
			var m = communicate.get('mouse');
			m.isWithin = function(x,y,w,h){
				return ( (m.x > x && m.x < x+w) && (m.y > y && m.y < y+h) );
			}
			for (var i=0;i<bricks.particles.length;i++){
				var p = bricks.particles[i];
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
			reset:reset,
			update:update,
			move:move,
			click:click,
		}
	})();


	var dot = (function(){
		function reset(){
			dots.particles = [];
		}
		function update(ctx){
			for (i=0;i<dots.particles.length;i++) {
				var p = dots.particles[i];
				if(p.size <=0 || p.alpha <=0 || (p.position.x < 0 || p.position.y < 0) || (p.position.x > map.width || p.position.y > map.height)){
					dots.particles.splice(i,1);
				}

				p.position.x += p.velocity.x;
				p.position.y += p.velocity.y;
				p.alpha -= p.fadeRate;
				p.size -= 0.1;

				if(draw){
					ctx.save();
						ctx.globalAlpha = p.alpha;
						ctx.beginPath();
						ctx.fillStyle = p.color;
						ctx.arc(p.position.x, p.position.y, p.width/2, 0, Math.PI*2, true);
						ctx.fill();
					ctx.restore();
				}
			}
		}
		function move() {
			for (var i=0;i<dots.amount;i++) {
				var p = new Particle();
				p.width = 1;
				var force = 10;
				p.velocity = {x: (force/2) - Math.random()*force, y: (force/2) - Math.random()*force};
				dots.particles.push(p);
			}
		}
		function click() {
			for (var i=0;i<dots.bigAmount;i++) {
				var p = new Particle();
					p.width = 10;
					p.height = 10;
					var force = 10;
					p.velocity = {x: Math.random()*force-Math.random()*force, y: Math.random()*force-Math.random()*force};
					p.fade = 0.01;
			    	p.color = "hsl("+((p.position.x/map.width + p.position.y/map.height) * 180) + ", 100%, 70%)";
				dots.particles.push(p);
			}
		}
		return {
			reset:reset,
			update:update,
			move:move,
			click:click,
		}
	})();


	var wheelTrail = (function(){
		function reset(){
			wheelTrails.particles = [];
		}
		function update(ctx){
			var m = communicate.get('mouse');
			var maxSize = 20;

			wheelTrails.particles.unshift({x:m.x,y:m.y});
			if(wheelTrails.particles.length > maxSize) wheelTrails.particles.splice(wheelTrails.particles.length-1,1);

			ctx.strokeStyle = "white";
			ctx.lineWidth = 3;

			var gap = 10;

			ctx.beginPath();
			for(var i=0;i<wheelTrails.particles.length;i++){
				var p = wheelTrails.particles[i];

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
			for(var i=0;i<wheelTrails.particles.length;i++){
				var p = wheelTrails.particles[i];

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
			reset:reset,
			update:update,
			move:move,
			click:click,
		}
	})();




	function Particle() {
		var m = communicate.get('mouse')
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
		reset: reset,
		update:update,
		move:move,
		click:click,
	}

})();
