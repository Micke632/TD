




var PathResultEnum =
{
   ENUM_GO_ON:0,
   ENUM_NEW_CELL:1,
   ENUM_REACH_DEST:2,
   ENUM_STUCK : 3,
   ENUM_LOST:4,

};


class PathHelper
{
   constructor(pathFinder,width,height,ch,cw,fnc,maxPixelMove)
   {
      this.nextCell = null;
      this.imageWidth = width;
      this.imageHeight = height;
      this.cell_height = ch;
      this.cell_width  = cw;
      this.mw = pathFinder;
      this.maxmov = maxPixelMove;
      this.direction = 0;
      this.stuck = false;
      this.fnc  = fnc;
      this.max = maxPixelMove;
   }

   getDirection()
   {
      return this.direction;
   }

   getMaxDistance()
   {
      return this.maxmov;
   }

   isStuck()
   {
      return this.stuck;
   }

   getPathLength()
   {
      return this.mw.path.length;
   }


   calcRoute(fromCell, toCell, allExits)
   {

      let ok = this.mw.findRoute(this.fnc,true,fromCell,toCell,allExits);


      this.nextCell = this.getNextCellFrom(fromCell);
      if (this.nextCell)
      {
         this.maxmov = this.max;
         this.direction = this.getNewDirection(this.nextCell,fromCell);
         this.stuck = false;
      }
      else if (!ok){
          this.maxmov = 0;
          this.stuck = true;
      }

      return ok;

   }

   setRoutePath(p)
   {
      this.mw.path = p.slice();
   }





   //get new path if needed
  //returns:
  //const ENUM_GO_ON = 0;
  //const ENUM_NEW_CELl = 1;
  //const ENUM_REACH_DEST = 2;
  //const ENUM_STUCK = 3;
//  const ENUM_LOST = 4;
   checkPath(cell,x,y)
   {

      if (cell && (cell ==  this.nextCell) )
      {
         //get next direction

         //before moving to next cell make sure the image are inside the cell

         let pixels_until_inside = this.inside(cell,x,y);
         if ( pixels_until_inside == 0)
         {
            this.nextCell = this.getNextCellFrom(cell);
            if (this.nextCell)
            {
               this.maxmov =this.max;
               this.direction = this.getNewDirection(this.nextCell,cell);
               return PathResultEnum.ENUM_NEW_CELL;
            }
         }
         {
            this.maxmov = pixels_until_inside;
            return PathResultEnum.ENUM_GO_ON;

         }
      }

      if ( !cell || (cell.tower || cell.hidden) )
      {
         return PathResultEnum.ENUM_LOST;
      }


      if (this.stuck)
      {
         return PathResultEnum.ENUM_STUCK;
      }



     if (!this.nextCell)
     {
        return PathResultEnum.ENUM_REACH_DEST;
     }


      return PathResultEnum.ENUM_GO_ON;
   }

   getNextCell()
   {

      return this.mw.getNextPath();

   }



   setNextCellFrom(cell)
   {
      this.nextCell = this.getNextCellFrom(cell);
      if (this.nextCell)
         this.direction = this.getNewDirection(this.nextCell,cell);
   }

   getNextCellFrom(from)
   {
      let cell = this.getNextCell();

      if ( cell && (cell != from) )
      {
         return  cell;
      }
      else if (cell)
      {
         return this.getNextCellFrom(from);
      }
      return null;

   }

   getNewDirection(cell,fromCell)
   {


      if (cell.i > fromCell.i)
      {
         return 0;
      }
      else if (cell.i < fromCell.i)
      {
         return 1;
      }
      else if (cell.j > fromCell.j)
      {
         return 2;
      }
      else
      {
         return 3;
      }

   }

   inside(cell,x,y)
   {

      if (this.direction==3)   //up
      {

         let cell_y_d = cell.y + this.cell_height;
         //make sure the bottom is above

         let ydiff = y + this.imageHeight - cell_y_d;

         if (ydiff <  2)
         {
            return 0;
         }
         else
         {
            return ydiff;

         }


      }
      else if (this.direction==1)   //left
      {
         let cell_r = cell.x +this.cell_width;
         let xdiff =  x + this.imageWidth -  cell_r ;
         if ( xdiff < 2  )
         {
            return 0;
         }
         else
         {
            return xdiff;
         }
      }
      else{
         return 0;
      }
   }


}

module.exports.PathHelper = PathHelper;
