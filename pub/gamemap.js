


function Cell(i,j,x,y, home)
{
   this.i = i;
   this.j = j;
   this.x = x;//getX(i);
   this.y = y;//getY(j);
   this.home = home;
   this.neighbors = [];

   this.tower = null;


   this.hidden = false;

   this.blocked = false;

   this.draw = false;

   this.f = 0;
   this.g = 0;
   this.h = 0;

   this.previous = null;

   this.setPrevious  = function(p)
   {

      this.previous = p;


   }

   this.getPrevious =function()
   {


      {
         return this.previous;
      }

   }

   this.getF = function()
   {


      {
         return this.f;
      }

   }

   this.isStunner  =function(cell)
   {
      if (cell && cell.tower && cell.tower.type==3)
      {
         return true;
      }
      return false;
   }
   this.getG= function()
   {
      let right = this.home.getCell(this.i+1,this.j);

      let top  = this.home.getCell(this.i,this.j-1);

      let left = this.home.getCell(this.i-1,this.j);
      let bottom = this.home.getCell(this.i,this.j+1);

      if (this.isStunner(right) || this.isStunner(top) || this.isStunner(left) || this.isStunner(bottom))
      {
          this.g+= 2;
      }


      return this.g;


   }

   this.setG = function(g)
   {

         this.g = g;

   }

   this.setF = function(f)
   {

      this.f = f;


   }

   this.setH= function(h)
   {

         this.h = h;


   }

   this.getH = function()
   {

      return this.h;


   }

   this.clear = function()
   {
      this.neighbors = [];
      this.tower = null;
   }

   this.hasTower  =function()
   {
      return this.tower!=null;
   }

   this.addNeighbors = function()
   {
      let i = this.i;
      let j = this.j;

      let top  = this.home.getCell(i,j-1);
      let right = this.home.getCell(i+1,j);
      let bottom = this.home.getCell(i,j+1);
      let left = this.home.getCell(i-1,j);
      if (top && !top.hidden)
      this.neighbors.push(top);
      if (right && !right.hidden)
      this.neighbors.push(right);
      if (bottom && !bottom.hidden)
      this.neighbors.push(bottom);
      if (left && !left.hidden)
      this.neighbors.push(left);
   }



   this.show = function()
   {



      if (this.hidden)
      {
         noStroke();
         fill(255,255,255,200);


         rect(this.x,this.y,CELL_WIDTH,CELL_HEIGHT);
      }




}




}


class GameMap
{



   constructor(cols, rows)
   {
      this.cols = cols;
      this.rows = rows;
      this.grid = new Array(this.cols);
      for (let i=0;i<this.cols;i++)
      {
         this.grid[i] = new Array(this.rows);

      }



      this.CELL_WIDTH  = 0;
      this.CELL_HEIGHT  =0;
      this.TOP = 0;
   }

   init(w,h,t)
   {
      this.CELL_WIDTH = w;
      this.CELL_HEIGHT = h;
      this.TOP = t;

      for (let i=0;i<this.cols;i++)
      {
         for (let j=0;j<this.rows;j++)
         {
            this.grid[i][j] = new Cell(i,j,this.getX(i),this.getY(j),this);

            if (i===0 || i===this.cols-1 || j===0 || j===this.rows-1)
            {
               this.grid[i][j].hidden = true;
            }
         }
      }
 }

 addNeighbors()
 {

      for (let i=0;i<this.cols;i++)
      {
         for (let j=0;j<this.rows;j++)
         {
            this.grid[i][j].addNeighbors();
         }
      }


   }

   reset()
   {
      this.resetPathInfo();
      this.clearGrid();
      this.addNeighbors();
   }

   clearGrid()
   {
      for (let i=0;i<this.cols;i++)
      {
         for (let j=0;j<this.rows;j++)
         {
            this.grid[i][j].clear();
         }
      }
   }

   resetPathInfo()
   {

      for (let i=0;i<this.cols;i++)
      {
         for (let j=0;j<this.rows;j++)
         {
            this.grid[i][j].f = 0;
            this.grid[i][j].g = 0;
            this.grid[i][j].h = 0;

            this.grid[i][j].setPrevious(null);
         }
      }
   }

   show()
   {
      for (let i=0;i<this.cols;i++)
      {
         for (let j=0;j<this.rows;j++)
         {
            if (i===0 || i===this.cols-1 || j===0 || j===this.rows-1){
               this.grid[i][j].show();
            }

         }
      }
   }

   getCell(i,j)
   {
      if (i<0 || j <0 || i > this.cols-1 || j>this.rows-1)
      {
         return undefined;
      }
      return this.grid[i][j];
   }

   getI(x)
   {
      let i = Math.floor( (  x) / this.CELL_WIDTH);
      return i;
   }

   getJ(y)
   {
      let j =  (  y - this.TOP) / this.CELL_HEIGHT;

      return Math.floor(j);
   }

   getX(i)
   {
      let x =   i * this.CELL_WIDTH ;

      return x;
   }

   getY(j)
   {
      let y =   j * this.CELL_HEIGHT ;

      return y+this.TOP;
   }

