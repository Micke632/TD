



class Bullet
{
   constructor(x,y,aim,r)
   {

      this.speed = 300;
      this.remove = false;

      this.range = r;
      if (r==0)
         this.range = Statics.getDefaultRange();
      this.aim = createVector(aim.x,-aim.y);
      this.aim.normalize();
      this.vector = createVector(0,0);
      this.towervector = createVector(x,y);

      this.color = color(55,244,244,222);
      this.pizelSize = 3;
      this.moveMent  = 0;
      this.x = 0;
      this.y = 0;

   }

   set(x,y,aim,r, color, pixelSize, moveMent,speed)
   {

      this.range = r;
      if (r==0)
         this.range = Statics.getDefaultRange();

      this.aim.x = aim.x;
      this.aim.y = -aim.y;
      this.aim.normalize();
      this.vector.x = 0;
      this.vector.y = 0;
      this.towervector.x = x;
      this.towervector.y = y;

      this.remove = false;
      this.color = color;
      this.pizelSize = pixelSize;
      this.moveMent  = moveMent;
      this.speed = speed;
      this.x = 0;
      this.y = 0;

   }

   update(dtime)
   {
      if (this.remove) return;

      let distance = dtime/1000.0 * this.speed;

      let d = p5.Vector.mult(this.aim,distance);
      this.vector.add(d);

      if ( this.vector.mag() > this.range )
      {
         this.remove = true;
         return;
      }
      let x = p5.Vector.add(this.towervector,this.vector);
      //this.towervector.add(this.vector);
      this.x = x.x;//this.towervector.x;
      this.y = x.y;//this.towervector.y;

      if (this.x > width - SIDE || this.y  > height - TOP  || this.x <0 || this.y <0)
         this.remove = true;
      else
         this.doUpdate()
   }

   doUpdate()
   {
      if ( this.moveMent > 0)
      {
         this.x  += getRndInteger(-this.moveMent ,this.moveMent );
         this.y += getRndInteger(-this.moveMent ,this.moveMent );
      }
   }

   show()
   {
      if (this.remove) return;
      fill(this.color);
      rect(this.x ,this.y,this.pizelSize,this.pizelSize);
   }
}




class BulletHandling
{
   constructor()
   {
      this.bullets = [];
      for (let i=0;i<1000;i++)
      {
         this.bullets.push(new Bullet(0,0,createVector(1,1)));
      }


      this.last=0;

   }

   create(x, y, aim, r, color, pixelSize, moveMent, speed)
   {
      if (this.last == this.bullets.length)
      {
          this.erase(true);      //try erase one bullet
          if (this.last == this.bullets.length)
          {
            // could not erase, add a new
            this.bullets.push(new Bullet(0,0,createVector(1,1)));
            this.last+=1;
         }
      }
      this.bullets[this.last++].set(x,y,aim,r,color,pixelSize, moveMent, speed);

   }




   erase(eraseOne)
   {

      for (let i=0;i<this.last;i++)
      {
         if (this.bullets[i].remove)
         {
            //swap and "pop"
            let temp = this.bullets[i];
            this.bullets[i] = this.bullets[this.last-1];
            this.bullets[this.last-1] = temp;
            this.last-=1;

            if (eraseOne)
               break;

            //keep erasing
            this.erase(eraseOne);
        }
      }
   }



   updateAndShow(dtime)
   {
      for (let i=0;i<this.last;i++)
      {
         this.bullets[i].update(dtime);
         this.bullets[i].show();
      }
   }




}








function Tower(i,j,img)
{


   {
      this.i = i;
      this.j = j;
      this.tower_score = 0;
      this.selected = false;
      this.fireSpeed = 1500 ;
      this.lastFire = 0;
      this.time = 0;
      this.x = gameMap.getX(this.i);
      this.y = gameMap.getY(this.j);

      this.aimSpeed = 0.1;
      this.turretDirection = p5.Vector.random2D();
      this.targetDirection = createVector(1,0);
      this.position = createVector( this.x+ CELL_WIDTH,this.y + CELL_HEIGHT );
      this.currentEnemy = null;
      this.range = Statics.getDefaultRange();
      this.count=0;
      this.hit=1;
      this.level =1;
      this.cost=2;
      this.upgradeCost = 10;
      this.aimLength = ceil(CELL_WIDTH / 2);
      this.name = "SimpleTower";
      this.img = img;
      this.hitBooster= new Map();
      this.best = false;
      this.disabled = false;
      this.updateTime = 0;
      this.repairTime=0;
      this.spent = this.cost;
      this.removeTime = 0;
      this.remove = false;
      this.kills = 0;
      this.text="";
      this.findTargetRate=5;
      this.veteran  =false;
      this.type  = 0 ;
      this.prio  =0;
      this.ee = [];
      this.notifyVector = null;
      this.from = null;


   }
};

Tower.prototype.getName = function()
{
   return this.name;
}
Tower.prototype.getUpgradeCost = function()
{
   return this.upgradeCost;
}
Tower.prototype.getPrio = function()
{
   return this.prio;
}
Tower.prototype.getLevel = function()
{
   return this.level;
}

