


getCells = function(e)
{
   let right = gameMap.getCell(e.i+1,e.j);

   let top  =  gameMap.getCell(e.i,e.j-1);

   let left =  gameMap.getCell(e.i-1,e.j);
   let bottom =  gameMap.getCell(e.i,e.j+1);
   let bottomright = null;
   let rightUp = null;
   let rightright = null;
   let bottomLeft = null;
   let bottomDown = null;
   if (bottom )
   {
      bottomright =  gameMap.getCell(bottom.i+1,bottom.j);
      bottomDown =  gameMap.getCell(bottom.i,bottom.j+1);

      bottomLeft=  gameMap.getCell(bottom.i-1,bottom.j);
   }
   if (right)
   {
      rightright = gameMap.getCell(right.i+1,right.j);

      rightUp =  gameMap.getCell(right.i,right.j-1);

   }
   let bottomrightRight = null;
   let bottomrightDown = null;
   if (bottomright )
   {
      bottomrightRight =  gameMap.getCell(bottomright.i+1,bottomright.j);
      bottomrightDown =  gameMap.getCell(bottomright.i,bottomright.j+1);
   }
   let bottomleftdown = null;
   if (bottomLeft )
   {
      bottomleftdown =  gameMap.getCell(bottomLeft.i,bottomLeft.j+1);

   }
   let bottomrightRightDown = null;
   if (bottomrightRight )
   {
      bottomrightRightDown =  gameMap.getCell(bottomrightRight.i,bottomrightRight.j+1);

   }
   let rightrightUp = null;
   if (rightright)
   {
      rightrightUp =  gameMap.getCell(rightright.i,rightright.j-1);

   }

   let leftUp = null;
   if (left)
   {
      leftUp =  gameMap.getCell(left.i,left.j-1);

   }

   let ar = new Array();
   ar.push(top);
   ar.push(left);
   ar.push(rightright);
   ar.push(rightUp);
   ar.push(bottomrightRight);
   ar.push(bottomrightDown);
   ar.push(bottomLeft);
   ar.push(bottomleftdown);
   ar.push(bottomrightRightDown);
   ar.push(rightrightUp);
   ar.push(leftUp);



   return ar;


}









class Enemy
{
   constructor(home,start,img)
   {

      this.manager = home;
      this.i = start.i;
      this.j = start.j;
      this.hp = 9;
      this.points = 2;

      this.startHp=this.hp;

      this.time = 0;
      this.remove = false;
      this.speed = 35;




      this.vector = createVector(gameMap.getX(this.i), gameMap.getY(this.j));

      this.direction = Statics.getRight();

      this.cell  = this.getCellAtMe();

      this.end = null;


      this.images = img;
      this.animateCounter = 0;

      this.minion  =false;
      this.frameCounter = 0;
      this.boss = null;
      this.armor = 0;
      this.friction = [];
      this.normalExits = true;
      this.immune=false;
      this.prio = 10;
      this.name = "Vanilla";

      this.pathHelper = new PathHelper(new MazeWalker(Statics.exitCells),
                                 this.images[0].width,
                                 CELL_WIDTH,
                                 CELL_HEIGHT,
                                 function(){
                                    gameMap.resetPathInfo();
                                 },
                                 Statics.getMaxMovement()
                                 );




   }

   getName()
   {
      return this.name;
   }

   canBeSlowed()
   {
      if (this.immune) return false;
      if (this.speed==0) return false;
      return true;
   }

   slowed()
   {
      return this.friction.length > 0;
   }

   setEnd(end)
   {
      this.end = end;

   }

   giveHp(z)
   {
      if (this.remove) return false;
      if (this.startHp<=this.hp) return false;
      this.hp +=z;
      return true;
   }

   damage(z)
   {
      if (this.remove) return false;
      if (this.armor>0)
      {
         this.armor-=z;
         gongSound.play();
         return false;
      }
      this.hp -=z;
      if (this.hp<=0)
      {
         g_points +=this.points;

         g_total_score += this.points;
         this.remove = true;

         this.doOnDead();


      }

      return true;
   }

