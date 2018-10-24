


const COLS = 29;
const ROWS = 28;
const FRAMERATE = 10;
const SIDE = 140;
const TOP = 40;
const LEVEL_TIME = 25000;

const START_GOLD  =70;

var g_enemies = [];
var g_towers = [];
var g_planes=[];

var g_enemies_escaped = 0;
var g_total_score  = 0;
var g_points = 50;

let lastTime = 0;
let delta = 0;
let towerTool = null;
let currentCell =  null;
let currentSelected =  null;
let selectedEnemy = null;


var g_current_tower_type = 0;

var towersImage;
var t1Image;
var t2Image;
var t3Image;
var t4Image;
var t5Image;
var t6Image;
var t7Image;
var treeImage;
var backgroundImage;
var asteroidImage;
var asteroidImageSpider;
var asteroidImageRed;
var asteroidImageAnim= [];
var asteroidImageAnim2= [];
var asteroidImageAnim3=[];
var planeImage;
var clickButtonSound;
var healthSound;
var gongSound;
var positiveSound ;
var skweakSound;
var aeaSound;
var beepSound;
var applauseSound;
var clickSound;
var badClickSound;
var swoshSound;
var popSound;

var frame_count=0;

let text_x;

var g_headlines = [];

let scoreWindow;
let towerInfoWindow;
let selectedTowerInfoWindow;

let input;


let pause_game = false;

let lastTower =  null;
let lastCurrent  =null;
let towerSelected  =true;


var towers_removed  = 0;

let recalc = false;

var gameMap = null;
var enemyManager = null;
var bulletHandler = null;
let game = null;
let cnv;

var currentLevel = 1;

var gameStateEnum =
{
	ENUM_OFF:0,
	ENUM_RUN:1,
	ENUM_FINISHED:2,
};

var gameState = gameStateEnum.ENUM_OFF;

var queue = [];

function isGameFinished()
{
	return gameState==gameStateEnum.ENUM_FINISHED;
}

function setGameFinished()
{
	gameState=gameStateEnum.ENUM_FINISHED;
}


function setNoGame()
{
	gameState = gameStateEnum.ENUM_OFF;
}

function isNoGame()
{
	return gameState == gameStateEnum.ENUM_OFF;
}



class Statics
{
   static getRight() {return Statics.right;}
   static setRight(s){
      Statics.right = s;
   }
   static getLeft() {return Statics.left;}
   static setLeft(s){
      Statics.left = s;
   }
   static getUp() {return Statics.up;}
   static setUp(s){
      Statics.up = s;
   }
   static getDown() {return Statics.down;}
   static setDown(s){
      Statics.down = s;
   }

   static setMaxMovement(s)
   {
      Statics.size=s;
      Object.freeze(Statics.size);
   }

   static getMaxMovement() {
      return Statics.size;
   }


   static setStartPos(p)
   {
      Statics.startCells = p.slice();
      Object.freeze(Statics.startCells);
   }

   static setExitPos(p)
   {
      Statics.exitCells = p.slice();
      Object.freeze(Statics.exitCells);
   }

   static setDefaultRange(x)
   {
      Statics.range =x;
   }
   static getDefaultRange()
   {
      return Statics.range;
   }

}

function compareTowers(a,b)
{

   let i=0;
   if (a.disabled && b.disabled) return 0;

   if (a.disabled && !b.disabled)
      i=-1;

   else if (!a.disabled && b.disabled)
      i=1;

   else if (a.tower_score > b.tower_score)
   {
      i=1;
   }
   else if (a.tower_score < b.tower_score)
   {
      i=-1;
   }
   return i*-1;
}

function sortTowers()
{
   g_towers.sort(compareTowers);

}


function resetAll()
{
   g_total_score  = 0 ;
   g_enemies_escaped = 0;
   towers_removed  = 0;
   g_points = START_GOLD;
   g_towers = [];
   g_enemies = [];
   g_planes = [];
   currentLevel = 1;
   gameMap.reset();
   game.reset();
}


