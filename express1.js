var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + '/public'));
app.use("/bower_components", express.static(__dirname + '/bower_components'));
app.listen(process.env.PORT || 3000);

var jsonStr="";
var jsonDate = new Date();
var str = "";
var champFullStr = "";
var champStr = "";
var itemStr = "";
var masteryStr = "";
var runeStr = "";
var summonerStr = "";
var fiveDayStr = "";
var fivePatchStr = "";
var LOLversion = "7.16.1";
var itemString = "";
var masteryString = "";
var runeString = "";
var summonerString = "";
var fiveDaysWinRateArray = [];
var fivePatchWinRateArray = [];
var currentDate;
var currentDayWinRateString = "";
var currentPatchWinRateString = "";
var temp;
var numberOfChamp;
var LOLversion = "7.17.1";
var arrayOfChampIds;
var championFullInfoString = "";
var ObjectOfHashStrings = {};
var ObjectOfStatsStrings = {};

//app.set('port', process.env.PORT || 3000);
//app.listen(3000);

app.post('/excel', function(req, res) { 
    res.json(req.body);
    var excelStr = JSON.stringify(req.body.a);
    fs.writeFile('excelString.txt', excelStr, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('excelString saved');
                }); 
});

function serverCall1(http1){
    var currentDayString = "";
    console.log(new Date());
    console.log("current date " + new Date());
    var myurl1 = "/v2/champions?&limit=900&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options1 = {
        host: 'api.champion.gg',
        path: myurl1
    }
    callback1 = function(response) {
        response.on('data', function (chunk) {   //save json string containing current day data
        // in variable currentDayString
        currentDayString += chunk;
        });
        response.on('end', function () {
            fs.readFile('fiveDaysWinRate.txt', 'utf8', function (err,data) { // reads file, if it is not empty parses it 
            //  and saves it in fiveDaysWinRateArray.
                if (err) {
                    return console.log(err);
                }
                if (data != "") {
                    fiveDaysWinRateArray = JSON.parse(data);
                }
                if (fiveDaysWinRateArray.length < 5) {
                    fiveDaysWinRateArray.push({"date": new Date(), "data": currentDayString});
                } else {
                    if ((new Date()).getDate() != (new Date(fiveDaysWinRateArray[4].date)).getDate()) {
                        fiveDaysWinRateArray.shift();
                        fiveDaysWinRateArray.push({"date": new Date(), "data": currentDayString});
                        console.log("inserted data for date: "+(fiveDaysWinRateArray[4].date).getDate());           
                    }
                }
                currentDayWinRateString = currentDayString;
                temp = JSON.stringify(fiveDaysWinRateArray);
                fiveDayStr = temp;
                fs.writeFile('fiveDaysWinRate.txt', temp, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('fiveDayData saved');
                }); 
            });
        });
    }
    //  end of callback1 definition
     http1.request(options1, callback1).end();
    //  end of serverCall1
}
//=======================================================================
serverCall1(http);
setInterval(serverCall1,1000*60*60*3,http); // serverCall1 is called every 1000*60*60*3 miliseconds = 3 hours
//=======================================================================
function serverCallForPatchWinRate(http1) {
    var currentPatchString = "";
    var myurl1 = "/v2/champions?&limit=900&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options1 = {
        host: 'api.champion.gg',
        path: myurl1
    }
    callback1 = function(response) {
        response.on('data', function (chunk) {   //save json string containing current day data
        // in variable currentDayString
        currentPatchString += chunk;
        });
        response.on('end', function () {
            var currentPatchStringJSON = JSON.parse(currentPatchString);
            var currentPatch = currentPatchStringJSON[0].patch;
            console.log(currentPatch);
            fs.readFile('fivePatchWinRate.txt', 'utf8', function (err,data) { 
                if (err) {
                    return console.log(err);
                }
                if (data != "") {
                    fivePatchWinRateArray = JSON.parse(data);
                }
                if (fivePatchWinRateArray.length < 5) {
                    fivePatchWinRateArray.push({"patch": currentPatch, "data": currentPatchString});
                } else {
                    if (currentPatch != (fivePatchWinRateArray[4].patch)) {
                        fivePatchWinRateArray.shift();
                        fivePatchWinRateArray.push({"patch": currentPatch, "data": currentPatchString});
                        console.log("inserted data for patch: "+(fivePatchWinRateArray[4].patch));           
                    }
                //currentDayString = "";
                }
                currentPatchWinRateString = currentPatchString;
                temp = JSON.stringify(fivePatchWinRateArray);
                fivePatchStr = temp;
                fs.writeFile('fivePatchWinRate.txt', temp, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('fivePatchData saved');
                }); 

            });

        });
    }
    //  end of callback1 definition
    http1.request(options1, callback1).end();    
}
//=============================================================================
serverCallForPatchWinRate(http);
setInterval(serverCallForPatchWinRate,1000*60*60*12,http); // serverCallForPatchWinRate is called every 1000*60*60*12 miliseconds = 12 hours
//==========================================================