   removeNeighbor(cell, cell2)
   {
      if (!cell || !cell2) return;

      if (!cell.hidden && !cell.tower)
         removeFromArray2(cell.neighbors,cell2);

      removeFromArray2(cell2.neighbors,cell);
   }


   setTower(i,j,tower)
   {
      let cell = this.getCell(i,j);

      let right = this.getCell(i+1,j);

      let bottom = this.getCell(i,j+1);
      if (!bottom ) return 0;
      let bottomright = this.getCell(bottom.i+1,bottom.j);


      if (!cell || !right || !bottomright)  return 0;

      if (cell.tower || cell.hidden || cell.blocked) return 0;
      if (right.tower || right.hidden || right.blocked) return 0;
      if (bottom.tower || bottom.hidden || bottom.blocked) return 0 ;
      if (bottomright.tower || bottomright.hidden || bottomright.blocked) return 0;

      let t = tower;


      cell.tower = t;
      right.tower = t;
      bottom.tower = t;
      bottomright.tower = t;



      let top  = this.getCell(i,j-1);

      let left = this.getCell(i-1,j);

      let rightright = this.getCell(right.i+1,right.j);

      let rightUp = this.getCell(right.i,right.j-1);

      let bottomrightRight = this.getCell(bottomright.i+1,bottomright.j);
      let bottomrightDown = this.getCell(bottomright.i,bottomright.j+1);

      let bottomDown = this.getCell(bottom.i,bottom.j+1);

      let bottomLeft = this.getCell(bottom.i-1,bottom.j);

      this.removeNeighbor(top,cell);
      this.removeNeighbor(rightUp,right);
      this.removeNeighbor(rightright,right);
      this.removeNeighbor(bottomrightRight,bottomright);
      this.removeNeighbor(bottomrightDown,bottomright);
      this.removeNeighbor(bottomDown,bottom);
      this.removeNeighbor(bottomLeft,bottom);
      this.removeNeighbor(left,cell);



      removeFromArray2(bottom.neighbors,cell);
      removeFromArray2(cell.neighbors,bottom);

      removeFromArray2(cell.neighbors,right);
      removeFromArray2(right.neighbors,cell);

      removeFromArray2(bottomright.neighbors,right);
      removeFromArray2(right.neighbors,bottomright);

      removeFromArray2(bottom.neighbors,bottomright);
      removeFromArray2(bottomright.neighbors,bottom);
   }

   restoreNeighbor(cell1, cell2)
   {
      if (!cell1 || !cell2) return;

      if (!cell1.tower && !cell1.hidden && !cell1.neighbors.includes(cell2) )
      {
         cell1.neighbors.push(cell2);

         if (!cell2.neighbors.includes(cell1)){
            cell2.neighbors.push(cell1);
         }
      }
   }

   removeTower(i,j)
   {

      let cell = this.getCell(i,j);

      if (!cell) return;
      if (!cell.tower) return;
      cell.tower.remove=true;

      cell.tower = null;
      let right = this.getCell(i+1,j);

      let bottom = this.getCell(i,j+1);

      let bottomright = this.getCell(bottom.i+1,bottom.j);
      right.tower = null;
      bottom.tower = null;
      bottomright.tower = null;



      let top  = this.getCell(i,j-1);

      let left = this.getCell(i-1,j);

      let rightright = this.getCell(right.i+1,right.j);

      let rightUp = this.getCell(right.i,right.j-1);

      let bottomrightRight = this.getCell(bottomright.i+1,bottomright.j);
      let bottomrightDown = this.getCell(bottomright.i,bottomright.j+1);

      let bottomDown = this.getCell(bottom.i,bottom.j+1);

      let bottomLeft = this.getCell(bottom.i-1,bottom.j);


      this.restoreNeighbor(top,cell);

      this.restoreNeighbor(rightUp,right);

      this.restoreNeighbor(rightright,right);

      this.restoreNeighbor(bottomrightRight,bottomright);

      this.restoreNeighbor(bottomrightDown,bottomright);

      this.restoreNeighbor(bottomDown,bottom);

      this.restoreNeighbor(bottomLeft,bottom);

      this.restoreNeighbor(left,cell);



      //in tower

      if (bottom && !bottom.neighbors.includes(cell))
         bottom.neighbors.push(cell);

      if (cell && !cell.neighbors.includes(bottom))
            cell.neighbors.push(bottom);

      if (right && !right.neighbors.includes(cell))
               right.neighbors.push(cell);

      if (cell && !cell.neighbors.includes(right))
                        cell.neighbors.push(right);


      if (bottomright && !bottomright.neighbors.includes(right))
            bottomright.neighbors.push(right);

      if (right && !right.neighbors.includes(bottomright))
               right.neighbors.push(bottomright);


      if (bottomright && !bottomright.neighbors.includes(bottom))
                     bottomright.neighbors.push(bottom);

      if (bottom && !bottom.neighbors.includes(bottomright))
               bottom.neighbors.push(bottomright);

}

}


module.exports.GameMap = GameMap;