//let a  =this.getPrio();
Tower.prototype.fireModeDesc  =function()
{
   let a = this.getPrio();
   let fireModeS = "Default";
   if (a==1)
   {
      fireModeS = "Highest Prio";
   }
   else if (a==2)
   {
      fireModeS = "Closest exit";
   }
   return fireModeS;
}


Tower.prototype.getDescription = function()
{


   let n = this.getName();
   let s = this.tower_score;
   let l = this.getLevel();
   let c = this.getUpgradeCost();
   let k = this.kills;
   let d = this.doGetInfo()

   let print = n + "\nScore: " + int(s) + "\nLevel: " + l + "\nUpgrade: " + c + "\nKills: "+k +d;
   if (this.veteran)
   {
      print +="\nVeteran";
   }
   return print;

}
Tower.prototype.doGetInfo = function()
{

   let h = this.getHitPoint();
   let f = this.getFireSpeed();
   let r = this.getRange();
   let a = this.getAimSpeed();

   let print ="\nHitPoint: " + int(h) + "\nRange: "+int(r)+"\nReload: "+f/1000 + "\nAimSpeed: "+a.toFixed(2);

   return print;
}


Tower.prototype.getHitPoint = function()
{
   let l = this.hit;

   for (let value of this.hitBooster.values()) {
      l+= (value * 2);
   }
   if (this.veteran)
   {
      l+=1;
   }

   return l;
}

Tower.prototype.getAimSpeed = function()
{
   let l = this.aimSpeed;
   let d  =15;
   if (l < 0.1)
   {
      d=25;
   }

   for (let value of this.hitBooster.values()) {
      l+=  float( value /d );
   }

  if (this.veteran)
  {
    l+= 0.1;
  }

  return l;

}



Tower.prototype.getFireSpeed = function()
{
   let l =  this.fireSpeed;

   for (let value of this.hitBooster.values()) {
      l-= (value*50);
   }

  if (this.veteran)
  {
    l-=100;
  }

   return l;
}

Tower.prototype.getRange = function()
{
   return this.range;
}

Tower.prototype.getCost = function()
{
   return this.cost;
}

Tower.prototype.upgrade = function()
{
   if(this.level >=4) return;
   if (this.disabled) return;
   if (this.updateTime) return;
   if (g_points < this.upgradeCost ) return;
   g_points-= this.upgradeCost;
   this.spent+=this.upgradeCost;
   this.level +=1;


   this.doUpgrade();

   this.updateTime = this.time;

}

Tower.prototype.canUpgrade = function()
{
   if(this.level >=4) return false;
   return g_points>= this.upgradeCost;
}

Tower.prototype.canRepair = function()
{
   if (this.disabled && this.repairTime == 0) return true;

   return false;
}

Tower.prototype.canChangeFireMode  =function()
{
   return false;
}

Tower.prototype.initRemoveTower = function()
{
   if (this.disabled) return;

   if (this.removeTime  > 0)
   {
      this.removeTime  = 0;
   }
   else
   {
      this.removeTime = this.time;
   }

}


Tower.prototype.repair = function()
{
   if (!this.disabled) return;
   if (this.repairTime) return;
   if (g_points < this.spent/4 ) return;
   g_points-= this.spent/4;

   this.repairTime = this.time;
}

Tower.prototype.boost = function(by,lvl)
{

   this.hitBooster.set(by,lvl);

}

Tower.prototype.removeBoost = function(by)
{

   this.hitBooster.remove(by);

}

Tower.prototype.doUpgrade = function()
{
   this.hit+=1;

   this.upgradeCost += 15;
}

Tower.prototype.changePrio = function()
{
   if (this.prio==0)
   {
      this.prio=1;
   }
   else if (this.prio==1)
   {
      this.prio=2;
   }
   else if (this.prio==2)
   {
      this.prio=0;
   }
}


Tower.prototype.fire = function()
{

   {

      let h = this.getHitPoint();
      if (this.currentEnemy.damage(h )){
         this.tower_score+=h;

         if (this.currentEnemy.remove)
         {
            this.kills+=1;
            this.tower_score+=5;

            if ( !this.veteran && this.level >= 4 && this.kills > 60 && this.tower_score > 14000)
            {
               this.veteran  =true;

               g_headlines.push("One of your towers are now a veteran..");
            }
         }
      }
      //if (this.selected)
         //gun_fire.play();

      bulletHandler.create(this.position.x,this.position.y,this.turretDirection,this.getRange(), color(55,244,244,222),2,0,300);

   }

   if (!this.currentEnemy.remove)
      this.notifyNeighborTower();
}


Tower.prototype.notify =  function(vector,from)
{
   //console.log("thanks");
   let dir = p5.Vector.sub(vector,this.position);

   dir.y *=-1;

   this.notifyVector = dir;
   this.notifyVector.normalize();
   this.from = from
   this.notifyTime = this.time;
}

