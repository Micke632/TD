
class Component{

   constructor()
   {
      this.parent = null;
   }

   init() {}

   init2() {}

   doOnDead() {}

   update(delta) {}

   getType()  { }


   doOnReachEnd()
   {

   }

   receive(m,v){}

   get(m){}

}


class TransformComponent extends Component
{
   constructor()
   {
      super();
      this.x = 0;
      this.y = 0;

   }

   update(delta)
   {

   }

   transform(x,y)
   {
      this.x =x;
      this.y =y;
   }

   getX()
   {
      return this.x;
   }

   getY()
   {
      return this.y ;
   }

   after()
   {
   }
}


//rotate
class FlyingTransformComponent extends TransformComponent
{
   constructor(w,h)
   {
      super();
      this.w  =w;
      this.h  =h;
   }



   transform(x,y)
   {
      if (this.parent.i==0)
      {
         push();
         translate(x+ this.w/2, y+this.h /2);
         rotate(HALF_PI*3)
         imageMode(CENTER);
         this.x = 0;
         this.y = 0;
      }
      else {
         this.x = x;
         this.y = y;
      }

   }

   after()
   {
      if (this.parent.i==0)
      {
         pop();

      }

   }
}





class EnemyGraphicComponent extends Component
{
   constructor(images,hpComponent, transformComponent)
   {
      super();
      this.animateCounter=0;
      this.hpComponent = hpComponent;
      this.transformComponent = transformComponent;

      this.images = images;
      this.armorimages = null;
      this.w = this.images[0].width;

   }

   update(delta)
   {

      if (this.hpComponent.isArmor() && this.armorimages)
      {

         renderSystem.addRender(new RenderImage(this.armorimages[0],this.parent.vector.x,this.parent.vector.y,this.transformComponent));
      }
      else {

         renderSystem.addRender(new RenderImage(this.images[this.animateCounter],this.parent.vector.x,this.parent.vector.y,this.transformComponent));
         this.animateCounter++;
         if (this.animateCounter == this.images.length)
         {
            this.animateCounter=0;
         }
      }


      let l = this.hpComponent.getHpL();

      if (l>0)
      {

         renderSystem.addRender( new RenderHp(this.parent.vector.x,this.parent.vector.y,this.w,l));

      }
   }

}

class MoveableComponent extends Component
{

   constructor(w,h)
   {
      super();

      this.pathHelper = new PathHelper(new MazeWalker(Statics.exitCells),
                                 w,
                                 h,
                                 CELL_WIDTH,
                                 CELL_HEIGHT,
                                 function(){
                                    gameMap.resetPathInfo();
                                 },
                                 Statics.getMaxMovement()
                                 );

      this.friction = [];
      this.immune  =false;
   }


   init()
   {
         this.parent.register(this,messagesEnum.friction);
         this.parent.register(this,messagesEnum.route);

         this.calcRoute(true);
   }


   getType()
   {
      return componentEnum.movement;
   }

   receive(m,v)
   {
      if (m == messagesEnum.friction)
      {
         this.addFriction(v);
      }
      else if (m == messagesEnum.route)
      {
         return this.calcRoute(true);
      }

   }

   get(m)
   {
      if (m == messagesEnum.friction)
      {
         return this.IsSlowed();
      }

      return null;
   }


   calcRoute(exits)
   {

      if (!this.pathHelper.calcRoute(this.parent.cell, this.parent.end, exits))
      {
         return false;
      }

      this.makeDirectionFrom(this.pathHelper.getDirection());

      return true;

   }


   makeDirectionFrom(d)
   {

         if (d == 0)
         {
            this.parent.direction =Statics.getRight();
         }
         else if (d == 1)
         {
            this.parent.direction = Statics.getLeft()
         }
         else if (d == 2)
         {
            this.parent.direction = Statics.getDown()
         }
         else
         {
            this.parent.direction =  Statics.getUp()
         }

   }




