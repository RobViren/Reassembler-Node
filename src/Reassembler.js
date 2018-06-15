var FB = require("./FleetBuilder");

var f;

document.getElementById("doit").addEventListener("click",(e) => {
	var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    f = FB.buildFleet("doop",12,10000,200,10000,1000,2);
    
    console.log(f.getTotalValue());
});

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
    }
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var scale = .5;
var originx = 250;
var originy = 250;

setInterval(function () {
    if(f !== undefined){
        f.drawFleet(context,originx,originy,scale);
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
}