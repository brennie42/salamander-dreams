c = document.getElementById("name");
ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;	
window.addEventListener('keydown', handleKeyPress,);
window.addEventListener('keyup',handleKeyUp);

var KeysPressed = {
	shift:false,
	space:false,
	up:false,
	down:false,
	left:false,
	right:false,
	r:false
};

function handleKeyUp(e){
	switch (e.keyCode) {
		case 82: KeysPressed.r=false; break;
		case 16: KeysPressed.shift = false; break;
		case 32: KeysPressed.space = false;players[0].fire();break;
        case 37: KeysPressed.left = false; break;
        case 38: KeysPressed.up = false; break;
        case 39: KeysPressed.right = false; break;
        case 40: KeysPressed.down = false; break;
    }
	}
var spaceWasPressed = false;
var spriteSheet = new Image();
spriteSheet.src = "images/sprite.png";
function handleKeyPress(e) { 
    switch (e.keyCode) {
		case 82: KeysPressed.r=true;break;
		case 16: KeysPressed.shift=true;break;
		case 32: KeysPressed.space = true; spaceWasPressed=true;;break;
        case 37: KeysPressed.left = true; break;
        case 38: KeysPressed.up = true; break;
        case 39: KeysPressed.right = true; break;
        case 40: KeysPressed.down = true; break;
    }
}

function Particle(posx,posy,angle,magnitude,id,type){
	this.type=type;
	this.position={x:posx,y:posy};
		this.position.x = posx;
		this.position.y = posy;
	this.move = function(){};
	this.id = id;
	this.draw = function(){};
	this.collide = function(){};
this.velocity={angle:angle,magnitude:magnitude};
	this.velocity.angle = angle;
	this.velocity.magnitude = magnitude;
};