Tower.prototype.notifyNeighborTower= function()
{

}

Tower.prototype.findTarget = function()
{





   for (let i=0;i<g_enemies.length;i++)
   {
      let e = g_enemies[i];
      if (e.remove) continue;
      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= this.getRange()+10 )
      {


         if (this.getPrio() == 0)
         {
            this.currentEnemy = e;
            return;
         }
         else
         {
            this.ee.push({enem:e,dist:dir.mag()}) ;
         }

      }



   }

   for (let i=0;i<g_planes.length;i++)
   {
      let e = g_planes[i];
      if (e.remove) continue;
      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= this.getRange() +10 )
      {



      //   if (this.getPrio() == 0)
         {
            this.currentEnemy = e;
            return;
         }
         //else
         {
            //this.pp.push(e) ;
         }


      }

   }
   //planes always highest prio
   /*if (this.pp.length)
   {
      if (this.currentEnemy==null)
      {
         this.currentEnemy = this.pp[0];
      }

      return;
   }
   */
   if (this.ee.length)
   {
      if (this.getPrio() == 1)
      {
         this.ee.sort(function(a,b) {

            return a.enem.prio - b.enem.prio ;

         });


         if (!this.currentEnemy || (this.ee[0].enem.prio < this.currentEnemy.prio))
         {
            this.currentEnemy = this.ee[0].enem;
         }
      }
      else {
         //closest to exit

         this.ee.sort(function(a,b) {

            let x =  a.enem.getPathLength() - b.enem.getPathLength() ;
            return x;
         });


         this.currentEnemy = this.ee[0].enem;




      }
   }



   this.ee.length  = 0;
}

Tower.prototype.aimAtFromNotify = function(v)
{

   let angle = this.turretDirection.angleBetween(v);
   if (angle < 0.3) return;


   {
      this.turretDirection = this.slerp(this.turretDirection,v,this.getAimSpeed(), angle);
      this.turretDirection.normalize();
   }


}

Tower.prototype.supportSlerp  =function()
{
   return true;
}


Tower.prototype.aimAt = function(e, newTarget)
{
   let dir = p5.Vector.sub(e.vector,this.position);

   let mag = dir.mag();

   dir.y *=-1;
   this.targetDirection = dir;
   this.targetDirection.normalize();

   let angle = this.turretDirection.angleBetween(this.targetDirection);


   let close  = mag < CELL_WIDTH*2;

   if (angle == 0 || !this.supportSlerp() || (close && (angle <  0.3) ))
   {
      this.turretDirection.x = this.targetDirection.x;
      this.turretDirection.y = this.targetDirection.y;
   }
   else {
      this.turretDirection = this.slerp(this.turretDirection,this.targetDirection,this.getAimSpeed(), angle);
      this.turretDirection.normalize();

   }


   return mag;
}




Tower.prototype.slerp = function(vectorA, vectorB, t, angle)
{


    let v = p5.Vector.mult(vectorA,Math.sin((1 - t) * angle));
    let v2 = p5.Vector.mult(vectorB,Math.sin( t * angle));
    v.add(v2);

    return v.div( Math.sin(angle));

}


Tower.prototype.canFire = function()
{
   let angle = this.turretDirection.angleBetween(this.targetDirection );
   if (angle < 0.15) return true;
   return false;
}

Tower.prototype.getUpdateTime= function()
{
   return 2000*this.level;
}
Tower.prototype.getRepairTime= function()
{
   return 5000*this.level;
}
Tower.prototype.getRemoveTime = function()
{
   return 120*currentLevel;
}

Tower.prototype.getPrio = function(timed)
{
   return this.prio;
}

Tower.prototype.update = function(timed)
{
   if (this.remove) return;
   this.time+=timed;
   this.count++;
   if (!this.currentEnemy  &&  !this.notifyVector && ( this.count % this.findTargetRate  != 0 ) )
   {
      return;
   }


   if (this.updateTime)
   {
      if (this.time - this.updateTime > this.getUpdateTime())
      {
         this.updateTime  = 0;
         positiveSound.play();
      }
      return;
   }
   else if (this.repairTime)
   {
      if (this.time - this.repairTime > this.getRepairTime())
      {
         this.repairTime  = 0;
         this.disabled = false;
         positiveSound.play();
      }
      return;
   }
   else if (this.removeTime)
   {

      if (this.time - this.removeTime > this.getRemoveTime())
      {
         removeTower(this.i,this.j);
         this.remove  =true;
         this.removeTime = 0;
         return;
      }
   }

   if (this.disabled) return;

   let noEnemy = this.currentEnemy?false:true ;

   if ( noEnemy ||  this.getPrio()!=0  )
   {
      this.findTarget();
   }




   if (this.count % 200 == 0)
   {
      this.hitBooster.clear();
   }

   if (this.currentEnemy )
   {
      this.notifyVector=null;

      let r = this.aimAt(this.currentEnemy, noEnemy);

      if ( this.currentEnemy.remove  || r > (this.getRange()+10) )
      {
         this.currentEnemy = null;
      }
      else if ( this.time - this.lastFire  >= this.getFireSpeed() ) {
         if (this.canFire()) {
            this.fire();
            this.lastFire = this.time;
         }
      }


   }
   else if (this.notifyVector!=null)
   {
         //console.log("aiming");
      this.aimAtFromNotify(this.notifyVector);

      if (this.time - this.notifyTime > 2000)
      {
         this.notifyVector = null;
         this.from = null;
      }


  }

}

