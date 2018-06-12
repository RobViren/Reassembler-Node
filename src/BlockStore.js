var BD = require('./BlockData');
var Util = require('./Util');

//Block related functions
function Block(block_number){
	this.x = 0.0;
	this.y = 0.0;
	this.angle = 0.0;
	this.block_data = Util.copyObject(BD.block_data[block_number]);

	//Functions
	this.rotate = rotate;
	this.translate = translate;
	this.roundBlock = roundBlock;
	this.removeAttachment = removeAttachment;
}

function rotate(angle){
	var ROUNDING_ERROR = .001;
	//check for zero. No reason to rotate zero
    if(angle != 0.0)
    {
        //Normalize angle
        while(angle < 0.0) angle+= 360.0;
        while(angle >= 360.0) angle -= 360.0;

        //Hold degree angle for "angle" change
        var angle_deg = angle;

        //convert to radian
        angle *= Math.PI /180.0;

        //Change private rotation
        //The .0001 is because floating point angle is showing up as higher than M_PI even though it is not
        if(angle-.0001 > Math.PI)
            this.angle = (angle - 2 * Math.PI);
        else
            this.angle = angle;

        //Rotate bounds
        for(var i = 0; i < this.block_data.verts.length; ++i)
        {
            var old_x = this.block_data.verts[i][0]; // x
            var old_y = this.block_data.verts[i][1]; // y

            //Rotation
            this.block_data.verts[i][0] = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.block_data.verts[i][1] = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Rounding down because of trig floating point errors
            if(ROUNDING_ERROR > this.block_data.verts[i][0] && this.block_data.verts[i][0]  > -ROUNDING_ERROR)
                this.block_data.verts[i][0] = 0.0;
            if(ROUNDING_ERROR > this.block_data.verts[i][1] && this.block_data.verts[i][1] > -ROUNDING_ERROR)
                this.block_data.verts[i][1] = 0.0;
        }

        //Rotate the attachments and "angles"
        for(var i = 0; i < this.block_data.ports.length; ++i)
        {
            var old_x = this.block_data.ports[i][0]; // x
            var old_y = this.block_data.ports[i][1]; // y

            //Rotation
            this.block_data.ports[i][0] = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.block_data.ports[i][1] = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Round because trig suckssssss
            if(ROUNDING_ERROR > this.block_data.ports[i][0] && this.block_data.ports[i][0]  > -ROUNDING_ERROR)
                this.block_data.ports[i][0] = 0.0;
            if(ROUNDING_ERROR > this.block_data.ports[i][1] && this.block_data.ports[i][1] > -ROUNDING_ERROR)
                this.block_data.ports[i][1] = 0.0;

            //Change angle
            this.angle[i] += angle_deg;

            //Normalize
            while(this.angle[i] < 0.0){ this.angle[i] += 360.0; }
            while(this.angle[i] >= 360.0){ this.angle[i] -= 360.0; }
        }
    }
}

function translate(x,y){
	this.x = x;
	this.y = y;

	for(var i = 0; i < this.block_data.verts.length; ++i){
		this.block_data.verts[i][0] += x;
		this.block_data.verts[i][1] += y;
	}

	for(var i = 0; i < this.block_data.ports.length; ++i){
		this.block_data.ports[i][0] += x;
		this.block_data.ports[i][1] += y;
	}
}
var rounding_factor = 10000;
function roundBlock(){
	this.x = Math.round(this.x * rounding_factor) / rounding_factor;
	this.y = Math.round(this.y * rounding_factor) / rounding_factor;
	this.angle = Math.round(this.angle * rounding_factor) / rounding_factor;

	for(var i = 0; i < this.block_data.verts.length; ++i){
		this.block_data.vert[i][0] = Math.round(this.block_data.verts[i][0] * rounding_factor) / rounding_factor;
		this.block_data.vert[i][1] = Math.round(this.block_data.verts[i][1] * rounding_factor) / rounding_factor;
	}
	for(var i = 0; i < this.block_data.ports.length; ++i){
		this.block_data.ports[i][0] = Math.round(this.block_data.ports[i][0] * rounding_factor) / rounding_factor;
		this.block_data.ports[i][1] = Math.round(this.block_data.ports[i][1] * rounding_factor) / rounding_factor;
	}
}

function removeAttachment(index){
	this.block_data.ports.splice(index,1);
	//this.shape.angle.splice(index,1);
}

function getRandomBlockByType(faction,type){
    if(BD.faction_blocks[faction] === undefined){
        console.log("Not a Faction");
        return(false);
    }
    if(BD.faction_blocks[faction][type] === undefined){
        console.log("Faction does not have type");
        return(false);
    }
    if(BD.faction_blocks[faction][type].length === 0){
        //faction has no blocks of that type, try again
        return(false);
    } else {
        return(new Block(BD.faction_blocks[faction][type][Util.getRandomInt(0,BD.faction_blocks[faction][type].length-1)]));
    }
}

module.exports = {
  Block: Block,
  getRandomBlockByType
};