function getSaveData()
{


      let datax = [] ;


      for (let ind=0;ind<g_towers.length;ind++)
      {
         let e = g_towers[ind];
         if (e.remove) continue;

         let i = e.i;
         let j=  e.j;
         let l = e.level;
         let s = e.tower_score;
         let k = e.kills;
         let d = e.disabled;
         let v = e.veteran;
         let t = e.type;


         datax.push({x:i,y:j,level:l,score:s,kills:k, disabled:d , vet:v , type:t });
      }



      let gamedata = {gamelevel:game.currentLevel,escaped:g_enemies_escaped,gold:int(g_points),score:int(g_total_score),removed:towers_removed, towers:datax}

      let json = JSON.stringify(gamedata);
      console.log(json);

}

function loadfromData(json)
{
   //game.clear();
   game.currentLevel  = int(json.gamelevel);
   game.currentLevel-=1;
   g_enemies_escaped = int(json.escaped);

   g_points= 1000000;

   g_total_score = int(json.score);
   towers_removed = json.removed;
   g_towers = [];
   g_enemies = [];
   planes = [];



   for (let i=0;i<json.towers.length;i++)
   {
      let t = json.towers[i];

      let ii = int(t.x);
      let j = int(t.y);
      let ty = int(t.type);
      let l = int(t.level);
      let s = int(t.score);
      let k = int(t.kills);
      let d =boolean(t.disabled);
      let v = boolean(t.vet);

      let pp = towerTool.createTower(ii,j,ty,true);
      if (pp!=2)
      {
         console.log("error loading fromfile");
         console.log(pp);
         console.log(json.towers.length);
         console.log(i);
         break;
         //return;
      }

   //   towers[towers.length - 1].level  =l;
      g_towers[towers.length - 1].tower_score = s;
      g_towers[towers.length - 1].kills = k;
      g_towers[towers.length - 1].disabled = d;
      g_towers[towers.length - 1].veteran = v;
      while (g_towers[g_towers.length - 1].level < l)
         g_towers[g_towers.length - 1].upgrade();
   }

   g_points = int(json.gold);

   //   console.log(json.towers);
}


function removeTower(i,j)
{
   let cell = gameMap.getCell(i,j);

   if (!cell) return;
   if (!cell.tower) return;
   g_points += cell.tower.spent / 2;
   //console.log("remove tower");
   gameMap.removeTower(i,j);

   towers_removed+=1;

   queue.push(function() {enemyManager.calcRoute(); } );
}




canWalk = function(c)
{

   if (!c || (c.tower || c.hidden)) return false;
   return true;
}


function setStartExit()
{
   let x = width /2 - CELL_WIDTH*2 - SIDE /2;
   let xx = width /2 - CELL_WIDTH - SIDE /2;

   let xxx = width /2  - SIDE /2;
   let xxxx = width /2 + CELL_WIDTH - SIDE /2;


   let c = gameMap.getI(x);
   let cc = gameMap.getI(xx);
   let ccc = gameMap.getI(xxx);
   let cccc = gameMap.getI(xxxx);


   let y = height /2 - CELL_HEIGHT*2 + TOP;
   let yy = height /2 -CELL_HEIGHT + TOP;
   let yyy = height /2 + TOP;
   let yyyy = height /2 +CELL_HEIGHT + TOP;
   let d = gameMap.getJ(y);
   let dd = gameMap.getJ(yy);
   let ddd = gameMap.getJ(yyy);
   let dddd = gameMap.getJ(yyyy);

   let starts = [gameMap.getCell(c,0),gameMap.getCell(cc,0),gameMap.getCell(ccc,0),gameMap.getCell(cccc,0),gameMap.getCell(0,d),gameMap.getCell(0,dd),gameMap.getCell(0,ddd),gameMap.getCell(0,dddd) ];

   let exits = [gameMap.getCell(c,ROWS-1),gameMap.getCell(cc,ROWS-1),gameMap.getCell(ccc,ROWS-1),gameMap.getCell(cccc,ROWS-1),gameMap.getCell(COLS-1,d),gameMap.getCell(COLS-1,dd),gameMap.getCell(COLS-1,ddd),gameMap.getCell(COLS-1,dddd) ];



   Statics.setStartPos(starts);
   Statics.setExitPos(exits);
}