Tower.prototype.disable = function()
{
   this.disabled = true;
}

Tower.prototype.show = function()
{


   if (this.remove) return;


   {
      image(this.img,this.x,this.y);


      if (this.selected)
      {
         let xx = this.x+CELL_WIDTH*2;
         let yy = this.y+CELL_HEIGHT*2;
         stroke(255);
         line(this.x,this.y,xx,this.y);
         line(this.x,yy,xx,yy);
         noStroke();
      }
      if (this.best)
      {
         let xx = this.x+CELL_WIDTH*2;
         let yy = this.y+CELL_HEIGHT*2;
         stroke(color('green'));
         strokeWeight(3);
         line(this.x,this.y,this.x,yy);
         line(xx,this.y,xx,yy);
         noStroke();
         strokeWeight(1);
      }
      if (this.disabled)
      {
         let xx = this.x+CELL_WIDTH*2;
         let yy = this.y+CELL_HEIGHT*2;
         stroke(color('red'));
         strokeWeight(2);
         line(this.x,this.y,xx,yy);
         line(xx,this.y,this.x,yy);
         noStroke();
         strokeWeight(1);
      }
      else if (this.removeTime)
      {
            let xx = CELL_WIDTH*2;

            let x =  (this.time - this.removeTime ) / this.getRemoveTime()  ;
            let l =  xx * min(1,x) ;

            //console.log(l);

            stroke(color('red'));
            strokeWeight(3);

            line(this.x,this.y-2,this.x +  l,this.y-2);
            noStroke();
            strokeWeight(1);
      }

      else if (this.updateTime)
      {
            let xx = CELL_WIDTH*2;

            let x =  (this.time - this.updateTime ) / this.getUpdateTime()  ;
            let l =  xx * min(1,x) ;

            stroke(color('blue'));
            strokeWeight(2);

            line(this.x,this.y-2,this.x +  l,this.y-2);
            noStroke();
            strokeWeight(1);
      }

      else if (this.repairTime)
      {
            let xx = CELL_WIDTH*2;

            let x =  (this.time - this.repairTime ) / this.getRepairTime()  ;
            let l =  xx * min(1,x) ;

            stroke(color('white'));
            strokeWeight(2);

            line(this.x,this.y-2,this.x +  l,this.y-2);
            noStroke();
            strokeWeight(1);
      }

      if (this.level>1)
      {
         let xx = this.x+CELL_WIDTH-10;
         let yy = this.y+CELL_HEIGHT+5;
         if (this.veteran)
         {
            stroke(color('red'));
         }
         else {
            stroke(255);
         }
         strokeWeight(2);
         for (let i=1;i<=this.level;i++)
         {
            line(xx+(i*3),yy,xx+(i*3),yy+10);
         }


         noStroke();
         strokeWeight(1);
      }


   }

   this.doShow();
}

