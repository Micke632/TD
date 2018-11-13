
class Render
{
	constructor(){}
	draw(){}
};

class RenderImage extends Render
{
   constructor(image,x,y, transform)
   {
      super();
      this.image = image;
      this.x = x;
      this.y = y;
      this.transform = transform;
   }

   draw()
   {
      this.transform.transform(this.x,this.y);
      image(this.image,this.transform.getX(),this.transform.getY());
      this.transform.after();
   }
}

class RenderHp extends Render
{
	constructor(x,y,w,l)
   {
      super();
      this.x = x;
      this.y = y;
      this.w = w;
      this.l  =l;
   }
	draw()
   {
      stroke(color('green'));
      strokeWeight(3);
      line(this.x,this.y-5,this.x+ ( this.w * this.l),this.y-5);
      noStroke();
      strokeWeight(1); ;
   }
};

class RenderSeekerAim extends Render
{
	constructor(x,y,aim,l)
   {
      super();
      this.x = x;
      this.y = y;
      this.aim = aim;
      this.l = l;

   }
	draw()
   {

      stroke(color('red'));
      strokeWeight(3);
      line(this.x+10,this.y+10,this.x+10 + this.aim.x*this.l,this.y+10-this.aim.y*this.l);
      noStroke();
      strokeWeight(1);

   }
};



class RenderSystem
{
   constructor()
   {

		this.renderObjects = [];

   }

   addRender(f)
   {
      this.renderObjects.push(f);
   }


   draw()
   {

		while (this.renderObjects.length)
		{
         let o = this.renderObjects.pop();
		   o.draw();
		}

   }

}