function preload()
{
   towersImage = loadImage("art/tools_b.png");
   backgroundImage = loadImage("art/sand_template.jpg");
   clickSound = loadSound("art/click_sound_5.mp3");
   badClickSound = loadSound("art/losesound1.wav");
   popSound = loadSound("art/pop.ogg");
   clickButtonSound = loadSound("art/MenuClick.wav");
   //gun_fire2 = loadSound("art/gun_fire2.wav");
   //gun_fire = loadSound("art/gun_fire.wav");
   healthSound =     loadSound("art/life_pickup.flac");
   swoshSound =     loadSound("art/qubodup-megaswosh1.wav");
   gongSound = loadSound("art/gong.wav");
   skweakSound = loadSound("art/skweak1.ogg");
   positiveSound = loadSound("art/gmae.wav");
   aeaSound = loadSound("art/foom_0.wav");
   beepSound = loadSound("art/beep.wav");
   applauseSound = loadSound("art/WellDone.ogg");
   asteroidImage = loadImage("art/asteroid-small.png");

   asteroidImageRed = loadImage("art/asteroid-small.png");

   t1Image = loadImage("art/t1.png");
   t2Image = loadImage("art/t2a.png");
   t3Image = loadImage("art/t3a.png");
   t4Image = loadImage("art/tAA.png");
   t5Image = loadImage("art/tBoost.png");
   t6Image = loadImage("art/tslow.png");
   t7Image = loadImage("art/t8.png")
   treeImage =  loadImage("art/tree_14.png");

   for (let i=0;i<4;i++)
   {
      let f = "art/a3000"+i+".png";
      asteroidImageAnim.push(loadImage(f));

   }
   for (let i=0;i<4;i++)
   {
      let f = "art/b1000"+i+".png";
      asteroidImageAnim2.push(loadImage(f));

   }
   for (let i=1;i<5;i++)
   {
      let f = "art/Asteroids_32x32_00"+i+".png";
      asteroidImageAnim3.push(loadImage(f));

   }
   asteroidImageSpider = loadImage("art/b40000.png");
   planeImage = loadImage("art/plane.png");
   console.log("preloaded ");
}

function setup() {


   cnv = createCanvas(800,600);


   input = createInput("Name");

   let button3 = createButton("start");

   input.position(width-SIDE,height-40);
   input.size(SIDE-15,10);


   button3.mousePressed(buttonStart);

   let buttonSave = createButton("save score");
   buttonSave.position(width-SIDE,height-20);
   buttonSave.mousePressed(buttonSaves);
   button3.position(width-SIDE+buttonSave.width,5);
   button3.size(40,30);

   cnv.mousePressed(mousePressedInGrid);
   cnv.mouseReleased(mouseReleasedInGrid);

   cnv.mouseMoved(mouseMovesInGrid);


   CELL_WIDTH = (width  -SIDE ) / COLS;
   CELL_HEIGHT = (height  -TOP) / ROWS;

   console.log("width cell "+CELL_WIDTH);
   console.log("height cell "+CELL_HEIGHT);
   // console.log("window width "+width);

   towersImage.resize(SIDE,TOP*2);

   asteroidImage.resize(floor(CELL_WIDTH/2),floor(CELL_HEIGHT/2));



   for (let i=0;i<asteroidImageAnim.length;i++)
   {
      asteroidImageAnim[i].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));
   }
   for (let i=0;i<asteroidImageAnim2.length;i++)
   {
      asteroidImageAnim2[i].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));
   }
   for (let i=0;i<asteroidImageAnim3.length;i++)
   {
      asteroidImageAnim3[i].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));
   }

   asteroidImageSpider.resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));


   frameRate(FRAMERATE);

   gameMap = new GameMap(COLS,ROWS);

   gameMap.init(CELL_WIDTH, CELL_HEIGHT, TOP);


   for (let i=0;i<COLS;i++)
   {
      assert(gameMap.getI( gameMap.getX(i) )==i,"i "+i);

   }
   for (let j=0;j<ROWS;j++)
   {
      assert(gameMap.getJ( gameMap.getY(j) )==j,"j "+j);

   }

   setStartExit();

   //update start and exit cells
   for (let i=0;i<Statics.startCells.length;i++)
   {
         Statics.startCells[i].hidden = false;
         Statics.startCells[i].blocked = true;
   }
   for (let i=0;i<Statics.exitCells.length;i++)
   {
         Statics.exitCells[i].hidden = false;
         Statics.exitCells[i].blocked = true;
   }


   Statics.setDefaultRange(CELL_WIDTH*3);

   Statics.setRight(createVector(1,0));
   Statics.setLeft(createVector(-1,0));
   Statics.setDown(createVector(0,1));
   Statics.setUp(createVector(0,-1));

   Statics.setMaxMovement( min(CELL_WIDTH,CELL_HEIGHT) -4 )


   enemyManager = new EnemyManager();

   towerTool = new TowerTool();

   game = new Game();

   text_x = width;

   scoreWindow = createGraphics(200,300);

   towerInfoWindow = createGraphics(SIDE,250);
   selectedTowerInfoWindow =  createGraphics(SIDE,240);
   gameInfoWindow = createGraphics(width  -SIDE,TOP);

   getBestScore();

   bulletHandler = new BulletHandling();

   resetAll();




}




