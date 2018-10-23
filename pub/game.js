


class Game
{
	constructor()
	{
		this.nrOfLevels  = 0;
		this.levels = [];
		this.reset();
	}

	reset()
	{
		this.leveltime = 0;
		this.time   = 0;
		this.timer = 0;
		this.tower1=null;
		this.tower2=null;
		this.tower3=null;
		if (!this.levels.length  ||  this.levels.length < this.nrOfLevels)
		{	//dont erase at start..
			this.levels = [];
			this.levels = [new Level1(),new Level2(),new Level3(), new Level4(),new Level5(),new Level6(),new Level7(),new Level8(),new Level9(),new Level10(this),new Level11(),new Level12(),new Level13(),new Level14(),new Level15(),new Level16(),new Level17(),new Level18(),new Level19(),new Level20(), new Level21(),new Level22(),new Level23(this),new Level24(),new Level25(),new Level26(),new Level27(),new Level28(),new Level29(),new Level30(),new Level31(),new Level32(),new Level33(),new Level34(),new Level35(),new Level36(),new Level37(),new Level38(),new Level39(),new Level40(),new Level41(),new Level42(),new Level43(),new Level44(),new Level45(),new Level46(),new Level47(),new Level48(), new Level49(), new Level50(),new Level51(),new Level52(), new Level53(), new Level54() , new Level55(), new Level56(), new Level57(), new Level58(), new Level59()]
		}
		this.nrOfLevels = this.levels.length;

	}


	createHeadline()
	{
		if (g_towers.length < 3) return;

		sortTowers();

		this.tower1 = g_towers[0];
		this.tower2 = g_towers[1];
		this.tower3 = g_towers[2];

		this.tower1.text= "1";
		this.tower2.text= "2";
		this.tower3.text= "3";
		let s = "Best towers: 1:"+this.tower1.tower_score + "...2:"+this.tower2.tower_score+"...3:"+ this.tower3.tower_score;
		g_headlines.push(s);
		this.timer = this.time;

	}

	increaseTime(t)
	{
		this.leveltime+=t;
	}


	getLevelTime()
	{
		return this.leveltime;
	}

	update(timed)
	{

		if (!this.levels.length) return false;

		this.leveltime += timed;
		this.time +=timed;


		this.levels[0].run(this.time);

		if(this.leveltime > LEVEL_TIME)
		{
			//this.currentLevel++;
			if (this.levels.length)
			{
				this.levels.shift();
			}

			if (!this.levels.length)
			{
				levelsDone();
			}

			this.leveltime = 0;
			return true;
		}

		if (this.timer > 0)
		{
			let t = this.time - this.timer;
			if (t > 10000)
			{
				this.timer=0;
				this.tower1.text="";
				this.tower2.text="";
				this.tower3.text="";
				this.tower1=null;
				this.tower2=null;
				this.tower3=null;
			}
		}

		return false;
	}
}



class Level1
{
	constructor()
	{
		this.level = 1;
		this.last  = 0;
		this.e = 3;
		this.done = false;

	}



	run(timed)
	{


		if ( timed - this.last  >= 1000 && this.e > 0)
		{

			enemyManager.createEnemies(2,EnemyType.VANILLA,1);
			this.last = timed;
			this.e --;
		}


	}

}

class Level2
{
	constructor()
	{
		this.level = 2;
		this.last  = 0;
		this.e = 3;
		this.done = false;
	}

	run(now)
	{


		if (!this.done)
		{
			enemyManager.createEnemies(1,EnemyType.BIG,2);
			this.done  =true;
			return;
		}
		if ( now - this.last  >= 1500 && this.e > 0)
		{

			enemyManager.createEnemies(2,EnemyType.VANILLA,2);
			this.last = now;
			this.e --;
		}


	}

}

class Level3
{
	constructor()
	{
		this.level = 3;
		this.last  = 0;
		this.e = 3;
		this.d = 1;
		this.done  =false;
	}



	run(now)
	{


		if ( now - this.last  >= 1500 && this.e > 0)
		{

			enemyManager.createEnemies(4,EnemyType.VANILLA,3);
			this.last = now;
			this.e --;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BIG,3);
				this.last = now;
				this.d --;
			}

		}
	}

}

