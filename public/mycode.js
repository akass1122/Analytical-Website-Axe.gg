var champmap;
var matchData;
var simpleRolesArray = ["TOP", "MIDDLE", "MID", "JUNGLE"];

var champRoleMap;
var currchampdata;

var jsonarray;
var arrayObject;
var doneJson = false;
var firstLoad = true;
var champFullObj = {};
var itemObj = {};
var summonerObj = {};
var fiveDayObj = {};
var arrayOfIdsNames = [];
var arrayOfObjects = [];

var voidchamps = ["Cho'Gath", "Kha'Zix", "Kog'Maw", "Rek'Sai", "Vel'Koz"];
var voidchampstext = ["Cho\\'Gath", "Kha\\'Zix", "Kog\\'Maw", "Rek\\'Sai", "Vel\\'Koz"];
var voidchampslink = ["ChoGath", "KhaZix", "KogMaw", "RekSai", "VelKoz"];

var champs = [];
var champids = [];
var dateArray = [];
var arrayChampFive = [];
var arrayRoleFive = [];
var champHashes, runeHashes, masteryHashes;
var currentChampId = "";
var currentChampName;
var currentRole = "";
var currentRoleIndex;

google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);

function makeWinRateChart() {
	var winArray = makeWinRateArray(currentChampId, roleNameConvert(currentRole));
	makeDateArray();
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Win Rate');

	for (var i = 0; i < winArray.length; i++) {
	      data.addRows([
	        [dateArray[i], Number.parseFloat(winArray[i])],
	      ]);
	};

	var options = {'title':'Win Rate',
				legend: {position: 'none'},
				  // legend:'top',
				  hAxis: {title: 'Date'},
				  vAxis: {title: 'Percent'},
				  backgroundColor: '#E4E4E4',
	             'width':300,
	             colors: ['green'],
	             'height':250};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.AreaChart(document.getElementById('winRateChart_div'));


	chart.draw(data, options);
};

function makePickRateChart() {
	var pickArray = makePickRateArray(currentChampId, roleNameConvert(currentRole));
	makeDateArray();
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Pick Rate');

	for (var i = 0; i < pickArray.length; i++) {
	      data.addRows([
	        [dateArray[i], Number.parseFloat(pickArray[i])],
	      ]);
	};

	var options = {'title':'Pick Rate',
				legend: {position: 'none'},
				  // legend:'top',
				  hAxis: {title: 'Date'},
				  vAxis: {title: 'Percent'},
				  backgroundColor: '#E4E4E4',
	             'width':300,
	             colors: ['blue'],
	             'height':250};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.AreaChart(document.getElementById('pickRateChart_div'));


	chart.draw(data, options);
};

function makeBanRateChart() {
	var banArray = makeBanRateArray(currentChampId, roleNameConvert(currentRole));
	makeDateArray();
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Date');
	data.addColumn('number', 'Ban Rate');

	for (var i = 0; i < banArray.length; i++) {
	      data.addRows([
	        [dateArray[i], Number.parseFloat(banArray[i])],
	      ]);
	};

	var options = {'title':'Ban Rate',
				legend: {position: 'none'},
				  // legend:'top',
				  hAxis: {title: 'Date'},
				  vAxis: {title: 'Percent'},
				  backgroundColor: '#E4E4E4',
	             'width':300,
	             colors: ['red'],
	             'height':250};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.AreaChart(document.getElementById('banRateChart_div'));


	chart.draw(data, options);
};

function makeDmgChart() {	
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Dmg Type');
	data.addColumn('number', 'Dmg');
	var totalTrue, totalMagical, totalPhysical;

	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
		if (matchData[i].role == roleNameConvert(currentRole)) {
			totalTrue = matchData[i].damageComposition.totalTrue;
			totalMagical = matchData[i].damageComposition.totalMagical;
			totalPhysical = matchData[i].damageComposition.totalPhysical;
			break;
		}
	}
	data.addRows([
		['Physical', totalPhysical],
	]);
	data.addRows([
		['Magic', totalMagical],
	]);
		data.addRows([
		['True', totalTrue],
	]);
	var options = {'title':'DMG Composition',
				// legend: {position: 'none'},
				  legend:'top',
				  is3D: true,
				  // hAxis: {title: 'Date'},
				  // vAxis: {title: 'Percent'},
				  backgroundColor: '#E4E4E4',
				  // backgroundColor: 'rgba(217, 217, 217, 0.85);',
				  // backgroundColor: 'transparent',
	             'width':221,
	             colors: ['#b30000', 'purple', 'gray'],
	             'height':235};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.PieChart(document.getElementById('dmgChart_div'));

	chart.draw(data, options);
};

function makeDateArray() {
	for (var i = 0; i < arrayRoleFive.length; i++) {
		dateArray.push(arrayRoleFive[i].date.getMonth()+1+'-'+arrayRoleFive[i].date.getDate());
		// alert(dateArray[i]);
	};
};

function makeWinRateArray(id, role) {
	var winArray = [];
	for (var i = 0; i < arrayRoleFive.length; i++) {
		winArray.push(arrayRoleFive[i].data[id + " " + role].winRate);
		// alert(winArray[i]);
		//alert(typeof Number.parseFloat(winArray[i]));
	};
	return winArray;
};

function makePickRateArray(id, role) {
	var pickArray = [];
	for (var i = 0; i < arrayRoleFive.length; i++) {
		pickArray.push(arrayRoleFive[i].data[id + " " + role].playRate);
		// alert(winArray[i]);
		//alert(typeof Number.parseFloat(winArray[i]));
	};
	return pickArray;
};

function makeBanRateArray(id, role) {
	var banArray = [];
	for (var i = 0; i < arrayRoleFive.length; i++) {
		banArray.push(arrayRoleFive[i].data[id + " " + role].banRate);
		// alert(winArray[i]);
		//alert(typeof Number.parseFloat(winArray[i]));
	};
	return banArray;
};

//=================================================
function findCurrentRoleIndex() {
	var currentRoleConverted = roleNameConvert(currentRole);	
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
		if (matchData[i].role == currentRoleConverted) {
			currentRoleIndex = i;
			break;
		}
	}
}


//===================================

// function makeDateArray() {
// 	for (var i = 0; i < arrayChampFive.length; i++) {
// 		dateArray.push(arrayChampFive[i].date.getMonth()+1+'-'+arrayChampFive[i].date.getDate());
// 		// alert(dateArray[i]);
// 	};
// };

// function makeWinRateArray(id) {
// 	var winArray = [];
// 	for (var i = 0; i < arrayChampFive.length; i++) {
// 		winArray.push(arrayChampFive[i].data[id].winRate);
// 		// alert(winArray[i]);
// 		//alert(typeof Number.parseFloat(winArray[i]));
// 	};
// 	return winArray;
// };

// function makePickRateArray(id) {
// 	var pickArray = [];
// 	for (var i = 0; i < arrayChampFive.length; i++) {
// 		pickArray.push(arrayChampFive[i].data[id].playRate);
// 		// alert(winArray[i]);
// 		//alert(typeof Number.parseFloat(winArray[i]));
// 	};
// 	return pickArray;
// };

// function makeBanRateArray(id) {
// 	var banArray = [];
// 	for (var i = 0; i < arrayChampFive.length; i++) {
// 		banArray.push(arrayChampFive[i].data[id].banRate);
// 		// alert(winArray[i]);
// 		//alert(typeof Number.parseFloat(winArray[i]));
// 	};
// 	return banArray;
// };



//============================================

// function makeWinRateChart(champIdStr) {
// 	var winArray = makeWinRateArray(champIdStr);
// 	makeDateArray();
// 	var data = new google.visualization.DataTable();
// 	data.addColumn('string', 'Date');
// 	data.addColumn('number', 'Win Rate');

// 	for (var i = 0; i < winArray.length; i++) {
// 	      data.addRows([
// 	        [dateArray[i], Number.parseFloat(winArray[i])],
// 	      ]);
// 	};

// 	var options = {'title':'Win Rate',
// 				legend: {position: 'none'},
// 				  // legend:'top',
// 				  hAxis: {title: 'Date'},
// 				  vAxis: {title: 'Percent'},
// 				  backgroundColor: '#E4E4E4',
// 	             'width':300,
// 	             colors: ['green'],
// 	             'height':250};

// 	// Instantiate and draw our chart, passing in some options.
// 	var chart = new google.visualization.AreaChart(document.getElementById('winRateChart_div'));


// 	chart.draw(data, options);
// };

// function makePickRateChart(champIdStr) {
// 	var pickArray = makePickRateArray(champIdStr);
// 	makeDateArray();
// 	var data = new google.visualization.DataTable();
// 	data.addColumn('string', 'Date');
// 	data.addColumn('number', 'Pick Rate');

// 	for (var i = 0; i < pickArray.length; i++) {
// 	      data.addRows([
// 	        [dateArray[i], Number.parseFloat(pickArray[i])],
// 	      ]);
// 	};

// 	var options = {'title':'Pick Rate',
// 				legend: {position: 'none'},
// 				  // legend:'top',
// 				  hAxis: {title: 'Date'},
// 				  vAxis: {title: 'Percent'},
// 				  backgroundColor: '#E4E4E4',
// 	             'width':300,
// 	             colors: ['blue'],
// 	             'height':250};

// 	// Instantiate and draw our chart, passing in some options.
// 	var chart = new google.visualization.AreaChart(document.getElementById('pickRateChart_div'));


// 	chart.draw(data, options);
// };

// function makeBanRateChart(champIdStr) {
// 	var banArray = makeBanRateArray(champIdStr);
// 	makeDateArray();
// 	var data = new google.visualization.DataTable();
// 	data.addColumn('string', 'Date');
// 	data.addColumn('number', 'Ban Rate');

// 	for (var i = 0; i < banArray.length; i++) {
// 	      data.addRows([
// 	        [dateArray[i], Number.parseFloat(banArray[i])],
// 	      ]);
// 	};

// 	var options = {'title':'Ban Rate',
// 				legend: {position: 'none'},
// 				  // legend:'top',
// 				  hAxis: {title: 'Date'},
// 				  vAxis: {title: 'Percent'},
// 				  backgroundColor: '#E4E4E4',
// 	             'width':300,
// 	             colors: ['red'],
// 	             'height':250};

// 	// Instantiate and draw our chart, passing in some options.
// 	var chart = new google.visualization.AreaChart(document.getElementById('banRateChart_div'));


// 	chart.draw(data, options);
// };

// function makeDmgChart() {
// 	// var banArray = makeBanRateArray(champIdStr);
// 	makeDateArray();
// 	var data = new google.visualization.DataTable();
// 	data.addColumn('string', 'Dmg Type');
// 	data.addColumn('number', 'Dmg');
// 	var totalTrue, totalMagical, totalPhysical;

// 	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
// 		if (matchData[i].role == roleNameConvert(currentRole)) {
// 			totalTrue = matchData[i].damageComposition.totalTrue;
// 			totalMagical = matchData[i].damageComposition.totalMagical;
// 			totalPhysical = matchData[i].damageComposition.totalPhysical;
// 		}
// 	}



// 	data.addRows([
// 		['Physical', totalPhysical],
// 	]);
// 	data.addRows([
// 		['Magic', totalMagical],
// 	]);
// 		data.addRows([
// 		['True', totalTrue],
// 	]);

// 	var options = {'title':'DMG Composition',
// 				// legend: {position: 'none'},
// 				  legend:'top',
// 				  is3D: true,
// 				  // hAxis: {title: 'Date'},
// 				  // vAxis: {title: 'Percent'},
// 				  backgroundColor: '#E4E4E4',
// 				  // backgroundColor: 'rgba(217, 217, 217, 0.85);',
// 				  // backgroundColor: 'transparent',
// 	             'width':221,
// 	             colors: ['#b30000', 'purple', 'gray'],
// 	             'height':235};

// 	// Instantiate and draw our chart, passing in some options.
// 	var chart = new google.visualization.PieChart(document.getElementById('dmgChart_div'));

// 	chart.draw(data, options);
// };

// function makeDmgArray(id) {
// 	var dmgArray = [];
// 	for (var i = 0; i < arrayChampFive.length; i++) {
// 		banArray.push(arrayChampFive[i].data[id].banRate);
// 		// alert(winArray[i]);
// 		//alert(typeof Number.parseFloat(winArray[i]));
// 	};
// 	return banArray;
// };


