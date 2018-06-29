// var SB = require("./src/ShipBuilder");

// var ship = SB.buildShip("woop",8,1,10000,200);
// var canvas = document.getElementById("canvas");
// var context = canvas.getContext("2d");

// ship.drawShip(context, 200, 200, 0.5);

const {dialog} = require('electron').remote
var R = require("./src/Reassembler");

var fleetButton = document.getElementById("FleetButton");
var showFleet = document.getElementById("ShowFleet");
var maxFleetValue = document.getElementById("max_fleet_value");
var maxShipValue = document.getElementById("max_ship_value");
var minShipValue = document.getElementById("min_ship_value");
var faction = document.getElementById("faction");
var symmetry = document.getElementById("symmetry");
var run = document.getElementById("Run");
var options = document.getElementById("options");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var battleTime = document.getElementById("time");

var timer;

checkConfig = () => {
    if(config.max_fleet_value < config.max_ship_value){
        return { error: "Max ship value cannot be higher than fleet value"}
    }

    if(config.min_ship_value > config.max_ship_value){
        return { error: "Min ship value cannot be higher than max ship value"}
    }

    if(config.path === undefined){
        return { error: "You must select a fleet to beat."}
    }

    return 1
}
//Default Config
var config = {
    max_fleet_value: 16000,
    max_ship_value: 16000,
    min_ship_value: 200,
    faction: 8,
    symmetry: 1
};

fleetButton.addEventListener("click", () => {
    config.path = dialog.showOpenDialog();
    //Backticks to not work for some reason
    config.path = config.path[0].replace(/\\/g,"/");
    showFleet.innerHTML = config.path;
})

maxFleetValue.addEventListener("input", () => {
    config.max_fleet_value = parseInt(maxFleetValue.value);
});

maxShipValue.addEventListener("input", () => {
    config.max_ship_value = parseInt(maxShipValue.value);
});

minShipValue.addEventListener("input", () => {
    config.min_ship_value = parseInt(minShipValue.value);
});

faction.addEventListener("input", () => {
    config.faction =  parseInt(faction.value.replace(/[^0-9]/g,''))
});

symmetry.addEventListener("input", () => {
    config.symmetry =  parseInt(symmetry.value.replace(/[^0-9]/g,''))
});

run.addEventListener("click", () => {
    var res = checkConfig();
    if(res.error !== undefined){
        alert(res.error);
    } else {
        //options.style.display ="none";
        timer = new Date();
        console.log(config);
        R.bruteForceFleetBeater(config.path,config.faction,config.max_fleet_value,config.min_ship_value,config.max_ship_value,config.symmetry);
        setInterval(() => {
            console.log(Date.now() - timer);
        },100);
    }
});

context.width = window.innerWidth;
context.height = window.innerHeight;
canvas.width = window.innerWidth * 0.6;
canvas.height = window.innerHeight * 0.8;
