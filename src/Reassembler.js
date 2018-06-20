var BM = require("./BattleManager");
var FB = require("./FleetBuilder");
var Util = require("./Util");
var os = require('os');

var NUM_THREADS = os.cpus().length;
var stop = false;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var scale = .5;
var originx = 250;
var originy = 100;
var best_fleet;
var max_score = 0;
var stop = false;
var pause = false;

//Drawing
window.addEventListener('keydown',check,false);

function check(e) {
    var magnitude = 5;
    switch(e.key){
    	case 's':
    		originy -= magnitude;
    		break;
    	case 'w':
    		originy += magnitude;
    		break;
    	case 'a':
    		originx += magnitude;
    		break;
    	case 'd':
    		originx -= magnitude;
            break;
        case 'q':
            stop = true;
            break;
    }
}

setInterval(function () {
    context.width = window.innerWidth;
    context.height = window.innerHeight;
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.8;
    if(best_fleet !== undefined){
        best_fleet.drawFleet(context,originx,originy,scale);
    }
},100);

canvas.addEventListener("mousewheel", onWheel, false);
// Firefox
canvas.addEventListener("DOMMouseScroll", onWheel, false);

function onWheel (event){
    // cross-browser wheel delta
    var e = event || e; // old IE support
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))

    if(delta == -1){
    	scale *= .9;
    }
    else{
    	scale /= .9;
    }
    console.log(scale);
};

function bruteForceFleetBeater(path,faction,total_value, min_ship_value, max_ship_value, symmetry){
    FB.groupBuildFleet("F",faction,total_value,min_ship_value,max_ship_value,symmetry,NUM_THREADS).then(res => {
        BM.battleGroup(path,res).then(results => {
            var winner = false;
            for(var i = 0; i < results.length; i++){
                if(results[i].score > max_score){
                    best_fleet = res[i];
                    max_score = results[i].score;
                }
                if(results[i].winner === 1){
                    console.log("Winner is " + res[i].name);
                    winner = true;
                }
            }
            console.log("Leader is " + best_fleet.name + " with  a score of " + max_score);
            best_fleet.name = "best_fleet";
            best_fleet.saveFleet("./ships/best.lua");
            if(!winner) {
                bruteForceFleetBeater(path,faction,total_value, min_ship_value, max_ship_value, symmetry);
            }
        });
    });
}

function stopSim() {
    stop = true;
};

function pauseSim() {
    pause = !pause;
};

module.exports = {
    bruteForceFleetBeater: bruteForceFleetBeater,
    pauseSim: pauseSim,
    stopSim: stopSim
}