//=================================================

// function removePreviousChampInfo() {
// 	$("#loadingNameTable").remove();
// 	$("#titleWinSkillOrderTable").remove();
// 	$("#titleFreqSkillOrderTable").remove();
// 	$("#freqMaster").remove();
// 	$("#winMaster").remove();
// 	$('#winTrinketTable').remove();
// 	$('#freqTrinketTable').remove();

// 	$('#titleWinStartItemsTable').remove();
// 	$('#titleFreqStartItemsTable').remove();

// 	$('#titleWinFinalItemsTable').remove();
// 	$('#titleFreqFinalItemsTable').remove();

// 	$('#titleFreqRuneTable').remove();
// 	$('#titleWinRuneTable').remove();
// 	$('#titleWinSummsTable').remove();
// 	$('#titleFreqSummsTable').remove();
	


// 	$(".divRole").remove();
// 	$(".roleTable").remove();
// 	$(".divMatch").remove();
// 	$(".bigMatchTable").remove();
// 	$(".showMore").remove();
// 	$(".champInput1").remove();
// 	$(".champDataTable").remove();
// 	$(".smallChampTable").remove();
// }

// function fillInCurrentChampInfo () {
// 	$('#roleTable1').append(makeRoleTable());
// 	makeChampFilter();
// 	makeBanRateChart(currentChampId);
// 	makeDmgChart();
// 	makeWinRateChart(currentChampId);
// 	makePickRateChart(currentChampId);
	
// 	$('#loadingName').append(loadingName());
// 	$('#winSkill_div').append(winSkillOrderTableGen());
// 	$('#freqSkill_div').append(skillOrderTableGen());
// 	$('#winTrinket_div').append(winTrinket());
// 	$('#freqTrinket_div').append(freqTrinket());

// 	$('#winStartItem_div').append(winStartItems());
// 	$('#freqStartItem_div').append(freqStartItems());


// 	$('#winFinalItem_div').append(winFinalItems());
// 	$('#freqFinalItem_div').append(freqFinalItems());
// 	$('#winSumms_div').append(winSumms());
// 	$('#freqSumms_div').append(freqSumms());

	
// 	$('#champDT').append(makeChampDataTable());
// 	makeAllMatchTables(currentRole);
	

// 	$('#winRune_div').append(winRuneTable());
// 	$('#freqRune_div').append(freqRuneTable());
// 	$('#winMaster_div').append(makeWinMasteryTable());
// 	$('#freqMaster_div').append(makeMasteryTable());
// }

//=========================================================

function removePreviousChampInfo() {
	removePreviousRoleInfo();
	$(".roleTable").remove();
}

function removePreviousRoleInfo() {
	$("#loadingNameTable").remove();
	$("#titleWinSkillOrderTable").remove();
	$("#titleFreqSkillOrderTable").remove();
	$("#freqMaster").remove();
	$("#winMaster").remove();
	$('#winTrinketTable').remove();
	$('#freqTrinketTable').remove();
	$('#titleWinStartItemsTable').remove();
	$('#titleFreqStartItemsTable').remove();

	$('#titleWinFinalItemsTable').remove();
	$('#titleFreqFinalItemsTable').remove();

	
	$('#titleWinRuneTable').remove();
	$('#titleFreqRuneTable').remove();
	$('#titleWinSummsTable').remove();	
	$('#titleFreqSummsTable').remove();
	


	$(".divRole").remove();
	//$(".roleTable").remove();
	$(".divMatch").remove();
	$(".bigMatchTable").remove();
	$(".showMore").remove();
	$(".champInput1").remove();
	$(".champDataTable").remove();
	$(".smallChampTable").remove();
}

function fillInCurrentChampInfo () {
	$('#roleTable1').append(makeRoleTable()); 
	fillInCurrentRoleInfo ();   
}


function fillInCurrentRoleInfo () {
	findCurrentRoleIndex();
	makeChampFilter();
	makeBanRateChart();
	makeWinRateChart();
	makePickRateChart();
	makeDmgChart();	
		
	$('#loadingName').append(loadingName());
	$('#winSkill_div').append(winSkillOrderTableGen());
	$('#freqSkill_div').append(skillOrderTableGen());
	$('#winTrinket_div').append(winTrinket());
	$('#freqTrinket_div').append(freqTrinket());

	$('#winFinalItem_div').append(winFinalItems());
	$('#freqFinalItem_div').append(freqFinalItems());
	$('#winStartItem_div').append(winStartItems());
	$('#freqStartItem_div').append(freqStartItems());
	$('#winSumms_div').append(winSumms());
	$('#freqSumms_div').append(freqSumms());

	
	$('#champDT').append(makeChampDataTable());
	makeAllMatchTables(currentRole);
	

	$('#winRune_div').append(winRuneTable());
	$('#freqRune_div').append(freqRuneTable());
	$('#winMaster_div').append(makeWinMasteryTable());
	$('#freqMaster_div').append(makeMasteryTable());
}



//=========================================================

function makeChampPg() {
	if (firstLoad == false) {	
		removePreviousChampInfo();
	}	
	if (this.id) {
		currentChampId = this.id;
		currentChampName = champFullObj.keys[currentChampId];
	}
	else if (this.className && this.className.indexOf('_') != -1) {
		currentChampId = this.className.split('_')[1];
		currentChampName = champFullObj.keys[currentChampId];
	}	

	function getHash() {
		async.parallel([function(callback) {			
			$.getJSON("/hashes/" + currentChampId, function (data) {
			//$.getJSON("/hashesForChamp1", function (data) {
				champHashes = data;
				callback();
			});
		}, function(callback) {				
				$.getJSON("/runeData", function (data) {
					runeHashes = data;
					callback();
				});
		}, function(callback) {				
				$.getJSON("/stats/"+ currentChampId, function (data) {
					//$.getJSON("/statsForChamp84", function (data) {	
					//$.getJSON("/statsForChamp51", function (data) {					
					matchData = data;
					callback();
				});
		}, function(callback) {				
				$.getJSON("/masteryData", function (data) {
					masteryHashes = data;
					callback();
				});
		}], function done(err, results) {			
			if (err) {
				throw err;
			}
			p1Hide();
			if (firstLoad == true) {
				$('#loadingSplash').append(loadingSplash());
			} else {
				changeSplash();
			}
			fillInCurrentChampInfo ();
			firstLoad = false;
			});
	}
	getHash();
}

function winSkillOrderTableGen() {
	//var currentRole1 = roleNameConvert(currentRole);	
	// var currentRoleIndex;
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
	// 	if (matchData[i].role == currentRole1) {
	// 		currentRoleIndex = i;
	// 		break;
	// 	}
	// }
	var skillString = champHashes[currentRoleIndex].hashes.skillorderhash.highestWinrate.hash;
	var skillArray = skillString.split("-");	
	var $titleSkillTable = $('<table id = "titleWinSkillOrderTable" class = "left winTable table3">');
	$row1 = $('<tr>').appendTo($titleSkillTable);
	$cell1 = $('<th>Highest Win Skill Order</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleSkillTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.skillorderhash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.skillorderhash.highestWinrate.count +' games</td>').appendTo($row2);
	var $skillTable = $('<table id = "winSkillOrderTable" class = "left table2">').appendTo($titleSkillTable);
	var $trhead = $('<tr>').appendTo($skillTable);
	var $th, $tr, $td;
	for (var i = 0; i <= 18; i++) {
		$th = $('<th>').appendTo($trhead);
		if (i == 0) {
			$th.text("Abilities");
			// $th.width('800px');
		} else {
			$th.text(i);
		};
	};
	for (var i = 0; i < 5; i++) {
		$tr = $('<tr>').appendTo($skillTable);
		for (var w = 0; w <= 18; w++) {
			$td = $('<td class = "tooltip">').appendTo($tr);
		};
	};

	var abilityTooltip;


	$skillTable[0].rows[1].cells[0].textContent = 'Passive: ' + champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].passive.name;

	abilityTooltip = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].passive.description;

	var $div3 = $('<div class = "tooltiptext"></div>').appendTo($skillTable[0].rows[1].cells[0]);
	var $nameTag = $('<p>' + abilityTooltip + '</p>').appendTo($div3);


	for (var r = 2; r <= 5; r++) {
		$skillTable[0].rows[r].cells[0].textContent = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].spells[r - 2].name;

		abilityTooltip = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].spells[r - 2].tooltip;

		var $div3 = $('<div class = "tooltiptext"></div>').appendTo($skillTable[0].rows[r].cells[0]);
		var $nameTag = $('<p>' + abilityTooltip + '</p>').appendTo($div3);
		// var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3);

		// $skillTable[0].rows[r].cells[0].style.backgroundColor = "#ffcc99";
	}

	for (var i = 1; i <= 18; i++) {
		// $skillTable[0].rows[1].cells[i].style.border = "#004d00";
		// $skillTable[0].rows[1].cells[i].style.backgroundColor = "#ffcc99";
		$skillTable[0].rows[1].cells[i].style.border = "transparent";
		if (skillArray[i] == "Q") {
			$skillTable[0].rows[2].cells[i].textContent = "Q";
			$skillTable[0].rows[2].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "W") {
			$skillTable[0].rows[3].cells[i].textContent = "W";
			$skillTable[0].rows[3].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "E") {
			$skillTable[0].rows[4].cells[i].textContent = "E";
			$skillTable[0].rows[4].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "R") {
			$skillTable[0].rows[5].cells[i].textContent = "R";
			$skillTable[0].rows[5].cells[i].style.backgroundColor = "#ffcc99";
		}
	};
	return $titleSkillTable;
}
//=================================================


//==========================================

function skillOrderTableGen() {	
	// var currentRole1 = roleNameConvert(currentRole);	
	// var currentRoleIndex;
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
	// 	if (matchData[i].role == currentRole1) {
	// 		currentRoleIndex = i;
	// 		break;
	// 	}
	// }
	var skillString = champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.hash;
	var skillArray = skillString.split("-");
	// alert(skillArray[1]);
	var $titleSkillTable = $('<table id = "titleFreqSkillOrderTable" class = "left table3">');
	$row1 = $('<tr>').appendTo($titleSkillTable);
	$cell1 = $('<th>Most Frequent Skill Order</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleSkillTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.count +' games</td>').appendTo($row2);
	var $skillTable = $('<table id = "freqSkillOrderTable" class = "left table2">').appendTo($titleSkillTable);
	var $trhead = $('<tr>').appendTo($skillTable);
	var $th, $tr, $td;
	for (var i = 0; i <= 18; i++) {
		$th = $('<th>').appendTo($trhead);
		if (i == 0) {
			$th.text("Abilities");
			// $th.width('800px');
		} else {
			$th.text(i);
		};
	};
	for (var i = 0; i < 5; i++) {
		$tr = $('<tr>').appendTo($skillTable);
		for (var w = 0; w <= 18; w++) {
			$td = $('<td class = "tooltip">').appendTo($tr);
		};
	};

	var abilityTooltip;


	$skillTable[0].rows[1].cells[0].textContent = 'Passive: ' + champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].passive.name;

	abilityTooltip = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].passive.description;

	var $div3 = $('<div class = "tooltiptext"></div>').appendTo($skillTable[0].rows[1].cells[0]);
	var $nameTag = $('<p>' + abilityTooltip + '</p>').appendTo($div3);


	for (var r = 2; r <= 5; r++) {
		$skillTable[0].rows[r].cells[0].textContent = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].spells[r - 2].name;

		abilityTooltip = champFullObj.data[champFullObj.keys[champHashes[currentRoleIndex].championId]].spells[r - 2].tooltip;

		var $div3 = $('<div class = "tooltiptext"></div>').appendTo($skillTable[0].rows[r].cells[0]);
		var $nameTag = $('<p>' + abilityTooltip + '</p>').appendTo($div3);
		// var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3);

		// $skillTable[0].rows[r].cells[0].style.backgroundColor = "#ffcc99";
	}

	for (var i = 1; i <= 18; i++) {
		// $skillTable[0].rows[1].cells[i].style.border = "#004d00";
		// $skillTable[0].rows[1].cells[i].style.backgroundColor = "#ffcc99";
		$skillTable[0].rows[1].cells[i].style.border = "transparent";

		if (skillArray[i] == "Q") {
			$skillTable[0].rows[2].cells[i].textContent = "Q";
			$skillTable[0].rows[2].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "W") {
			$skillTable[0].rows[3].cells[i].textContent = "W";
			$skillTable[0].rows[3].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "E") {
			$skillTable[0].rows[4].cells[i].textContent = "E";
			$skillTable[0].rows[4].cells[i].style.backgroundColor = "#ffcc99";
		}
		else if (skillArray[i] == "R") {
			$skillTable[0].rows[5].cells[i].textContent = "R";
			$skillTable[0].rows[5].cells[i].style.backgroundColor = "#ffcc99";
		}
	};
	return $titleSkillTable;
}

