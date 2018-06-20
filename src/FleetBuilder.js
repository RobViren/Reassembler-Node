var Util = require("./Util");
var SB = require("./ShipBuilder");
var fs = require("fs");

//Fleet things
function Fleet(name,faction){
	this.name = name;
	this.faction = faction;
	this.ships = [];

	//Functions
	this.getTotalValue = getTotalValue;
	this.drawFleet = drawFleet;
    this.addShip = addShip;
    this.saveFleet = saveFleet;
}

function getTotalValue(){
	var value = 0;
	for(var i = 0; i < this.ships.length; i++){
		value += this.ships[i].getShipValue();
	}
	return(value);
}

function buildFleet(name,faction,total_value, min_ship_value, max_ship_value, symmetry){
	var new_fleet = new Fleet(name,faction);
  return new Promise((resolve,reject) => {
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

    resolve(new_fleet);
  });
}

function groupBuildFleet(name,faction,total_value, min_ship_value, max_ship_value, symmetry, quantity){
  return new Promise((resolve, reject) => {
    var promise = [];
    for(var i = 0; i < quantity; i++){
      promise.push(buildFleet("F" + i,faction,total_value,min_ship_value,max_ship_value,symmetry));
    };

    Promise.all(promise).then(res => {
      var save_promises = [];
      for(var i = 0; i < res.length; i++){
        save_promises.push(res[i].saveFleet("./ships/" + res[i].name + ".lua"));
      }

      //Damn you async
      Promise.all(save_promises).then( () => {
        resolve(res);
      });
    });
  });
}

function drawFleet(context,x,y,scale){
  context.clearRect(0, 0, 2000, 2000);
	for(var k = 0; k < this.ships.length; ++k){
        this.ships[k].drawShip(context,x, y + 300 * k * scale, scale);
	}
}

function addShip(name, faction, ship_symmetry, target_ship_value){
  //function buildShip(name, faction, ship_symmetry, target_ship_value, min_thruster_value, weights){
  this.ships.push(SB.buildShip(name, faction, ship_symmetry, target_ship_value, target_ship_value * .1));
}

function saveFleet(path){
    var flt = {
        color0:"0x113077",
        color1:"0xaaaaaa",
        color2:"0",
      }

    var fleet_str = "{\n";
    fleet_str += "color0=" + flt["color0"] + ",\n";
    fleet_str += "color1=" + flt["color1"] + ",\n";
    fleet_str += "color2=" + flt["color2"] + ",\n";
    fleet_str += "name=\"" + this.name + "\",\n";
    fleet_str += "faction=" + this.faction + ",\n";
    fleet_str +=  "blueprints={\n";

    //Ship String
    this.ships.forEach((element,i) => {
        var str = "{data={";
        str += "name=\"" + element["name"] + "\",";
        str += "author=\"" +  element["name"] + "_" + i + "\",";
        str += "color0=" + flt["color0"] + ",";
        str += "color1=" + flt["color1"] + ",\n";
        str += "wgroup={0, 0, 2, 0}}, blocks={\n";
        element.blocks.forEach((block) => {
            //{803, {53.391, 10.005}, 2.82},
            str += "{" + block.block_data.ident + "," + "{" + block.x + "," + block.y + "}," + block.angle + "},\n";
        });
        str = str.substring(0, str.length - 2);
        str += "}},\n";
        fleet_str += str;
    });
    fleet_str = fleet_str.substring(0, fleet_str.length - 2);
    fleet_str += "}}";

    return new Promise((resolve,reject) => {
      fs.writeFile(path, fleet_str, 'utf-8', function(err) {
          if (err){
            throw err
          } 
          resolve();
      });
    });
}


module.exports = {
  Fleet: Fleet,
  drawFleet: drawFleet,
  addShip: addShip,
  getTotalValue: getTotalValue,
  buildFleet: buildFleet,
  groupBuildFleet: groupBuildFleet
};