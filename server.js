var express  = require("express");
var helmet  = require("helmet");
//var mongoose  = require("mongoose");
var bodyParser = require("body-parser");
/*
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open',function() {
  console.log("connected to db");
});

db.on('error',function(err) {
  console.error(err);
});
*/

const mysql = require('mysql');

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'apa$123',
  database : 'node'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    console.log(err);
    return;
  }
  console.log('Connection established');
});


var app = express();

//let Score = require('./models/score');


var server = app.listen(8000, function(){
  console.log("server started")
});

app.use(helmet());
app.use(express.static('pub'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/getBestScore',function(req,res) {
   con.query('SELECT * FROM scores ORDER BY score DESC LIMIT 5', (err,rows) => {
      if(err) throw err;

      console.log('Data received from Db:\n');
      console.log(rows);

      let objToJson = rows;
      let response = [];
      for (let key in rows) {
         response.push(rows[key]);
      }
      objToJson.response = response;
      let finalresponse = JSON.stringify(objToJson);
      //console.log(finalresponse);
      res.send(finalresponse) ;
   });
})


/*
app.get('/getBestScore',function(req,res) {

    let q = Score.find();

    q.limit(5);
    q.sort( {score:-1});
    q.exec(function(err,scores) {
      if (err)  {
          console.error(err);
      }
      else {
          res.send(scores) ;
      }

    });

});
*/


/*
app.get('/getBestTowers',function(req,res) {

    let q = Score.find();

    q.limit(5);
    q.sort( {best_tower_score:-1});
    q.exec(function(err,scores) {
      if (err)  {
          console.error(err);
      }
      else {
          res.send(scores) ;
      }

    });

});
*/
async function haveBetterScore(user,score)
{
  let q = Score.find();
  q.where("user").equals(user);
  q.where("score").gte(score);
  let scores =  await q.exec();
  return scores;

}

async function removeScoresLowerThan(user,score)
{
  let q = Score.deleteMany();
  q.where("user").equals(user);
  q.where("score").lt(score);
  let scores =  await q.exec();
  return scores;

}
 app.post('/save',function(req,res) {

    const user = req.body.user;
    const score = req.body.score;

    if ((user.length == 0) ||  (score <  100) || (score >  100000))
    {
         res.send("INVALID");
         return;
    }

    con.query('SELECT * FROM scores WHERE user = ?',user, (err,rows) => {
      if(err) throw err;
      if (rows.length)
      {
         console.log(rows[0].score );

         if (rows[0].score >= score)
         {
            //better score available
             res.send("2");
             return;
         }else {
            con.query('UPDATE scores SET score=? ,date=?,best_tower_score=?,best_tower_type=? WHERE user = ?', [score,new Date(),req.body.best_tower_score,req.body.best_tower_type,user],
            (err,result) => {
               if (err) throw err;

               console.log(`Changed row(s)`);
            });
         }
     }
     else {
        con.query('INSERT INTO  scores SET user =?, score=? ,date=?,best_tower_score=?,best_tower_type=? ', [user,score,new Date(),req.body.best_tower_score,req.body.best_tower_type],
        (err,result) => {
           if (err) throw err;

           console.log(`inserted row(s)`);

            res.send("1");
        });
     }


  });


 });

// app.post('/save',function(req,res) {
//
//   const user = req.body.user;
//   const score = req.body.score;
//
//   if ((user.length == 0) ||  (score <  100) || (score >  100000))
//   {
//     res.send("INVALID");
//     return;
//   }
//
//   const scores =  haveBetterScore(user,score);
//
//   scores.then(function(result)
//   {
//     if (!result.length)
//     {
//      console.log("store new");
//
//      let s = new Score();
//      s.user = user;
//      s.score =score;
//      s.best_tower_score = req.body.best_tower_score;
//      s.best_tower_type = req.body.best_tower_type;
//      s.date  = new Date();
//      s.save( function(err)
//      {
//        if (err)
//        {
//          console.error(err);
//          res.send("ERROR");
//        }
//        else {
//          res.send("1");
//        }
//
//
//
//      });
//
//       removeScoresLowerThan(user,score);
//
//    }
//    else {
//         console.log("found better");
//         res.send("2");
//    }
//
//  });


//});