function loadingSplash(){
	//var champ1 = champFullObj.keys[champHashes[currentRoleIndex].championId];
	
	//var champ1 = currentChampName;
	var $loadingSplashImg = $('<img id="loadSplash">');
	var loadingSplashImgUrl = "http://ddragon.leagueoflegends.com/cdn/7.14.1/img/champion/" + currentChampName + ".png";
	$('#champInfo').css("background-image", "url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + currentChampName + "_0.jpg')");
	$loadingSplashImg.attr('src', loadingSplashImgUrl);
	return $loadingSplashImg;
}

function changeSplash() {
	//var champ1 = currentChampName;
	$("#loadSplash")[0].src = "http://ddragon.leagueoflegends.com/cdn/7.14.1/img/champion/" + currentChampName + ".png";
	$('#champInfo').css("background-image", "url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + currentChampName + "_0.jpg')");
}

function loadingName(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	//var champ1 = currentChampName;
	var $nameTable = $('<table id = "loadingNameTable" class = "left table3">');
	$row1 = $('<tr>').appendTo($nameTable);
	$cell1 = $('<th>' + currentChampName + '</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($nameTable);
	// $cell2 = $('<td>' + (champHashes[0].hashes.skillorderhash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[0].hashes.skillorderhash.highestCount.count +' games</td>').appendTo($row2);
	$cell2 = $('<td>' + champFullObj.data[currentChampName].title + '</td>').appendTo($row2);
	return $nameTable;
}

function winTrinket(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];


	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
	// 	if (matchData[i].role == roleNameConvert(currentRole)) {


			//var champ1 = currentChampName;
			var $trinketTable = $('<table id = "winTrinketTable" class = "left winTable table4">');
			$row1 = $('<tr>').appendTo($trinketTable);
			$cell1 = $('<th>Highest Win Trinket</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($trinketTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.trinkethash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.trinkethash.highestWinrate.count +' games</td>').appendTo($row2);
			$row3 = $('<tr>').appendTo($trinketTable);
			$cell3 = $('<td class = "tooltip">').appendTo($row3);

			var trinket = champHashes[currentRoleIndex].hashes.trinkethash.highestWinrate.hash;
			var trinketDescription = itemObj.data[trinket].description;
			var trinketPlain = itemObj.data[trinket].plaintext;
			var trinketName = itemObj.data[trinket].name;

			var $div3 = $('<div class = "tooltiptext"></div>').appendTo($cell3);
			var $nameTag = $('<p>' + trinketName + '<br>' + '<br>' + trinketPlain + '</br>' + '<br>' + trinketDescription + '</p>').appendTo($div3);

			var $trinketImg = $('<img id="winTrink">');
			var trinketImgUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + trinket + ".png"
			$trinketImg.attr('src', trinketImgUrl);
			$trinketImg.appendTo($cell3);
			
		
	
	return $trinketTable;
}

function freqTrinket(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
	// 	if (matchData[i].role == roleNameConvert(currentRole)) {
			//var champ1 = currentChampName;
			var $trinketTable = $('<table id = "freqTrinketTable" class = "left table4">');
			$row1 = $('<tr>').appendTo($trinketTable);
			$cell1 = $('<th>Most Frequent Trinket</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($trinketTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.trinkethash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.trinkethash.highestCount.count +' games</td>').appendTo($row2);
			$row3 = $('<tr>').appendTo($trinketTable);
			$cell3 = $('<td class = "tooltip">').appendTo($row3);
			var trinket = champHashes[currentRoleIndex].hashes.trinkethash.highestCount.hash;
			var trinketDescription = itemObj.data[trinket].description;
			var trinketPlain = itemObj.data[trinket].plaintext;
			var trinketName = itemObj.data[trinket].name;
			var $div3 = $('<div class = "tooltiptext"></div>').appendTo($cell3);
			var $nameTag = $('<p>' + trinketName + '<br>' + '<br>' + trinketPlain + '</br>' + '<br>' + trinketDescription + '</p>').appendTo($div3);
			var $trinketImg = $('<img id="freqTrink">');
			var trinketImgUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + trinket + ".png"
			$trinketImg.attr('src', trinketImgUrl);
			$trinketImg.appendTo($cell3);
	// 		break;
	// 	}
	// }
	return $trinketTable;
}
//===============================================================
//================================================================


var special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

function stringifyNumber(n) {
  if (n < 20) return special[n];
  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function winSumms(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
		// if (matchData[i].role == roleNameConvert(currentRole)) {
			var champ1 = champFullObj.keys[currentChampId];
			var $titleSummsTable = $('<table id = "titleWinSummsTable" class = "left winTable table6">');
			$row1 = $('<tr>').appendTo($titleSummsTable);
			$cell1 = $('<th>Highest Win Summs</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($titleSummsTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.summonershash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.summonershash.highestWinrate.count +' games</td>').appendTo($row2);

			var summsString = champHashes[currentRoleIndex].hashes.summonershash.highestWinrate.hash;
			var summsArray = summsString.split("-");

			var $summsTable = $('<table id = "winSummsTable" class = "left innerItemTable table2">').appendTo($titleSummsTable);
			var $trhead = $('<tr>').appendTo($summsTable);
			var $th, $tr, $td;

			$tr = $('<tr>').appendTo($summsTable);
			var summsImgIndex;
			var summsImgName;
			var summsUrl;
			var $summsImg;

			for (var j = 0; j < summsArray.length; j++) {
				$td = $('<td class = "tooltip">').appendTo($tr);
				summsImgIndex = summsArray[j];
			
			
			

				//=========================
				// for (var property in summonerObj.data) {
				// 	if (summonerObj.data.hasOwnProperty(property)) {
				// 		if (property.key == parseInt(summsImgIndex)) {
				// 			summsImgName = property.image.full;
				// 		}
				// 	}
				// }

				//==============================

				for (var property in summonerObj.data) {
					if (parseInt(summonerObj.data[property].key) == parseInt(summsImgIndex)) {
						summsImgName = summonerObj.data[property].image.full;
					}					
				}

			//var arrayOfKeys = Object.keys(summonerObj.data);
			// for (var i = 0; i < arrayOfKeys.length; i++) {					
			// 	if (parseInt(summonerObj.data[arrayOfKeys[i]]['key']) == parseInt(summsImgIndex)) {
			//  		summsImgName = summonerObj.data[arrayOfKeys[i]].image.full;				 		
			//  	}
			// }


				summsUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/spell/" + summsImgName;
				
				$summsImg = $('<img class = "itemIcon">');
				$summsImg.attr('src', summsUrl);
				$summsImg.appendTo($td);
			};
			
		
	
	return $titleSummsTable;
}

function freqSumms(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	//for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
		//if (matchData[i].role == roleNameConvert(currentRole)) {
			var champ1 = champFullObj.keys[currentChampId];
			var $titleSummsTable = $('<table id = "titleFreqSummsTable" class = "left table6">');
			$row1 = $('<tr>').appendTo($titleSummsTable);
			$cell1 = $('<th>Most Frequent Summs</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($titleSummsTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.summonershash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.summonershash.highestCount.count +' games</td>').appendTo($row2);

			var summsString = champHashes[currentRoleIndex].hashes.summonershash.highestCount.hash;
			var summsArray = summsString.split("-");

			var $summsTable = $('<table id = "freqSummsTable" class = "left innerItemTable table2">').appendTo($titleSummsTable);
			var $trhead = $('<tr>').appendTo($summsTable);
			var $th, $tr, $td;

			$tr = $('<tr>').appendTo($summsTable);
			var summsImgIndex;
			var summsImgName;
			var summsUrl;
			var $summsImg;
			
			
			for (var w = 0; w <= 1; w++) {
				$td = $('<td class = "tooltip">').appendTo($tr);
				summsImgIndex = summsArray[w];

				//=========================
				// for (var property in summonerObj.data) {
				// 	if (summonerObj.data.hasOwnProperty(property)) {
				// 		if (property.key == parseInt(summsImgIndex)) {
				// 			summsImgName = property.image.full;
				// 		}
				// 	}
				// }

				//==============================

				for (var property in summonerObj.data) {
					if (parseInt(summonerObj.data[property].key) == parseInt(summsImgIndex)) {
						summsImgName = summonerObj.data[property].image.full;
					}					
				}

			//var arrayOfKeys = Object.keys(summonerObj.data);
			// for (var i = 0; i < arrayOfKeys.length; i++) {					
			// 	if (parseInt(summonerObj.data[arrayOfKeys[i]]['key']) == parseInt(summsImgIndex)) {
			//  		summsImgName = summonerObj.data[arrayOfKeys[i]].image.full;				 		
			//  	}
			// }


				summsUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/spell/" + summsImgName;
				
				$summsImg = $('<img class = "itemIcon">');
				$summsImg.attr('src', summsUrl);
				$summsImg.appendTo($td);
			};
			
		
	
	return $titleSummsTable;
}

function winStartItems(){	
	var $titleItemTable = $('<table id = "titleWinStartItemsTable" class = "left winTable itemTab table5">');
	$row1 = $('<tr>').appendTo($titleItemTable);
	$cell1 = $('<th>Highest Win Start Items</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleItemTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.firstitemshash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.firstitemshash.highestWinrate.count +' games</td>').appendTo($row2);
	var itemString = champHashes[currentRoleIndex].hashes.firstitemshash.highestWinrate.hash;
	var itemArray = itemString.split("-");
	var $itemTable = $('<table id = "winStartItemsTable" class = "left innerItemTable table2">').appendTo($titleItemTable);
	var $trhead = $('<tr>').appendTo($itemTable);
	var $th, $tr, $td;			
	$tr = $('<tr>').appendTo($itemTable);
	var itemImgIndex;
	var itemUrl;
	var $itemImg;
	for (var w = 1; w < itemArray.length; w++) {
		$td = $('<td class = "tooltip">').appendTo($tr);
		itemImgIndex = itemArray[w];
		itemUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + itemImgIndex + ".png";		
		$itemImg = $('<img class = "itemIcon">');
		$itemImg.attr('src', itemUrl);
		$itemImg.appendTo($td);
	};
	
	return $titleItemTable;
}

function freqStartItems(){
	var champ1 = champFullObj.keys[currentChampId];
	var $titleItemTable = $('<table id = "titleFreqStartItemsTable" class = "left itemTab table5">');
	$row1 = $('<tr>').appendTo($titleItemTable);
	$cell1 = $('<th>Most Common Start Items</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleItemTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.firstitemshash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.firstitemshash.highestCount.count +' games</td>').appendTo($row2);
	var itemString = champHashes[currentRoleIndex].hashes.firstitemshash.highestCount.hash;
	var itemArray = itemString.split("-");
	var $itemTable = $('<table id = "freqStartItemsTable" class = "left innerItemTable table2">').appendTo($titleItemTable);
	var $trhead = $('<tr>').appendTo($itemTable);
	var $th, $tr, $td;
	$tr = $('<tr>').appendTo($itemTable);
	var itemImgIndex;
	var itemUrl;
	var $itemImg;
	for (var w = 1; w < itemArray.length; w++) {
		$td = $('<td class = "tooltip">').appendTo($tr);
		itemImgIndex = itemArray[w];
		itemUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + itemImgIndex + ".png";		
		$itemImg = $('<img class = "itemIcon">');
		$itemImg.attr('src', itemUrl);
		$itemImg.appendTo($td);
	};	
	return $titleItemTable;
}

function winFinalItems(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
	// 	if (matchData[i].role == roleNameConvert(currentRole)) {
			var champ1 = champFullObj.keys[currentChampId];
			var $titleItemTable = $('<table id = "titleWinFinalItemsTable" class = "left winTable itemTab table4">');
			$row1 = $('<tr>').appendTo($titleItemTable);
			$cell1 = $('<th>Highest Win Full Build</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($titleItemTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestWinrate.count +' games</td>').appendTo($row2);

			var itemString = champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestWinrate.hash;
			var itemArray = itemString.split("-");

			var $itemTable = $('<table id = "winFinalItemsTable" class = "left innerItemTable table2">').appendTo($titleItemTable);
			var $trhead = $('<tr>').appendTo($itemTable);
			var $th, $tr, $td;
			for (var i = 0; i <= 5; i++) {
				$th = $('<th>').appendTo($trhead);
				$th.text(capitalizeFirstLetter(stringifyNumber(i + 1)));
			};

			$tr = $('<tr>').appendTo($itemTable);
			var itemImgIndex;
			var itemUrl;
			var $itemImg;
			for (var w = 0; w <= 5; w++) {
				$td = $('<td class = "tooltip">').appendTo($tr);
				itemImgIndex = itemArray[w + 1];
				itemUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + itemImgIndex + ".png";
				
				$itemImg = $('<img class = "itemIcon">');
				$itemImg.attr('src', itemUrl);
				$itemImg.appendTo($td);
			};
	// 		break;
	// 	}
	// }
	return $titleItemTable;
}

function freqFinalItems(){
	//var champ1 = champFullObj.keys[champHashes[0].championId];
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
	// 	if (matchData[i].role == roleNameConvert(currentRole)) {
			//var champ1 = champFullObj.keys[currentChampId];
			var $titleItemTable = $('<table id = "titleFreqFinalItemsTable" class = "left itemTab table4">');
			$row1 = $('<tr>').appendTo($titleItemTable);
			$cell1 = $('<th>Most Frequent Full Build</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($titleItemTable);
			$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestCount.count +' games</td>').appendTo($row2);

			var itemString = champHashes[currentRoleIndex].hashes.finalitemshashfixed.highestCount.hash;
			var itemArray = itemString.split("-");

			var $itemTable = $('<table id = "freqFinalItemsTable" class = "left innerItemTable table2">').appendTo($titleItemTable);
			var $trhead = $('<tr>').appendTo($itemTable);
			var $th, $tr, $td;
			for (var i = 0; i <= 5; i++) {
				$th = $('<th>').appendTo($trhead);
				$th.text(capitalizeFirstLetter(stringifyNumber(i + 1)));
			};

			$tr = $('<tr>').appendTo($itemTable);
			var itemImgIndex;
			var itemUrl;
			var $itemImg;
			for (var w = 0; w <= 5; w++) {
				$td = $('<td class = "tooltip">').appendTo($tr);
				itemImgIndex = itemArray[w + 1];
				itemUrl = "http://ddragon.leagueoflegends.com/cdn/7.15.1/img/item/" + itemImgIndex + ".png";
				
				$itemImg = $('<img class = "itemIcon">');
				$itemImg.attr('src', itemUrl);
				$itemImg.appendTo($td);
			};
	// 		break;
	// 	}
	// }
	return $titleItemTable;
}



//============================================================
//===============================================================

function makeRoleTable() { //Just  roles, no picture, name
	var $roleTable = $('<table class = "roleTable">');	
	var $tr, $td, $th;
	$tr = $('<tr>').appendTo($roleTable);
	$th = $('<th>').text("Role").appendTo($tr);
	$th = $('<th>').text("Rate").appendTo($tr);
	$th = $('<th>').text("Win").appendTo($tr);
		
	for (var i = 0; i < champHashes.length  ; i++) {
		$tr = $('<tr>').appendTo($roleTable);
		$td = $('<td>').appendTo($tr);
		
		var roleName = champHashes[i].role;

		// if (i == 0) {
		// 	currentRole = roleName;
		// }
		if (roleName == "MIDDLE") {
			roleName = "MID";
		}
		if (roleName == "DUO_CARRY") {
			roleName = "ADC";
		}
		if (roleName == "DUO_SUPPORT") {
			roleName = "SUPP";
		}
		$td.text(roleName);
		$td.css({cursor: "pointer"});

		$td.bind("click", function() {	
			for (var i = 1; i < $roleTable[0].rows.length; i++) {
				$roleTable[0].rows[i].cells[0].style.backgroundColor = "transparent";
				$roleTable[0].rows[i].cells[0].style.color = "white";
			}
			this.style.backgroundColor = "#99ccff";
			if (currentRole != this.innerHTML) {
				currentRole = this.innerHTML;
				


				removePreviousRoleInfo();
				fillInCurrentRoleInfo();

				// $(".divMatch").remove();
				// $(".bigMatchTable").remove();
				// $(".showMore").remove();
				// makeAllMatchTables(currentRole);
			}
		}
		);
		$td = $('<td>').appendTo($tr);
		$td.text(((champHashes[i].percentRolePlayed)*100).toFixed(2) + "%");

		$td = $('<td>').appendTo($tr);
		$td.text(((champHashes[i].winRate)*100).toFixed(2) + "%");
	}
	insertSortTable($roleTable[0], 1, 0, false);
	currentRole = $roleTable[0].rows[1].cells[0].innerHTML;
	$roleTable[0].rows[1].cells[0].style.backgroundColor = "#99ccff";
	$roleTable[0].rows[1].cells[0].style.textShadow = "none";
	$roleTable[0].rows[1].cells[0].style.color = "rgb(54, 25, 25)";
	$roleTable.css({borderCollapse: "collapse"});
	return $roleTable;
}


function makeChampFilter() {
	$input = $('<input type="search" class="champInput1" oninput="champFilter1()" placeholder="Champ search">').appendTo('#roleTable1');
	$input.css({margin: "auto", display: "block", width: "125px", height: "30px"});
	makeSmallChampTable().appendTo("body");
	$(".smallChampTable").hide();
}

function champFilter1() { //WORKING
	$(".smallChampTable").appendTo('#roleTable1');
	var filter = $(".champInput1")[0].value.toUpperCase();
	if (filter == "") {
		$(".smallChampTable").hide();
		return;
	}		    	
    $(".smallChampTable").show();
    for (i = 0; i < champs.length; i++) {		
	   	$(".smallTable_" + champs[i]).show();
    };
    for (i = 0; i < champs.length; i++) {
		if (champmap.hasOwnProperty(champids[i].toString())) {
	        //if ( == -1) {
	        if ((champs[i].toUpperCase().indexOf(filter) == -1)) {
	        	$(".smallTable_" + champs[i]).hide();
	        };
	    };
    };
}


function makeSmallChampTable() {
	var $tr, $td, $a, currentName;
	var $table = $('<table class = "smallChampTable">');
	for (i = 0; i < champs.length; i++) {
		$tr = $('<tr>').appendTo($table);
		$tr[0].className = "smallTable_" + champs[i];		
		$td = $('<td>').appendTo($tr);
		currentName = champs[i];		
		$td.css("backgroundImage", "url('http://ddragon.leagueoflegends.com/cdn/7.14.1/img/champion/" + currentName + ".png')");
		$td.css({width: "50px", height: "50px", backgroundSize: "cover"});
		$td = $('<td>').appendTo($tr);

		$a = $('<a href ="#!">' +  currentName + '</a>');
		$a[0].className = "smallTableLink_" + champids[i];

		$a[0].onclick = makeChampPg;
		$td.append($a);
		$td.css({borderCollapse: "collapse", border: "1px solid white"});				
		//$td = $('<td>').text(winRate).appendTo($tr);
		//$td.css({borderCollapse: "collapse", border: "1px solid white"});
		}		
	return $table;
}


function makeChampDataTable() {
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
		if (matchData[i].role == roleNameConvert(currentRole)) {
			var $dataTable = $('<table id = "champDT1" class = "champDataTable">');

			var $tr, $td, $th;
			$tr = $('<tr>').appendTo($dataTable);
			$th = $('<th>').text("Stat").appendTo($tr);
			$th = $('<th>').text("Average Value").appendTo($tr);

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Win");
			$td = $('<td>').appendTo($tr);
			$td.text((matchData[i].winRate*100).toFixed(2) + "%");

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Pick");
			$td = $('<td>').appendTo($tr);
			$td.text((matchData[i].playRate*100).toFixed(2) + "%");

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Ban");
			$td = $('<td>').appendTo($tr);
			$td.text((matchData[i].banRate*100).toFixed(2) + "%");
			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("K / D / A");
			$td = $('<td>').appendTo($tr);
			$td.text(Math.round(matchData[i].kills.toFixed(2)) + ' / ' + Math.round(matchData[i].deaths.toFixed(2)) + ' / ' + Math.round(matchData[i].assists.toFixed(2)));

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("CS");
			$td = $('<td>').appendTo($tr);
			$td.text(Math.round(matchData[i].minionsKilled.toFixed(2)) + Math.round(matchData[i].neutralMinionsKilledTeamJungle.toFixed(2)) + Math.round(matchData[i].neutralMinionsKilledEnemyJungle.toFixed(2)));

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Total Dmg Dealt");
			$td = $('<td>').appendTo($tr);
			$td.text(matchData[i].damageComposition.total.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Dmg Taken");
			$td = $('<td>').appendTo($tr);
			$td.text(matchData[i].totalDamageTaken.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

			$tr = $('<tr>').appendTo($dataTable);
			$td = $('<td>').appendTo($tr);
			$td.text("Games Played");
			$td = $('<td>').appendTo($tr);
			$td.text(matchData[i].averageGames.toFixed(2));
			break;



		}
	}
	return $dataTable;
}


//==================================================================
function roleNameConvert(shortName) {
	if (shortName == "MID") {
		return "MIDDLE";
	} else if (shortName == "ADC" ) {
		return "DUO_CARRY";
	} else if (shortName == "SUPP") {
		return "DUO_SUPPORT";
	} else {
		return shortName;
	}
}

function makeMatchTable(currentRole, decreasing) {	
	var currentMatchId;
	var currentMatchName;
	var matches, winRate;
	var currentRole1 = roleNameConvert(currentRole);	
	var $table = $('<table class = "matchTable">').appendTo('#matchups1');
	// $table.css({borderCollapse: "collapse", border: "1px solid white"});
	// $table.css({cellpadding:"0", cellspacing:"0", width: "100%"});
	var $tbody = $('<tbody>').appendTo($table);
	// alert(1);
	var $tr = $('<tr>').appendTo($tbody);
	var $th = $('<th>Icon</th>').appendTo($tr);
	$th = $('<th>Name</th>').appendTo($tr);
	// $th.css({height: "50px"}); //, border: "1px solid black"});	
	$th = $('<th>').text(currentChampName + " Win").appendTo($tr);
	// $th.css({height: "50px"});


	//==============================
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
		if (matchData[i].role == currentRole1) {
			if (simpleRolesArray.indexOf(currentRole1) != -1) {				
				matches = (matchData[i].matchups)[currentRole1]; // matches is the array of matches for the chosen (current) role
			}				
			for (var j = 0; j < matches.length; j++) {
				$tr = $('<tr>').appendTo($table);
				$td = $('<td>').appendTo($tr);
				if (matches[j].champ2_id != currentChampId) {
					currentMatchId = matches[j].champ2_id;
					winRate =(( matches[j].champ1.winrate)*100).toFixed(2) + "%";
				} else {
					currentMatchId = matches[j].champ1_id;
					winRate =(( matches[j].champ2.winrate)*100).toFixed(2) + "%";
				}
				currentMatchName = champFullObj.keys[currentMatchId];			
				$td.css("backgroundImage", "url('http://ddragon.leagueoflegends.com/cdn/7.14.1/img/champion/" + currentMatchName + ".png')");
				$td.css({width: "50px", height: "50px", backgroundSize: "cover"});
				$td = $('<td>').appendTo($tr);

				$a = $('<a href ="#!">' +  currentMatchName + '</a>');
				$a[0].className = "matchTable_" + currentMatchId;
				$a[0].onclick = makeChampPg;
				$td.append($a);

				$td.css({borderCollapse: "collapse", border: "1px solid white"});
				
				$td = $('<td>').text(winRate).appendTo($tr);
				$td.css({borderCollapse: "collapse", border: "1px solid white"});
			}
		} 
	}
	if (decreasing == true) {	
		insertSortTable($table[0], 2,1, false);
	} else {
		insertSortTable($table[0], 2,1, true);
	}
	for (var i = 6; i < $table[0].rows.length; i++) {		
		$($table[0].rows[i]).hide();
	}
	return $table[0];
}
//========================================
function makeMatchTable1(currentRole, flag, decreasing) {
	var currentMatchId;
	var currentMatchName;
	var matches, winRate;
	var currentRole1 = roleNameConvert(currentRole); 
	var $table = $('<table class = "matchTable">').appendTo('#matchups1');
	// $table.css({borderCollapse: "collapse", border: "1px solid white"});
	// $table.css({cellpadding:"0", cellspacing:"0", width: "100%"});	
	var $tr = $('<tr>').appendTo($table);
	var $th = $('<th>Icon</th>').appendTo($tr);
	$th = $('<th>Name</th>').appendTo($tr);
	// $th.css({height: "50px"}); //, border: "1px solid black"});	
	$th = $('<th>').text(currentChampName + " Win").appendTo($tr);
	// $th.css({height: "50px"});



	//=========================
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
		if (matchData[i].role == currentRole1) {			
			matches = (matchData[i].matchups)[flag];						
			for (var j = 0; j < matches.length; j++) {
				$tr = $('<tr>').appendTo($table);
				$td = $('<td>').appendTo($tr);

				if (matches[j].champ2_id != currentChampId) {
					currentMatchId = matches[j].champ2_id;
					winRate =(( matches[j].champ1.winrate)*100).toFixed(2) + "%";
				} else {
					currentMatchId = matches[j].champ1_id;
					winRate =(( matches[j].champ2.winrate)*100).toFixed(2) + "%";
				}									
				currentMatchName = champFullObj.keys[currentMatchId];			
				$td.css("backgroundImage", "url('http://ddragon.leagueoflegends.com/cdn/7.14.1/img/champion/" + currentMatchName + ".png')");
				$td.css({width: "50px", height: "50px", backgroundSize: "cover"});
				$td = $('<td>').appendTo($tr);
				$a = $('<a href ="#!">' +  currentMatchName + '</a>');
				$a[0].className = "matchTable_" + currentMatchId;
				$a[0].onclick = makeChampPg;
				$td.append($a);
				$td.css({borderCollapse: "collapse", border: "1px solid white"});				
				$td = $('<td>').text(winRate).appendTo($tr);
				$td.css({borderCollapse: "collapse", border: "1px solid white"});
			}
			}
		 break; 

		}
		if (decreasing == true) {	
		insertSortTable($table[0], 2,1, false);
	} else {
		insertSortTable($table[0], 2,1, true);
	}
	for (var i = 6; i < $table[0].rows.length; i++) {		
		$($table[0].rows[i]).hide();
	}	
	return $table[0];
}

//==================================
function makeTwoMatchTables(currentRole) {
	var currentRoleName, $div, $table, $tr, $td;
	var nextLine = 6;
	$div = $('<div class = "divMatch">').appendTo($('#matchups1'));
	// $div.css({height:"50px", display: "block", background: "transparent"});
	// var $div1 = $('<div>').appendTo('body');
	if (simpleRolesArray.indexOf(currentRole) != -1) {		
		$table = $('<table class = "bigMatchTable">').appendTo('#matchups1');
		$tr1 = $('<tr>').appendTo($table);
		$td1 = $('<td>').appendTo($tr1);

		//$table1 = $('<table>').appendTo($td1);

		$table1 = $('<table id = "winMatchups" class = "winTable">').appendTo($td1);

		$table1.css({borderCollapse: "collapse"});		
		$tr = $('<tr>').appendTo($table1);
		$th = $('<th>').text(currentRole + " Champions That "+currentChampName+" Counters").appendTo($tr);
		//$td.css({height: "50px", backgroundColor: "yellow", paddingLeft: "10px", paddingRight: "10px"});		
		$tr = $('<tr>').appendTo($table1);
		$td = $('<td>').appendTo($tr);
		var table1 = makeMatchTable(currentRole, true)
		$td.append(table1);	
	}	
		// $td = $('<td>').appendTo($tr1);
		// $div = $('<div>').appendTo($td);
		// $div.css({width:"50px", display: "inline-block", background: "transparent"});
		$td2 = $('<td>').appendTo($tr1);
		$table2 = $('<table id = "loseMatchups" class = "loseTable">').appendTo($td2);
		$table2.css({borderCollapse: "collapse"});
		$tr = $('<tr>').appendTo($table2);
		$th = $('<th>').text(currentRole + " Champions That Counter " + currentChampName).appendTo($tr);		
		//$td.css({height: "50px", backgroundColor: "yellow", paddingLeft: "10px", paddingRight: "10px"});		
		$tr = $('<tr>').appendTo($table2);
		$td = $('<td>').appendTo($tr);
		var table2 = makeMatchTable(currentRole, false);
		$td.append(table2);
		var $button = $('<button class = "showMore layouttab"> Show More </button>').appendTo('#matchups1');		
		$button.css({margin: "auto", display: "block", height: "30px", width: "100", fontWeight: "bold"});				
		$button[0].onclick = function() {
			if (nextLine >= table1.rows.length) {
				$button.hide();
				return;
			}
			showTablePart(table1, nextLine, 5);
			nextLine = showTablePart(table2, nextLine, 5);
		}
	}	
//========================

function showTablePart(table, startingLine, numberOfLines) {
	var n = Math.min(table.rows.length, startingLine + numberOfLines);
	for (var i = startingLine; i < n; i++) {
		$(table.rows[i]).show();
	}
	return n;	
}

//============================================================

function makeTwoMatchTables1(currentRole, flag) {	
	var nextLine = 6;
	// $div = $('<div class = "divMatch">').appendTo('body');
	// $div.css({height:"50px", display: "block", background: "transparent"});
	//var $div1 = $('<div>').appendTo('body');
	var $div, $table, $tr, $td, text;
	var currentRoleName;
	var currentRole = roleNameConvert(currentRole);
	if (currentRole == "DUO_SUPPORT" && flag == "DUO_SUPPORT") {
		text = "Supp";
	} else if (currentRole == "DUO_CARRY" && flag == "DUO_CARRY") {
		text = "ADC";
	}else if (currentRole == "DUO_CARRY" && flag == "ADCSUPPORT") {
		text = "Supp";
	}
	 else if (currentRole == "DUO_SUPPORT" && flag == "ADCSUPPORT") {
		text = "ADC";
	} else if (currentRole == "DUO_SUPPORT" && flag == "SYNERGY") {
		text = "ADC";

	} else if (currentRole == "DUO_CARRY" && flag == "SYNERGY") {
		text = "Supp";
	}



	$div = $('<div class = "divMatch">').appendTo('#matchups1');

	$table = $('<table class = "bigMatchTable">').appendTo('#matchups1');
	$tr1 = $('<tr>').appendTo($table);
	$td1 = $('<td>').appendTo($tr1);
	$table1 = $('<table id="winMatchups1" class = "winTable">').appendTo($td1);
	$table1.css({borderCollapse: "collapse"});
	$tr = $('<tr>').appendTo($table1);
	if (flag != "SYNERGY") {
	$td = $('<td>').text(text + " Champions That " + currentChampName + " Counters").appendTo($tr);
	} else if (flag == "SYNERGY") {
		$td = $('<td>').text(text + " Champions That "+ currentChampName + " Synergizes Well with").appendTo($tr);
	}
	//$td.css({height: "50px", backgroundColor: "yellow", paddingLeft: "10px", paddingRight: "10px"});	
	$tr = $('<tr>').appendTo($table1);
	$td = $('<td>').appendTo($tr);	
	var table1 = makeMatchTable1(currentRole, flag, false);
		$td.append(table1);	
	// $td = $('<td>').appendTo($tr1);
	// $div = $('<div>').appendTo($td);
	// $div.css({width:"50px", display: "inline-block", background: "transparent"});
    $td2 = $('<td>').appendTo($tr1);
	$table2 = $('<table id="loseMatchups1" class = "loseTable">').appendTo($td2);
	$table2.css({borderCollapse: "collapse"});	
	$tr = $('<tr>').appendTo($table2);
	if (flag != "SYNERGY") {
		$td = $('<td>').text(text + " Champions That Counter " + currentChampName).appendTo($tr);
	} else if (flag == "SYNERGY") {
		$td = $('<td>').text(text + " Champions That "+ currentChampName + " Synergizes Poorly with").appendTo($tr);
	}	
	//$td.css({height: "50px", backgroundColor: "yellow", paddingLeft: "10px", paddingRight: "10px"});	
	$tr = $('<tr>').appendTo($table2);
	$td = $('<td>').appendTo($tr);
	var table2 = makeMatchTable1(currentRole, flag, true);
		$td.append(table2);	
	var $button = $('<button class = "showMore layouttab"> Show More </button>').appendTo('#matchups1');	
		$button.css({margin: "auto", display: "block", height: "40px", width: "120", fontWeight: "bold"});				
		$button[0].onclick = function() {
			if (nextLine >= table1.rows.length) {
				$button.hide();
				return;
			}
			showTablePart(table1, nextLine, 5);
			nextLine = showTablePart(table2, nextLine, 5);
		}
}

function makeAllMatchTables(currentRole) {

	if (simpleRolesArray.indexOf(currentRole) != -1) {
		
		makeTwoMatchTables(currentRole);
	} else if (currentRole == "SUPP") {
		
		makeTwoMatchTables1(currentRole, "DUO_SUPPORT");
		makeTwoMatchTables1(currentRole, "ADCSUPPORT");
		makeTwoMatchTables1(currentRole, "SYNERGY");	
	} else if (currentRole == "ADC") {
		makeTwoMatchTables1(currentRole, "DUO_CARRY");
		makeTwoMatchTables1(currentRole, "ADCSUPPORT");
		makeTwoMatchTables1(currentRole, "SYNERGY");
	}
}

function insertSortTable(table, sortingColumn, startingRow, ascending) {//sort numeric columns only
    var temp, x, y, rows;
    if (ascending == true) {
			sign = 1;
	} else {
		sign = -1;
	} 
	rows = table.rows; 
    for (var i = startingRow; i < table.rows.length-1; i++) {
        for (var j = i; j >= startingRow; j--) {                    
            x = rows[j].cells[sortingColumn];
			y = rows[j + 1].cells[sortingColumn];
			if (sign*parseFloat(x.innerHTML) > sign*parseFloat(y.innerHTML)) {
				rows[j].parentNode.insertBefore(rows[j + 1], rows[j]); 	                       
            }
            else {
                break;
            }
        }
    }    
    return table;
}

//==================================================================
/* sort both numeric values and by id-strings of a column's cells, ASCENDING is true or false  */
function insertSortTable1(table, sortingColumn, startingRow, numericFunctionOfCell, stringFunctionOfCell, ascending) {
    var temp, x, y, rows; 
	rows = table.rows; 
    for (var i = startingRow; i < table.rows.length-1; i++) {
        for (var j = i; j >= startingRow; j--) {                    
            x = rows[j].cells[sortingColumn];
			y = rows[j + 1].cells[sortingColumn];
				if ($.isNumeric(parseFloat(numericFunctionOfCell(x)))) {
				if ((ascending == true && parseFloat(numericFunctionOfCell(x)) > parseFloat(numericFunctionOfCell(y))) || (ascending == false && parseFloat(numericFunctionOfCell(x)) < parseFloat(numericFunctionOfCell(y)))) {
					rows[j].parentNode.insertBefore(rows[j + 1], rows[j]); 	                       
	            } else {
	                break;
	            }
	        } else {	        		        	
		        if ((ascending == true && stringFunctionOfCell(x).toLowerCase() > stringFunctionOfCell(y).toLowerCase()) || (ascending == false && stringFunctionOfCell(x).toLowerCase() < stringFunctionOfCell(y).toLowerCase())) {
	        		rows[j].parentNode.insertBefore(rows[j + 1], rows[j]); 
	        	} else {
	        		break;
	        	}
	        }
        }
    }    
    return table;
}

//==============================================================
/* Sorts or reverse order if already sorted */
/* Sorts both numeric function and string function of a column's cells. If the colums was unsorted, then sorts it ascending if ASCENDING is true, descending if ASCENDING is false */
/* If the column was sorted, then reverses the order*/
/* numericFunctionOfCell is a function of cell that can be parsed to numeric values, could be innerHTML of cell that has textContent that starts by a number like 56% */
/* stringFunctionOfCell can be any string function of cell, for example innerHTML of a cell, or a part of cell id */
function insertSortTable2(table, sortingColumn, startingRow, numericFunctionOfCell, stringFunctionOfCell, ascending) {//
    var x, y, rows, counter;
    var counter = 0; 
	rows = table.rows;

    for (var i = startingRow; i < table.rows.length-1; i++) {
        for (var j = i; j >= startingRow; j--) {                    
            x = rows[j].cells[sortingColumn];
			y = rows[j + 1].cells[sortingColumn];
				if ($.isNumeric(parseFloat(numericFunctionOfCell(x)))) {
				if ((ascending == true && parseFloat(numericFunctionOfCell(x)) > parseFloat(numericFunctionOfCell(y))) || (ascending == false && parseFloat(numericFunctionOfCell(x)) < parseFloat(numericFunctionOfCell(y)))) {
					rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
					counter++; 	                       
	            } else {
	                break;
	            }
	        } else {	        		        	
		        if ((ascending == true && stringFunctionOfCell(x).toLowerCase() > stringFunctionOfCell(y).toLowerCase()) || (ascending == false && stringFunctionOfCell(x).toLowerCase() < stringFunctionOfCell(y).toLowerCase())) {		        
	        		rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
	        		counter++; 
	        	} else {
	        		break;
	        	}
	        }
        }
    }
    if (counter == 0) {
    	reverseTable(table, startingRow);
    }   
    return table;
}
//======================================================
/* Sorts numeric values or a string function's values of a column's cells. The string function of cell can be textContent of cell, or a part of cell id, */
/* or any other string function.*/ 
/*If the column was unsorted, then sorts it ascending if ASCENDING is true, descending if ASCENDING is false */
function insertSortTable3(table, sortingColumn, startingRow, stringFunctionOfCell, ascending) {//
    var x, y, rows, counter;
    var counter = 0; 
	rows = table.rows;

    for (var i = startingRow; i < table.rows.length-1; i++) {
        for (var j = i; j >= startingRow; j--) {                    
            x = rows[j].cells[sortingColumn];
			y = rows[j + 1].cells[sortingColumn];
				if ($.isNumeric(parseFloat(y.innerHTML))) {
				if ((ascending == true && parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) || (ascending == false && parseFloat(x.innerHTML) < parseFloat(y.innerHTML))) {
					rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
					counter++; 	                       
	            } else {
	                break;
	            }
	        } else {	        		        
		        if ((ascending == true && stringFunctionOfCell(x).toLowerCase() > stringFunctionOfCell(y).toLowerCase()) || (ascending == false && stringFunctionOfCell(x).toLowerCase() < stringFunctionOfCell(y).toLowerCase())) {		        
	        		rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
	        		counter++; 
	        	} else {
	        		break;
	        	}
	        }
        }
    }
    if (counter == 0) {
    	reverseTable(table, startingRow);
    }   
    return table;
}

function reverseTable(table, startingRow) {
	var rows = table.rows;
	for ( var i = startingRow; i < rows.length - 1; i++) {
		rows[i].parentNode.insertBefore(rows[rows.length - 1], rows[i]);
	}
	return table;
}

function winRuneTable(){
	// var currentRole1 = roleNameConvert(currentRole);	
	// var currentRoleIndex;
	// for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion		
	// 	if (matchData[i].role == currentRole1) {
	// 		currentRoleIndex = i;
	// 		break;
	// 	}
	// }

	var runeArray = runeHashes.data;
	var winRune = champHashes[currentRoleIndex].hashes.runehash.highestWinrate.hash;
	var winRuneArray = winRune.split("-");

	var $titleRuneTable = $('<table id = "titleWinRuneTable" class = "left winTable table3">');
	$row1 = $('<tr>').appendTo($titleRuneTable);
	$cell1 = $('<th>Highest Win Runes</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleRuneTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.runehash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.runehash.highestWinrate.count +' games</td>').appendTo($row2);


	var $runeTable = $('<table id = "winRunes" class = "left runes">').appendTo($titleRuneTable);
	
	var $trhead = $('<tr>').appendTo($runeTable);
	var $th, $tr, $td;
	for (var i = 0; i <= 2; i++) {
		$th = $('<th>').appendTo($trhead);
		if (i == 0) {
			$th.text("Icon");
		} else if (i == 1) {
			$th.text("Count");
		} else {
			$th.text("Description");
		}
	};

	for (var i = 0; i < winRuneArray.length / 2; i++) {
		$tr = $('<tr>').appendTo($runeTable);
		$td = $('<td id = "runeIcon" class = "tooltip">').appendTo($tr);
		$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.15.1/img/rune/" + runeArray[winRuneArray[i*2]].image.full +  "')";
		// $td[0].style.width = "64px";
		// $td[0].style.height = "64px";

		$td = $('<td>').appendTo($tr);
		$td[0].textContent = "x " + winRuneArray[i*2+1];

		$td = $('<td id = "runeDescription">').appendTo($tr);
		$td[0].innerHTML = runeArray[winRuneArray[i*2]].name; //+ "<br>" + runeArray[winRuneArray[i*2]].description + " each";

	};

	return $titleRuneTable;
}

function freqRuneTable(){
	var runeArray = runeHashes.data;
	var freqRune = champHashes[currentRoleIndex].hashes.runehash.highestCount.hash;
	var freqRuneArray = freqRune.split("-");

	var $titleRuneTable = $('<table id = "titleFreqRuneTable" class = "left table3">');
	$row1 = $('<tr>').appendTo($titleRuneTable);
	$cell1 = $('<th>Most Frequent Runes</th>').appendTo($row1);
	$row2 = $('<tr>').appendTo($titleRuneTable);
	$cell2 = $('<td>' + (champHashes[currentRoleIndex].hashes.runehash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[currentRoleIndex].hashes.runehash.highestCount.count +' games</td>').appendTo($row2);


	var $runeTable = $('<table id = "freqRunes" class = "left runes">').appendTo($titleRuneTable);
	
	var $trhead = $('<tr>').appendTo($runeTable);
	var $th, $tr, $td;
	for (var i = 0; i <= 2; i++) {
		$th = $('<th>').appendTo($trhead);
		if (i == 0) {
			$th.text("Icon");
		} else if (i == 1) {
			$th.text("Count");
		} else {
			$th.text("Description");
		}
	};

	for (var i = 0; i < freqRuneArray.length / 2; i++) {
		$tr = $('<tr>').appendTo($runeTable);
		$td = $('<td id = "runeIcon" class = "tooltip">').appendTo($tr);
		$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.15.1/img/rune/" + runeArray[freqRuneArray[i*2]].image.full +  "')";
		// $td[0].style.width = "64px";
		// $td[0].style.height = "64px";

		$td = $('<td>').appendTo($tr);
		$td[0].textContent = "x " + freqRuneArray[i*2+1];

		$td = $('<td id = "runeDescription">').appendTo($tr);
		$td[0].innerHTML = runeArray[freqRuneArray[i*2]].name;// + "<br>" + runeArray[freqRuneArray[i*2]].description + " each";

	};
	// $row3 = $('<tr>').appendTo($titleRuneTable);
	// $cell3 = $('<td>').appendTo($row3);

	// var heightWin = $('#titleWinRuneTable').height();
	// var heightFreq = $('#titleFreqRuneTable').height();
	// alert(heightWin);
	// alert(heightFreq);
	// var heightDifference = Math.abs(heightWin - heightFreq);
	// $div1 = $('<div>').appendTo($cell3);
	// alert(heightDifference)
	// $div1.css("height", "100px");
	// $titleRuneTable.css("height", height);

	return $titleRuneTable;
}




//============================================



function ferocityTable(colorArray) {
	// alert(1);
	// var skillString = champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.hash;
	// var skillArray = skillString.split("-");
	// alert(skillArray[1]);
	var ferocityArray = masteryHashes.tree.Ferocity;

	// class="mastery-icon tsm-tooltip tooltipstered" data-type="masteries" data-id="6142" style="background-image: url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/6142.png')">

	var $masteryTable = $('<table>');
	var $row = $('<tr>').appendTo($masteryTable);
	var $cell = $('<td> Ferocity </td>').appendTo($row);


	var $skillTable = $('<table id = "ferocity" class = "left masteryPart">').appendTo($masteryTable);
	var $trhead = $('<tr>').appendTo($skillTable);
	var $th, $tr, $td;
	for (var i = 0; i < 6; i++) {
		$tr = $('<tr>').appendTo($skillTable);
		for (var w = 0; w < 3; w++) {
			$td = $('<td class = "tooltip">').appendTo($tr);
			if (i % 2 == 0) {
				if (w == 0) {
					if (colorArray.indexOf(ferocityArray[i][w].masteryId) != - 1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.15.1/img/mastery/" + ferocityArray[i][w].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[ferocityArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3); 
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.15.1/img/mastery/" + "gray_" + ferocityArray[i][w].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[ferocityArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[masteryHashes.data[ferocityArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
				else if (w == 1) {
					$td[0].style.background = "transparent";
					$td[0].style.border = "none";
				}
				else if (w == 2) {
					if (colorArray.indexOf(ferocityArray[i][1].masteryId) != - 1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + ferocityArray[i][1].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][1].masteryId].name + ' (' + colorArray[colorArray.indexOf(ferocityArray[i][1].masteryId) + 1] + '/' + masteryHashes.data[ferocityArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][1].masteryId].description[colorArray[colorArray.indexOf(ferocityArray[i][1].masteryId) + 1] - 1] + '</p>').appendTo($div3);
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + ferocityArray[i][1].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][1].masteryId].name + ' (0/' + masteryHashes.data[ferocityArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][1].masteryId].description[masteryHashes.data[ferocityArray[i][1].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
			}
			else {
				if (colorArray.indexOf(ferocityArray[i][w].masteryId) != - 1) {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + ferocityArray[i][w].masteryId + ".png')";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
					var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[ferocityArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
					var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[colorArray[colorArray.indexOf(ferocityArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3);
				}
				else {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + ferocityArray[i][w].masteryId + ".png')";
					$td[0].style.opacity = "1";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
					var $nameTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[ferocityArray[i][w].masteryId].ranks + ')</p>').appendTo($div3);
					var $descTag = $('<p>' + masteryHashes.data[ferocityArray[i][w].masteryId].description[masteryHashes.data[ferocityArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
				}
			}
			$td[0].style.backgroundSize = "cover";
		};
	};
	
	return $masteryTable;
}

function cunningTable(colorArray) {
	// alert(1);
	// var skillString = champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.hash;
	// var skillArray = skillString.split("-");
	// alert(skillArray[1]);
	var cunningArray = masteryHashes.tree.Cunning;

	// class="mastery-icon tsm-tooltip tooltipstered" data-type="masteries" data-id="6142" style="background-image: url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/6142.png')">

	var $masteryTable = $('<table>');
	var $row = $('<tr>').appendTo($masteryTable);
	var $cell = $('<td> Cunning </td>').appendTo($row);

	var $skillTable = $('<table id = "cunning" class = "left masteryPart">').appendTo($masteryTable);
	var $trhead = $('<tr>').appendTo($skillTable);
	var $th, $tr, $td;
	for (var i = 0; i < 6; i++) {
		$tr = $('<tr>').appendTo($skillTable);
		for (var w = 0; w < 3; w++) {
			$td = $('<td class = "tooltip">').appendTo($tr);
			if (i % 2 == 0) {
				if (w == 0) {
					if (colorArray.indexOf(cunningArray[i][w].masteryId) != -1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + cunningArray[i][w].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(cunningArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[cunningArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].description[colorArray[colorArray.indexOf(cunningArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3); 
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + cunningArray[i][w].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[cunningArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].description[masteryHashes.data[cunningArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
				else if (w == 1) {
					$td[0].style.background = "transparent";
					$td[0].style.border = "none";
				}
				else if (w == 2) {
					if (colorArray.indexOf(cunningArray[i][1].masteryId) != -1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + cunningArray[i][1].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][1].masteryId].name + ' (' + colorArray[colorArray.indexOf(cunningArray[i][1].masteryId) + 1] + '/' + masteryHashes.data[cunningArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][1].masteryId].description[colorArray[colorArray.indexOf(cunningArray[i][1].masteryId) + 1] - 1] + '</p>').appendTo($div3);
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + cunningArray[i][1].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][1].masteryId].name + ' (0/' + masteryHashes.data[cunningArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][1].masteryId].description[masteryHashes.data[cunningArray[i][1].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
			}
			else {
				if (colorArray.indexOf(cunningArray[i][w].masteryId) != -1) {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + cunningArray[i][w].masteryId + ".png')";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
					var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(cunningArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[cunningArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
					var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].description[colorArray[colorArray.indexOf(cunningArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3);
				}
				else {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + cunningArray[i][w].masteryId + ".png')";
					$td[0].style.opacity = "1";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);	
					var $nameTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[cunningArray[i][w].masteryId].ranks + ')</p>').appendTo($div3);
					var $descTag = $('<p>' + masteryHashes.data[cunningArray[i][w].masteryId].description[masteryHashes.data[cunningArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
				}
			}
			$td[0].style.backgroundSize = "cover";
		};
	};

	return $masteryTable;
}

// $(".tooltip").hover(function(){
// 	$(this).css("opacity", "1");
// });

function resolveTable(colorArray) {
	// alert(1);
	// var skillString = champHashes[currentRoleIndex].hashes.skillorderhash.highestCount.hash;
	// var skillArray = skillString.split("-");
	// alert(skillArray[1]);
	var resolveArray = masteryHashes.tree.Resolve;

	// class="mastery-icon tsm-tooltip tooltipstered" data-type="masteries" data-id="6142" style="background-image: url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/6142.png')">

	var $masteryTable = $('<table>');
	var $row = $('<tr>').appendTo($masteryTable);
	var $cell = $('<td> Resolve </td>').appendTo($row);

	var $skillTable = $('<table id = "cunning" class = "left masteryPart">').appendTo($masteryTable);
	var $trhead = $('<tr>').appendTo($skillTable);
	var $th, $tr, $td;
	for (var i = 0; i < 6; i++) {
		$tr = $('<tr>').appendTo($skillTable);
		for (var w = 0; w < 3; w++) {
			$td = $('<td class = "tooltip">').appendTo($tr);
			if (i % 2 == 0) {
				if (w == 0) {
					if (colorArray.indexOf(resolveArray[i][w].masteryId) != -1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + resolveArray[i][w].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(resolveArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[resolveArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].description[colorArray[colorArray.indexOf(resolveArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3); 
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + resolveArray[i][w].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[resolveArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].description[masteryHashes.data[resolveArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
				else if (w == 1) {
					$td[0].style.background = "transparent";
					$td[0].style.border = "none";
				}
				else if (w == 2) {
					if (colorArray.indexOf(resolveArray[i][1].masteryId) != -1) {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + resolveArray[i][1].masteryId + ".png')";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][1].masteryId].name + ' (' + colorArray[colorArray.indexOf(resolveArray[i][1].masteryId) + 1] + '/' + masteryHashes.data[resolveArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][1].masteryId].description[colorArray[colorArray.indexOf(resolveArray[i][1].masteryId) + 1] - 1] + '</p>').appendTo($div3);
					}
					else {
						$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + resolveArray[i][1].masteryId + ".png')";
						$td[0].style.opacity = "1";

						var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
						var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][1].masteryId].name + ' (0/' + masteryHashes.data[resolveArray[i][1].masteryId].ranks + ')</p>').appendTo($div3); 
						var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][1].masteryId].description[masteryHashes.data[resolveArray[i][1].masteryId].ranks - 1] + '</p>').appendTo($div3);
					}
				}
			}
			else {
				if (colorArray.indexOf(resolveArray[i][w].masteryId) != -1) {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + resolveArray[i][w].masteryId + ".png')";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
					var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].name + ' (' + colorArray[colorArray.indexOf(resolveArray[i][w].masteryId) + 1] + '/' + masteryHashes.data[resolveArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
					var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].description[colorArray[colorArray.indexOf(resolveArray[i][w].masteryId) + 1] - 1] + '</p>').appendTo($div3);
				}
				else {
					$td[0].style.backgroundImage = "url('http://ddragon.leagueoflegends.com/cdn/7.13.1/img/mastery/" + "gray_" + resolveArray[i][w].masteryId + ".png')";
					$td[0].style.opacity = "1";

					var $div3 = $('<div class = "tooltiptext"></div>').appendTo($td);
					var $nameTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].name + ' (0/' + masteryHashes.data[resolveArray[i][w].masteryId].ranks + ')</p>').appendTo($div3); 
					var $descTag = $('<p>' + masteryHashes.data[resolveArray[i][w].masteryId].description[masteryHashes.data[resolveArray[i][w].masteryId].ranks - 1] + '</p>').appendTo($div3);
				}
			}
			$td[0].style.backgroundSize = "cover";
		};
	};

	return $masteryTable;
}

// $(document).ready(function() {
// // Tooltip only Text
// $('.masterTooltip').hover(function(){
//         // Hover over code
//         var title = $(this).attr('title');
//         $(this).data('tipText', title).removeAttr('title');
//         $('<p class="tooltip"></p>')
//         .text(title)
//         .appendTo('body')
//         .fadeIn('slow');
// }, function() {
//         // Hover out code
//         $(this).attr('title', $(this).data('tipText'));
//         $('.tooltip').remove();
// }).mousemove(function(e) {
//         var mousex = e.pageX + 20; //Get X coordinates
//         var mousey = e.pageY + 10; //Get Y coordinates
//         $('.tooltip')
//         .css({ top: mousey, left: mousex })
// });
// });

function makeMasteryTable() {
	var masteryArray;
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
		if (matchData[i].role == roleNameConvert(currentRole)) {
			masteryStr = champHashes[i].hashes.masterieshash.highestCount.hash;
			var masteryArray = masteryStr.split("-");
			$masteryTable = $('<table id="freqMaster">').appendTo("body");
			$row1 = $('<tr>').appendTo($masteryTable);
			$cell1 = $('<th>Most Frequent Masteries</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($masteryTable);
			$cell2 = $('<td>' + (champHashes[i].hashes.masterieshash.highestCount.winrate * 100).toFixed(2) + '% over '+ champHashes[i].hashes.masterieshash.highestCount.count +' games</td>').appendTo($row2);	$tripleTable = $('<tr>').appendTo($masteryTable);
			$tripleTable = $('<tr>').appendTo($masteryTable);
			$row = $('<tr>').appendTo($tripleTable);
			$cell = $('<td>').appendTo($row);
			ferocityTable(masteryArray).appendTo($cell);
			$cell = $('<td>').appendTo($row);
			cunningTable(masteryArray).appendTo($cell);
			$cell = $('<td>').appendTo($row);
			resolveTable(masteryArray).appendTo($cell);
			break;
		}
	}
	return $masteryTable;
}

function makeWinMasteryTable() {
	var masteryArray;
	for (var i = 0; i < matchData.length; i++) {  //array of data for all roles played by this champion
		if (matchData[i].role == roleNameConvert(currentRole)) {
			masteryStr = champHashes[i].hashes.masterieshash.highestWinrate.hash;
			masteryArray = masteryStr.split("-");
			$masteryTable = $('<table id="winMaster" class = "winTable">').appendTo("body");
			$row1 = $('<tr>').appendTo($masteryTable);
			$cell1 = $('<th>Highest Win Masteries</th>').appendTo($row1);
			$row2 = $('<tr>').appendTo($masteryTable);
			$cell2 = $('<td>' + (champHashes[i].hashes.masterieshash.highestWinrate.winrate * 100).toFixed(2) + '% over '+ champHashes[i].hashes.masterieshash.highestWinrate.count +' games</td>').appendTo($row2);	$tripleTable = $('<tr>').appendTo($masteryTable);
			$tripleTable = $('<tr>').appendTo($masteryTable);
			$row = $('<tr>').appendTo($tripleTable);
			$cell = $('<td>').appendTo($row);
			ferocityTable(masteryArray).appendTo($cell);
			$cell = $('<td>').appendTo($row);
			cunningTable(masteryArray).appendTo($cell);
			$cell = $('<td>').appendTo($row);
			resolveTable(masteryArray).appendTo($cell);
			break;
		}
	}
	return $masteryTable;
}
function p1Hide() {
	$("#p1").hide();
	$(".p1icon").hide();
	$("#champPg").show();	
}

function p1Show() {
	$("#champPg").hide();
	$("#p1").show();
	$(".p1icon").show();	
}

//============================
function champfilter() {
		    // Declare variables
		    var input, filter;
		    input = document.getElementById('champInput');
		    filter = input.value.toUpperCase();
		    if (document.getElementById("top").className.indexOf("active")!=-1) {
		    	topfunc();
		    }
		    else if (document.getElementById("mid").className.indexOf("active")!=-1) {
		    	midfunc();
		    }
		    else if (document.getElementById("jg").className.indexOf("active")!=-1) {
		    	jgfunc();
		    }
		    else if (document.getElementById("adc").className.indexOf("active")!=-1) {
		    	adcfunc();
		    }
		    else if (document.getElementById("supp").className.indexOf("active")!=-1) {
		    	suppfunc();
		    }
		    else {
		    	allfunc();
		    }

		    // Loop through all list items, and hide those who don't match the search query

			if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
			    for (i = 0; i < champs.length; i++) {
					if (champmap.hasOwnProperty(champids[i].toString())) {
				        if (champs[i].toUpperCase().indexOf(filter) == -1) {
				        //if (!(champs[i].toUpperCase().startsWith(filter))) {
				            document.getElementById("table_"+champs[i]).style.display = "none";
				        };
				    };
			    };			
			} else {
			    for (i = 0; i < champs.length; i++) {
					//if (champmap.hasOwnProperty(champids[i].toString())) {
				        if (champs[i].toUpperCase().indexOf(filter) == -1) {
				        //if (!(champs[i].toUpperCase().startsWith(filter))) {	
				            document.getElementById(champs[i]).style.display = "none";
				        };
				    };
			    };
			}
		
//==============================================

function removetable() {
			$("#champtable").remove();
		}

function tablemake() {	
	var $a, th, row, cell;
	var champnamecurr, champidcurr, champidcurrStr, champwincurr, champpickcurr, champbancurr, voidindex;
    for (i = 0; i < champs.length; i++) {
 		if (champmap.hasOwnProperty(champids[i].toString())) {
    		document.getElementById(champs[i]).style.display = "none";
    	};
    }
	var champt1 = document.createElement("table");	
	champt1.setAttribute("id", "champtable");
	var thead = champt1.createTHead();
	th = document.createElement("th");
	th.innerHTML = "<b>Icon</b>";
	thead.appendChild(th);
	th = document.createElement("th");
	th.innerHTML = "<b>Champion</b>";
	th.onclick = function(){insertSortTable2(champt1, 1, 0, cellText, cellId, true);};
	th.setAttribute("style", "cursor: pointer;");
	thead.appendChild(th);
	th = document.createElement("th");
	th.innerHTML = "<b>Lane</b>";
	th.onclick = function(){insertSortTable2(champt1, 2, 0, cellText, cellId, true);};
	th.setAttribute("style", "cursor: pointer;");
	thead.appendChild(th);
	th = document.createElement("th");
	th.innerHTML = "<b>Win Rate</b>";
	th.onclick = function(){insertSortTable2(champt1, 3, 0, cellText, cellId, false);};
	th.setAttribute("style", "cursor: pointer;");
	thead.appendChild(th);
	th = document.createElement("th");
	th.innerHTML = "<b>Pick Rate</b>";
	th.onclick = function(){insertSortTable2(champt1, 4, 0, cellText, cellId, false);};
	th.setAttribute("style", "cursor: pointer;");
	thead.appendChild(th);
	th = document.createElement("th");
	th.innerHTML = "<b>Ban Rate</b>";
	th.onclick = function(){insertSortTable2(champt1, 5, 0, cellText, cellId, true);};
	th.setAttribute("style", "cursor: pointer;");
	thead.appendChild(th);
	for (var i = 0; i < champs.length; i++) {
		if (champmap.hasOwnProperty(champids[i].toString())) {
			champnamecurr = champs[i];
			champidcurr = champids[i];
			champidcurrStr = champidcurr.toString();
			champwincurr = champmap[champidcurrStr].winRate;
			champpickcurr = champmap[champidcurrStr].playRate;
			champbancurr = champmap[champidcurrStr].banRate;
			voidindex = voidchamps.indexOf(champnamecurr);
			row = champt1.insertRow(-1);
			row.id="table_"+champnamecurr;
			cell = row.insertCell(0);
			if (voidindex==-1) {
				cell.style.backgroundImage="url('ChampSq/"+champnamecurr+".png')";
			} else {
				cell.style.backgroundImage="url('ChampSq/"+voidchampstext[voidindex]+".png')";
			};
			cell.style.width="50px";
			cell.style.height="50px";
			cell.style.backgroundSize="cover";
			cell = row.insertCell(1);			
			$a = $('<a href = "#!">' + champnamecurr + '</a>' ).appendTo(cell);
			$a[0].className = "mainTable_" + champidcurr;
			$a[0].onclick = makeChampPg;
			cell.id = champnamecurr + " tabrow";
			cell = row.insertCell(2);
			cell = row.insertCell(3);
			cell.id = "tablewin_" + champnamecurr;
			cell.innerHTML= champwincurr + "%";
			cell = row.insertCell(4);
			cell.id = "tablepick_" + champnamecurr;
			cell.innerHTML= champpickcurr + "%";
			cell = row.insertCell(5);
			cell.id = "tableban_" + champnamecurr;
			cell.innerHTML= champbancurr + "%";
		};
	};
	$("#p1").append(champt1);	
};


function cellText(cell) {
	return cell.innerHTML;
}

function cellId(cell) {
		return cell.id;
	}

function layouttabpress(tabname) {
    var layouttabs = document.getElementsByClassName("layouttab");
    for (var i = 0; i < layouttabs.length; i++) {
        layouttabs[i].className = layouttabs[i].className.replace(" active", "");
    };
	document.getElementById(tabname).className += " active";
}


function tabpress(tabname) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    };
	document.getElementById(tabname).className += " active";
}

function topfunc() {
	allfunc();
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {		
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " TOP")) {
					document.getElementById("table_"+champs[i]).style.display="none";
				} else {
					document.getElementById("tablewin_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " TOP"].winRate + "%";
					document.getElementById("tablepick_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " TOP"].playRate + "%";
				};
			};
		};
	} else {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {						
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " TOP")) {
					document.getElementById(champs[i]).style.display="none";
				} else {
					// alert(document.getElementById("winval" + champs[i])== null));
					document.getElementById("winperc_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " TOP"].winRate + "%";
				};
			};
		};
	};
}

function midfunc() {
	allfunc();
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " MIDDLE")) {
					document.getElementById("table_"+champs[i]).style.display="none";
				} else {
					document.getElementById("tablewin_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " MIDDLE"].winRate + "%";
					document.getElementById("tablepick_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " MIDDLE"].playRate + "%";
				};
			};
		};				
	} else {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " MIDDLE")) {
					document.getElementById(champs[i]).style.display="none";
				} else {
					document.getElementById("winperc_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " MIDDLE"].winRate + "%";						
				};
			};
		};
	};
}

function jgfunc() {
	allfunc();
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " JUNGLE")) {
					document.getElementById("table_"+champs[i]).style.display="none";
				} else {
					document.getElementById("tablewin_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " JUNGLE"].winRate + "%";
					document.getElementById("tablepick_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " JUNGLE"].playRate + "%";
				};
			};
		};				
	} else {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " JUNGLE")) {
					document.getElementById(champs[i]).style.display="none";
				} else {
					document.getElementById("winperc_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " JUNGLE"].winRate + "%";
				};
			};
		};
	};
}

