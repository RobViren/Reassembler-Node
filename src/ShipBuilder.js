var Util = require('./Util');
var BS = require('./BlockStore');

//Ship Related Functions
function Ship(name, faction){
	this.name = name;
	this.faction = faction;
	this.blocks = [];
	//Set the command block as the first block
	this.blocks[0] = BS.getRandomBlockByType(faction,"command");

	//Functions
	this.getShipValue = getShipValue;
	this.addBlock = addBlock;
	this.addBlockSymm = addBlockSymm;
	this.drawShip = drawShip;
	this.addBlockType = addBlockType;
	this.getHullCount = getHullCount;
	this.getThrustPoints = getThrustPoints;
	this.getModulePoints = getModulePoints;

}

function addBlock(block_number, attachment_block_index){

	var new_block = new BS.Block(block_number);
	//Cannont attach a block to a thruster
	if(new_block.block_data.type !== "thruster" && this.blocks[attachment_block_index].block_data.type === "thruster"){
		return(false);
	}

	var ship_block_indexs = [];

	//Non-repeating Random attachment point index checking
	while(ship_block_indexs.length < this.blocks[attachment_block_index].block_data.ports.length){

		var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].block_data.ports.length);
		while(Util.doesRepeat(ship_attachment_index,ship_block_indexs)){
			var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].block_data.ports.length);
		}
		ship_block_indexs.push(ship_attachment_index);

		var new_block_indexs = [];

		//More Thruster Nonsense
		if(new_block.block_data.type === "thruster"){
			var res;
			if(new_block.block_data.ports[0][2] === "THRUSTER_OUT"){
				res = true;
			} else {
				fitBlock(0, ship_attachment_index, new_block, this.blocks[attachment_block_index]);
				res = checkBlocks(new_block,this.blocks);
			}
			
			if(res == false){
				this.blocks.push(new_block);
				return(true);
			}

			new_block = new BS.Block(block_number);
		}
		else{
			while(new_block_indexs.length < new_block.block_data.ports.length){

				var new_index = Util.getRandomInt(0, new_block.block_data.ports.length);
				while(Util.doesRepeat(new_index,new_block_indexs)){
					var new_index = Util.getRandomInt(0, new_block.block_data.ports.length);
				}
				new_block_indexs.push(new_index);

				if(new_block.block_data.ports[new_index].type === undefined && this.blocks[attachment_block_index].block_data.ports[ship_attachment_index].type ===undefined){
					fitBlock(new_index, ship_attachment_index, new_block, this.blocks[attachment_block_index]);
					
					var res = checkBlocks(new_block,this.blocks);

					if(res == false){
						new_block.removeAttachment(new_index);
						this.blocks[attachment_block_index].removeAttachment(ship_attachment_index);
						this.blocks.push(new_block);
						return(true);
					}
				}
				new_block = new BS.Block(block_number);
			}
		}
	}
	return(false);
}

