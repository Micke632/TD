


var messagesEnum =
{
   movement:1,
   render:2,
   hp:4,
   damage:8,
   friction:16,
   route:32

}



class TObject
{
   constructor()
   {

      this.components = [];
      this.observers = new Map();
      this.observersGetter = new Map();
      this.remove = false;
      this.time  = 0;
   }

   initComponents()
   {
      for (let i=0;i<this.components.length;i++)
      {
         this.components[i].init();
      }

   }

   add(c)
   {
      c.parent  =this;
      this.components.push(c)
   }


   update(delta)
   {
      if (this.remove) return;
      this.time+=delta;

      for (let i=0;i<this.components.length;i++)
      {
         this.components[i].update(delta);
      }
   }

   register(component,message)
   {
      if (this.observers.has(component))
      {
         let l = this.observers.get(component);
         l+=message;
         this.observers.set(component,l);
      }
      else
         this.observers.set(component,message);
   }

   registerGetter(component,message)
   {
      this.observersGetter.set(message,component);
   }

   get(message)
   {

      if (this.observersGetter.has(message))
      {
         let l = this.observersGetter.get(message);
         return l.get(message);
      }

      return null;
   }

   send(message,value)
   {

      this.observers.forEach(function(v,k,m)
         {
            if (message & v)
            {
               k.receive(message,value);
            }
         });
   }

   show() {}

   doOnDead()
   {
   }


}

class EnemyObject extends TObject
{
   constructor(start)
   {
      super();

      this.i = start.i;
      this.j = start.j;
      this.vector = createVector(gameMap.getX(this.i), gameMap.getY(this.j));
      this.cell  = this.getCellAtMe();
      this.speed  = 1;
      this.direction  = Statics.getRight();
      this.end = Statics.exitCells[0];
      this.prio = 10;
      this.name = "Vanilla";
   }

   getName()
   {
      return this.name;
   }



   getCellAtMe()
   {
      let i = gameMap.getI(this.vector.x);
      let j = gameMap.getJ(this.vector.y);
      return  gameMap.getCell(i,j);
   }

   doOnDead()
   {
      if (this.remove) return;

      g_points +=this.points;

      g_total_score += this.points;
      this.remove = true;

      for (let i=0;i<this.components.length;i++)
      {
         this.components[i].doOnDead();
      }
   }


   doOnReachEnd()
   {
      for (let i=0;i<this.components.length;i++)
      {
         this.components[i].doOnReachEnd();
      }
   }



}



class FlyingtObject extends EnemyObject
{
   constructor(start, images, hp)
   {
      super(start);

      let healthComponent = new HealthComponent(false,hp);
      this.speed =1;
      this.trans = new FlyingTransformComponent(images[0].width/2,images[0].height/2) ;
      this.add(healthComponent);
      this.add(new FlyingComponent());
      this.add(this.trans);
      this.add( new EnemyGraphicComponent(images,healthComponent, this.trans) );

      this.name ="Flier";
      this.direction = this.i==0?Statics.getRight():Statics.getDown();

   }


/*
   update(delta)
   {
      if (this.remove) return;
      this.time+=delta;

      for (let i=0;i<this.components.length;i++)
      {
         this.components[i].update(delta);
      }
   }
*/

}