   doOnDead()
   {
      popSound.play();
   }


   getCellAtMe()
   {
      let i = gameMap.getI(this.vector.x);
      let j = gameMap.getJ(this.vector.y);
      return  gameMap.getCell(i,j);
   }

   makeDirectionFrom(d)
   {

      if (d == 0)
      {
         this.direction =Statics.getRight();
      }
      else if (d == 1)
      {
         this.direction = Statics.getLeft()
      }
      else if (d == 2)
      {
         this.direction = Statics.getDown()
      }
      else
      {
         this.direction =  Statics.getUp()
      }

   }

   getPathLength()
   {
      if (this.normalExits)
      {
         return this.pathHelper.getPathLength();
      }
      else {
         return 1000;
      }
   }

   calcRoute()
   {

      if (!this.pathHelper.calcRoute(this.cell, this.end, this.normalExits))
      {
         //console.log("calcRoute")
         return false;
      }

      this.makeDirectionFrom(this.pathHelper.getDirection());

      return true;

   }

   setRoutePath(p)
   {
      this.pathHelper.setRoutePath(p);
   }

   setNextCellFrom(cell)
   {
      this.pathHelper.setNextCellFrom(cell);
      this.makeDirectionFrom(this.pathHelper.getDirection());

   }

   closeTo(e)
   {

      let dir = p5.Vector.sub(e.vector,this.vector);

      if (dir.mag() <= Statics.getDefaultRange() ){

         dir.normalize();
         dir.y *=-1;
         this.hpAim = dir;
         return true;
      }


      return false;

   }

   doStuff()
   {

      if (this.minion && !this.boss)
      {

         for (let i=0;i<g_enemies.length;i++)
         {
            if ((!g_enemies[i].remove) && (!g_enemies[i].minion))
            {
               if (this.closeTo(g_enemies[i]))
               {

                  //this.simple=false;
                  this.speed = g_enemies[i].speed;
                  if (this.speed > 2){
                     this.speed-=2;
                  }

                  this.end = g_enemies[i].end;

                  this.boss = g_enemies[i];

                  this.calcRoute();
                  return;
               }

            }
         }


      }

      if (this.minion && this.boss)
      {


         if (this.boss.remove || !this.closeTo(this.boss))
         {
            this.boss = null;
            // this.simple = true;
            this.speed = getRndInteger(30,45);
            //this.calcRoute( );
         }
         else
         {
            if (this.hp >1)
            {
               if (this.boss.giveHp(1))
               {
                  bulletHandler.create(this.vector.x,this.vector.y,this.hpAim,30,color(0,240,0,222), 2,2,60);
                  healthSound.play();
                  this.hp-=1;
               }
            }

         }
      }


   }

   handleFriction(distance)
   {
      if (this.friction.length>0)
      {
         let x = p5.Vector.mult(this.direction,-1);

         for (let i=0;i<this.friction.length;i++)
         {
            let b = distance * (this.friction[i].dist/100);

            let dd = p5.Vector.mult(x,b);
            distance-=b;
            if (distance>0)
            {
               this.vector.add(dd);
            }

         }


         for (let i=0;i<this.friction.length;i++)
         {

            if ( this.time - this.friction[i].time > this.friction[i].s)
            {
               removeFromArray2(this.friction,this.friction[i]);
               break;
            }
         }

      }
   }