function addBlockSymm(block_number, attachment_block_index){
	var new_block = new BS.Block(block_number);
	//Cannont attach a block to a thruster
	if(new_block.block_data.type !== "thruster" && this.blocks[attachment_block_index].block_data.type === "thruster"){
		return(false);
	}
	var ship_block_indexs = [];

	//Non-repeating Random attachment point index checking
	while(ship_block_indexs.length < this.blocks[attachment_block_index].block_data.ports.length){

		var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].block_data.ports.length);
		while(Util.doesRepeat(ship_attachment_index,ship_block_indexs)){
			var ship_attachment_index = Util.getRandomInt(0, this.blocks[attachment_block_index].block_data.ports.length);
		}
		ship_block_indexs.push(ship_attachment_index);

		var new_block_indexs = [];

		//More Thruster Nonsense
		if(new_block.block_data.type === "thruster"){
			fitBlock(0, ship_attachment_index, new_block, this.blocks[attachment_block_index]);
			var res = checkBlocksSymm(new_block,this.blocks);

			if(res === false){
				this.blocks.push(new_block);

				//Add mirror block
				var mirror_block;
				if(new_block.block_data.mirror !== undefined){
					mirror_block = new BS.Block(new_block.block_data.mirror);
				} else {
					mirror_block = new BS.Block(block_number);
				}

				if(new_block.block_data.mirror === undefined){
					var mirror_angle = new_block.angle;
					mirror_angle *= 180.0/ Math.PI;
					while(mirror_angle < 0.0){mirror_angle+= 360.0;}
					while(mirror_angle >= 360.0){ mirror_angle -= 360.0;}
					mirror_angle *= -1;
					mirror_block.rotate(mirror_angle);
				}
				else{
					mirror_block.rotate(new_block.angle*-180.0/Math.PI);
				}

				mirror_block.translate(new_block.x, -new_block.y);
				mirror_block.roundBlock();
				if(!checkBlocks(mirror_block,this.blocks)){
					//remove all attachments for mirror block
					for(var i = 0; i < mirror_block.block_data.ports.length; ++i){
						mirror_block.removeAttachment(i);
					}
					this.blocks.push(mirror_block);
				}

				return(true);
			}

			new_block = new BS.Block(block_number);
		}
		else{
			while(new_block_indexs.length < new_block.block_data.ports.length){

				var new_index = Util.getRandomInt(0, new_block.block_data.ports.length);
				while(Util.doesRepeat(new_index,new_block_indexs)){
					var new_index = Util.getRandomInt(0, new_block.block_data.ports.length);
				}
				new_block_indexs.push(new_index);

				if(new_block.block_data.ports[new_index].type === undefined && this.blocks[attachment_block_index].block_data.ports[ship_attachment_index].type ===undefined){
					fitBlock(new_index, ship_attachment_index, new_block, this.blocks[attachment_block_index]);

					var res = checkBlocksSymm(new_block,this.blocks);

					if(res == false){
						new_block.removeAttachment(new_index);
						this.blocks[attachment_block_index].removeAttachment(ship_attachment_index);
						this.blocks.push(new_block);

						//Add mirror block
						var mirror_block;
						if(new_block.block_data.mirror !== undefined){
							mirror_block = new BS.Block(new_block.block_data.mirror);
						} else {
							mirror_block = new BS.Block(block_number);
						}

						if(new_block.block_data.mirror === undefined){
							var mirror_angle = new_block.angle;
							mirror_angle *= 180.0/ Math.PI;
							while(mirror_angle < 0.0){mirror_angle+= 360.0;}
							while(mirror_angle >= 360.0){ mirror_angle -= 360.0;}
							mirror_angle *= -1;
							mirror_block.rotate(mirror_angle);
						}
						else{
							mirror_block.rotate(new_block.angle*-180.0/Math.PI);
						}

						mirror_block.translate(new_block.x, -new_block.y);
						mirror_block.roundBlock();
						if(!checkBlocks(mirror_block,this.blocks)){
							//remove all attachments for mirror block
							while(mirror_block.block_data.ports.length > 0){
								mirror_block.removeAttachment(0);
							}
							this.blocks.push(mirror_block);
						}

						return(true);
					}
				}
				new_block = new BS.Block(block_number);
			}
		}
	}
	return(false);
}

function addBlockType(type,symm){

	var block_number = BS.faction_blocks[this.faction][type][Util.getRandomInt(0,BS.faction_blocks[this.faction][type].length)]

	var attempted_blocks = [];
	while(attempted_blocks.length < this.blocks.length){
		var random_index = Util.getRandomInt(0,this.blocks.length);
		while(Util.doesRepeat(random_index,attempted_blocks)){
			random_index = Util.getRandomInt(0, this.blocks.length);
		}
		if(symm === 0){
			if(this.addBlock(block_number,random_index)){
				return(true);
			}
		}
		else {
			if(this.addBlockSymm(block_number,random_index)){
				return(true);
			}
		}
		attempted_blocks.push(random_index);
	}
}