/* Reads from a file and sends to clients */
app.get("/fiveDayData1", function(req, res){  
  fs.readFile('fiveDaysWinRate.txt', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    res.send(data);
  });
});
//===========================
app.get("/fiveDayData", function(req, res){ 
    res.send(fiveDayStr);

});
//=====================
app.get("/fivePatchData", function(req, res){ 
    res.send(fivePatchStr);

});
//======================================
// Takes in 1 parameter id

app.get("/hashes/:id", function(req, res){ 

  var hashStr = "";


  var myurl = "/v2/champions/"
    + req.params.id
    + "?&champData=hashes&api_key=5df59c3c1ea850a631d859fbbecb522b"; 


    //var myurl = "v2/champions/1/matchups&api_key= 5df59c3c1ea850a631d859fbbecb522b";
    var options = {
      host: 'api.champion.gg',
      path: myurl
    };

  
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

//=====================================

//Takes in 2 parameters: elo and limit

app.get("/dynamic/:elo/:limit", function(req, res){

  var myurl="/v2/champions?elo="+req.params.elo
    
    +"&limit="+req.params.limit
    +"&api_key=5df59c3c1ea850a631d859fbbecb522b";
  var options = {
    host: 'api.champion.gg',
    path: myurl
};

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
app.get("/statistics/:id", function(req, res){
    var str1 = "";
    var myurl = "/v2/champions/"
    + req.params.id
    + "?champData=kda,damage,averageGames,totalHeal,killingSpree,minions,gold,normalized,groupedWins,"
    + "firstitems,skills,finalitems,matchups&limit=200"
    + "&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options = {
    host: 'api.champion.gg',
    path: myurl
    };
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
            str1 += chunk;
        });
        response.on('end', function () {
            res.type("text/plain");
            res.send(str1);
        });
    }
    http.request(options, callback).end();
});
//=================================
app.get("/runeInfo", function(req, res){
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/rune.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
        str1 += chunk;
        });
        response.on('end', function () {
        res.type("application/json");
        res.send(str1);
        });
    }
    http.request(options, callback).end();
});


//=================================
function getRuneData(http1) {
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/rune.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http1, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {  
        str1 += chunk;
        });
        response.on('end', function () {
        runeString = str1;
        fs.writeFile('data/rune.txt', str1, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('written rune');
            }); 

        });
    }
    http1.request(options, callback).end();
}

// getRuneData(http); // get rune info right away when server starts
// setInterval(getRuneData,1000*60*60*24,http); // getRune is called every 1000*60*60*24 miliseconds = everyday

app.get("/runes", function(req, res){   
    res.type("text/plain");
    res.send(runeString);        
});

//=================================
app.get("/itemInfo", function(req, res){
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/item.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
        str1 += chunk;
        });
        response.on('end', function () {
        res.type("application/json");
        res.send(str1);
        });
    }
    http.request(options, callback).end();
});


