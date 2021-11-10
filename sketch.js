var trex, trexAnimation ,trexLose;
var solo, soloImage, soloCollide;
var nuvem , nuvemImg;
var cacto, cactoImg1, cactoImg2, cactoImg3, cactoImg4, cactoImg5, cactoImg6;
var randomNum;
var pontuacao;
const JOGAR = 1;
const ENCERRAR = 0;
var estado = JOGAR;
var grupoCactos, grupoNuvens;
var somPulo, somPerder, somCheckPoint;
var resetar, resetarImg, gameOver, gameOverImg;

function gerarNuvens(){
  if(frameCount%80 == 0){
    nuvem = createSprite(width, 100, 40, 10);
    nuvem.y = Math.round(random(30, 80));
    nuvem.velocityX = -5;
    nuvem.lifetime = width/-nuvem.velocityX;
    nuvem.addImage("nuvem", nuvemImg);
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    grupoNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  if (frameCount%50 == 0){
    cacto = createSprite(width, 160, 34, 70);
    cacto.velocityX = -(5+pontuacao/100);
    cacto.lifetime = width/-cacto.velocityX;
    randomNum = Math.round(random(1,6));
    switch (randomNum){
      case 1:
        cacto.addImage("cacto1", cactoImg1);
      break;
      case 2:
        cacto.addImage("cacto2", cactoImg2);
      break;
      case 3:
        cacto.addImage("cacto3", cactoImg3);
      break;
      case 4:
        cacto.addImage("cacto4", cactoImg4);
      break;
      case 5:
        cacto.addImage("cacto5", cactoImg5);
      break;
      case 6:
        cacto.addImage("cacto6", cactoImg6);
      break;
      default:
      break;
    }
    cacto.scale = 0.5;
    grupoCactos.add(cacto);
  }
}

function restart(){
  estado = JOGAR;
  grupoNuvens.destroyEach();
  grupoCactos.destroyEach();
  pontuacao = 0;
  trex.changeAnimation("correndo");
}

function preload(){
  trexAnimation = loadAnimation("./images/trex1.png","./images/trex2.png","./images/trex3.png");
  soloImage = loadImage("./images/ground2.png");
  nuvemImg = loadImage("./images/cloud.png");
  cactoImg1 = loadImage("./images/obstacle1.png");
  cactoImg2 = loadImage("./images/obstacle2.png");
  cactoImg3 = loadImage("./images/obstacle3.png");
  cactoImg4 = loadImage("./images/obstacle4.png");
  cactoImg5 = loadImage("./images/obstacle5.png");
  cactoImg6 = loadImage("./images/obstacle6.png");
  trexLose = loadAnimation("./images/trex_collided.png");
  resetarImg = loadImage("./images/restart.png");
  gameOverImg = loadImage("./images/gameOver.png");
  somPulo = loadSound("./sons/jump.mp3");
  somPerder = loadSound("./sons/die.mp3");
  somCheckPoint = loadSound("./sons/checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);


  trex = createSprite(50,150,15,70);
  trex.addAnimation("correndo", trexAnimation);
  trex.addAnimation("perdeu", trexLose);
  trex.scale = 0.5;

  soloCollide = createSprite(width/2,195,width,15);
  soloCollide.visible = false;
  solo = createSprite(width/2,180,width,30);
  solo.addImage("chão",soloImage);

  randomNum = 0;
  pontuacao = 0;

  grupoCactos = new Group();
  grupoNuvens = new Group();
  trex.debug = false;
  trex.setCollider("circle", 0, 5, 35);
  //trex.setCollider("rectangle",0 ,0 ,125, 100);

  resetar = createSprite(width/2, 130);
  resetar.addImage("botão de resetar", resetarImg);
  resetar.scale = 0.5;
  gameOver = createSprite(width/2, 100);
  gameOver.addImage("texto gameOver", gameOverImg);
  gameOver.scale = 0.5;
}

function draw() {
  background("white");
  text("pontuação: " + Math.round(pontuacao), width-150, 50);

  if (estado == JOGAR){
    if (solo.x<100){
      solo.x = solo.width/2;
    }
    if (touches.length > 0 && trex.y >= 164){
      trex.velocityY = -10;
      somPulo.play();
      touches = [];
    }
    if (grupoCactos.isTouching(trex)){
      estado = ENCERRAR;
      somPerder.play();
      //trex.velocityY = -10;
      //somPulo.play();
    }
    if(pontuacao%100 == 0 && pontuacao != 0){
      somCheckPoint.play();
    }
    solo.velocityX = -(5+3*pontuacao/100);
    gerarNuvens();
    gerarObstaculos();
    pontuacao += 0.25;
    //console.log(frameRate());
    trex.velocityY = trex.velocityY+0.5;
    //açao da gravidade
    resetar.visible = false;
    gameOver.visible = false;
  }else if(estado == ENCERRAR){
    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);
    solo.velocityX = 0;
    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    trex.velocityY = 0;
    trex.changeAnimation("perdeu");
    resetar.visible = true;
    gameOver.visible = true;
    if(touches.length > 0){
      restart();
      touches = [];
    }
  }
  console.log(trex.y);

  trex.collide(soloCollide);
  drawSprites();
}