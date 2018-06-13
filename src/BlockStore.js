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
            var old_x = this.block_data.verts[i].x; // x
            var old_y = this.block_data.verts[i].y; // y

            //Rotation
            this.block_data.verts[i].x = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.block_data.verts[i].y = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Rounding down because of trig floating point errors
            if(ROUNDING_ERROR > this.block_data.verts[i].x && this.block_data.verts[i].x  > -ROUNDING_ERROR)
                this.block_data.verts[i].x = 0.0;
            if(ROUNDING_ERROR > this.block_data.verts[i].y && this.block_data.verts[i].y > -ROUNDING_ERROR)
                this.block_data.verts[i].y = 0.0;
        }

        //Rotate the attachments and "angles"
        for(var i = 0; i < this.block_data.ports.length; ++i)
        {
            var old_x = this.block_data.ports[i].x; // x
            var old_y = this.block_data.ports[i].y; // y

            //Rotation
            this.block_data.ports[i].x = old_x * Math.cos(angle) - old_y * Math.sin(angle);
            this.block_data.ports[i].y = old_y * Math.cos(angle) + old_x * Math.sin(angle);

            //Round because trig suckssssss
            if(ROUNDING_ERROR > this.block_data.ports[i].x && this.block_data.ports[i].x  > -ROUNDING_ERROR)
                this.block_data.ports[i].x = 0.0;
            if(ROUNDING_ERROR > this.block_data.ports[i].y && this.block_data.ports[i].y > -ROUNDING_ERROR)
                this.block_data.ports[i].y = 0.0;

            //Change angle
            this.block_data.ports[i].angle += angle_deg;

            //Normalize
            while(this.block_data.ports[i].angle < 0.0){ this.block_data.ports[i].angle += 360.0; }
            while(this.block_data.ports[i].angle >= 360.0){ this.block_data.ports[i].angle -= 360.0; }
        }
    }
}

function translate(x,y){
	this.x = x;
	this.y = y;

	for(var i = 0; i < this.block_data.verts.length; ++i){
		this.block_data.verts[i].x += x;
		this.block_data.verts[i].y += y;
	}

	for(var i = 0; i < this.block_data.ports.length; ++i){
		this.block_data.ports[i].x += x;
		this.block_data.ports[i].y += y;
	}
}

var rounding_factor = 10000;
function roundBlock(){
	this.x = Math.round(this.x * rounding_factor) / rounding_factor;
	this.y = Math.round(this.y * rounding_factor) / rounding_factor;
	this.angle = Math.round(this.angle * rounding_factor) / rounding_factor;

	for(var i = 0; i < this.block_data.verts.length; ++i){
		this.block_data.verts[i].x = Math.round(this.block_data.verts[i].x * rounding_factor) / rounding_factor;
		this.block_data.verts[i].y = Math.round(this.block_data.verts[i].y * rounding_factor) / rounding_factor;
	}
	for(var i = 0; i < this.block_data.ports.length; ++i){
		this.block_data.ports[i].x = Math.round(this.block_data.ports[i].x * rounding_factor) / rounding_factor;
		this.block_data.ports[i].y = Math.round(this.block_data.ports[i].y * rounding_factor) / rounding_factor;
	}
}

function removeAttachment(index){
	this.block_data.ports.splice(index,1);
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

function getBlock(id){
    if(BD.block_data[id] === undefined){
        return(false);
    } else {
        return(new Block(id));
    }
}

function drawBlock(b,x,y){
    var offset_x = x;
    var offset_y = y;
    var zoom = 10.0;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo((b.verts[b.verts.length-1].x + offset_x) * zoom,-(b.verts[b.verts.length-1].y - offset_y) * zoom);
    ctx.font = "12px Arial";
    for(var i = 0; i < b.verts.length; i++){
        ctx.lineTo((b.verts[i].x + offset_x) * zoom,-(b.verts[i].y - offset_y) * zoom);
        ctx.strokeText(i,(b.verts[i].x + offset_x) * zoom,-(b.verts[i].y - offset_y) * zoom);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.arc((offset_x) * zoom, -(-offset_y) * zoom, 10, 0, 2 * Math.PI, false);
    ctx.stroke();

    for(var i = 0; i < b.ports.length; i++){
        ctx.beginPath();
        ctx.arc((b.ports[i].x + offset_x) * zoom, -(b.ports[i].y - offset_y) * zoom, 10, 0, 2 * Math.PI, false);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((b.ports[i].x + offset_x) * zoom,-(b.ports[i].y - offset_y) * zoom);
        ctx.lineTo((b.ports[i].x + offset_x + 10 * Math.cos(b.ports[i].angle * Math.PI/180)) * zoom,-(b.ports[i].y - offset_y + 10 * Math.sin(b.ports[i].angle * Math.PI/180)) * zoom)
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
        ctx.strokeStyle = '#000000';
        ctx.strokeText(i,(b.ports[i].x + offset_x) * zoom,-(b.ports[i].y - offset_y -1) * zoom);
    }
}

module.exports = {
  Block: Block,
  getRandomBlockByType,
  getBlock: getBlock,
  drawBlock: drawBlock
};