   update(dtime)
   {
      if (this.remove) return;

      this.time+=dtime;
      let maxDistance = this.pathHelper.getMaxDistance();

      let dist = dtime/1000.0 * this.speed;
      let distance= min(dist,maxDistance);

      let vector = p5.Vector.mult(this.direction,distance);

      this.vector.add(vector);


      this.handleFriction(distance);


      this.cell = this.getCellAtMe();

      let result = this.pathHelper.checkPath(this.cell,this.vector.x,this.vector.y);

      if (result == PathResult.ENUM_NEW_CELL)
      {
         this.makeDirectionFrom(this.pathHelper.getDirection());
      }
      else if (result == PathResult.ENUM_REACH_DEST)
      {
         //console.log("dest");
         //some have towers as destination
         if (!Statics.exitCells.includes(this.cell))
         {
            this.doOnReachEnd();
         }
         else
         {
            applauseSound.play();
            this.remove = true;
            g_enemies_escaped += 1;
            return;
         }

      }
      else if (result == PathResult.ENUM_STUCK)
      {
         return;
      }
      else if (result == PathResult.ENUM_LOST)
      {
         let c = this.findCellAround(this.cell);
         if (!c)
         {
            console.error("error!,outside area");
            //remove him atleast
            this.remove = true;
            return;
         }
         //move to cell
         this.vector.x = c.x;
         this.vector.y = c.y;
         this.cell = this.getCellAtMe();
         this.calcRoute();

         return;
      }



      if (this.frameCounter++ % 10 == 0)
         this.doStuff();


   }

   findCell(cell,dir)
   {
      if (!cell ) return null;

      if (dir == Statics.getRight())
      {   //try move left
         let c = gameMap.getCell(cell.i - 1, cell.j);
         if (canWalk(c)) return c;
         if (c && c.hidden)
         {
            return this.findCell(cell,Statics.getDown());
         }
         return this.findCell(c,dir);
      }
      else if (dir == Statics.getLeft())
      {
         let c = gameMap.getCell(cell.i +1, cell.j);
         if (canWalk(c)) return c;
         if (c && c.hidden)
         {
            return this.findCell(cell,Statics.getDown());
         }

         return this.findCell(c,dir);
      }
      else if (dir == Statics.getDown())
      {
         let c = gameMap.getCell(cell.i , cell.j -1);
         if (canWalk(c)) return c;
         if (c && c.hidden)
         {
            return this.findCell(cell,Statics.getRight());
         }

         return this.findCell(c,dir);
      }
      else
      {
         let c = gameMap.getCell(cell.i , cell.j +1);
         if (canWalk(c)) return c;
         if (c && c.hidden)
         {
            return this.findCell(cell,Statics.getRight());
         }
         return this.findCell(c,dir);
      }
   }

   findCellAround(cell)
   {
      if (!cell ) return null;

      return this.findCell(cell,this.direction);

   }


   doOnReachEnd()
   {
   }

   getHpL()
   {
      if (this.hp === this.startHp) return 1;
      let d = this.hp / this.startHp;
      return d;


   }

   slowDown(d,t,p)
   {
      //if (this.friction.length>1) return;
      this.friction.push( { dist:d, time:this.time ,s:t, who:p } );

   }

   isInFriction(p)
   {
      for (let i=0;i<this.friction.length;i++)
      {
         if (this.friction[i].who == p)
         return true;
      }
      return false;
   }

   show()
   {

      if (this.remove) return;

      image(this.images[this.animateCounter],this.vector.x,this.vector.y);
      this.animateCounter++;
      if (this.animateCounter == this.images.length)
      {
         this.animateCounter=0;
      }

      stroke(color('green'));
      strokeWeight(3);
      line(this.vector.x,this.vector.y-2,this.vector.x+ (this.images[0].width * this.getHpL()),this.vector.y-2);
      noStroke();
      strokeWeight(1);


      this.doDraw();


   }

   doDraw()
   {

   }
}

////////////////////////////////////////////////////////////////

class Enemy2 extends Enemy
{
   constructor(h,start,image,images)
   {
      super(h,start,image);
      this.images2=images;
      this.prio = 5;
   }

   getName()
   {
      return "Beeper";
   }



