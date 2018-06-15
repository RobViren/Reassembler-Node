var Util = require("./Util");
var SB = require("./ShipBuilder");

//Fleet things
function Fleet(name,faction){
	this.name = name;
	this.faction = faction;
	this.ships = [];

	//Functions
	this.getTotalValue = getTotalValue;
	this.drawFleet = drawFleet;
    this.addShip = addShip;
}

function getTotalValue(){
	var value = 0;
	for(var i = 0; i < this.ships.length; i++){
		value += this.ships[i].getShipValue();
	}
	return(value);
}

function buildFleet(name,faction,total_value, min_ship_value, max_ship_value, block_limit, symmetry){
	var new_fleet = new Fleet(name,faction);

	var loop_counter = 0;

    while(new_fleet.getTotalValue() < total_value){

		ship_value = Util.getRandomInt(min_ship_value,max_ship_value);

		new_fleet.addShip(name + "_" + loop_counter, faction, symmetry, ship_value);
		loop_counter++;
	}
  //Remove ship that put it over
  new_fleet.ships.pop();

  //Add new ship that is the perfect value
  var remainder = total_value - new_fleet.getTotalValue();
  ship_value = remainder;
  if(min_ship_value < remainder){
    new_fleet.addShip(name + "_" + "remainder",faction, symmetry, ship_value);
  }

	return(new_fleet);
}

function drawFleet(context,x,y,scale){
  context.clearRect(0, 0, 2000, 2000);
	for(var k = 0; k < this.ships.length; ++k){
        this.ships[k].drawShip(context,x, y + 300 * k * scale, scale);
	}
}

function addShip(name, faction, ship_symmetry, target_ship_value){
  this.ships.push(SB.buildShip(name, faction, ship_symmetry, target_ship_value));
}


module.exports = {
  Fleet: Fleet,
  drawFleet: drawFleet,
  addShip: addShip,
  getTotalValue: getTotalValue,
  buildFleet: buildFleet
};