function SpaceShip(posx,posy,angle,magnitude,id,spriteStartX,spriteStartY,spriteStopX,spriteStopY){
	Particle.call(this,posx,posy,angle,magnitude,id,"spaceship");
	this.image = { src:spriteSheet,start:{x:spriteStartX,y:spriteStartY},stop:{x:spriteStopX,y:spriteStopY},dimensions:{width:spriteStopX-spriteStartX,height:spriteStopY-spriteStartY}};
	this.cooldown = 0;
	this.size = 5;
	this.velocity.rotationSpeed=0;
	this.velocity.x = 0;
	this.velocity.y = 0;
	this.fire = function(){
		var translationForCentorX = this.position.x + (this.image.stop.x - this.image.start.x)/2;
		var translationForCentorY = this.position.y + (this.image.stop.y - this.image.start.y)/2;
		if(1){
			asteroids[asteroids.length] = new Projectile(translationForCentorX, translationForCentorY,this.velocity.angle,1,asteroids[asteroids.length-1].id+1,5); 
			this.cooldown=20;
		};
	};
	this.move = function(){
		if(KeysPressed.up==true){this.velocity.magnitude +=0.02 * time.dt()*Math.random()*2};
		if(KeysPressed.down==true){this.velocity.magnitude-=0.02 * time.dt()};
		if(KeysPressed.left==true){this.velocity.rotationSpeed-=0.0022 * time.dt()};
		if(KeysPressed.right==true){this.velocity.rotationSpeed+=0.0022 * time.dt();};
		if(KeysPressed.space==true)
		if(KeysPressed.shift==true){
			this.velocity.x -= this.velocity.x*0.005*time.dt();
			this.velocity.y -= this.velocity.y*0.005*time.dt();
		};
	
		this.velocity.angle += this.velocity.rotationSpeed;
		this.velocity.rotationSpeed = this.velocity.rotationSpeed*0.90;
		this.velocity.x += Math.cos(this.velocity.angle) * this.velocity.magnitude * time.dt();
		this.velocity.y += Math.sin(this.velocity.angle) * this.velocity.magnitude * time.dt();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		this.velocity.x -= this.velocity.x*0.001*time.dt();
		this.velocity.y -= this.velocity.y*0.001*time.dt();
		this.velocity.magnitude-= this.velocity.magnitude*0.5;
		if(this.position.x<0){this.position.x+=c.width};
		if(this.position.y<0){this.position.y+=c.height};
		if(this.position.x>c.width){this.position.x-=c.width};
		if(this.position.y>c.height){this.position.y-= c.height};
	}
	this.collide = function(){
		for(var i = 0; i<asteroids.length;i++){
			if(asteroids[i].type == "asteroid"){
			var asteroidsRadius2 = (this.size + asteroids[i].size) * (this.size + asteroids[i].size);
			var distance2 = ((this.position.x+this.image.dimensions.width - asteroids[i].position.x) * (this.position.x+this.image.dimensions.height - asteroids[i].position.x)) + ((this.position.y - asteroids[i].position.y) * (this.position.y - asteroids[i].position.y));
			if(distance2+10 <= asteroidsRadius2) {return true;}
		}
		};
		return false;
	};
	this.draw = function(){
		ctx.save();
				
		if(document.getElementById("speedDebug").checked){
			ctx.font = "25px Arial";
			ctx.fillText(this.velocity.magnitude.toFixed(4) + " acc " + this.velocity.rotationSpeed.toFixed(4) + "rotspeed" + this.velocity.x.toFixed(4)+"x" + this.velocity.y.toFixed(4) + "y",this.position.x+this.size,this.position.y-50)
		};
		var translationForCentorX = this.position.x + (this.image.dimensions.width)/2;
		var translationForCentorY = this.position.y + (this.image.dimensions.height)/2;
		ctx.translate(translationForCentorX,translationForCentorY);
		ctx.rotate(this.velocity.angle + (0.5 * Math.PI));
		ctx.translate(-(translationForCentorX),-(translationForCentorY));
		ctx.drawImage(this.image.src,this.image.start.x,this.image.start.y,this.image.stop.x,this.image.stop.y,this.position.x,this.position.y,this.image.stop.x,this.image.stop.y);
		ctx.restore();
	};
};
function Projectile(posx,posy,angle,magnitude,id,size){
	Particle.call(this,posx,posy,angle,magnitude,id,"projectile");
	this.size=10;
	this.draw = function(){
		ctx.beginPath();
		ctx.strokeStyle = "#FF0000"
		ctx.moveTo(this.position.x,this.position.y);
		var secondx = 10 * Math.cos(this.velocity.angle) * (this.velocity.magnitude) ;
		var secondy = 10 * Math.sin(this.velocity.angle) * (this.velocity.magnitude) ;
		ctx.lineTo(this.position.x + secondx,this.position.y + secondy );
		ctx.closePath();
		ctx.lineWidth=1;
		ctx.stroke();
		if(document.getElementById("idDebug").checked){
			ctx.font = "50px Arial";
			ctx.fillText(this.id,this.position.x+this.size,this.position.y)
		};
		if(document.getElementById("speedDebug").checked){
			ctx.font = "25px Arial";
			ctx.fillText(this.velocity.magnitude.toFixed(4),this.position.x+this.size,this.position.y-50)
		};
	};
	this.move  = function(){
		this.position.x += Math.cos(this.velocity.angle) * this.velocity.magnitude * time.dt();
		this.position.y += Math.sin(this.velocity.angle) * this.velocity.magnitude * time.dt();
	};
	this.collide=function(){
		if(this.position.x<0){return -1;} ;
		if(this.position.y<0){return -1;};
		if(this.position.x>c.width){return -1;};
		if(this.position.y>c.height){return -1;};
		for(var i = 0; i<asteroids.length;i++){
			if(asteroids[i].type == "asteroid"){
			var asteroidsRadius2 = (this.size + asteroids[i].size) * (this.size + asteroids[i].size);
			var distance2 = ((this.position.x - asteroids[i].position.x) * (this.position.x - asteroids[i].position.x)) + ((this.position.y - asteroids[i].position.y) * (this.position.y - asteroids[i].position.y));
			if(distance2 <= asteroidsRadius2){				
				if(asteroids[i].size >=4){
					asteroids[asteroids.length] = new Asteroid(asteroids[i].position.x, asteroids[i].position.y,asteroids[i].velocity.angle - Math.PI*Math.random(),asteroids[i].velocity.magnitude*1.2,asteroids.length,asteroids[i].size*0.5)
					asteroids[asteroids.length] = new Asteroid(asteroids[i].position.x, asteroids[i].position.y,asteroids[i].velocity.angle + Math.PI*Math.random(),asteroids[i].velocity.magnitude*1.2,asteroids.length,asteroids[i].size*0.5)
				};
				return i;
				}
		}
		};
	};
};
function Asteroid( posx,posy,angle,magnitude,id,size){
	Particle.call(this, posx,posy,angle,magnitude,id,"asteroid");
	this.randomOffset = angle + (Math.random() * Math.PI * 2);
	this.size = size;
	this.image= { src:spriteSheet,start:{x:0,y:28},stop:{x:47,y:75},dimensions:{width:0,height:0}};
	this.image.dimensions.width = this.image.stop.x - this.image.start.x;
	this.image.dimensions.height = this.image.stop.y - this.image.start.y;
	this.draw = function(){
		ctx.save();
		var translationForCentorX = this.position.x + (this.image.stop.x - this.image.start.x)/2;
		var translationForCentorY = this.position.y + (this.image.stop.y - this.image.start.y)/2;
		//ctx.translate(translationForCentorX,translationForCentorY);
		//ctx.rotate(this.velocity.angle + (0.5 * Math.PI)+this.randomOffset);
		//ctx.translate(-(translationForCentorX),-(translationForCentorY));
		ctx.drawImage(this.image.src,this.image.start.x,this.image.start.y,this.image.dimensions.width,this.image.dimensions.height,this.position.x-((this.image.dimensions.width*(this.size/20))/2),this.position.y-((this.image.dimensions.height*(this.size/20))/2),this.image.dimensions.width*(this.size/20),this.image.dimensions.height*(this.size/20));
		ctx.restore();


		if(document.getElementById("idDebug").checked){	
		ctx.font = "50px Arial";
		ctx.fillText(this.id,this.position.x+this.size,this.position.y);
		};
		if(document.getElementById("speedDebug").checked){
			ctx.font = "25px Arial";
			ctx.fillText(this.velocity.magnitude,this.position.x+this.size,this.position.y-50)
		};
		
		//console.log("drawing  " + this.id+"  " + this.position.x);
	};
	this.move=function(){
		this.position.x += Math.cos(this.velocity.angle) * this.velocity.magnitude * time.dt();
		this.position.y += Math.sin(this.velocity.angle) * this.velocity.magnitude * time.dt();
		if(this.position.x<0){this.position.x=c.width} ;
		if(this.position.y<0){this.position.y=c.height};
		if(this.position.x>c.width){this.position.x=0};
		if(this.position.y>c.height){this.position.y=0};
	};
	this.collide=function(){};
};