   update(delta)
   {

      let maxDistance = this.pathHelper.getMaxDistance();

      let dist = delta/1000.0 * this.parent.speed;
      let distance= min(dist,maxDistance);

      let vector = p5.Vector.mult(this.parent.direction,distance);

      this.parent.vector.add(vector);


      this.handleFriction(distance);

      this.parent.cell  = this.parent.getCellAtMe();


      let result = this.pathHelper.checkPath(this.parent.cell,this.parent.vector.x,this.parent.vector.y);

      if (result == PathResultEnum.ENUM_NEW_CELL)
      {
         this.makeDirectionFrom(this.pathHelper.getDirection());
      }
      else if (result == PathResultEnum.ENUM_REACH_DEST)
      {
         //console.log("dest");
         //some have towers as destination
         if (!Statics.exitCells.includes(this.parent.cell))
         {
            this.parent.doOnReachEnd();
         }
         else
         {
            applauseSound.play();
            this.parent.remove = true;
            g_enemies_escaped += 1;
            return;
         }

      }
      else if (result == PathResultEnum.ENUM_STUCK)
      {
         //return;
      }
      else if (result == PathResultEnum.ENUM_LOST)
      {
         let c = this.findCellAround(this.parent.cell);
         if (!c)
         {
            console.error("error!,outside area");
            //remove him atleast
            this.parent.remove = true;
            return;
         }
         //move to cell
         this.parent.vector.x = c.x;
         this.parent.vector.y = c.y;
         this.parent.cell = this.parent.getCellAtMe();
         this.calcRoute(true);

         //return;
      }




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


   IsSlowed()
   {
      return this.friction.length > 0;
   }


   addFriction(o)
   {
      //console.log("slow");
      if (!this.immune)
         this.friction.push(o);

   }



   handleFriction(distance)
   {
            if (this.friction.length>0)
            {
               let x = p5.Vector.mult(this.parent.direction,-1);

               for (let i=0;i<this.friction.length;i++)
               {
                  let b = distance * (this.friction[i].dist/100);

                  let dd = p5.Vector.mult(x,b);
                  distance-=b;
                  if (distance>0)
                  {
                     this.parent.vector.add(dd);
                  }

               }

               for (let i=0;i<this.friction.length;i++)
               {

                  if ( this.parent.time - this.friction[i].time > this.friction[i].s)
                  {
                     removeFromArray2(this.friction,this.friction[i]);
                     break;
                  }
               }

         }

   }

}


class FlyingComponent extends Component
{

   constructor()
   {
      super();

      this.friction = [];


   }

   init()
   {

   }

   getType()
   {
      return componentEnum.flying;
   }


   update(delta)
   {



      let dist = delta/1000.0 * this.parent.speed;
   //   let distance= min(dist,maxDistance);

      let vector = p5.Vector.mult(this.parent.direction,dist);

      this.parent.vector.add(vector);

      this.handleFriction(dist);

      this.parent.cell  = this.parent.getCellAtMe();

      if (!this.parent.cell)
      {
         applauseSound.play();
         this.parent.remove = true;
         g_enemies_escaped += 1;

      }


   }



   slowed()
   {
      return this.friction.length > 0;
   }

   slowDown(d,t,p)
   {
         this.friction.push( { dist:d, time:this.parent.time ,s:t, who:p } );

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



   handleFriction(distance)
   {
            if (this.friction.length>0)
            {
               let x = p5.Vector.mult(this.parent.direction,-1);

               for (let i=0;i<this.friction.length;i++)
               {
                  let b = distance * (this.friction[i].dist/100);

                  let dd = p5.Vector.mult(x,b);
                  distance-=b;
                  if (distance>0)
                  {
                     this.parent.vector.add(dd);
                  }

               }

               for (let i=0;i<this.friction.length;i++)
               {

                  if ( this.parent.time - this.friction[i].time > this.friction[i].s)
                  {
                     removeFromArray2(this.friction,this.friction[i]);
                     break;
                  }
               }


         }

   }

}




class HealthComponent extends Component
{
   constructor(isMorf,hp)
   {
      super();

      this.hp  = hp;
      this.startHp  =this.hp;
      this.points = 2+ this.hp /3;
      this.armor  = 0;
      this.state = true;
      this.c = 10;
      this.morf = isMorf;
   }