function adcfunc() {
	allfunc();
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " DUO_CARRY")) {
					document.getElementById("table_"+champs[i]).style.display="none";
				} else {
					document.getElementById("tablewin_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_CARRY"].winRate + "%";
					document.getElementById("tablepick_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_CARRY"].playRate + "%";
				};
			};
		};				
	} else {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " DUO_CARRY")) {
					document.getElementById(champs[i]).style.display="none";
				} else {
					document.getElementById("winperc_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_CARRY"].winRate + "%";						
				};
			};
		};
	};
}

function suppfunc() {
	allfunc();
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " DUO_SUPPORT")) {
					document.getElementById("table_"+champs[i]).style.display="none";
				} else {
					document.getElementById("tablewin_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_SUPPORT"].winRate + "%";
					document.getElementById("tablepick_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_SUPPORT"].playRate + "%";
				};
			};
		};				
	} else {
		for (var i = 0; i <= champs.length - 1; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				if (!champRoleMap.hasOwnProperty(champids[i].toString() + " DUO_SUPPORT")) {
					document.getElementById(champs[i]).style.display="none";
				} else {
					document.getElementById("winperc_" + champs[i]).textContent = champRoleMap[champids[i].toString() + " DUO_SUPPORT"].winRate + "%";
				};
			};
		}
	};
}
function allfunc(){
	if (document.getElementById("tablebutt").className.indexOf("active")!=-1) {
		for (var i = 0; i < champs.length; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				document.getElementById("table_"+champs[i]).style.display="table-row";
				document.getElementById("tablewin_" + champs[i]).textContent = champmap[champids[i].toString()].winRate + "%";
				document.getElementById("tablepick_" + champs[i]).textContent = champmap[champids[i].toString()].playRate + "%";
			};
		};				
	} else {
		for (var i = 0; i < champs.length; i++) {
			if (champmap.hasOwnProperty(champids[i].toString())) {
				document.getElementById(champs[i]).style.display="inline-block";
				document.getElementById("winperc_" + champs[i]).textContent = champmap[champids[i].toString()].winRate + "%";
			};
		};
	};
}