function getShipValue(){
	var total_value = 0;
	for(var i =0; i < this.blocks.length; i++){
		if(this.blocks[i].block_data.points !== undefined){
			total_value += this.blocks[i].block_data.points;
		}
	}
	return(total_value);
}

function getHullCount(){
	var count = 0;
	for(var i =0; i < this.blocks.length; ++i){
		if(this.blocks[i].block_data.type === "hull"){
			count ++;
		}
	}
	return(count);
}

function getThrustPoints(){
	var points = 0;
	for(var i = 0; i < this.blocks.length; ++i){
		if(this.blocks[i].type === "thruster"){
			points += parseInt(this.blocks[i].block_data.points);
		}
	}
	return(points);
}

function getModulePoints(){
	var points = 0;
	for(var i =0; i < this.blocks.length; ++i){
		if(this.blocks[i].type == "other" || this.blocks[i].type == "shield" || this.blocks[i].type == "generator"){
			points += parseInt(this.blocks[i].block_data.points);
		}
	}
	return(points);
}

function drawShip(ctx,x,y,zoom){

	ctx.font = "12px Arial";
	ctx.fillText(this.blocks.length.toString(),this.blocks[this.blocks.length-1].x * zoom + x,this.blocks[this.blocks.length-1].y * zoom + y);

	ctx.beginPath();
	for(var i = 0; i < this.blocks.length; i++){

		for(var j = 0; j < this.blocks[i].block_data.verts.length; ++j){

			var length = this.blocks[i].block_data.verts.length;
			if(j == 0){
				ctx.moveTo(this.blocks[i].block_data.verts[j].x * zoom + x,this.blocks[i].block_data.verts[j].y * zoom + y);
				ctx.lineTo(this.blocks[i].block_data.verts[length-1].x * zoom + x,this.blocks[i].block_data.verts[length -1].y * zoom + y);
				ctx.moveTo(this.blocks[i].block_data.verts[j].x * zoom + x,this.blocks[i].block_data.verts[j].y * zoom + y);
			}
			else if(j < length){
				ctx.lineTo(this.blocks[i].block_data.verts[j].x * zoom + x,this.blocks[i].block_data.verts[j].y * zoom + y);
			}
		}
	}
ctx.stroke();
}

//Block fitting functions
function fitBlock(index1,index2, b1, b2){

	//Rotate Block
	var a1 = b1.block_data.ports[index1].angle;
	var a2 = b2.block_data.ports[index2].angle;

    var target_angle = a2 + 180.0;
    //Normalize angle
    while(target_angle < 0.0) target_angle+= 360.0;
    while(target_angle > 360.0) target_angle -= 360.0;

    b1.rotate(target_angle - a1);

	//Translate Block
	var xdiff = b2.block_data.ports[index2].x - b1.block_data.ports[index1].x;
	var ydiff = b2.block_data.ports[index2].y - b1.block_data.ports[index1].y;

	b1.translate(xdiff,ydiff);
	b1.roundBlock();
}

function pointInPolygon(x, y, verts) {

    var i, j=verts.length-1 ;
    var  oddNodes=false;

    for (i=0; i<verts.length; i++) {
        if ((verts[i].y< y && verts[j].y>=y ||  verts[j].y< y && verts[i].y>=y) &&  (verts[i].x<=x || verts[j].x<=x)) {
          oddNodes^=(verts[i].x+(y-verts[i].y)/(verts[j].y-verts[i].y)*(verts[j].x-verts[i].x)<x);
        }
        j=i;
    }

    if(oddNodes == 1)
    	oddNodes = true;
    else
    	oddNodes = false;

	return oddNodes;
}