   init()
   {
      this.parent.register(this,messagesEnum.damage);
      this.parent.registerGetter(this,messagesEnum.hp);
   }
   getType()
   {
      return componentEnum.hp;
   }

   getHP()
   {
      return this.hp;
   }

   isArmor()
   {
      return this.armor>0;
   }

   update(delta)
   {
      if (!this.morf) return;

      if (this.c++ % 70 == 0)
      {
         this.state=!this.state;
         if (!this.state)
         {
            this.parent.speed = 20;
            this.armor=150;
            this.c+=20;

         }
         else
         {
            this.parent.speed =30;
            this.armor=0;
         }
      }


   }

   message(x)
   {
      this.damage(x);
   }

   receive(m,v)
   {
      if (m == messagesEnum.damage)
      {
         this.damage(v);
      }

   }

   get(m)
   {
      if (m == messagesEnum.hp)
      {
         return this.hp;
      }
   }


   getHpL()
   {
         if (this.hp === this.startHp) return 1;
         let d = this.hp / this.startHp;
         return d;


   }

   damage(z)
   {
         if (this.parent.remove) return false;
         if (this.armor>0)
         {
            this.armor-=z;
            gongSound.play();
            return false;
         }
         this.hp -=z;
         if (this.hp<=0)
         {
            this.parent.doOnDead();

         }

         return true;
   }





}


class MinionComponent extends Component
{
   constructor(hpComponent,moveComponent)
   {
      super();
      this.boss = null;
      this.hpComponent = hpComponent;
      this.moveComponent = moveComponent;
      this.c  =0;
   }

   getType()
   {
      return componentEnum.minion;
   }


   closeTo(e)
   {

      let dir = p5.Vector.sub(e.vector,this.parent.vector);

      if (dir.mag() <= Statics.getDefaultRange() ){

         dir.normalize();
         dir.y *=-1;
         this.hpAim = dir;
         return true;
      }


      return false;

   }

   update(delta)
   {
      if (this.c++ % 5 != 0) return;

      if (!this.boss)
      {

         for (let i=0;i<g_enemies.length;i++)
         {
            if ( !g_enemies[i].remove && g_enemies[i]!=this )
            {
               if (this.closeTo(g_enemies[i]))
               {

                  this.parent.speed = g_enemies[i].speed;
                  if (this.parent.speed > 2){
                     this.parent.speed-=2;
                  }

                  this.parent.end = g_enemies[i].end;

                  this.boss = g_enemies[i];

                  this.moveComponent.calcRoute(false);
                  return;
               }

            }
         }


      }

      if (this.boss)
      {


         if (this.boss.remove || !this.closeTo(this.boss))
         {
            this.boss = null;
            this.parent.speed = getRndInteger(30,45);
         //   this.moveComponent.calcRoute( );
         }
         else
         {
            if (this.hpComponent.hp >1)
            {
               let h1 = this.boss.get(messagesEnum.hp);
               this.boss.send(messagesEnum.hp,-1);
               let h2 = this.boss.get(messagesEnum.hp);
               if (h2 > h1)
               {
                  bulletHandler.create(this.vector.x,this.vector.y,this.hpAim,30,color(0,240,0,222), 2,2,60);
                  healthSound.play();
                  this.hpComponent.hp-=1;
               }
            }

         }
      }


   }

}







class SpawnComponent extends Component
{
   constructor(hpComponent,manager,images)
   {
      super();
      this.hpComponent = hpComponent;
      this.manager = manager;
      this.images = images;
   }



   update(delta)
   {
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

         let cell = this.checkAround(this.parent.cell);
         if (cell)
         {
            return cell;
         }


         return this.parent.cell;
      }


   doOnDead()
   {
   //   if (this.parent.remove) return;

      beepSound.play();
      let m = getRndInteger(4,8);

      let hp = this.hpComponent.getHP();

      for (let i=0;i<m;i++)
      {


         let e = this.manager.createMinionEnemy(this.getPos(),this.parent.end,this.images,hp + 20);

         e.speed = getRndInteger(20,35);

      }


   }
}




class SpawnComponent2 extends SpawnComponent
{
   constructor(hpComp,manager,images,images2)
   {
      super(hpComp,manager,images);

      this.images2 = images2;
      this.parent=null;
   }


