
var EnemyType =
{
   VANILLA : 0,
   BIG : 1,
   SPIDER : 2,
   PLANE : 3,
   MORPHG : 4,
   GRRR : 5,
   STONE:6,
   KAKA:7,
   POISON:8,
   BOSS:9,
   IMMUNE:10,
   MINION:11,

};



let ROUTES =
{
   START_ZERO_END_ZERO:1,
   START_ZERO_END_ONE:2,
   START_ONE_END_ZERO:3,
   START_ONE_END_ONE:4,

};


class EnemyManager
{
   constructor()
   {



      this.asteriod = [];
      this.asteriodBigger = [];
      this.mw = new MazeWalker(Statics.exitCells);
      this.asteriod.push(asteroidImage);
      this.asteriodBigger.push(asteroidImage.get());
      this.asteriodBigger[0].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));

      this.asteriodSpider = [];
      this.asteriodSpider.push(asteroidImageSpider);

      this.asteriodInv = [];
      this.asteriodInv.push(asteroidImageRed);
      this.asteriodInv[0].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));
      this.asteriodInv[0].filter(INVERT);

      this.tree = [];
      this.tree.push(treeImage.get());
      this.tree[0].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));

      this.plane =[];
      this.plane.push(planeImage);


      this.paths = new Map();

      this.startpositions = [Statics.startCells[0],Statics.startCells[4]];
      this.endpositions = [Statics.exitCells[1],Statics.exitCells[5]];


   }


   getPathRoute(start,end)
   {
      if (start == 0 && end == 0) return ROUTES.START_ZERO_END_ZERO;

      if (start == 0  && end == 1) return ROUTES.START_ZERO_END_ONE;
      if (start == 1 && end == 0) return ROUTES.START_ONE_END_ZERO;
      if (start == 1 && end == 1) return ROUTES.START_ONE_END_ONE;


   }




   calcShortest(recalc)
   {
      if (recalc)
      {

         this.paths.clear();
      }
      if (this.paths.length==4) return true;



      //check all exits are reachable (4 routes)

      for (let i=0;i<this.startpositions.length;i++)
      {
         for (let j=0;j<this.endpositions.length;j++)
         {
            let route = this.getPathRoute(i,j);

            if (!this.paths.has(route))
            {

               this.mw.path.length=0;
               if (!this.mw.findRoute(function() {gameMap.resetPathInfo();},true,this.startpositions[i],this.endpositions[j],false))
               {
                  //blocked
                  return false;
               }
               //copy path
               {
                  let l = this.mw.path.slice();
                  this.paths.set(route,l);
               }

            }

         }

      }
      return true;
   }

   getShortestEndFrom(p)
   {
      if (p == 0)
      {

         let r1 = this.paths.get(ROUTES.START_ZERO_END_ZERO);
         let r2 = this.paths.get(ROUTES.START_ZERO_END_ONE);


         if (r1.length > r2.length)
         return 1;
         else
         return 0;
      }
      else
      {
         let r1 = this.paths.get(ROUTES.START_ONE_END_ZERO);
         let r2 = this.paths.get(ROUTES.START_ONE_END_ONE);


         if (r1.length > r2.length)
         return 1;

         else
         return 0;
      }
   }

   getHp(hp,lvl)
   {
      let v = lvl / 10;
      let c = max(v,1);
      return  hp * c;

   }

   getHpPlane(h,lvl)
   {

      let hp  =h;
      if  (lvl > 10)
      {
         hp += hp + (lvl*2);
      }

      return hp;
   }

   getSpeed(speed,lvl)
   {

      let c = speed + lvl/4; ;

      return c;
   }

   getSpeedPlane(speed,lvl)
   {
      let c = speed+ lvl/3;
      return c;
   }

   create(pos,end,type,lvl)
   {
      let e = null;
      if (type===EnemyType.VANILLA)
      {
         let hp = this.getHp(9,lvl);
         e = this.createEnemy(pos,end,this.asteriod,hp);
         e.speed = this.getSpeed(25,lvl);
      }
      else if (type===EnemyType.SPIDER)
      {
         let hp = 0;
         if (lvl<10)
         {
            hp = this.getHp(40,lvl);
         }
         else
         hp = this.getHp(80,lvl);

         e = this.createSpawnEnemy(pos,end,this.asteriodSpider, this.asteriod, hp);
         e.speed = this.getSpeed(25,lvl);

      }
      else if (type===EnemyType.BIG)
      {
         let hp =  this.getHp(20,lvl);
         e = this.entityManager.createEnemy(pos,end,this.asteriodBigger, hp);
         e.speed = this.getSpeed(25,lvl);
         e.name="BIG";
         e.prio = 8;
      }
      else if (type===EnemyType.STONE)
      {
         let hp =  this.getHp(30,lvl);
         e = this.createEnemy(pos,end,this.asteroidImageAnim, hp);
         e.speed = this.getSpeed(25,lvl);
         e.name="STONE";
         e.prio = 7;

      }
      else if (type===EnemyType.MORPHG)
      {
         let hp =  this.getHp(55,lvl);
         e = this.createMorphEnemy(pos,end,asteroidImageAnim,this.asteriodInv, hp);
         e.speed = this.getSpeed(25,lvl);


      }
      else if (type===EnemyType.KAKA)
      {
         let hp =  this.getHp(80,lvl);
         e = this.createSpawn3Enemy(pos,end,asteroidImageAnim2,this.asteriod, hp);
         e.speed = this.getSpeed(25,lvl);


      }
      else if (type===EnemyType.GRRR)
      {

         let hp =  this.getHp(30,lvl);

         if (lvl < 10)
         {
            e = this.createSpawn2Enemy(pos,end,asteroidImageAnim2,this.asteriod,null, hp);

         }
         else
         {
            e = this.createSpawn2Enemy(pos,end,asteroidImageAnim2,this.asteriod,this.asteriodBigger, hp);

         }

         e.speed = this.getSpeed(25,lvl);

      }
      else if (type===EnemyType.POISON)
      {
         let hp =  this.getHp(20,lvl);
         e = this.createPoisonEnemy(pos,end,this.tree, hp);
         e.speed = this.getSpeed(7,lvl);


      }
      else if (type===EnemyType.BOSS)
      {
         let hp =  this.getHp(150,lvl);
         e = this.createEnemy(pos,end,asteroidImageAnim, hp);
         e.speed = this.getSpeed(35,lvl);


         e.prio = 3;
         e.name = "Boss";

      }
      else if (type===EnemyType.IMMUNE)
      {
         let hp =  this.getHp(55,lvl);
         e = this.createImmuneEnemy(pos,end,asteroidImageAnim3, hp);
         e.speed = this.getSpeed(25,lvl);



      }

      return e;
   }

   createPlanes(nr,lvl)
   {
      let startpos = [Statics.startCells[0],Statics.startCells[2],Statics.startCells[4],Statics.startCells[6]];

      let hp = this.getHpPlane(10,lvl)
      let speed = this.getSpeedPlane(30,lvl);

      for (let i=0;i<nr;i++)
      {
         let l = i%2==0?0:2;
         let r = getRndInteger(0,2);
         let e = this.createPlaneEnemy(startpos[l+r],this.plane,hp);

         e.speed = speed;

      }
   }

   addDefaultComponents(e, images, hp)
   {
      let moveableComponent = new MoveableComponent(images[0].width,images[0].height);
      let healthComponent = new HealthComponent(false,hp);
      let trans = new TransformComponent();
      e.add(moveableComponent);
      e.add(trans);
      e.add(healthComponent);
      e.add( new EnemyGraphicComponent(images,healthComponent, trans) );
   }


   createEnemy(start,end,images,hp)
   {
      let e = new EnemyObject(start);
      this.addDefaultComponents(e,images,hp);
      e.end = end;
      e.initComponents();
      g_enemies.push(e);
      return e;

   }

   createPlaneEnemy(start,images,hp)
   {

      let e = new FlyingtObject(start, images,hp);
      e.initComponents();
      e.prio=1;
      g_planes.push(e);
      return e;

   }

   createPoisonEnemy(start,end,images,hp)
   {
      let e = new EnemyObject(start);
      this.addDefaultComponents(e,images,hp);
      e.add(new PoisonComponent());
      e.end = end;
      e.initComponents();
      e.prio = 2;
      g_enemies.push(e);
      return e;
   }

   createSpawnEnemy(start,end,images,images2,hp)
   {
      let e = new EnemyObject(start);
      this.addDefaultComponents(e,images);
      e.add(new SpawnComponent(this,images2));
      e.prio = 8;
      e.name = "Spawn";
      e.end = end;
      e.initComponents();
      g_enemies.push(e);
      return e;
   }

   createSpawn2Enemy(start,end,images,images2,images3,hp)
   {
      let e = new EnemyObject(start);
      this.addDefaultComponents(e,images);
      e.add(new SpawnComponent2(this,images2, images3));
      e.prio = 7;
      e.name = "Spawn2";
      e.end = end;
      e.initComponents();
      g_enemies.push(e);
      return e;
   }

   createSpawn3Enemy(start,end,images,images2,hp)
   {
      let e = new EnemyObject(start);
      this.addDefaultComponents(e,images);
      e.add(new SpawnComponent3(this,images2,hp));
      e.prio = 6;
      e.name = "Spawn3";
      e.end = end;
      e.initComponents();
      g_enemies.push(e);
      return e;

   }

   createMorphEnemy(start,end,images,images2,hp)
   {
      let e = new EnemyObject(start);

      let moveableComponent = new MoveableComponent(images[0].width,images[0].height);
      let healthComponent = new HealthComponent(true,hp);

      let trans = new TransformComponent();
      e.add(moveableComponent);
      e.add(healthComponent);
      e.add(trans);
      let grap = new EnemyGraphicComponent(images,healthComponent, trans);
      grap.armorimages = images2;

      e.add(grap );

      e.prio = 3;
      e.name = "Mmorpher";

      e.end = end;

      e.initComponents();
      g_enemies.push(e);
      return e;

   }

   createImmuneEnemy(start,end,images,hp)
   {
      let e = new EnemyObject(start,this,images);

      let moveableComponent = new MoveableComponent(images[0].width,images[0].height);
      moveableComponent.immune = true;
      let healthComponent = new HealthComponent(false,hp);
      let trans = new TransformComponent();
      e.add(moveableComponent);
      e.add(healthComponent);

      e.add(trans);
      e.add( new EnemyGraphicComponent(images,healthComponent, trans));

      e.prio = 3;
      e.name = "Immune";
      e.end = end;

      e.initComponents();
      g_enemies.push(e);
      return e;

   }



   createMinionEnemy(start,end,images,hp)
   {
      let e = new EnemyObject(start);
      e.end = end;
      e.prio = 7;
      e.name  = "Minion";
      this.addDefaultComponents(e,images);
      e.add(new MinionComponent());

      e.initComponents();
      g_enemies.push(e);
      return e;
   }

   createSeekerEnemy(start,images,hp,armor)
   {

      let e = new EnemyObject(start);
      e.prio = 2;
      e.name  = "Seeker";
      let moveableComponent = new MoveableComponent(images[0].width,images[0].height);
      let healthComponent = new HealthComponent(false,hp);
      healthComponent.armor = armor;
      let trans = new TransformComponent();
      let seeker = new TowerSeekerComponent(this);

      e.add(moveableComponent);
      e.add(healthComponent);
      e.add(seeker);
      e.add(trans);

      e.add( new EnemyGraphicComponent(images,healthComponent, trans) );

      e.initComponents();


      g_enemies.push(e);

      return e;
   }


   findTower(fromCell)
   {


      for (let i=0;i<3;i++)
      {
         if (i > g_towers.length-1) continue;
         let tower = g_towers[i];
         if (!tower) continue;
         if (tower.disabled) continue;
         let cell = this.findGoal(fromCell,tower);
         if (cell)
         {
            return {cell:cell,tower:tower};
         }
      }

      //found no towers,go to exit

      return null;
   }




   /*
   findTower2(e)
   {
   g_towers.sort(function(a,b) {

   let x = Statics.startCells[4]
   let i = dist(x.i, x.j ,a.i,a.j);
   let j = dist(x.i, x.j ,b.i,b.j);
   return i-j;

} )

for (let i=0;i<20;i++)
{
let tower = g_towers[i];
if (!tower) continue;
let c = gameMap.getCell(tower.i,tower.j);
let cells = getCells(c);
let x  = 0;
for (let i=0;i<cells.length;i++)
{
if (cells[i] && cells[i].tower) x++;
}
if (x>=4) continue;

if (this.findGoal(e,tower))
{
e.goal = tower;
return;
}
}

//found no towers,go to exit

e.normalExits = true;
e.end = Statics.exitCells[0];
e.calcRoute( );

}
*/