var asteroids = new Array();
var players = new Array();	

function arrayOfParticles(number){
	c.width= window.innerWidth;
	c.height= window.innerHeight;
	asteroids=[];
	for(var i = 0; i<number;i++){
		asteroids[i] = new Asteroid(10*(((Math.random() * c.width)*2)-c.width), 10*(((Math.random() * c.height)*2)-c.height), Math.random() * Math.PI * 2,0.5+Math.random()*0.25,i,50 +(Math.random()*20));
	};
};

function startGame(){
	
	players[0] = new SpaceShip(c.width/2, c.height/2, 0,0,1,0,0,25,25);
/*for(var i=0;i<1000	0;i++){
	players[i]= new SpaceShip(c.width/2, c.height/2, 0,0,1,0,0,25,25);
}*/
	arrayOfParticles(5);
	
};
var currentfps = 0;
var time = {
	startTime: 0,
	dtSet: function(){
		this.startTime  = new Date().getTime();
	},
	dt:function(){ 
		var d = new Date().getTime();
		return (d-this.startTime)*(10/60);
		
	}
};

var fps = {	
	startTime : 0,
	frameNumber : 0,
	getFPS : function(){
		this.frameNumber++;
		var d = new Date().getTime(),
		currentTime = ( d - this.startTime )/1000,
		result = Math.floor( ( this.frameNumber / currentTime ) );		
		if( currentTime > 1 ){
			this.startTime = new Date().getTime();
			this.frameNumber = 0;
			}		
			return result;	}	};

function render(){

	currentfps=fps.getFPS();
	if(document.getElementById("fpsDebug").checked){
		document.getElementById("fps").innerHTML = currentfps.toString();
	}
	c.width = window.innerWidth - 100;
	c.height = window.innerHeight - 100;
	if(players.length){
		for(var i=0; i<players.length;i++){
		players[i].move();
			if(players[i].collide()){
				players.splice(i,1)
			}
		}
		for(var i=0; i<players.length;i++){
		players[i].draw();};
	};
		for (var i=0; i<asteroids.length;i++){
		asteroids[i].draw();
	};
	for(var i=0; i<asteroids.length;i++){
			asteroids[i].move();
	};
	for(var i=0; i<asteroids.length;i++){
		asteroids[i].move();
	};
	for(var i=0; i<asteroids.length;i++){
		var temp=asteroids[i].collide();
		if(temp+1){
			if(temp>=0){
				asteroids.splice(i,1);
				asteroids.splice(temp,1);
			}
			else{
				asteroids.splice(i,1)
				};
		}
		if(temp==-1){
			asteroids.splice(i,1)
		}
		if (asteroids[i].size<10){
			asteroids.splice(i,1);
		};
	};
	if(players.length<1 and asteroids.length<0){
		if(KeysPressed.space){
			startGame();
			KeysPressed.space=false;
		}
		ctx.font = "100px Arial";
		ctx.fillText("You Lose",c.width/4,c.height/2+50);
		ctx.fillText("Press Space To Start A New Game.",c.width/4,c.height/2-50);
	}
	if(asteroids.length<1 and players.length>0){
		if(KeysPressed.space){
			startGame();
			KeysPressed.space=false;
		}
		ctx.font = "100px Arial";
		ctx.fillText("You Win",c.width/4,c.height/2+50);
		ctx.fillText("Press Space To Start A New Game.",c.width/4,c.height/2-50);
	};
	if(asteroids.length<1 and players.length<1){
		if(KeysPressed.space){
			startGame();
			KeysPressed.space=false;
		}
		ctx.font = "100px Arial";
		ctx.fillText("Press Space To Start A New Game.",c.width/4,c.height/2);
	
		time.dtSet();
};
function Animationloop(){
	requestAnimationFrame(Animationloop);
	render();
};