function mainFunction() {			
	async.parallel([			
	function(callback) {				
		$.getJSON("/champFullData", function (data) {
			champFullObj = data;
			callback();
		});
	}, function(callback) {				
		$.getJSON("/itemData", function (data) {
			itemObj = data;
			callback();
		});
	}, function(callback) {				
		$.getJSON("/summonerData", function (data) {
			summonerObj = data;
			callback();
		});
	}, function(callback) {
		$.getJSON("/champFullData", function (data) {
			champFullObj = data;
			callback();
		});
	},	function(callback) {				
		$.getJSON("/fiveDayData", function (data) {
			fiveDayObj = data;
			callback();
		});
	}
	], function done(err, results) {				
		if (err) {
			throw err;
		}
		makeArrayOfIdsNames();				
		arrayObject = JSON.parse(fiveDayObj[4].data); // champ stats for the current day
		champmap = makeDayChampObj(arrayObject);
		champRoleMap = makeDayRoleObj(arrayObject);
		makeGrid();				
		p1Show();
		makeFiveDayArrObj(); //  makes arrayChampFive and arrayRoleFive
	});
}

function makeArrayOfIdsNames() {
	var ids = Object.keys(champFullObj.keys);
	for (var i = 0; i < ids.length; i++) {
		arrayOfIdsNames.push({"id" : ids[i], "name" : champFullObj.keys[ids[i]]});		
	};
	arrayOfIdsNames.sort(alphabetizeChamps);	
	for (var i = 0; i < arrayOfIdsNames.length; i++) {
		champs.push(arrayOfIdsNames[i].name);
		champids.push(Number.parseInt(arrayOfIdsNames[i].id));		
	};
}

