
//update      
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
let wait =false;
let curFrame;
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
  //console.log(frameCount+" "+curFrame)
  if(wait && frameCount - curFrame>120){
    wait=false;
    //score+=1;
  }
  if(score>250){
    if(score==250){
      wait =true;
      score+=1;
      curFrame = frameCount;
    }
      rate=35
    }else if(score>=200){
      if(score==200){
        wait =true;
        score+=1;
        curFrame = frameCount;
      }
      rate=40
      //speed=4.5
    }else if(score>=150){
      if(score==150){
        wait =true;
        score+=1;
        curFrame = frameCount;
      }
      rate=50
      //speed=10
    }else if(score>=100){
      if(score==100){
        wait =true;
        score+=1;
        curFrame = frameCount;
      }
      rate=60
      //speed=12
    }else if(score>=50){
      if(score==50){
        wait =true;
        score+=1;
        curFrame = frameCount;
      }
      rate=70
      //speed=14
    }
  if (!wait && frameCount % rate == 0) {
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

      speed=0;
      frameRate(0)
      
      setTimeout(function() { $("#LScore").text(score); },100);
      $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
      });
      return;
    }
  }
}

function updateScore() {
  if (!wait && frameCount % 60 == 0 && frameCount>60 ) {
    score+=1;
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
