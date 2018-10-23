





class MazeWalker
{
   //A*



   constructor(exits)
   {


      this.path =[];

      this.visited = new Set();
      this.stack = [];
      this.current = null;

      this.exits   = exits.slice();
   }

   heuristic(a,b) {
   //   var d = dist(a.i, a.j ,b.i,b.j);
      let d = Math.abs(a.i-b.i) + Math.abs(a.j - b.j);
      return d;
   }

   findRoute(cleanfnc, getPath, start, end, anyExit) {

      cleanfnc();

      let openSet = [];

      openSet.push(start);
      let closedSet = new Set();

      while (openSet.length > 0)
      {
         let winner = 0;
         for (let i=0;i<openSet.length;i++)
         {
            if(openSet[i].getF() < openSet[winner].getF())
            {
               winner = i;
            }

         }

         let current = openSet[winner];

         let found = false;
         if (anyExit)
         {
            found = this.exits.includes(current);
         }
         else
         found = current === end;

         if(found)
         {

            if(!getPath)
            return true;

            this.path.length=0;


            var temp = current;
            this.path.push(temp);
            while (temp.getPrevious())
            {
               this.path.push(temp.getPrevious());
               temp=temp.getPrevious()
            }

            return true;
         }


         removeFromArray2(openSet,current);
         closedSet.add(current);

         let neighbors = current.neighbors;

         for (let i=0;i<neighbors.length;i++)
         {
            let neighbor = neighbors[i];

            if (!closedSet.has(neighbor))
            {
               var tempG = current.getG() + 1;
               var newPath = false;
               if (openSet.includes(neighbor))
               {
                  if (tempG <  neighbor.getG())
                  {
                     neighbor.setG(tempG);
                     newPath = true;
                  }
               }
               else {
                  neighbor.setG(tempG);
                  openSet.push(neighbor);
                  newPath = true;
               }
               if (newPath)
               {
                  neighbor.setH(this.heuristic(neighbor, end));

                  neighbor.setF(neighbor.getG() + neighbor.getH());

                  neighbor.setPrevious(current);



               }

            }

         }

      }

      {
         this.path.length=0;
      //   console.log("no solution");

      }
      return false;

   }

   getNextPath()
   {
      if (this.path.length > 0)
      return this.path.pop();
      return null;

   }

   findSimpleRoute(cell)
   {
      this.visited.clear();
      this.visited.add(cell);
      this.stack = [cell];
      this.current = cell;
   }

   walk(cell)
   {
      if (canWalk(cell) && !this.visited.has(cell))
      {
         this.current = cell;
         this.visited.add(cell);
         this.stack.push(cell);

         return true;
      }

      return false;
   }


   getStupidPath()
   {


      if (Statics.exitCells.includes(this.current)) return null;

      let top  = getCell(this.current.i,this.current.j-1);
      let right = getCell(this.current.i+1,this.current.j);
      let bottom = getCell(this.current.i,this.current.j+1);
      let left = getCell(this.current.i-1,this.current.j);

      let l =[top,right,bottom,left];
      l =g_shuffle(l);

      for (let i=0;i<l.length;i++)
      {
         if (this.walk(l[i]))
         return l[i];
      }

      if (this.stack.length>0) {
         let cell = this.stack.pop();

         this.current = cell;
         return cell;
      }

      return null;
   }

}

module.exports.PathFinder = MazeWalker;