function getBestScore()
{
   httpGet('/getBestScore', 'json',false, function(response) {


      {
         //   scoreWindow.background(255);
         scoreWindow.textSize(15);
         scoreWindow.fill(color('black'));
         scoreWindow.text("HighScore",10,20);
         scoreWindow.textSize(10);
         let y = 10 ;
         let m = min(5, response.length);
         for (let i=0;i<m ;i++)
         {
            scoreWindow.text(i+1,10,20 + y);
            scoreWindow.text("Name:",10,30 +  y);
            scoreWindow.text(response[i].user ,10+30,30 +  y);

            scoreWindow.text("Score:",10,40 +  y);
            scoreWindow.text(response[i].score ,10+30,40 + y);
            scoreWindow.text("Best tower:",10,50 +  y);
            scoreWindow.text(response[i].best_tower_score ,10+50,50 + y);
            y+=50;


         }

      }

   });





}

function getBestTowers()
{
   httpGet('/getBestTowers', 'json',false, function(response) {
      console.log(response);


   });
}

function levelsDone()
{
   if (isGameFinished()) return;

   //wait until all enemies gone
   if ( (!g_enemies.length) && (!g_planes.length) )
   {
      setGameFinished();

      console.log("done");

      g_total_score = int(g_total_score) - (10*g_enemies_escaped)  - (towers_removed*50) ;
      g_headlines.push("Score : "+g_total_score);
   }
   else {
      g_enemies= g_enemies.filter(x => !x.remove);
      g_planes= g_planes.filter(x => !x.remove);

      //console.log("waiting");
      queue.push(function() { levelsDone(); } );
   }
}


function buttonStart()
{

   if ( gameState == gameStateEnum.ENUM_OFF)
   {
      g_headlines.push("lets go...");
      gameState = gameStateEnum.ENUM_RUN;

   }
   else if (gameState == gameStateEnum.ENUM_RUN)
   {
      game.increaseTime(5000);      //5 sec
   }

}



function buttonSaves()
{

   if (!isGameFinished())
   {
      g_headlines.push("Can't save yet..")
      return ;
   }

   let tscore   = 0;
   let tname  = "none";



   //tot_score = 10100;
   //tscore  = 5;
   let name = input.value();

   if (!name.length || name=="Name" || name.length>20)
   {
      g_headlines.push("Invalid name..");
      return;
   }

   g_towers[0].best = false;
   sortTowers();
   g_towers[0].best = true;

   tscore = g_towers[0].tower_score;
   tname = g_towers[0].name;

   //total_score = 200;
   //tscore = 50;
   if (g_total_score > 100 && tscore > 0)
   {
      let x  = { user: name, score:int(g_total_score), best_tower_score:int(tscore) , best_tower_type:tname} ;

      httpPost('/save', x, function(finished) {
         console.log(finished);
         if ( finished == 1 || finished == 2)
         {
            setNoGame();
            g_headlines.push("SAVED")
         }

      });
   }
   else {
      g_headlines.push("Will not save");
   }

}