Tower.prototype.doShow = function()
{
   if (this.text)
   {
      textSize(CELL_WIDTH*2);
      fill(color('white'));
      text(this.text,this.x+CELL_WIDTH- 5,this.y+CELL_HEIGHT+10);
   }


   let xx = this.x+CELL_WIDTH;
   let yy = this.y+CELL_HEIGHT;
   stroke(0);
   strokeWeight(this.level);
   line(xx,yy,xx + this.turretDirection.x*this.aimLength,yy-this.turretDirection.y*this.aimLength);
   noStroke();
   strokeWeight(1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////


function Tower2(i,j,img)
{

   Tower.call(this,i,j,img);

   this.hit=2;
   this.cost = 15;
   this.name="RangerTower";
   this.upgradeCost = 20;
   this.fireSpeed = 1000;
   this.findTargetRate=3;
   this.range= Statics.getDefaultRange()+5;
   this.type  = 1;
   this.aimSpeed = 0.25;
}


Tower2.prototype = Object.create(Tower.prototype);
Tower2.prototype.constructor = Tower2;

Tower2.prototype.canChangeFireMode  =function()
{
   return true;
}

Tower2.prototype.doUpgrade = function()
{

   if (this.level === 3)
   {
      this.hit+=4;
      this.upgradeCost += 250;
      this.range+=15;
      this.aimSpeed+=0.05;
   }
   else if (this.level === 4)
   {
      this.hit+=5;
      this.range += 15;
      this.aimSpeed+=0.05;
      //this.upgradeCost=0;
      //this.fireSpeed -=100;
   }
   else if (this.level === 2)
   {
      this.hit+=3;
      this.upgradeCost += 100;
      this.range+=12;
   }


   this.fireSpeed -=100;

}


Tower2.prototype.notifyNeighborTower= function()
{
   //console.log("notifyNeighborTower");
   let c1 = gameMap.getCell(this.i-1,this.j);
   let c2 = gameMap.getCell(this.i,this.j-1);
   let c3 = gameMap.getCell(this.i+2,this.j);
   let c4 = gameMap.getCell(this.i,this.j+2);
   this.notifyTower(c1);
   this.notifyTower(c2);
   this.notifyTower(c3);
   this.notifyTower(c4);
}

Tower2.prototype.notifyTower = function(cell)
{
   if ( (cell && cell.tower) && (cell.tower != this.from)  && (cell.tower.type==1)  && !cell.tower.notifyVector)
   {
      cell.tower.notify(this.currentEnemy.vector.copy(),this);
   }

}

Tower2.prototype.doGetInfo = function()
{
   let h = this.getHitPoint();
   let f = this.getFireSpeed();
   let r = this.getRange();
   let a = this.getAimSpeed();

   let print ="\nHitPoint: " + int(h) + "\nRange: "+int(r)+"\nReload: "+f/1000 + "\nAimSpeed: "+a.toFixed(2);

   let s = this.fireModeDesc();

   print = print + "\nF.Mode:"+s;
   return print;
}



/* Tower2.prototype.doShow = function()
{
//draw aim
let x = getX(this.i);
let y = getY(this.j);
let xx = x+CELL_WIDTH;
let yy = y+CELL_HEIGHT;
stroke(0);
strokeWeight(2);
line(xx,yy,xx + this.aim.x*this.aimLength,yy-this.aim.y*this.aimLength);
noStroke();
strokeWeight(1);
}
*/

//////////////////////////////////////////////////////////////////////////////////////////////////


function TowerSniper(i,j,img)
{

   Tower.call(this,i,j,img);

   this.hit=10;
   this.cost = 100;
   this.name="SnipeTower";
   this.upgradeCost = 50;
   this.fireSpeed = 2500;
   this.range=Statics.getDefaultRange()*3;
   this.findTargetRate=5;
   this.type  = 6;
   this.prio = 1;
   this.aimSpeed = 0.05;
}


TowerSniper.prototype = Object.create(Tower.prototype);
TowerSniper.prototype.constructor = TowerSniper;


TowerSniper.prototype.canChangeFireMode  =function()
{
   return true;
}

TowerSniper.prototype.doGetInfo = function()
{
   let h = this.getHitPoint();
   let f = this.getFireSpeed();
   let r = this.getRange();
   let a = this.getAimSpeed();

   let print ="\nHitPoint: " + int(h) + "\nRange: "+int(r)+"\nReload: "+f/1000 + "\nAimSpeed: "+a.toFixed(2);

   let s = this.fireModeDesc();

   print = print + "\nF.Mode:"+s;
   return print;

}



TowerSniper.prototype.doUpgrade = function()
{

   if (this.level === 3)
   {
      this.hit+=1;
      this.upgradeCost += 250;
      this.range+=10;
      this.aimSpeed+=0.01;
   }
   else if (this.level === 4)
   {
      this.hit+=2;
      this.range += 10;
      this.aimSpeed+=0.01;

   }
   else if (this.level === 2)
   {
      this.hit+=1;
      this.upgradeCost += 100;
      this.range+=15;
   }


   this.fireSpeed -=200;



}



///////////////////////////////////////
function Tower3(i,j,img)
{

   Tower.call(this,i,j,img);

   this.hit=3;

   this.name="StunTower";
   this.range  = Statics.getDefaultRange() - CELL_WIDTH;
   this.myenemies = [];
   this.cost = 100;
   this.upgradeCost = 100;
   this.fireSpeed = 1500;

   this.stunChance = 5;
   this.findTargetRate=3;
   this.type  = 3 ;

}


Tower3.prototype = Object.create(Tower.prototype);
Tower3.prototype.constructor = Tower3;

Tower3.prototype.getStunChance= function()
{
   return 1/this.stunChance *100;
}



Tower3.prototype.doGetInfo = function()
{

   let h = this.getHitPoint();
   let f = this.getFireSpeed();
   let r = this.getRange();
   let d = this.getStunChance();
   let print ="\nHitPoint: " + int(h) + "\nRange: "+int(r)+"\nReload: "+f/1000 + "\nStun:"+int(d)+"%";

   return print;
}

Tower3.prototype.canFire = function()
{
   return true;
}

Tower3.prototype.supportSlerp  =function()
{
   return false;
}


Tower3.prototype.findTarget = function()
{
   this.myenemies.length = 0;


   for (let i=0;i<g_enemies.length;i++)
   {
      let e = g_enemies[i];
      if (e.remove) continue;
      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= this.getRange()  )
      {

         this.currentEnemy  = e;
         this.myenemies.push(e);

      }
   }
}

Tower3.prototype.addHeat = function()
{

   bulletHandler.create(this.position.x,this.position.y,this.turretDirection ,this.getRange(),color(240,0,0,222),4,2 ,50);
   let v = this.turretDirection.copy();
   for (let i=0;i<15;i++)
   {
      v.rotate(0.10);
      bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(240,0,0,222),4,2 ,50);
   }


}



