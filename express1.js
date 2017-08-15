var http = require('http');
var fs = require('fs');
var path = require('path');

var express = require('express');
var app = express();
var jsonStr="";

var jsonDate = new Date();//json with winRate (change twice a day);
var str = "";
var champFullStr = "";
var champStr = "";
var itemStr = "";
var masteryStr = "";
var runeStr = "";
var summonerStr = "";
var fiveDayStr = "";


var fiveDaysWinRateArray = [];
var currentDate;
var currentDayWinRateString = "";
var temp;



//app.set('port', process.env.PORT || 3000);

//app.listen(3000);

function serverCall1(http1,started){ 
var myurl1 = "/v2/champions?&limit=900&api_key=5df59c3c1ea850a631d859fbbecb522b";
var options1 = {
    host: 'api.champion.gg',
    path: myurl1
  }
callback1 = function(response) {
  response.on('data', function (chunk) {   //save json string in variable str
    currentDayWinRateString += chunk;
  });
  response.on('end', function () {

    fs.readFile('fiveDaysWinRate.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      
      //currentDate = new Date();
      if (data != "") {
        fiveDaysWinRateArray = JSON.parse(data);
      }
      if (fiveDaysWinRateArray.length < 5) {
        fiveDaysWinRateArray.push({"date": new Date(), "data": currentDayWinRateString});
        currentDayWinRateString = "";
        
      }
      else {
        //console.log(fiveDaysWinRateArray[4].date);
        //console.log((fiveDaysWinRateArray[4].date).getMonth());
        //console.log("testing "+(fiveDaysWinRateArray[4].date).getDate());
        if ((new Date()).getDate() != (new Date(fiveDaysWinRateArray[4].date)).getDate()) {
          fiveDaysWinRateArray.shift();
          fiveDaysWinRateArray.push({"date": new Date(), "data": currentDayWinRateString});
          console.log("inserted "+(fiveDaysWinRateArray[4].date).getDate());
          console.log(fiveDaysWinRateArray[4].date.getMonth());
        //}
      }
      currentDayWinRateString = "";
    }
      temp = JSON.stringify(fiveDaysWinRateArray);
      fs.writeFile('fiveDaysWinRate.txt', temp, function (err) {
        if (err) {
            return console.log(err);
          }
        console.log('done five');

      });
     
      //res.send(data);      
  });

    //console.log("DONE ");
    if (!started) {
      app.listen(process.env.PORT || 3000);
    }
    
  });
  // currentDayWinRateString = "";
  }

  //  end of callback1 definition
 
  http1.request(options1, callback1).end();
  //  end of serverCall1
}

serverCall1(http,false);
setInterval(serverCall1,1000*60*60,http,true);

setInterval(function(){console.log("test setInterval");
}, 32000);

app.use("/public", express.static(__dirname + '/public'));
app.use("/bower_components", express.static(__dirname + '/bower_components'));
//================================================


// fs.readFile('s1.txt', 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   jsonStr1 = data;
//   console.log(data);
// });
//*********************************************************************************************
app.get("/hashesForChamp1", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  
    fs.readFile('champ1hashes.txt', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      
      res.send(data);
    });
  
});
//******************************************************************************
app.get("/statsForChamp51", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  
    fs.readFile('stats51ADC.js', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      
      res.send(data);
    });
  
});
//****************************************************
app.get("/statsForChamp84", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  
    fs.readFile('stats84MiddleTop.js', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      
      res.send(data);
    });
  
});





//************************************************************************

// THIS PROGRAM READS all champs info from a local file with CACHING


app.get("/champFullData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (champFullStr != "") {
    // console.log("11111111111111111111");
    return res.send(champFullStr);
  } else {
    fs.readFile('dragon1/championFull.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      champFullStr = data;
      // console.log("33333333333333333");
      // console.log(data);
      res.send(data);
  });
}
});



app.get("/champData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (champStr != "") {
    // console.log("11111111111111111111");
    return res.send(champStr);
  } else {
    fs.readFile('dragon1/champion.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      champStr = data;
      // console.log("33333333333333333");
      // console.log(data);
      res.send(data);
  });
}
});


app.get("/itemData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (itemStr != "") {
    // console.log("11111111111111111111");
    return res.send(itemStr);
  } else {
    fs.readFile('dragon1/item.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      itemStr = data;
      // console.log("33333333333333333");
      // console.log(data);
      res.send(data);
  });
}
});

//============================================WORKING