class Level4
{
	constructor()
	{
		this.level = 4;
		this.last  = 0;
		this.e = 1;
		this.done = false;
	}



	run(now)
	{


		if ( now - this.last  >= 600 && this.e > 0)
		{

			enemyManager.createEnemies(1,EnemyType.STONE,4);
			this.last = now;
			this.e --;
		}


	}

}

class Level5
{
	constructor()
	{
		this.level = 5;
		this.last  = 0;
		this.e = 1;
		this.done = false;
		this.d = 1;
	}



	run(now)
	{


		if (!this.done)
		{
			enemyManager.createEnemies(1,EnemyType.GRRR,5);
			this.done  =true;
			this.last = now;
			return;
		}

		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BIG,5);
				this.last = now;
				this.d --;
			}
		}

	}

}

class Level6
{
	constructor()
	{
		this.level = 6;
		this.last  = 0;
		this.e = 1;
		this.done = false;
		this.d = 2;
	}





	run(now)
	{

		//let now = millis();
		if (!this.done)
		{
			enemyManager.createEnemies(1,EnemyType.STONE,6);
			this.done  =true;
			this.last = now;

			g_headlines.push("Next level.....planes!!")

			return;
		}
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(1,EnemyType.BIG,6);
				this.last = now;
				this.d --;
			}
		}

	}

}

class Level7
{
	constructor()
	{
		this.level = 7;
		this.last  = 0;
		this.done = false;

	}




	run(now)
	{


		if (!this.done)
		{
			enemyManager.createPlanes(2,7);
			this.done  =true;


		}

	}

}

class Level8
{
	constructor()
	{
		this.level = 8;
		this.last  = 0;

		this.done = false;

	}



	run(timed)
	{


		if (!this.done)
		{
			enemyManager.createEnemies(1,EnemyType.MORPHG,8);
			this.done  =true;

		}

	}

}

class Level9
{
	constructor()
	{
		this.level = 9;
		this.last  = 0;
		this.e = 1;
		this.done = false;
		this.d = 2;
	}


	run(now)
	{


		if (!this.done)
		{
			enemyManager.createEnemies(1,EnemyType.GRRR,9);
			this.done  =true;
			this.last = now;
			return;
		}
		if ( now - this.last  >= 2000 && this.e > 0)
		{

			enemyManager.createEnemies(1,EnemyType.SPIDER,9);
			this.last = now;
			this.e --;
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(1,EnemyType.BIG,9);
				this.last = now;
				this.d --;
			}
		}

	}

}

class Level10
{
	constructor(h)
	{
		this.level = 10;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d = 5;
		this.first=false;
		this.home  =h;
	}





	run(now)
	{
		if (!this.first)
		{
			this.first=true;
			this.home.createHeadline();
		}


		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createEnemies(1,EnemyType.SPIDER,10);


			this.last = now;

			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(5,EnemyType.VANILLA,10);
				this.last = now;
				this.d --;
			}
		}

	}

}

class Level11
{
	constructor()
	{
		this.level = 11;
		this.last  = 0;
		this.e =2;


	}



	run(now)
	{



		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createEnemies(1,EnemyType.STONE,11);
			this.last = now;
			this.e--;
		}

	}

}

class Level12
{
	constructor()
	{
		this.level = 12;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
	}



	run(now)
	{


		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createEnemies(1,EnemyType.GRRR,12);
			//this.done  =true;
			this.last = now;
			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BIG,12);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level13
{
	constructor()
	{
		this.level = 13;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =1;
	}


	run(now)
	{


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.SPIDER,13);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,13);
				//this.done  =true;
				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(1,EnemyType.BIG,13);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level14
{
	constructor()
	{
		this.level = 14;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =1;
	}




	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.KAKA,14);
			this.last = now;
			this.c --;
		}

	}

}