findGoal(cell,ee)
{


   let cc = [gameMap.getCell(ee.i,ee.j-1),gameMap.getCell(ee.i-1,ee.j),gameMap.getCell(ee.i-1,ee.j+1),gameMap.getCell(ee.i+2,ee.j),gameMap.getCell(ee.i+2,ee.j+1),gameMap.getCell(ee.i,ee.j+2),gameMap.getCell(ee.i+1,ee.j+2),gameMap.getCell(ee.i+2,ee.j-1),gameMap.getCell(ee.i-1,ee.j-1),gameMap.getCell(ee.i+2,ee.j+2),gameMap.getCell(ee.i-1,ee.j+2),gameMap.getCell(ee.i+1,ee.j-1)];



   for (let k=0;k<cc.length;k++)
   {

      if (!cc[k]) continue;
      if (cc[k].tower) continue;

      if (this.checkRouteFrom(cell,cc[k]))
      {
         return cc[k];
      }

   }

   return null;
}


createSeeker(lvl)
{

   sortTowers();

   {
      let hp = 480+(lvl*3);
      let p = getRndInteger(0,this.startpositions.length+1);
      if (p==this.startpositions.length) p=1;

      let e = this.createSeekerEnemy(this.startpositions[p],this.asteriodBigger, hp, 50);

      e.speed+=10 + (lvl/4);

   }

}