// app.get("/masteryData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
// //res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
//   if (masteryStr != "") {
//     console.log("11111111111111111111");
//     res.setHeader('Content-Type', 'application/json');
//     return res.send(masteryStr);
//   } else {
//     fs.readFile('dragon1/mastery.json', 'utf8', function (err,data) {
//       if (err) {
//         return console.log(err);
//       }
//       masteryStr = data;
//       console.log("33333333333333333");
//       // console.log(data);
//       res.setHeader('Content-Type', 'application/json');
//       res.send(data);
//   });
// }
// });

//======================WORKING AND USING PATH.JOIN

app.get("/masteryData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (masteryStr != "") {
    //console.log("11111111111111111111");
    res.setHeader('Content-Type', 'application/json');
    return res.send(masteryStr);
  } else {
    //fs.readFile('dragon1/mastery.json', 'utf8', function (err,data) {

    fs.readFile(path.join(__dirname,'dragon1/mastery.json') , 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    masteryStr = data;
    //console.log("33333333333333333");
    // console.log(data);
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
}
});


// //======================WORKING AND USING PATH.JOIN
// app.get("/masteryData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
// //res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
//     masteryStr ="";
//     fs.readFile(path.join(__dirname,'dragon1/mastery.json') , 'utf8', function (err,data) {

  
//     //fs.readFile('dragon1/mastery.json', 'utf8', function (err,data) {
//       if (err) {
//         return console.log(err);
//       }
//       masteryStr = data;
//       // console.log("33333333333333333");
//       // console.log(data);
      
//       res.setHeader('Content-Type', 'application/json');
//       res.send(data);
//       //res.json(data);  NOT WORKING
//   });

// });





//=======================


app.get("/runeData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (runeStr != "") {
    // console.log("11111111111111111111");
    return res.send(runeStr);
  } else {
    fs.readFile('dragon1/rune.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      runeStr = data;
      // console.log("33333333333333333");
      // console.log(data);

      res.send(data);
  });
}
});


app.get("/summonerData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  if (summonerStr != "") {
    // console.log("11111111111111111111");
    return res.send(summonerStr);
  } else {
    fs.readFile('dragon1/summoner.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      summonerStr = data;
      // console.log("33333333333333333");
      // console.log(data);
      res.send(data);
  });
}
});


app.get("/fiveDayData", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110  
  fs.readFile('fiveDaysWinRate.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    fiveDayStr = data;
    // console.log("33333333333333333");
    // console.log(data);
    res.send(data);
  });
});


//***********************************************************************************

// THIS PROGRAM READS all champs info from a local file


app.get("/champData1", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110

  fs.readFile('map.json', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    champFullStr = data;
    res.send(data);

    console.log(data);
  });
});


//***********************************************************************************

//======================================

app.get("/simple", function(req, res){ //req is string that is the part of url after http://localhost:3000, here url is http://localhost:3000/simple
//res is the response object to show on this url.

  res.send("HI THERE");
});

//=============================


// 1st external call ends
//==========================================


//=============================
// // 1st external call starts
// Takes in 1 parameter id

app.get("/match/:id", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110
  if ( (new Date()) - jsonDate > 60*1000) {
    //console.log("2222222222222222222222");
    res.type("text/plain");
    jsonDate = new Date();
    return res.send(jsonStr);
  }
  if (jsonStr !="") {
    //console.log("11111111111111111111");
    res.type("text/plain");
    jsonDate = new Date();
    return res.send(jsonStr);
  }
  //console.log("33333333333333333");

  //var myurl = "/v2/champions/1/matchups?elo=SILVER&api_key = 5df59c3c1ea850a631d859fbbecb522b";


  //var myurl = "/v2/champions?&champData=kda,damage,averageGames,totalHeal,killingSpree,minions,gold,positions,normalized,groupedWins,trinkets,runes,firstitems,summoners,skills,finalitems,masteries,maxMins,matchups&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";
  var myurl = "/v2/champions/"
  + req.params.id
  + "?&champData=kda,damage,averageGames,minions,gold,positions,normalized,groupedWins,runes,firstitems,summoners,skills,finalitems,masteries,matchups&api_key=5df59c3c1ea850a631d859fbbecb522b"; 




// var myurl = "/v2/champions/"
//   + req.params.id
//   + "?&champData=hashes&api_key=5df59c3c1ea850a631d859fbbecb522b"; 


  //var myurl = "v2/champions/1/matchups&api_key= 5df59c3c1ea850a631d859fbbecb522b";
  var options = {
    host: 'api.champion.gg',
    path: myurl
  };

  //"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";



//this callback is for http, it saves json string in variable jsonStr
  callback = function(response) {
      response.on('data', function (chunk) {   //save json string in variable jsonStr
        jsonStr += chunk;
      });
      response.on('end', function () {
        res.type("text/plain");           
        res.send(jsonStr);


      });
    }
    http.request(options, callback).end();
});


// 1st external call ends
//==========================================