class Level15
{
	constructor()
	{
		this.level = 15;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}




	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.SPIDER,15);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,15);
				//this.done  =true;
				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BIG,15);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level16
{
	constructor()
	{
		this.level = 16;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first = false;
	}




	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...... more PLANES!!..");
		}



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.MORPHG,16);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,16);
				//this.done  =true;
				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,16);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level17
{
	constructor()
	{
		this.level = 17;
		this.last  = 0;
		this.e =1;
		this.d =1;
		this.done = false;
		this.x = 0;
		this.first=false;
	}




	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:....it will try do disable your number 1 tower..");
		}


		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createPlanes(2,17);


			this.last = now;
			this.done  =true;
			this.x=1;
			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createPlanes(1,17);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level18
{
	constructor()
	{
		this.level = 18;
		this.last  = 0;
		this.e =1;
		this.done = false;

	}



	run(now)
	{


		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createSeeker(18);


			this.last = now;
			this.done  =true;

			this.e--;
		}


	}

}

class Level19
{
	constructor()
	{
		this.level = 19;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}




	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.MORPHG,19);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,19);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,19);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level20
{
	constructor()
	{
		this.level = 20;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first = false;
	}





	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...an enemy that will disable your towers..how rude");
		}



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.KAKA,20);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,20);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(1,EnemyType.STONE,20);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level21
{
	constructor()
	{
		this.level = 21;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.POISON,21);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.SPIDER,21);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,21);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level22
{
	constructor()
	{
		this.level = 22;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first = false;
	}

	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:......two BOSS'ES.. they are fast!");
		}


		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(3,EnemyType.STONE,22);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level23
{
	constructor(h)
	{
		this.level = 23;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.home =h;
	}

	run(now)
	{


		if (!this.done)
		{
			this.home.createHeadline();
			this.done = true;
		}


		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BOSS,23);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level24
{
	constructor()
	{
		this.level = 24;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =1;
		this.first=false;
	}

	run(now)
	{

		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...planes again....");
		}


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.GRRR,24);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.SPIDER,24);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BIG,24);
				this.last = now;
				this.d --;
			}
		}



	}

}
class Level25
{
	constructor()
	{
		this.level = 25;
		this.last  = 0;
		this.e =1;
		this.d =1;
		this.done = false;
		this.x = 0;
	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.e > 0)
		{
			enemyManager.createPlanes(2,25);


			this.last = now;
			this.done  =true;
			this.x=1;
			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createPlanes(2,25);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level26
{
	constructor()
	{
		this.level = 26;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.KAKA,26);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2000 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,26);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,26);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level27
{
	constructor()
	{
		this.level = 27;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =2;
	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.IMMUNE,27);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,27);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level28
{
	constructor()
	{
		this.level = 28;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.MORPHG,28);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,28);
				this.last = now;
				this.d --;
			}
		}

		if (this.d==0)
		{
			if ( now - this.last  >= 1000 && this.e > 0)
			{

				enemyManager.createEnemies(1,EnemyType.SPIDER,28);
				this.last = now;
				this.e --;
			}
		}


	}

}

class Level29
{
	constructor()
	{
		this.level = 29;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =8;
	}

	run(now)
	{



		if ( now - this.last  >= 1000 && this.c > 0)
		{

			enemyManager.createEnemies(12,EnemyType.VANILLA,29);
			enemyManager.createEnemies(1,EnemyType.BIG,29);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.SPIDER,29);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level30
{
	constructor()
	{
		this.level = 30;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first = false;
	}

	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:....it will try do disable your number 1 tower..");
		}


		if ( now - this.last  >= 1000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.GRRR,30);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.SPIDER,30);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level31
{
	constructor()
	{
		this.level = 31;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d = 1;
		this.first = false;
	}

	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...planes..AA guns ready?");
		}


		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createSeeker(31);


			this.last = now;
			this.done  =true;
			this.x=1;
			this.e--;
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.SPIDER,31);
				this.last = now;
				this.d --;
			}
		}

	}

}

class Level32
{
	constructor()
	{
		this.level = 32;
		this.last  = 0;
		this.e =1;
		this.d =1;
		this.done = false;

	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.e > 0)
		{
			enemyManager.createPlanes(2,32);


			this.last = now;
			this.done  =true;

			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createPlanes(2,32);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level33
{
	constructor()
	{
		this.level = 33;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BOSS,33);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level34
{
	constructor()
	{
		this.level = 34;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =2;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.IMMUNE,34);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,34);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level35
{
	constructor()
	{
		this.level = 35;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.KAKA,35);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2000 && this.e > 0)
			{
				enemyManager.createEnemies(2,EnemyType.GRRR,35);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,35);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level36
{
	constructor()
	{
		this.level = 36;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.MORPHG,36);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,36);
				this.last = now;
				this.d --;
			}
		}