   checkAround(c)
   {
      //check 2 tiles away
      for (let i=-2;i<=2;i+=4)
      {
         for (let j=-2;j<=2;j+=4)
         {
            let cell = gameMap.getCell(c.i-i,c.j-j);
            if (canWalk(cell)) return cell;
         }
      }


      //let cell = null;
      let rightup = gameMap.getCell(c.i+1,c.j-1);
      if (canWalk(rightup))
      {
         return rightup;
      }

      {
         let rightdown = gameMap.getCell(c.i+1,c.j+1);
         if (canWalk(rightdown))
         {
            return rightdown;
         }
      }

      let leftdown = gameMap.getCell(c.i-1,c.j+1);
      if (canWalk(leftdown))
      {
         return leftdown;

      }


      return null;
   }

   getPos()
   {
      {

         let cell = this.checkAround(this.cell);
         if (cell)
         {

            {

               return cell;
            }
         }
      }

      return this.cell;
   }

   doOnDead()
   {
      //popp.play();

      beepSound.play();
      let m = getRndInteger(4,8);
      for (let i=0;i<m;i++)
      {
         let e = new Enemy(this.manager,this.getPos(),this.images2);
         // e.simple = true;
         e.minion = true;
         e.immune = true;

         e.hp+=20;
         e.startHp=e.hp;
         e.setEnd(this.end);

         e.calcRoute();

         e.speed = getRndInteger(20,35);
         g_enemies.push(e);
      }


   }



}

///////////////////////////////////////////

class Enemy2A extends Enemy2
{
   constructor(h,start,image,images,image2)
   {
      super(h,start,image,images);
      this.image2 = image2;
      this.parent=null;
      this.prio = 4;
   }

   getName()
   {
      return "Grrr";
   }

   doOnDead()
   {
      popSound.play();

      //beep.play();

      if (!this.parent && this.image2)
      {
         let e = new Enemy2A(this.manager,this.getPos(),this.image2,this.images2);
         e.parent = this;
         e.hp=this.startHp-25;
         e.startHp=e.hp;
         e.points= this.points-10;


         e.end=this.end;

         e.calcRoute();

         e.speed = this.speed-10;
         g_enemies.push(e);
      }
      else
      {

         for (let i=0;i<2;i++)
         {
            let e = new Enemy(this.manager,this.getPos(),this.images2);
            e.hp=this.startHp/2;
            e.startHp=e.hp;
            e.points= this.points/2;

            e.end=this.end;

            e.calcRoute();
            e.prio = 8;
            e.speed = getRndInteger(35,45);
            g_enemies.push(e);
         }
      }

   }
}
///////////////////////////////////////////////

class Enemy2B extends Enemy2
{
   constructor(h,start,image,images)
   {
      super(h,start,image,images);
      this.c = 1 ;
      this.prio = 6;
   }
   getName()
   {
      return "Boinker";
   }

   doStuff()
   {
      if (this.remove) return;
      if (this.c++ % 5 !=0) return;
      let e = new Enemy(this.manager,this.getPos(),this.images2);

      e.hp+=20;
      e.startHp=e.hp;



      e.end = this.end;


      e.calcRoute();

      e.speed = getRndInteger(this.speed-20,this.speed-15);
      g_enemies.push(e);
      beepSound.play();
   }

   doOnDead()
   {
      popSound.play();
   }

}

/////////////////////////////////////////////////////////////

class Enemy3 extends Enemy
{
   constructor(h,start,image, images2)
   {
      super(h,start,image);
      this.images2 = images2;
      this.state = true;
      this.c = 1;
      this.prio = 3;
   }

   getName()
   {
      return "Mmorkper";
   }

   doStuff()
   {
      if (this.c++ % 10 == 0)
      {
         this.state=!this.state;
         if (!this.state)
         {
            this.speed = 30;
            this.armor=150;
            this.c+=4;

         }
         else
         {
            this.speed = 60;
            this.armor=0;
         }
      }

   }