Tower3.prototype.getSlowDown = function()
{
   if (this.veteran) return 85;

   return 80;
}

Tower3.prototype.fire = function()
{

  if (this.selected)
      aeaSound.play();

   this.addHeat();

   let h = this.getHitPoint();

   for (let i=0;i<this.myenemies.length;i++)
   {

      if (this.myenemies[i].damage(h ))
      {
         if (this.myenemies[i].remove)
         {
            this.kills+=1;
            this.tower_score+=5

            if ( !this.veteran &&  this.level >= 4  && this.kills > 60 && this.tower_score > 14000)
            {
               this.veteran  =true;
               g_headlines.push("One of your towers are now a veteran..");
            }

         }
         if (getRndInteger(0,this.stunChance)==1)
         {
            if (this.selected)
               swoshSound.play();
            this.myenemies[i].slowDown(this.getSlowDown(),1200,this);

            this.tower_score+=h/2;

            bulletHandler.create(this.position.x,this.position.y,this.turretDirection,this.getRange(),color(0,0,240,222),3,3,60 );
            //bullets.push(new Wind(this.position.x,this.position.y,this.aim));
            let v = this.turretDirection.copy();
            v.rotate(0.10);
            //bullets.push(new Wind(this.position.x,this.position.y,v));
            bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,3,60 );
            v.rotate(0.10);
            //bullets.push(new Wind(this.position.x,this.position.y,v));
            bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,3,60 );
            v.rotate(0.10);
            //bullets.push(new Wind(this.position.x,this.position.y,v));
            bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,3,60 );
         }

         this.tower_score+=h;


      }
   }



}

Tower3.prototype.doUpgrade = function()
{

   if (this.level === 4)
   {
      this.hit+=3;
      //this.upgradeCost=0;
      this.fireSpeed-=300;
   }
   else if (this.level === 3)
   {
      this.hit+=1;
      this.upgradeCost += 200;
      this.fireSpeed-=100;
   }
   else
   {
      this.hit+=1;
      this.upgradeCost += 100;
      this.fireSpeed-=100;
   }

   this.stunChance -=1;



}

/////////////////////////////
function TowerSlow(i,j,img)
{

   Tower.call(this,i,j,img);


   this.name="FrictionTower";
   this.range  = Statics.getDefaultRange();
   this.upgradeCost = 50;
   this.fireSpeed = 1200;

   this.last = null;
   this.cost = 50;
   this.findTargetRate=3;
   this.enem = [];
   this.type  = 5;

}


TowerSlow.prototype = Object.create(Tower.prototype);
TowerSlow.prototype.constructor = TowerSlow;

TowerSlow.prototype.doGetInfo = function()
{


   let r = this.getRange();
   let h = this.getHitPoint();
   let f = this.getFireSpeed();

   let print = "\nRange: "+int(r) +"\nFriction:"+int(h)+"%";
   print += "\nReload: "+f/1000;

   return print;
}

TowerSlow.prototype.supportSlerp  =function()
{
   return false;
}


TowerSlow.prototype.canFire = function()
{
   return true;
}

TowerSlow.prototype.findTarget = function()
{

   this.enem.length  =0;


   for (let i=0;i<g_enemies.length;i++)
   {
      let e = g_enemies[i];
      if (e.remove) continue;
      if (!e.canBeSlowed()) continue;
      if (e.isInFriction(this))
      {
         //If this tower is already adding friction, find a new enemy
         if (e==this.currentEnemy)
            this.currentEnemy = null;
         continue;
      }

      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= (this.getRange() +10))
      {

         dir.normalize();
         dir.y *=-1;
         this.turretDirection = dir;
         this.currentEnemy = e;

         this.enem.push(e);


      }

   }




   for (let i=0;i<g_planes.length;i++)
   {
      let e = g_planes[i];
      if (e.remove) continue;
      if (e.isInFriction(this))
      {

         if (e==this.currentEnemy)
            this.currentEnemy = null;
         continue;
      }
      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= (this.getRange()+10))
      {

         dir.normalize();
         dir.y *=-1;
         this.turretDirection = dir;
         this.currentEnemy = e;


         this.enem.push(e);


      }

   }

   if (this.enem.length>1)
   {
      for (let i=0;i<this.enem.length;i++)
      {
         if (!this.enem[i].slowed())
         {
            this.currentEnemy = this.enem[i];
            return;
         }
      }

   }


}

//hit means friction for this tower
TowerSlow.prototype.getHitPoint = function()
{
   let l = this.level*15;

   for (let value of this.hitBooster.values()) {
      l+=(value*2);
   }

   if (this.veteran)
   {
      l+=5;
   }

   return l;
}

TowerSlow.prototype.doShow = function()
{

}