		if (this.d==0)
		{
			if ( now - this.last  >= 1000 && this.e > 0)
			{

				enemyManager.createEnemies(2,EnemyType.SPIDER,36);
				this.last = now;
				this.e --;
			}
		}


	}

}
class Level37
{
	constructor()
	{
		this.level = 37;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first=false;
	}

	run(now)
	{

		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...it will disable your towers..annoying");
		}


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(3,EnemyType.GRRR,37);
			this.last = now;
			this.c --;
		}




	}


}

class Level38
{
	constructor()
	{
		this.level = 38;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first = false;
	}

	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:....PLANES!!!");
		}


		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.POISON,38);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.SPIDER,38);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,38);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level39
{
	constructor()
	{
		this.level = 39;
		this.last  = 0;
		this.e =1;
		this.d =1;


	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.e > 0)
		{
			enemyManager.createPlanes(3,39);
			this.last = now;
			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createPlanes(3,39);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level40
{
	constructor()
	{
		this.level = 40;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{




		if ( now - this.last  >= 2000 && this.d > 0)
		{

			enemyManager.createEnemies(2,EnemyType.BOSS,40);
			this.last = now;
			this.d --;
		}




	}

}

class Level41
{
	constructor()
	{
		this.level = 41;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =4;
	}

	run(now)
	{




		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.GRRR,10);  //10 to make em weaker
			this.last = now;
			this.c --;
		}




	}


}
class Level42
{
	constructor()
	{
		this.level = 42;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.KAKA,42);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2000 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,42);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,42);
				this.last = now;
				this.d --;
			}
		}



	}

}


class Level43
{
	constructor()
	{
		this.level = 43;
		this.last  = 0;
		this.e =2;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		//    let now = millis();

		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(1,EnemyType.GRRR,43);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.e > 0)
			{
				enemyManager.createEnemies(2,EnemyType.SPIDER,43);

				this.last = now;
				this.e--;
			}
		}





	}

}

class Level44
{
	constructor()
	{
		this.level = 44;
		this.last  = 0;
		this.e =4;
		this.done = false;

	}

	run(now)
	{


		//let now = millis();

		if ( now - this.last  >= 1000 && this.e > 0)
		{
			enemyManager.createEnemies(2,EnemyType.STONE,44);
			//this.done  =true;
			this.last = now;
			this.e--;
		}

	}

}


class Level45
{
	constructor()
	{
		this.level = 45;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =3;
		this.c =4;
		this.first = false;
	}

	run(now)
	{

		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:...more planes....");
		}

