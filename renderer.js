const {dialog} = require('electron').remote
require("./src/Reassembler");

var target_fleet;
var log_path = "C:\\Users\\" + process.env.USERNAME + "\\Saved Games\\Reassembly\\data";
var path_to_reassembly = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Reassembly\\win32";

var fleetButton = document.getElementById("FleetButton");
var showFleet = document.getElementById("ShowFleet");
var maxFleetValue = document.getElementById("max_fleet_value");
var maxShipValue = document.getElementById("max_ship_value");
var minShipValue = document.getElementById("min_ship_value");
var maxBlocks = document.getElementById("max_blocks");
var faction = document.getElementById("faction");
var symmetry = document.getElementById("symmetry");
var run = document.getElementById("Run");
var intro = document.getElementById("Intro");

checkConfig = () => {
    if(config.max_fleet_value < config.max_ship_value){
        return { error: "Max ship value cannot be higher than fleet value"}
    }

    if(config.min_ship_value > config.max_ship_value){
        return { error: "Min ship value cannot be higher than max ship value"}
    }

    return 1
}
//Default Config
var config = {
    max_fleet_value: 16000,
    max_ship_value: 16000,
    min_ship_value: 100,
    max_blocks: 10000,
    faction: 8,
    symmetry: 1
};

fleetButton.addEventListener("click", () => {
    target_fleet = dialog.showOpenDialog()
    showFleet.innerHTML = target_fleet
})

maxFleetValue.addEventListener("input", () => {
    config.max_fleet_value = maxFleetValue.value;
});

maxShipValue.addEventListener("input", () => {
    config.max_ship_value = maxShipValue.value;
});

minShipValue.addEventListener("input", () => {
    config.min_ship_value = minShipValue.value;
});

maxBlocks.addEventListener("input", () => {
    config.max_blocks = maxBlocks.value;
});

faction.addEventListener("input", () => {
    config.faction =  Number(faction.value.replace(/[^0-9]/g,''))
});

symmetry.addEventListener("input", () => {
    config.symmetry =  Number(symmetry.value.replace(/[^0-9]/g,''))
});

run.addEventListener("click", () => {
    var res = checkConfig();
    if(res.error !== undefined){
        alert(res.error);
        return
    }
});