function mouseMovesInGrid()
{
   if (towerTool.disabled)  return;


   let i = gameMap.getI(mouseX);
   let j = gameMap.getJ(mouseY);
   let cell = gameMap.getCell(i,j);
   if (!cell) currentCell=null;
   else if (cell && !cell.hidden && currentCell!=cell)
   {
      currentCell = cell;
   }
}

function mousePressedInGrid() {


   let i = gameMap.getI(mouseX);
   let j = gameMap.getJ(mouseY);

   let cell = gameMap.getCell(i,j)

   lastCurrent = null;

   if (mouseX > width - SIDE)
   {
      if (mouseY > TOP && mouseY < towersImage.height+TOP)
      {
         currentSelected = null;
         //console.log("hhhhh");
         for (let i=0;i<g_towers.length;i++)
         {
            g_towers[i].selected = false;
         }

      }
      else {
         towerTool.disabled = true;
      }

   }

   if (!cell) return;

   currentSelected = null;
   for (let i=0;i<g_towers.length;i++)
   {
      g_towers[i].selected = false;
   }

   if (cell && cell.tower)
   {
      cell.tower.selected = true;
      //console.log("selected");
      currentSelected = cell.tower;
      towerTool.disabled = false;
   }



}



function mouseReleasedInGrid()
{
   let i = gameMap.getI(mouseX);
   let j = gameMap.getJ(mouseY);

   if (!towerTool.disabled)
   {
      let r = towerTool.createTower(i,j,g_current_tower_type,false);
      if (r==2)
      clickSound.play();
      else if (r==1)
      badClickSound.play();
   }


   if (mouseX > width - SIDE)
   {
      if (mouseY > TOP && mouseY < towersImage.height+TOP)
      {
         let w = towersImage.width /5;
         let h = towersImage.height /2;

         let i = floor(   (mouseX - (width - SIDE))  / w );
         let j = floor(   (mouseY - ( TOP))  / h );


         if (j>1){
            return;
         }

         if (j==1){
            j=5;
         }

         if (i+j > 6)
         {
            return;
         }
         g_current_tower_type = i+j;
         towerSelected  =true;

         towerTool.disabled = false;
         clickButtonSound.play();
      }
      else if (currentSelected ) {

         //console.log("hello")
         let y = mouseY - ( TOP + towerInfoWindow.height+ selectedTowerInfoWindow.height  +20  - 40 );

         let x =  (mouseX - (width - SIDE) - 10 );

         let play = false;
         if (y > 0 && y < 20)
         {
            if (x > 0 && x <45 )
            {
            //   console.log("first");
               if (currentSelected.canUpgrade())
               {
                  play = true;
                  currentSelected.upgrade();
               }
            }
            else if (x > 50 && x <75 )
            {
               //console.log("second");

               {
                  play = true;
                  currentSelected.initRemoveTower();
               }
            }
         }
         else if (y > 0 && y < 40)
         {
            if (x > 0 && x <45)
            {
               //console.log("third");
               if (currentSelected.disabled )
               {
                  play = true;
                  currentSelected.repair();
               }
            }
            else if (x > 50 && x <105 )
            {
               //console.log("fourth");
               if (currentSelected.canChangeFireMode())
               {
                  play = true;
                  currentSelected.changePrio();
                  lastCurrent = null;     //redraw window
               }

            }
         }
         if (play)
            clickButtonSound.play();


      }


   }


}

