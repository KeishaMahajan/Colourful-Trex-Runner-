var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var restart;

//localStorage[".HighestScore"] = 0;

function preload(){
  trex_running=loadAnimation("trex2.png","trex 3.png","trex4.png");
  trex_collided =loadImage("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.jpg");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle 2.png");
  obstacle3 = loadImage("obstacle 3.png");
  obstacle4 = loadImage("obstacle 4.png");
  obstacle5 = loadImage("obstacle 5.png");
  obstacle6 = loadImage("obstacle 6.png");
  

  restartImg = loadImage("restart 1.png");
}

function setup() {
 createCanvas (windowWidth,windowHeight)
  
  trex = createSprite(50,160,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addImage("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,195,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  //gameOver = createSprite(300,100);
  //gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,140);
  restart.addImage(restartImg);
  
  //gameOver.scale = 0.5;
  restart.scale = 0.5;

  //gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
    background(255);
  // trex.debug = true;

  text("Score: "+ score, windowWidth/2,50);
  
  if (touches.length>0 || keyDown ("space")&& trex.y>=height-120){
    
    jumpsound.play()
    trex.velocityY=-10
    touches=[]
    
  }
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < windowWidth-100){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
   
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    //gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  


  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(windowWidth,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage("spawn",cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(windowWidth,160,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6)); 
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.6;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  //gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  

  //console.log(localStorage[".HighestScore"]);
  
  score = 0;
  
}
