
$.extend(
      {
        redirectPost: function(location, args)
        {
            var form = $('<form></form>');
            form.attr("method", "get");
            form.attr("action", location);
    
            $.each( args, function( key, value ) {
                var field = $('<input></input>');
    
                field.attr("type", "hidden");
                field.attr("name", key);
                field.attr("value", value);
    
                form.append(field);
            });
            $(form).appendTo('body').submit();
        }
      });


      
class Player {
  constructor () {
    this.floor = 250
    this.standHeight = 40
    this.duckHeight = this.standHeight/2
    this.duckSpeed = 2
    this.w = 20
    this.h = this.standHeight
    this.x = 20
    this.v = 0
    this.fallSpeed = 0.5
    this.jumpSpeed = 11
    this.ducking = false
    this.y = this.floor-this.h
  } 
  move () {
    if (keyIsDown(UP_ARROW)||keyIsDown(32)) {
      this.jump()
    }
    if(mouseIsPressed){
        this.jump()
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.duck()
    } else {
      this.stand() 
    }
    if ((this.y-this.h) < this.floor) {
      this.v -= this.fallSpeed 
    }
    this.y += -this.v
    if (this.onGround()) {
      this.v = 0
      this.y = this.floor-this.h
    }
  }
  jump () {
    if (this.onGround() && !this.isDucking) {
      this.v += this.jumpSpeed
    }
  }
  duck () {
    if (this.onGround()) {
      this.ducking = true
      this.h = this.duckHeight
      this.y = this.floor-this.h
    }
  }
  onGround() {
    if ((this.y+this.h) >= this.floor) {
      return true
    } else {
      return false
    }
  }
  stand () {
    this.ducking = false
    this.h = this.standHeight
  }
  draw () {
    fill(90)
    //rect(this.x, this.y, this.w, this.h)
    if(this.ducking){
        image(img2, this.x, this.y);
    }else{
        image(img1, this.x, this.y);
    }
  }
}

class Obstacle {
  constructor (x, y, w, h, speed) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.movementSpeed = speed
  }
  move () {
    this.x -= this.movementSpeed
  }
  draw () {
    fill(120)
    rect(this.x, this.y, this.w, this.h)
  }
  collides(other) {
    return !(
      this.x + this.w < other.x ||
      this.x > other.x + other.w ||
      this.y + this.h < other.y ||
      this.y > other.y + other.h
    )
  }
}
const player = new Player()
let objects = []
let score = 0
let speed =4
let rate =80
var img1;
var img2;

function setup () {
  createCanvas(500, 300)
  frameRate(60)
}

function preload(){
  img1 = loadImage('dinosaur.png');
  img2 = loadImage('dinosaur2.png');
}

function updateObjects() {
  if(score>50){
      rate=70
      speed=4.5
    }else if(score>100){
      rate=60
      speed=4.8
    }else if(score>150){
        rate=53
      speed=5.1
    }else if(score>200){
        rate=46
      speed=5.8
    }else if(score>250){
        rate=40
      speed=6.3
    }
  if (frameCount % rate == 0) {
      /*
    if(score>200){
      speed=2
    }else{
      speed=0.01*score+1
    }
    */
    const rnd = Math.random()
    if (rnd > 0.75) {
     objects.push(new Obstacle(500, 200-10, 40, 30, speed)) 
    } else if (rnd > 0.5)  {
     objects.push(new Obstacle(500, 250-40, 20, 40, speed)) 
    } else if (rnd > 0.25)  {
     objects.push(new Obstacle(500, 200-20, 30, 40, speed)) 
    } else {
     objects.push(new Obstacle(500, 250-40, 40, 40, speed)) 
    }
  }
  for (let object of objects) {
    object.move()
    object.draw()
    if(object.collides(player)) {
      /*
      httpPost('score.php','json',data,function(response){
          console.log(response);
      }); 
      */
      speed=0;
      frameRate(0)
      var redirect = 'game_end';
      $.redirectPost(redirect, {hs: score});
      return;
    }
  }
}

function updateScore() {
  if (frameCount % rate == 0 && frameCount>90) {
    score += 1
  }
  drawScore()
}

function drawScore() {
  textSize(32);
  textAlign(CENTER)
  text(score, 250, 30);
  fill(0, 102, 153);
}

function draw () { 
  drawBackground()
  drawFloor()
  updateObjects()
  player.move()
  player.draw()
  updateScore()
} 

function drawBackground () {
  background(225)
}

function drawFloor () {
  fill(50)
  rect(0, 250, 500, 50)
}