function keyPressed() {
   if(keyCode == LEFT_ARROW) {
      enemyManager.createSeeker2(10);
   }
   else if(keyCode == RIGHT_ARROW) {
      enemyManager.createEnemies(1,EnemyType.KAKA,14);;
   }
   else if(keyCode == DOWN_ARROW) {
      enemyManager.createPlanes(2,10);
   }
   else if(keyCode == UP_ARROW) {
      enemyManager.createEnemies(5,EnemyType.VANILLA,50);
   }
   else if((keyCode == 46) || (keyCode==83)){



      //if( currentSelected)
      {
         for (let i=0;i<g_towers.length;i++)
         {
            if (g_towers[i].selected)
            {
               g_towers[i].initRemoveTower();
               return;
            }
         }


      }



   }
   else if(keyCode == 85) {   //u
      for (let i=0;i<g_towers.length;i++)
      {
         if (g_towers[i].selected)
         {
            g_towers[i].upgrade();
            return;
         }
      }

   }
   else if(keyCode == 65) {   //a
      for (let i=0;i<g_towers.length;i++)
      {
         if (g_towers[i].selected)
         {
            g_towers[i].changePrio();
            return;
         }
      }

   }

   else if(keyCode == 82) {       //r
      for (let i=0;i<g_towers.length;i++)
      {
         if (g_towers[i].selected && g_towers[i].disabled)
         {
            g_towers[i].repair();
            return;
         }
      }

   }
   else if(keyCode == 8) {
      g_points+=10;

   }
   else if(keyCode == 19) {  //pause
      pause_game = !pause_game;
      if (pause_game)
      {
         frameRate(0);
      }
      else {
         lastTime  =millis();
         frameRate(FRAMERATE);
      }

   }



    //console.log(keyCode);
}


function updateTowerInfoWindow()
{

   if (!towerSelected ) return;

   towerSelected  =false;
   let rr = towerTool.getTower(g_current_tower_type);
   if (!rr) return;


   {
      //  console.log("lidfdf");
      towerInfoWindow.clear();
      towerInfoWindow.textSize(14);
      towerInfoWindow.fill(color('blue'));

      let print = towerTool.getInfo(rr);

      towerInfoWindow.text(print,0,towersImage.height+5);
   }

}

function updateSelecedTowerInfoWindow()
{

      if (!currentSelected) {
         selectedTowerInfoWindow.clear();
         return;
      }

      if ( (lastCurrent != currentSelected) ||   ( frame_count % 20 == 0  ) )
      {
         //console.log("lkhdfshsdh");
         selectedTowerInfoWindow.clear();

         let print  = currentSelected.getDescription();

         if (currentSelected.disabled && !currentSelected.repairTime)
         {
            print+="\nBROKEN, \nNEED REPAIR";
         }
         selectedTowerInfoWindow.stroke(255);
         selectedTowerInfoWindow.fill(color('yellow'));
         selectedTowerInfoWindow.rect(5,5,SIDE- 10, selectedTowerInfoWindow.height );
         selectedTowerInfoWindow.noStroke();
         selectedTowerInfoWindow.textSize(14);
         selectedTowerInfoWindow.fill(color('blue'));

         selectedTowerInfoWindow.text(print,10,20);

         selectedTowerInfoWindow.stroke(255);
         selectedTowerInfoWindow.fill(color('grey'));

         //buttons (upgrade)
         if (currentSelected.canUpgrade())
         {
            selectedTowerInfoWindow.rect(10,selectedTowerInfoWindow.height - 40 ,45,20);
         }
         //sell
         selectedTowerInfoWindow.rect(60,selectedTowerInfoWindow.height - 40 ,25,20);

         //repair
         if (currentSelected.canRepair())
            selectedTowerInfoWindow.rect(10,selectedTowerInfoWindow.height - 20 ,45,20);

         //fire mode
         if (currentSelected.canChangeFireMode())
         {
            selectedTowerInfoWindow.rect(60,selectedTowerInfoWindow.height - 20 ,55,20);
         }

         selectedTowerInfoWindow.noStroke();
         selectedTowerInfoWindow.textSize(10);
         selectedTowerInfoWindow.fill(0);
         if (currentSelected.canUpgrade())
         {
            selectedTowerInfoWindow.text("Upgrade",14,selectedTowerInfoWindow.height - 25);
         }
         selectedTowerInfoWindow.text("Sell",65,selectedTowerInfoWindow.height - 25);
         if (currentSelected.canRepair())
         {
            selectedTowerInfoWindow.text("Repair",15,selectedTowerInfoWindow.height - 5);
         }

         if (currentSelected.canChangeFireMode())
         {
            selectedTowerInfoWindow.text("Fire Mode",65,selectedTowerInfoWindow.height - 5);
         }

         selectedTowerInfoWindow.noStroke();
         //noStroke();
      }

      lastCurrent  = currentSelected;


}