createEnemies(nr,type,lvl)
{
   this.calcShortest(false);


   let even = false;
   if (nr == 2 ) even=true;

   for (let i=0;i<nr;i++)
   {
      let startposIndex=0;

      if (even)
      {
         startposIndex = i;
      }
      else
      {
         startposIndex = getRndInteger(0,this.startpositions.length+1);

         if (startposIndex==this.startpositions.length) startposIndex=1;   //prefere to use startpos 1

      }



      let end = this.getShortestEndFrom(startposIndex);
      let endCell = this.endpositions[end];

      let e = this.create(this.startpositions[startposIndex],endCell, type, lvl);

      //let path = this.getPathRoute(startposIndex,end);

      e.speed = getRndInteger(e.speed-1 , e.speed+2);



      {

         // copy path to enemy
         //   let l = this.paths.get(path);

         //   e.setRoutePath(l);
         //   e.setNextCellFrom(this.startpositions[startposIndex]);

      }

      //g_enemies.push(e);
   }
}

checkRouteFrom(fromCell,toCell)
{
   let ok = this.mw.findRoute(function(){
                              gameMap.resetPathInfo();
                              },
                              false,fromCell,toCell,false);

   return ok;
}


calcRoute()
{

   if (!this.calcShortest(true))
   {
      return false;
   }

   for (let i=0;i<g_enemies.length;i++)
   {
      if (!g_enemies[i].remove)
      {

         g_enemies[i].send(messagesEnum.route,true);
      }


   }

   return true;
}
}