   show()
   {
      if (this.remove) return;
      if (this.state)
      {


         image(this.images[this.animateCounter],this.vector.x,this.vector.y);
         this.animateCounter++;
         if (this.animateCounter == this.images.length)
         {
            this.animateCounter=0;
         }
      }
      else{
         image(this.images2,this.vector.x,this.vector.y);
      }

      stroke(color('green'));
      strokeWeight(4);
      line(this.vector.x,this.vector.y-2,this.vector.x+ (this.images[0].width * this.getHpL()),this.vector.y-2);
      noStroke();
      strokeWeight(1);





   }
}


class EnemyPoison extends Enemy
{

   constructor(h,start,image)
   {
      super(h,start,image);
      this.c = 0;
      this.prio = 2;
   }

   getName()
   {
      return "Poiser";
   }

   doStuff()
   {
      if (this.c++ % 5 == 0) return;

      let e = this.cell;
      let cells = getCells(e);
      for (let i=0;i<cells.length;i++)
      {


         if (cells[i] && cells[i].tower && !cells[i].tower.disabled)
         {
            if (getRndInteger(1,3)!=2) continue;

            skweakSound.play();
            cells[i].tower.disable();
         }

      }
   }

}

/////////////////////////////////////////

var eState =
{
   SEARCH : 0,
   DRILL : 1,
   PULL_UP : 2,
   DONE : 3,
   THINK : 4,


}


class EnemySeeker extends Enemy
{

   constructor(h,start,image)
   {
      super(h,start,image);

      this.dstate = eState.SEARCH;
      this.goal  = null;
      this.aim = createVector(1,0);
      this.dlength = 10;
      this.prio = 2;
   }
   getName()
   {
      return "Seekwer";
   }

   doOnReachEnd()
   {
      if (this.speed == 0) return;
      /*   if(this.dstate == eState.DONE)
      {
      enemies_escaped += 1

      this.remove = true;
      this.speed = 0;

      return;
   }

   */

   let e = this.getCellAtMe();
   if (Statics.exitCells.includes(e))
   {
      g_enemies_escaped += 1


      this.remove = true;
      this.speed = 0;


      return;
   }

   this.speed = 0;


   let ok=false;

   let cells = getCells(e);
   for (let i=0;i<cells.length;i++)
   {
      if (cells[i] && cells[i].tower && cells[i].tower==this.goal) {ok=true;break;}
   }

   this.dstate = ok?eState.DRILL:eState.THINK;
}

aimAt()
{
   if (!this.goal) return;
   if (this.dlength!=10 ) return;
   let dir = p5.Vector.sub(this.goal.position,this.vector);

   dir.y *=-1;
   this.aim = dir;
   this.aim.normalize();


}

doStuff()
{

   //if (this.speed==0)
   {
      //if (this.dstate === eState.SEARCH)
      this.aimAt();
      if (this.dstate === eState.THINK)
      {
         this.goal = null;
         this.manager.findTower(this);
         this.speed= 40;
         this.dstate =eState.SEARCH;

      }

      else if (this.dstate === eState.DRILL)
      {
         this.dlength+=1;
         if (this.dlength > 25)
         {
            this.doOnDrillDone();

            this.dstate = eState.PULL_UP;

         }

      }
      else if (this.dstate === eState.PULL_UP)
      {
         this.dlength-=3;
         if (this.dlength < 11)
         {

            this.doOnPulledUp();
         }
      }

   }
}

doDraw()
{
   //draw aim
   //if (this.speed==0)
   {


      stroke(color('red'));
      strokeWeight(3);
      line(this.vector.x+10,this.vector.y+10,this.vector.x+10 + this.aim.x*this.dlength,this.vector.y+10-this.aim.y*this.dlength);
      noStroke();
      strokeWeight(1);

   }


}
doOnPulledUp()
{
   this.dstate = eState.DONE;

   this.end = Statics.exitCells[0];
   this.normalExits = true;
   this.goal  =null;

   //cleanUp(this.ind);
   this.speed = 40;
   this.calcRoute();
}

doOnDrillDone()
{
   skweakSound.play();
   this.goal.disable();
}
}