function updateGameInfoWindow()
{

   if (frame_count % 10 != 0) return ;

   gameInfoWindow.clear();
   {
      gameInfoWindow.textSize(20);
      gameInfoWindow.fill(color('yellow'));
      gameInfoWindow.text("Gold:",width - SIDE - 150 , 20)
      gameInfoWindow.text(int(g_points),width - SIDE - 75,20);
   }
   {

      let time = LEVEL_TIME - game.getLevelTime();
      let t = round(time / 1000) ;
      if (t<0)
         t=0;
      gameInfoWindow.textSize(20);
      gameInfoWindow.fill(color('black'));
      gameInfoWindow.text("Level:",20, 20);
      gameInfoWindow.text(currentLevel ,80,20);

      gameInfoWindow.text("Time:",150, 20);
      gameInfoWindow.text(t,200, 20);

   }
   {
      let e = max(0,g_enemies_escaped);
      gameInfoWindow.fill(color('red'));
      gameInfoWindow.text("Escaped:",width/2  - SIDE,20);
      gameInfoWindow.text(e,width/2  - SIDE+120 ,20);
   }

}




function draw() {


   ++frame_count;

   delta = millis() - lastTime;
   image(backgroundImage,0,0);


   {
      image(towersImage,width - SIDE,TOP);

      updateGameInfoWindow();
      image(gameInfoWindow,0,0);

      updateTowerInfoWindow();

      image(towerInfoWindow,width - SIDE ,TOP);

      updateSelecedTowerInfoWindow();

      image(selectedTowerInfoWindow,width - SIDE ,TOP+towerInfoWindow.height+20);

   }




      gameMap.show();


      if (currentCell)
      {
         towerTool.show(currentCell);
      }


      for (let i=0;i<g_towers.length;i++)
      {
         g_towers[i].update(delta);
         g_towers[i].show();

      }


      for (let i=0;i<g_enemies.length;i++)
      {
         g_enemies[i].update(delta);
         g_enemies[i].show();
      }


      for (let i=0;i<g_planes.length;i++)
      {
         g_planes[i].update(delta);
         g_planes[i].show();
      }


      bulletHandler.updateAndShow(delta);



      if (gameState == gameStateEnum.ENUM_RUN)
      {

         if (game.update(delta))
         {
            currentLevel++;

            if(g_enemies.length)
            {
               g_enemies= g_enemies.filter(x => !x.remove);

            }
            if(g_planes.length)
            {
               g_planes= g_planes.filter(x => !x.remove);

            }
            if(g_towers.length)
            {
               g_towers= g_towers.filter(x => !x.remove);

               if(g_towers.length)
               {
                  g_towers[0].best = false;
                  sortTowers();

                  g_towers[0].best = true;
               }

            }

            bulletHandler.erase(false);

         }

   }

   scroll();

   if (queue.length)
   {
      let c = queue.pop();
      c();
   }

   lastTime = millis();

   if (isNoGame())
   {
      image(scoreWindow,300,200);
   }

}


function scroll() {

   if (g_headlines.length==0) return;

   textSize(CELL_HEIGHT-1);
   fill(0);
   textAlign (LEFT);

   let te = g_headlines[0];
   // A specific String from the array is displayed according to the value of the "index" variable.
   text(te, text_x, height-10);

   // Decrement x
   text_x = text_x - 4;

   // If x is less than the negative width, then it is off the screen
   // textWidth() is used to calculate the width of the current String.
   let w = textWidth(te);
   if (text_x < -text_x) {
      text_x = width;
      g_headlines.shift();

   }


}