		//    let now = millis();

		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.IMMUNE,45);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,45);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level46
{
	constructor()
	{
		this.level = 46;
		this.last  = 0;
		this.e =1;
		this.d =1;
		this.first=false;

	}

	run(now)
	{
		if (!this.first)
		{
			this.first = true;
			g_headlines.push("Upcomming:....it will DESTROY towers..");
		}

		//let now = millis();

		if ( now - this.last  >= 2000 && this.e > 0)
		{
			enemyManager.createPlanes(4,46);


			this.last = now;


			this.e--;
		}
		if (this.e==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createPlanes(4,46);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level47
{
	constructor()
	{
		this.level = 47;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d = 2;
		this.g = 2;
	}

	run(now)
	{

		//let now = millis();

		if ( now - this.last  >= 2500 && this.e > 0)
		{
			enemyManager.createSeeker2(47);


			this.last = now;
			this.done  =true;
			this.x=1;
			this.e--;
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 5000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.SPIDER,47);
				this.last = now;
				this.d --;
			}
		}
		if (this.d==0)
		{
			if ( now - this.last  >= 5000 && this.g > 0)
			{


				enemyManager.createMinion();
				this.last = now;
				this.g --;
			}
		}

	}

}
class Level48
{
	constructor()
	{
		this.level = 48;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		//let now = millis();

		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.MORPHG,48);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,48);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level49
{
	constructor()
	{
		this.level = 49;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =2;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.IMMUNE,49);
			this.last = now;
			this.c --;
		}


		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,49);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level50
{
	constructor()
	{
		this.level = 50;
		this.last  = 0;
		this.e =1;
		this.d =1;
		this.c =1;
		this.first=false;

	}

	run(now)
	{
		if ( now - this.last  >= 1000 && this.c > 0)
		{

			enemyManager.createEnemies(4,EnemyType.IMMUNE,50);
			this.last = now;
			this.c --;
		}
		if (this.c==0)
		{
			if ( now - this.last  >= 2000 && this.e > 0)
			{
				enemyManager.createPlanes(4,50);

				this.last = now;

				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{1

				enemyManager.createPlanes(4,50);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level51
{
	constructor()
	{
		this.level = 51;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
	}

	run(now)
	{


		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BOSS,51);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level52
{
	constructor()
	{
		this.level = 52;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =1;
		this.c =1;
		this.first=false;
	}

	run(now)
	{



		if ( now - this.last  >= 1000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.GRRR,52);
			this.last = now;
			this.c --;
		}
		if (this.c == 0)
		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.GRRR,52);
				this.last = now;
				this.d--;
			}
		}



	}


}

class Level53
{
	constructor()
	{
		this.level = 53;
		this.last  = 0;
		this.e =2;
		this.done = false;
		this.d =1;
		this.c =2;
	}

	run(now)
	{


		//    let now = millis();

		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.GRRR,53);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 1000 && this.e > 0)
			{
				enemyManager.createEnemies(2,EnemyType.SPIDER,53);

				this.last = now;
				this.e--;
			}
		}





	}

}

class Level54
{
	constructor()
	{
		this.level = 54;
		this.last  = 0;
		this.e =5;
		this.done = false;

	}

	run(now)
	{


		//let now = millis();

		if ( now - this.last  >= 1000 && this.e > 0)
		{
			enemyManager.createEnemies(2,EnemyType.STONE,54);
			//this.done  =true;
			this.last = now;
			this.e--;
		}

	}

}

class Level55
{
	constructor()
	{
		this.level = 55;
		this.last  = 0;
		this.e =1;
		this.d =2;
		this.c =1;
		this.first=false;

	}

	run(now)
	{

	//	if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createPlanes(4,55);
				this.last = now;
				this.d --;
			}
		}


	}

}

class Level56
{
	constructor()
	{
		this.level = 56;
		this.last  = 0;
		this.e =2;
		this.done = false;
		this.d =2;
		this.c =2;
	}

	run(now)
	{



		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.KAKA,56);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2000 && this.e > 0)
			{
				enemyManager.createEnemies(1,EnemyType.GRRR,56);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,56);
				this.last = now;
				this.d --;
			}
		}



	}

}



class Level57
{
	constructor()
	{
		this.level = 57;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =1;
		this.first=false;
	}

	run(now)
	{




		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.GRRR,57);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if ( now - this.last  >= 2500 && this.e > 0)
			{
				enemyManager.createEnemies(2,EnemyType.SPIDER,57);

				this.last = now;
				this.e--;
			}
		}

		if (this.e==0)
		{
			if ( now - this.last  >= 2500 && this.d > 0)
			{

				enemyManager.createEnemies(4,EnemyType.BIG,57);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level58
{
	constructor()
	{
		this.level = 58;
		this.last  = 0;
		this.e =2;
		this.done = false;
		this.d =5;
		this.c =1;
	}

	run(now)
	{

		if ( now - this.last  >= 2000 && this.c > 0)
		{

			enemyManager.createEnemies(2,EnemyType.MORPHG,58);
			this.last = now;
			this.c --;
		}

		if (this.c==0)
		{
			if  (now - this.last  >= 2000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.STONE,58);
				this.last = now;
				this.d --;
			}
		}



	}

}

class Level59
{
	constructor()
	{
		this.level = 59;
		this.last  = 0;
		this.e =1;
		this.done = false;
		this.d =2;
		this.c =1;
	}

	run(now)
	{


		{
			if ( now - this.last  >= 1000 && this.d > 0)
			{

				enemyManager.createEnemies(2,EnemyType.BOSS,59);
				this.last = now;
				this.d --;
			}
		}



	}

}