///////////////////////////////////
class EnemySeeker2 extends EnemySeeker
{

   constructor(h,start,image)
   {
      super(h,start,image);
   }
   getName()
   {
      return "SeekwerBomb";
   }

   doOnPulledUp()
   {
      this.dstate = eState.THINK;
   }
   doOnDrillDone()
   {
      ///   skweak.play();
      removeTower(this.goal.i,this.goal.j);

      //this.goal.disable();
   }
}
//////////////////////
class EnemyPlane
{

   constructor(h,start,image)
   {
      this.speed = 25;
   //   this.x = getX(start.i);
      //this.y = getY(start.j);
      this.i = start.i;
      this.vector = createVector( gameMap.getX(start.i),gameMap.getY(start.j));

      this.direction = start.i==0?createVector(1,0):createVector(0,1);
      this.manager=h;
      this.time=0;
      this.hp=8;
      this.points = 5;
      this.startHp = 10;
      this.images = image;
      this.remove  =false;
      this.friction = [];
      this.prio = 1;
   }

   getCellAtMe()
   {
      let i = gameMap.getI(this.vector.x);
      let j = gameMap.getJ(this.vector.y);
      return  gameMap.getCell(i,j);
   }

   getName()
   {
      return "Flier";
   }

   damage(z)
   {
      if (this.remove) return false;
      this.hp -=z;
      if (this.hp<=0)
      {
         g_points +=this.points;
         g_total_score += this.points;
         this.remove = true;


      }

      return true;
   }

   getPathLength()
   {
      return 1;
   }

   slowed()
   {
      return this.friction.length > 0;
   }


   slowDown(d,t,p)
   {
      //if (this.friction.length>1) return;
      this.friction.push( { dist:d, time:this.time ,s:t, who:p } );

   }

   isInFriction(p)
   {
      for (let i=0;i<this.friction.length;i++)
      {
         if (this.friction[i].who == p) return true;
      }
      return false;
   }

   handleFriction(distance)
   {
      if (this.friction.length>0)
      {
         let x = p5.Vector.mult(this.direction,-1);

         for (let i=0;i<this.friction.length;i++)
         {
            let b = distance * (this.friction[i].dist/100);

            let dd = p5.Vector.mult(x,b);
            distance-=b;
            if (distance>0)
            {
               this.vector.add(dd);
            }

         }


         for (let i=0;i<this.friction.length;i++)
         {

            if ( this.time - this.friction[i].time > this.friction[i].s)
            {
               removeFromArray2(this.friction,this.friction[i]);
               break;
            }
         }

      }
   }

   update(dtime)
   {
      if (this.remove) return;
      this.time+=dtime;

      let dist = dtime/1000.0 * this.speed;

      let distance = min(dist,Statics.getMaxMovement());

      let d = p5.Vector.mult(this.direction,distance);

      this.vector.add(d);

      this.handleFriction(distance);

      let c = this.getCellAtMe();
      if (!c)
      {
         applauseSound.play();
         this.remove = true;
         g_enemies_escaped += 1;
      }

   }



   getHpL()
   {
      if (this.hp === this.startHp) return 1;
      let d = this.hp / this.startHp;
      return d;


   }



   show()
   {
      if (this.remove) return;
      if (this.i==0)
      {
         push();
         translate(this.vector.x+this.images.width/2,this.vector.y+this.images.height /2);
         rotate(HALF_PI*3)
         imageMode(CENTER);
         image(this.images,0,0);
         pop();
      }
      else
      {
         image(this.images,this.vector.x,this.vector.y);
      }


      stroke(color('green'));
      strokeWeight(3);
      line(this.vector.x,this.vector.y-2,this.vector.x+ (this.images.width * this.getHpL()),this.vector.y-2);
      noStroke();
      strokeWeight(1);





   }
}