function checkBlocksSymm(b1,blocks){

	if(b1.y < 0.0){
		return(true);
	}
	var vert_above = false;
	var vert_below = false;
	for(var i = 0; i < b1.block_data.verts.length; i++){
		if(b1.block_data.verts[i].y <= 0){
			vert_above = true;
		}
		if (b1.block_data.verts[i].y > 5){
			vert_below = true;
		}
		if(b1.block_data.verts[i].y < -5){
			return(true);
		}
		if(vert_above && vert_below){
			return(true);
		}
	}
	
	for(var i = 0; i < blocks.length; i++){
		if(collisionCheck(b1,blocks[i]) || collisionCheck(blocks[i],b1)){
			return(true);
		}
	}
	return(false);
}

function checkBlocks(b1,blocks){

	for(var i = 0; i < blocks.length; i++){
		if(collisionCheck(b1,blocks[i]) || collisionCheck(blocks[i],b1)){
			return(true);
		}
	}
	return(false);
}

function collisionCheck(b1,b2){

	if(Util.distance(b1.x,b1.y,b2.x,b2.y) < 200){
		if(pointInPolygon(b1.x,b1.y,b2.block_data.verts)){
			return(true);
		}
		for(var j = 0; j < b1.block_data.verts.length; ++j){

			var x = (b1.block_data.verts[j].x - b1.x) * .999 + b1.x;
			var y = (b1.block_data.verts[j].y - b1.y) * .999 + b1.y;

			var res = pointInPolygon(x,y,b2.block_data.verts);
			if(res == true){
				return(true);
			}

			x = (b1.block_data.verts[j].x - b1.x) * .5 + b1.x;
			y = (b1.block_data.verts[j].y - b1.y) * .5 + b1.y;

			res = pointInPolygon(x,y,b2.block_data.verts);
			if(res == true){
				return(true);
			}
		}
	}
	return(false);
}

//Ship Building Code Wah Wah wahhhhh
function buildShip(name, faction, ship_symmetry, target_ship_value, weights){
	if(weights === undefined){
		weights = makeWeights(faction,100);
	}
	//Prevent infinite runtime
	var MAX_ATTEMPTS = 200;
	//Check symm
	if(ship_symmetry == 2){
		ship_symmetry = Util.getRandomInt(0,2);
	}

	//New ship declaration
	var new_ship = new Ship(name, faction);
	var loop_counter = 0;
	var ship_value_reached = false;
	while(!ship_value_reached){
		if(loop_counter > MAX_ATTEMPTS){
			console.log("MAX_ATTEMPTS reached");
			return(new_ship);
		}

		loop_counter++;
		var next = weights[Util.getRandomInt(0,weights.length)];
		if(Number.isInteger(next)){
			if(ship_symmetry === 0){
				new_ship.addBlock(next,Util.getRandomInt(0,new_ship.blocks.length));
			} else {
				new_ship.addBlockSymm(next,Util.getRandomInt(0,new_ship.blocks.length));
			}
		} else {
			new_ship.addBlockType(next,ship_symmetry);
		}
		//TODO
		if(new_ship.getShipValue() > target_ship_value){
			if(ship_symmetry === 0){
				new_ship.blocks.pop();
				new_ship.addBlockType("thruster",ship_symmetry);
			} else{
				new_ship.blocks.pop();
				new_ship.blocks.pop();
				new_ship.addBlockType("thruster",ship_symmetry);
			}
			if(new_ship.getShipValue() > target_ship_value * .8){
				ship_value_reached = true;
			}
		}
	}
	return(new_ship);
}

function makeWeights(faction,length){
	var weights = [];
	var types = ["thruster","weapon","hull","shield","generator","other"];
	for(var i = 0; i < length; i++){
		var next = types[Util.getRandomInt(0,5)];
		if(BS.faction_blocks[faction][next].length > 0){
			weights.push(BS.faction_blocks[faction][next][Util.getRandomInt(0,BS.faction_blocks[faction][next].length)]);
		} else {
			i--;
		}
	}

	return(weights);
}

module.exports = {
	buildShip: buildShip,
	Ship: Ship
};

//TODO Fix mirror triangle issue where a symmetrical center triangle causes floating blocks