//=============================
// // 1st external call starts
// Takes in 1 parameter id

app.get("/hashes/:id", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"

  var hashStr = "";


  var myurl = "/v2/champions/"
    + req.params.id
    + "?&champData=hashes&api_key=5df59c3c1ea850a631d859fbbecb522b"; 


    //var myurl = "v2/champions/1/matchups&api_key= 5df59c3c1ea850a631d859fbbecb522b";
    var options = {
      host: 'api.champion.gg',
      path: myurl
    };

    //"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";



  //this callback is for http, it saves json string in variable jsonStr
  callback = function(response) {
      response.on('data', function (chunk) {   //save json string in variable jsonStr
        hashStr += chunk;
      });
      response.on('end', function () {
        res.type("text/plain");           
        res.send(hashStr);
      });
    }
    http.request(options, callback).end();
});


// 1st external call ends
//==========================================






//===============================



//==========================================


//===============================


// // 1st external call starts


app.get("/simpleJson", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110
  var myurl = "/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";
  var options = {
    host: 'api.champion.gg',
    path: myurl
};

//"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";



//this callback is for http, it saves json string in variable str
callback = function(response) {
    response.on('data', function (chunk) {   //save json string in variable str
      str += chunk;
    });
    response.on('end', function () {
      res.type("text/plain");
      
      res.send(str);


    });
  }
  http.request(options, callback).end();
 });


// 1st external call ends
//==========================================

// DYNAMIC: the returned json depends on url (url contains parameters for API request from champion.gg)

//===================================================
// // 1st external call starts
// Takes in 1 parameter limit

app.get("/dynamic/:limit", function(req, res){ //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110
  if ( (new Date()) - jsonDate > 60*1000) {
    console.log("2222222222222222222222");
    res.type("text/plain");
    jsonDate = new Date();
    return res.send(jsonStr);
  }
  if (jsonStr !="") {
    console.log("11111111111111111111");
    res.type("text/plain");
    jsonDate = new Date();
    return res.send(jsonStr);
  }
  console.log("33333333333333333");
  var myurl="/v2/champions?"+  
    "&limit="+req.params.limit
    +"&api_key=5df59c3c1ea850a631d859fbbecb522b";
  var options = {
    host: 'api.champion.gg',
    path: myurl
  };

  //"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";



//this callback is for http, it saves json string in variable jsonStr
  callback = function(response) {
      response.on('data', function (chunk) {   //save json string in variable str
        jsonStr += chunk;
      });
      response.on('end', function () {
        res.type("text/plain");           
        res.send(jsonStr);


      });
    }
    http.request(options, callback).end();
});


// 1st external call ends
//==========================================


// 1st external call starts

//Takes in 2 parameters: elo and limit

app.get("/dynamic/:elo/:limit", function(req, res){

  var myurl="/v2/champions?elo="+req.params.elo
    
    +"&limit="+req.params.limit
    +"&api_key=5df59c3c1ea850a631d859fbbecb522b";
  var options = {
    host: 'api.champion.gg',
    path: myurl
};

//"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";

callback = function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
      res.type("text/plain");
      res.send(str);
    });
  }
  http.request(options, callback).end();
 });




//======================================
//A LOT OF INFO FOR ONE CHAMP BOTH STATS AND MATCH
  app.get("/stats/:id", function(req, res){


 //req is string that is the part of url after http://localhost:3000, for example   "/dynamic/110"
//res is the response object to show on this url, res.send("HELLO");   will output string "HELLO" on http://localhost:3000/dynamic/110
  

  // var myurl = "/v2/champions?elo=SILVER&champData=kda,damage,averageGames,totalHeal,killingSpree,minions,gold,positions,normalized,groupedWins,trinkets,runes,"
  // + "firstitems,summoners,skills,finalitems,masteries,maxMins,matchups&limit=200"
  // +"&api_key=5df59c3c1ea850a631d859fbbecb522b";


  var str1 = "";

  var myurl = "/v2/champions/"
  + req.params.id
  
  + "?champData=kda,damage,averageGames,totalHeal,killingSpree,minions,gold,normalized,groupedWins,firstitems,skills,finalitems,matchups&limit=200"


  +"&api_key=5df59c3c1ea850a631d859fbbecb522b";




  var options = {
    host: 'api.champion.gg',
    path: myurl
  };

  //"/v2/champions?&limit=1000&api_key=5df59c3c1ea850a631d859fbbecb522b";



//this callback is for http, it saves json string in variable jsonStr
  callback = function(response) {
      response.on('data', function (chunk) {   //save json string in variable str
        str1 += chunk;
      });
      response.on('end', function () {
        res.type("text/plain");           
        res.send(str1);


      });
    }
    http.request(options, callback).end();
});