function alphabetizeChamps(a, b) {
	if (a.name.toLowerCase() < b.name.toLowerCase()) {
		return -1;
	}
	else if (a.name.toLowerCase() > b.name.toLowerCase()) {
		return 1;
	}
	else {
		return 0;
	}
}

function makeFiveDayArrObj() {
	var oneDay;
	for (var i = 0; i < fiveDayObj.length; i++) {
		oneDay = JSON.parse(fiveDayObj[i].data);
		arrayChampFive.push({"date": new Date(fiveDayObj[i].date),"data": makeDayChampObj(oneDay)});
		arrayRoleFive.push({"date": new Date(fiveDayObj[i].date),"data": makeDayRoleObj(oneDay)});
	};			
}

function makeDayChampObj(arrObj) { //stats (win rate, pick rate, and ban rate) for the role most played for each champ with key = champId
	var champObj = {};
	for (var i = 0; i < arrObj.length; i++) {
		currchampid = arrObj[i].championId;
		currchampidStr = currchampid.toString();
		currchampname = champs[champids.indexOf(currchampid)];
		if (champObj.hasOwnProperty(currchampidStr)) {
			champObj[currchampidStr].playRate = (parseFloat(champObj[currchampidStr].playRate) + parseFloat((arrObj[i].playRate*100).toFixed(2))).toFixed(2);
			if (((arrObj[i].percentRolePlayed*100).toFixed(2)) <= champObj[currchampidStr].percentRolePlayed) {
				continue;
			};
		};
		currchampdata = {name: currchampname, winRate: (arrObj[i].winRate*100).toFixed(2), playRate: (arrObj[i].playRate*100).toFixed(2), banRate: (arrObj[i].banRate*100).toFixed(2), role: arrObj[i].role, percentRolePlayed: (arrObj[i].percentRolePlayed*100).toFixed(2)};
		champObj[currchampidStr] = currchampdata;
	};
	return champObj;
};

