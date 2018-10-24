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

      this.asteridInv =    asteroidImageRed;
      this.asteridInv.resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));
      this.asteridInv.filter(INVERT);

      this.tree = [];
      this.tree.push(treeImage.get());
      this.tree[0].resize(floor(CELL_WIDTH-4),floor(CELL_HEIGHT-4));


      this.plane = planeImage
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

   setHp(e,hp,lvl)
   {
      let v = lvl / 10;
      let c = max(v,1);
      e.hp += hp * c;
      e.startHp = e.hp;
      e.points+=(hp/3);
   }

   setHpPlane(e,hp,lvl)
   {
      //let v = lvl / 10;
      //let c = min(v,1);
      if  (lvl > 10)
      {
         e.hp += hp + (lvl*2);
      }

      e.startHp = e.hp;
      e.points+=hp/2;
   }

   setSpeed(e,speed,lvl)
   {
      //let v = lvl / 10;
      let c = speed + lvl/4; ;

      e.speed+=c;
   }

   setSpeedPlane(e,speed,lvl)
   {
      e.speed+= speed+ lvl/3;
   }

   create(pos,type,lvl)
   {
      let e = null;
      if (type===EnemyType.VANILLA)
      {
         e = new Enemy(this,pos, this.asteriod);

      }
      else if (type===EnemyType.SPIDER)
      {
         e = new Enemy2(this,pos,this.asteriodSpider, this.asteriod);
         this.setSpeed(e,15,lvl);
         if (lvl<10)
         {
            this.setHp(e,50,lvl);
         }else
         this.setHp(e,70,lvl);
      }
      else if (type===EnemyType.BIG)
      {
         e = new Enemy(this,pos,this.asteriodBigger);
         e.prio = 9;
         this.setHp(e,20,lvl);
         this.setSpeed(e,10,lvl);

      }
      else if (type===EnemyType.STONE)
      {
         e = new Enemy(this,pos,asteroidImageAnim);
         e.name = "Stoner";
         e.prio = 8;
         this.setHp(e,30,lvl);
         this.setSpeed(e,15,lvl);
      }
      else if (type===EnemyType.MORPHG)
      {
         e = new Enemy3(this,pos,asteroidImageAnim,this.asteridInv);
         this.setHp(e,55,lvl);
         this.setSpeed(e,25,lvl);
      }
      else if (type===EnemyType.KAKA)
      {
         e = new Enemy2B(this,pos,asteroidImageAnim2,this.asteriod);
         this.setHp(e,80,lvl);
         this.setSpeed(e,25,lvl);
      }
      else if (type===EnemyType.GRRR)
      {
         if (lvl < 10)
         {
            e = new Enemy2A(this,pos,asteroidImageAnim2,this.asteriod);
         }
         else
         {
            e = new Enemy2A(this,pos,asteroidImageAnim2,this.asteriod,this.asteriodBigger);
         }

         this.setHp(e,30,lvl);
         this.setSpeed(e,25,lvl);
      }
      else if (type===EnemyType.POISON)
      {
         e = new EnemyPoison(this,pos,this.tree);
         this.setHp(e,20,lvl);
         if (lvl >30)
         {
            e.armor = 20;
         }
         e.speed=1;
         this.setSpeed(e,7,lvl);
      }
      else if (type===EnemyType.BOSS)
      {
         e = new Enemy(this,pos,asteroidImageAnim);
         e.prio = 3;
         e.name = "Boss";
         this.setHp(e,140,lvl);
         this.setSpeed(e,35,lvl);
      }
      else if (type===EnemyType.IMMUNE)
      {
         e = new Enemy(this,pos,asteroidImageAnim3);
         this.setHp(e,55,lvl);
         this.setSpeed(e,20,lvl);
         e.immune = true;
         e.name = "Immune";
         e.prio = 3;
      }
      return e;
   }

   createPlanes(nr,lvl)
   {
      let startpos = [Statics.startCells[0],Statics.startCells[2],Statics.startCells[4],Statics.startCells[6]];


      for (let i=0;i<nr;i++)
      {
         let l = i%2==0?0:2;
         let r = getRndInteger(0,2);
         let e =new EnemyPlane(this,startpos[l+r],this.plane);
         this.setHpPlane(e,25,lvl);
         this.setSpeedPlane(e,1,lvl);
         g_planes.push(e);
      }
   }



   findTower(e)
   {


      for (let i=0;i<3;i++)
      {
         if (i > g_towers.length-1) continue;
         let tower = g_towers[i];
         if (!tower) continue;
         if (tower.disabled) continue;
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


   findGoal(e,ee)
   {


      let cc = [gameMap.getCell(ee.i,ee.j-1),gameMap.getCell(ee.i-1,ee.j),gameMap.getCell(ee.i-1,ee.j+1),gameMap.getCell(ee.i+2,ee.j),gameMap.getCell(ee.i+2,ee.j+1),gameMap.getCell(ee.i,ee.j+2),gameMap.getCell(ee.i+1,ee.j+2),gameMap.getCell(ee.i+2,ee.j-1),gameMap.getCell(ee.i-1,ee.j-1),gameMap.getCell(ee.i+2,ee.j+2),gameMap.getCell(ee.i-1,ee.j+2),gameMap.getCell(ee.i+1,ee.j-1)];



      for (let k=0;k<cc.length;k++)
      {

         if (!cc[k]) continue;
         if (cc[k].tower) continue;

         e.end = cc[k];

         if (e.calcRoute( ))
         {


            return true;

         }

      }

      return false;
   }


   createSeeker(lvl)
   {

      sortTowers();





      {

         let p = getRndInteger(0,this.startpositions.length+1);
         if (p==this.startpositions.length) p=1;


         let e =new EnemySeeker(this,this.startpositions[p], this.asteriodBigger);
         e.points = 100;
         e.armor = 50;
         e.hp=480+(lvl*3);
         e.speed+=5 + (lvl/4);
         e.startHp=e.hp;
         e.normalExits = false;

         this.findTower(e)
         g_enemies.push(e);
      }

   }

   createMinion()
   {


      let e = new Enemy(this,this.startpositions[1], this.asteriod);
      this.setHp(e,50,1);
      this.setSpeed(e,20,1);
      e.minion = true;
      e.prio = 8;
      for (let ee=0;ee<g_enemies.length;ee++)
      {
         if (g_enemies[ee].getName() =="SeekwerBomb" )
         {
            e.boss = g_enemies[ee];
            break;
         }
      }
      if (e.boss)
      {
         let c = e.boss.getCellAtMe();
         e.normalExit = false;
         e.end = c;
      }
      else {
            e.end = Statics.exitCells[0];
      }



      e.calcRoute();
      g_enemies.push(e);



   }

   createSeeker2(lvl)
   {






      {



         let e =new EnemySeeker2(this,this.startpositions[1], this.asteriodBigger);
         e.points = 100;
         e.armor = 50;
         e.hp=400+(lvl*3);
         e.speed+=5 + (lvl/4);
         e.startHp=e.hp;
         e.normalExits = false;

         this.findTower2(e)
         g_enemies.push(e);
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



         let e = this.create(this.startpositions[startposIndex], type, lvl);

         let end = this.getShortestEndFrom(startposIndex);
         let path = this.getPathRoute(startposIndex,end);

         e.speed = getRndInteger(e.speed-1 , e.speed+2);

         e.end = this.endpositions[end];

         {
            // copy path to enemy
            let l = this.paths.get(path);

            e.setRoutePath(l);
            e.setNextCellFrom(this.startpositions[startposIndex]);

         }

         g_enemies.push(e);
      }
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

            g_enemies[i].calcRoute( );
         }


      }

      return true;
   }
}