//=================================
function getItemData(http1) {
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/item.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http1, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {  
        str1 += chunk;
        });
        response.on('end', function () {
        itemString = str1;
        fs.writeFile('data/item.txt', str1, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('written item data');
            }); 

        });
    }
    http1.request(options, callback).end();
}
//===================================================
// getItemData(http); // get rune info right away when server starts
// setInterval(getItemData,1000*60*60*24,http); // getRune is called every 1000*60*60*24 miliseconds = everyday
//=====================================================

app.get("/items", function(req, res){   
    res.type("text/plain");
    res.send(itemString);        
});

//=================================
app.get("/summonerInfo", function(req, res){ //takes API directly from the internet
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/summoner.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
        str1 += chunk;
        });
        response.on('end', function () {
        res.type("application/json");
        res.send(str1);
        });
    }
    http.request(options, callback).end();
});
//=================================

function getSummonerData(http1) {
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/summoner.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http1, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {  
        str1 += chunk;
        });
        response.on('end', function () {
        summonerString = str1;
        fs.writeFile('data/summoner.txt', str1, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('written summoner data');
            }); 

        });
    }
    http1.request(options, callback).end();
}

// getSummonerData(http); // get rune info right away when server starts
// setInterval(getSummonerData,1000*60*60*24,http); // getRune is called every 1000*60*60*24 miliseconds = everyday

app.get("/summoners", function(req, res){   
    res.type("text/plain");
    res.send(summonerString);        
});

//=================================
app.get("/masteryInfo", function(req, res){ //takes API directly from the internet
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/mastery.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
        str1 += chunk;
        });
        response.on('end', function () {
        res.type("application/json");
        res.send(str1);
        });
    }
    http.request(options, callback).end();
});

//=================================
function getMasteryData(http1) {
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/mastery.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http1, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {  
        str1 += chunk;
        });
        response.on('end', function () {
        masteryString = str1;
        fs.writeFile('data/mastery.txt', str1, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('written mastery data');
            }); 

        });
    }
    http1.request(options, callback).end();
}
//=====================================================
// getMasteryData(http); // get rune info right away when server starts
// setInterval(getMasteryData,1000*60*60*24,http); // getRune is called every 1000*60*60*24 miliseconds = everyday

//========================================================

app.get("/masteries", function(req, res){   
    res.type("text/plain");
    res.send(masteryString);        
});

//=========================================================
app.get("/versionInfo/", function(req, res){  //takes API directly from the internet
    var str1 = "";
    var myurl = "/v2/champions?&limit=1&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options = {
        host: 'api.champion.gg',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
            str1 += chunk;
        });
        response.on('end', function () {
            var version = JSON.parse(str1)[0].patch + '.1';
            console.log('version = '+ version);
            res.type("text/plain");
            res.send(version);
        });
    }
    http.request(options, callback).end();
});


//==============================================
/* This function updates League of Legends version (var LOLversion) everyday */

function getLOLVersion(http1) {
    var str1 = "";
    var myurl = "/v2/champions?&limit=1&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options = {
        host: 'api.champion.gg',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
            str1 += chunk;
        });
        response.on('end', function () {
            var array1 = JSON.parse(str1);
            LOLversion = array1[0].patch + '.1';
            console.log("as of " + new Date() + " LOLversion is " + LOLversion);
        });
    }
    http1.request(options, callback).end();
}
//=======================================================
// getLOLVersion(http); //get LOL version right away when server starts
// setInterval(getLOLVersion,1000*60*60*24,http); // getLOLVersion is called every 1000*60*60*24 miliseconds = everyday
//=======================================================
app.get("/version/", function(req, res){   
    res.type("text/plain");
    res.send(LOLversion);        
});

//=======================================================
app.get("/oneDayData", function(req, res){
    var str1 = "";
    var myurl = "/v2/champions?&limit=900&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options = {
        host: 'api.champion.gg',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
        str1 += chunk;
        });
        response.on('end', function () {
        res.type("application/json");
        res.send(str1);
        });
    }
    http.request(options, callback).end();
});