function makeDayRoleObj(arrObj) { //stats (win rate, pick rate, and ban rate) for each champ + role combination with key = champId + " " + role
	var champObj = {};
	for (var i = 0; i < arrObj.length; i++) {
		currchampid = arrObj[i].championId;
		currchampidStr = currchampid.toString();
		currChampRoleStr = currchampidStr + " " + arrObj[i].role;
		currchampname = champs[champids.indexOf(currchampid)];
		currchampdata = {name: currchampname, winRate: (arrObj[i].winRate*100).toFixed(2), playRate: (arrObj[i].playRate*100).toFixed(2), banRate: (arrObj[i].banRate*100).toFixed(2), role: arrObj[i].role, percentRolePlayed: (arrObj[i].percentRolePlayed*100).toFixed(2)};
		champObj[currChampRoleStr] = currchampdata;
	};
	return champObj;
};

function makeGrid() {
	var champnamecurr, champidcurr, champidcurrStr, link, voidindex, champlink, champicon, champname, winrate, winpercent, t1, t;
	var champwincurr = 0.50;
	for (var i = 0; i <= champs.length - 1; i++) {
		champnamecurr = champs[i];
		champidcurr = champids[i];
		champidcurrStr = champidcurr.toString();
		link = document.createElement("a");
		voidindex = voidchamps.indexOf(champs[i]);
		if (champmap.hasOwnProperty(champidcurrStr)) {
			champwincurr = champmap[champidcurrStr].winRate;				
			link.href = "#!/";
			link.id = champids[i];
			link.onclick = makeChampPg;					
			champicon = document.createElement("div");
			champicon.className = "champicon1 p1icon";
			champicon.id = champs[i];
			champname = document.createElement("span");
			var t = document.createTextNode(champnamecurr);					
			champname.appendChild(t);
			champicon.appendChild(champname);					
			winrate = document.createElement("div");
			winrate.className = "winrate1";
			winpercent = document.createElement("p");
			winpercent.id = "winperc_" + champs[i];					
			var t = document.createTextNode(champwincurr+"%");					
			winpercent.appendChild(t);
			winrate.appendChild(winpercent);
			champicon.appendChild(winrate);
			link.appendChild(champicon);
			$("#p1").append(link);					
			if (voidindex==-1) {
				document.getElementById(champs[i]).style.backgroundImage="url('ChampSq/"+champnamecurr+".png')";
			} else {
				document.getElementById(champs[i]).style.backgroundImage="url('ChampSq/"+voidchampstext[voidindex]+".png')";
			};
		};
	}
};

$(document).ready(function() {
	mainFunction();
});