   update(delta)
   {
   }

   doOnDead()
   {
      beepSound.play();

      let hp = this.hpComponent.getHP();


      if (!this.parent && this.images2)
      {
         let e = this.manager.createSpawnEnemy(this.getPos(),this.parent.end,this.images,this.images2, hp- 25);
         e.parent = this;

         e.speed = this.parent.speed-5;
      }
      else
      {

         for (let i=0;i<2;i++)
         {
            let e = this.manager.createEnemy(this.getPos(),this.parent.end,this.images , hp /2);

            e.speed = getRndInteger(35,45);

         }
      }



   }
}


class SpawnComponent3 extends SpawnComponent
{
   constructor(hpComp,manager,images)
   {
      super(hpComp,manager,images);
      this.counter = 0;

   }


   update(delta)
   {

      {

         if (this.counter++ % 25 !=0) return;

         let hp = this.hpComponent.getHP();

         let e = this.manager.createEnemy(this.getPos(),this.parent.end,this.images,hp + 20);

         e.speed = getRndInteger(this.parent.speed-2,this.parent.speed-1);

         beepSound.play();
      }

   }





}


class PoisonComponent extends Component
{
   constructor()
   {
      super();
      this.c = 0;
   }



   update(delta)
   {

         {
            if (this.c++ % 5 == 0) return;

            let e = this.parent.cell;
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


}



var eState =
{
   SEARCH : 0,
   DRILL : 1,
   PULL_UP : 2,
   DONE : 3,
   THINK : 4,
}






class TowerSeekerComponent extends Component
{
   constructor(manager,mover)
   {
      super();
      this.dstate = eState.SEARCH;
      this.goal  = null;
      this.aim = createVector(1,0);
      this.dlength = 10;
      this.mover  =mover;
      this.manager = manager;
      this.c  =0;
   }

   init()
   {

      let ee = this.manager.findTower(this.parent.cell);
      if (ee)
      {
            this.parent.end = ee.cell;
            this.goal = ee.tower;
            this.mover.calcRoute(false);
      }
      else {
         this.parent.end = Statics.exitCells[0];
      }
   }




   doOnReachEnd()
   {


      if (this.parent.speed == 0) return;
      if(this.dstate == eState.DONE)
      {
      //   enemies_escaped += 1

         //this.remove = true;
         //this.speed = 0;

         return;
      }

      //console.log("reached end");

      let e = this.parent.getCellAtMe();
   /*   if (Statics.exitCells.includes(e))
      {
         g_enemies_escaped += 1


         this.remove = true;
         this.speed = 0;


         return;
      }*/

      this.parent.speed = 0;


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
      let dir = p5.Vector.sub(this.goal.position,this.parent.vector);

      dir.y *=-1;
      this.aim = dir;
      this.aim.normalize();


   }



   update(delta)
   {
      if (this.c++ % 10 ==0)
      {

         this.aimAt();
         if (this.dstate === eState.THINK)
         {
            this.goal = null;
            let e = this.manager.findTower(this.parent.cell);
            if (e)
            {
               this.parent.end = e.cell;
               this.goal = e.tower;
            }
            this.speed= 40;
            this.dstate =eState.SEARCH;

            this.mover.calcRoute(false);


         }
         else if (this.dstate === eState.DRILL)
         {
         //   console.log("drilling");
            this.dlength+=1;
            if (this.dlength > 25)
            {
               this.doOnDrillDone();
            //   console.log("drilling done");
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

      renderSystem.addRender( new RenderSeekerAim(this.parent.vector.x,this.parent.vector.y,this.aim,this.dlength));

   }


   doOnPulledUp()
   {
      this.dstate = eState.DONE;
      this.parent.end = Statics.exitCells[0];
      this.goal  =null;
      this.parent.speed = 40;
      this.mover.calcRoute(true);
   }

   doOnDrillDone()
   {
      skweakSound.play();
      this.goal.disable();
   }



}