//=====================
function getChampionFullInfo(http1) {
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/championFull.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };
    //this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {
            str1 += chunk;
        });
        response.on('end', function () {
            championFullInfoString = str1;
            fs.writeFile('data/championFull.txt', str1, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('written championFull');
            }); 
            var champObj = JSON.parse(str1);
            arrayOfChampIds = Object.keys(champObj.keys);
            getAllHashes(http);
            getAllStats(http);
        });
    }
    http1.request(options, callback).end();
}
//======================================================

// getChampionFullInfo(http); // get Champion Full Info right away when server starts
// setInterval(getChampionFullInfo,1000*60*60*24,http); // getChampionFullInfo is called every 1000*60*60*24 miliseconds = everyday

//====================================
app.get("/championFullInfo/", function(req, res){  // takes from a server variable 
    res.type("text/plain");
    res.send(championFullInfoString);        
});

//=================================

/* takes API directly from the internet */
app.get("/championFullInfo1", function(req, res){
    var str1 = "";
    var myurl = "/cdn/" + LOLversion + "/data/en_US/championFull.json";
    var options = {
        host: 'ddragon.leagueoflegends.com',
        path: myurl
    };

//this callback is for http, it saves json string in variable str1
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
            str1 += chunk;
        });
        response.on('end', function () {
            var champObj = JSON.parse(str1);
            arrayOfChampIds = Object.keys(champObj.keys);
            res.type("application/json");
            res.send(str1);
        });
    }
    http.request(options, callback).end();
});

//========================================
function getHashStringForOneChamp(champIdStr, http1) {
    var hashStr = "";
    var myurl = "/v2/champions/"
    + champIdStr
    + "?&champData=hashes&api_key=5df59c3c1ea850a631d859fbbecb522b"; 
    var options = {
        host: 'api.champion.gg',
        path: myurl
    };
    //this callback is for http, it saves json string in variable hashStr
    callback = function(response) {
        response.on('data', function (chunk) {  
        hashStr += chunk;
        });
        response.on('end', function () {
        
        ObjectOfHashStrings[champIdStr] = hashStr;
        
        // fs.writeFile('hash/hash_'+ champIdStr + '.txt', hashStr, function (err) {
        //     if (err) {
        //         return console.log(err);
        //     }
        //     console.log('written hash for champ '+ champIdStr);
        // }); 
      });
    }
    http.request(options, callback).end();
}
//==========================
app.get("/hashString/:id", function(req, res){
    res.type("text/plain");
    res.send(ObjectOfHashStrings[req.params.id]);        
});

//========================================
function getAllHashes(http1) {
    for (var i = 0; i < arrayOfChampIds.length; i++) {
        getHashStringForOneChamp(arrayOfChampIds[i], http1);
    }
}

//========================================
function getStatsStringForOneChamp(champIdStr, http1) {
    var str1 = "";
    var myurl = "/v2/champions/"
    + champIdStr
    + "?champData=kda,damage,averageGames,totalHeal,killingSpree,minions,gold,normalized,groupedWins,"
    + "firstitems,skills,finalitems,matchups&limit=200"
    + "&api_key=5df59c3c1ea850a631d859fbbecb522b";
    var options = {
        host: 'api.champion.gg',
        path: myurl
    };
    callback = function(response) {
        response.on('data', function (chunk) {   //save json string in variable str1
            str1 += chunk;
        });
        response.on('end', function () {
            ObjectOfStatsStrings[champIdStr] = str1;
            // fs.writeFile('stats/stats_'+ champIdStr + '.txt', str1, function (err) {
            //     if (err) {
            //         return console.log(err);
            //     }
            //     console.log('written stats for champ '+ champIdStr);
            // }); 
        });    
    }    
    
    http1.request(options, callback).end();
}

//========================================

app.get("/statsString/:id", function(req, res){
    res.type("text/plain");
    res.send(ObjectOfStatsStrings[req.params.id]);        
});
//==============================================
function getAllStats(http1) {
    for (var i = 0; i < arrayOfChampIds.length; i++) {
        getStatsStringForOneChamp(arrayOfChampIds[i], http1);
    }
}