TowerSlow.prototype.fire = function()
{
   //this.findTarget();
   {

      if (this.currentEnemy && !this.disabled)
      {
         if (this.selected)
            swoshSound.play();

         let h = this.getHitPoint();
         this.currentEnemy.slowDown(h,3000,this);

         this.tower_score+=h/2;

         if ( !this.veteran &&  this.level >= 4  &&  this.tower_score > 16000)
         {
            this.veteran  =true;
            g_headlines.push("One of your towers are now a veteran..");
         }

         bulletHandler.create(this.position.x,this.position.y,this.turretDirection,this.getRange(),color(0,0,240,222),3,2 ,60);
         let v = this.turretDirection.copy();
         v.rotate(0.10);
         bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,2,60 );
         v.rotate(0.10);
         bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,2 ,60);
         v.rotate(0.10);
         bulletHandler.create(this.position.x,this.position.y,v,this.getRange(),color(0,0,240,222),3,2 ,60);
      }
      this.currentEnemy = null;
   }

}

TowerSlow.prototype.doUpgrade = function()
{


   {

      this.upgradeCost += 100;
      this.fireSpeed-=100;
      this.range+=5;
   }





}
///////////////////////////////////

function Tower4(i,j,img)
{

   Tower.call(this,i,j,img);

   this.hit=0;

   this.name="BoostTower";
   this.range = 0;
   this.cost=150;
   this.upgradeCost = 100;
   this.count = 0;
   this.type  = 4 ;
}


Tower4.prototype = Object.create(Tower.prototype);
Tower4.prototype.constructor = Tower4;

Tower4.prototype.doUpgrade = function()
{
   this.upgradeCost += 100;
}

Tower4.prototype.doGetInfo = function()
{


   let print = "\nBoost hitpoint: ";
   print += "\nBoost reload time:";
   print += "\nBoost aim speed: ";

   return print;
}

Tower4.prototype.update = function(timed)
{
   if (this.remove) return;
   this.time += timed;

   if (this.updateTime)
   {
      if (this.time - this.updateTime > this.getUpdateTime())
      {
         this.updateTime  = 0;
      }
      return;
   }
   else if (this.repairTime)
   {
      if (this.time - this.repairTime > this.getRepairTime())
      {
         this.repairTime  = 0;
         this.disabled = false;
      }
      return;
   }
   else if (this.removeTime)
   {
      if (this.time - this.removeTime > this.getRemoveTime())
      {
         removeTower(this.i,this.j);
         this.remove  =true;
         this.removeTime = 0;
         return;
      }
   }
   if (this.disabled) return;
   if (this.count++ % 20!=0 ) return;
   let e = gameMap.getCell(this.i,this.j);
   let cells = getCells(e);

   for (let i=0;i<cells.length;i++)
   {
      if (cells[i] && cells[i].tower)
      {
         cells[i].tower.boost(this,this.level);
      }

   }


}

Tower4.prototype.doShow = function()
{
   //draw range
   /*let x = getX(this.i);
   let y = getY(this.j);

   fill(200,200,200,100);

   rect( x-(CELL_WIDTH*2) ,y - (CELL_HEIGHT*2),  (CELL_WIDTH*6),(CELL_HEIGHT*6) );
   */
}

//////////////////////////////////////////////////////////////

function TowerAA(i,j,img)
{

   Tower.call(this,i,j,img);

   this.hit=6;
   this.fireSpeed = 500;
   this.name="AATower";
   this.range += 40;
   this.cost=100;
   this.upgradeCost = 75;
   this.findTargetRate=3;
   this.type  = 2 ;
   this.aimSpeed = 0.5;

}


TowerAA.prototype = Object.create(Tower.prototype);
TowerAA.prototype.constructor = TowerAA;

TowerAA.prototype.doUpgrade = function()
{
   this.upgradeCost += 100;
   this.hit+=2;
   this.range +=5;

}



TowerAA.prototype.findTarget = function()
{


   for (let i=0;i<g_planes.length;i++)
   {
      let e = g_planes[i];
      if (e.remove) continue;
      let dir = p5.Vector.sub(e.vector,this.position);

      if (dir.mag() <= this.getRange() + 10 )
      {

         this.currentEnemy  = e;
         return;
      }

   }


}

////////////////////////////////////


class TowerTool
{
   constructor()
   {

      this.disabled = false;

      this.imgT1 = t1Image;
      this.imgT1.resize(CELL_WIDTH*2,CELL_HEIGHT*2);
      this.imgT2 = t2Image;
      this.imgT2.resize(CELL_WIDTH*2,CELL_HEIGHT*2);
      this.imgT3 = t3Image;
      this.imgT3.resize(CELL_WIDTH*2,CELL_HEIGHT*2);
      this.imgT4 = t4Image;
      this.imgT4.resize(CELL_WIDTH*2,CELL_HEIGHT*2);
      this.imgT5 = t5Image;
      this.imgT5.resize(CELL_WIDTH*2,CELL_HEIGHT*2);

      this.imgT6 = t6Image;
      this.imgT6.resize(CELL_WIDTH*2,CELL_HEIGHT*2);

      this.imgT7 = t7Image;
      this.imgT7.resize(CELL_WIDTH*2,CELL_HEIGHT*2);

      this.t1 = new Tower(0,0,this.imgT1);
      this.t2 = new Tower2(0,0,this.imgT2);
      this.t3 = new TowerAA(0,0,this.imgT4);
      this.t4 = new Tower3(0,0,this.imgT3);
      this.t5 = new Tower4(0,0,this.imgT5);//boost
      this.t6 = new TowerSlow(0,0,this.imgT6);
      this.t7 = new TowerSniper(0,0,this.imgT7);
   }

