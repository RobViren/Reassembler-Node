const { exec } = require('child_process');
const fs = require("fs");

var cwd = process.cwd().replace(/\\/g,"/");

function battle(fleet1, fleet2){
  var battle = exec('"C:/Program Files (x86)/Steam/steamapps/common/Reassembly/win32/ReassemblyRelease.exe" --HeadlessMode=1 --NetworkEnable=0 --LoadSuperFast=1 --SteamEnable=0 --TimestampLog=0 --EnableDevBindings=1 --SandboxScript="arena \'' + cwd + '/ships/' + fleet1 + '.lua\' \'' + cwd + '/ships/' + fleet2 + '.lua\'"');
  return new Promise((resolve, reject) => {
    var results = "";
    battle.stdout.on('data',data =>{
      results += data;
    });
  
    battle.on('exit',data => {
      var res = parseResults(results);
      if(res.winner === -1){
        reject("No Winner Found?");
      } else {
        resolve(res);
      }
    });
  });
};

function parseResults(results) {
  var res = {};
  if(results.search("winner is 0") !== -1){
    res.winner = 0;
  } else if(results.search("winner is 1") !== -1){
    res.winner = 1;
  } else {
    res.winner = -1;
  }

  var num_str = (results.substr(results.search("headless loop after") + 20, 100));
  for(var i = 0; i < num_str.length; i++){
    if(isNaN(parseInt(num_str[i]))){
      num_str = num_str.substr(0,i);
      break;
    }
  }

  res.score = parseInt(num_str);

  return(res);
}


var battles = [];

battles.push(battle("ship","ship2"))
battles.push(battle("ship2","ship"))
battles.push(battle("ship","ship2"))
battles.push(battle("ship2","ship"))
battles.push(battle("ship","ship2"))
battles.push(battle("ship2","ship"))

Promise.all(battles).then(res =>{
  console.log(res);
});

module.exports = {
    battle: battle
};