   getTower(type)
   {

      switch(type)
      {
         case 0:{return this.t1;}
         case 1:{return this.t2;}
         case 2:{return this.t3;}
         case 3:{return this.t4;}
         case 4:{return this.t5;}
         case 5:{return this.t6;}
         case 6:{return this.t7;}
      }

      return null;
   }
   getInfo(tower)
   {

      let n = tower.getName();
      let c = tower.getCost();
      let print = n   + "\nCost:" +c;
      let stuntower = n == "StunTower" ;
      if ( stuntower || n == "RangerTower" || n== "SimpleTower" || n == "SnipeTower" || n=="AATower")
      {
         let h = tower.getHitPoint();
         let f = tower.getFireSpeed();
         let r = tower.getRange();

         print += "\nHit point: " + h + "\nRange: "+int(r)+"\nReload: "+(f/1000);


         if (!stuntower)
         {
            let a = tower.getAimSpeed();
            print+="\nAimSpeed:"+a.toFixed(2);
         }

      }
      if (stuntower)
      {
         print += "\nStun chance: "+tower.getStunChance()+"%";
         print += "\nStuns and hit all \nenemies in \nrange (not planes)";
      }
      if (n == "FrictionTower")
      {
         let h = tower.getHitPoint();
         print += "\nSlows down: "+h+"%";
         print += "\nMakes enemies \nmove slower";
      }
      if (n == "SimpleTower")
      {
         print += "\nCheap";
      }
      if (n == "RangerTower")
      {
         print += "\nUpgrades good.\nBig damage\ndealer";
      }
      if (n == "BoostTower")
      {
         let h = tower.getLevel()*2;
         print += "\nBoost towers: "+h;
         print += "\nMake surrounding \ntowers better: ";
      }
      if (n == "SnipeTower")
      {
         print += "\nLong range gun\nSlow reload and aim.";
      }
      if (n == "AATower")
      {
         print += "\nAnti Aircraft gun";
      }


      return print;

   }

   createTower(i,j,type, fromFile)
   {
      let cell = gameMap.getCell(i,j);

      let right = gameMap.getCell(i+1,j);

      let bottom = gameMap.getCell(i,j+1);
      if (!bottom ) return 0;
      let bottomright = gameMap.getCell(bottom.i+1,bottom.j);


      if (!cell || !right || !bottomright)  return 0;

      if (cell.tower || cell.hidden || cell.blocked) return 0;
      if (right.tower || right.hidden || right.blocked) return 0;
      if (bottom.tower || bottom.hidden || bottom.blocked) return 0 ;
      if (bottomright.tower || bottomright.hidden || bottomright.blocked) return 0;

      let t = null;
      if (type===0)
      {
         t = new Tower(i,j,this.imgT1);

      }
      else if (type===1)
      {
         t = new Tower2(i,j,this.imgT2);
      }
      else if (type===2)
      {
         t = new TowerAA(i,j,this.imgT4);
      }
      else if (type===3)
      {
         t = new Tower3(i,j,this.imgT3);
      }
      else if (type===4)
      {
         t = new Tower4(i,j,this.imgT5);
      }
      else if (type===5)
      {
         t = new TowerSlow(i,j,this.imgT6);
      }
      else if (type===6)
      {
         t = new TowerSniper(i,j,this.imgT7);
      }

      let cost = t.cost;
      if (!fromFile)
      {
         if (g_points < t.cost)
            return 0 ;
         g_points -= cost;
      }



      g_towers.push(t);

      gameMap.setTower(i,j,t);


      if (!enemyManager.calcRoute())
      {
         //blocked..
         removeTower(i,j);
         g_points += cost;
         return 1;
      }
      return 2;
   }




   show(cell)
   {


      let r = 0;

      let t = this.getTower(g_current_tower_type);

      if (cell.tower != null)
      {
         r = cell.tower.getRange();
         t = null;
      }
      else if (t != null)
      r = t.getRange();



      {
         if (cell.tower && (cell.tower.updateTime || cell.tower.disabled) )
         {
            fill(240,10,10,100);
         }
         else
         {
            fill(200,200,200,100);
         }




         ellipse(cell.x + CELL_WIDTH,cell.y + CELL_HEIGHT,r*2,r*2);


         // fill(0,255,0,100);
         if (t)
         image(t.img,cell.x,cell.y);



      }

   }
}

//module.exports.Empty = BulletHandling;
