"use strict";

var fs = require("fs");
var util = require("./Util");

var block_data = {};
var faction_blocks = {
    2: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    3: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    4: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    6: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    7: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    }, 
    8: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    11: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    12: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    14: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    },
    15: {
        thruster: [],
        weapon: [],
        command: [],
        hull: [],
        shield: [],
        generator: [],
        other: []
    }
}

function checkFaction(faction){
    switch(faction){
        case 2:
        case 3:
        case 4:
        case 6:
        case 7:
        case 8:
        case 11:
        case 12:
        case 14:
        case 15:
            return(true);
        default:
            return(false);
    }
}

function loadData(){
    var raw_block_data = fs.readFileSync("./src/json/blocks.json");
    var raw_shape_data = fs.readFileSync("./src/json/shapes.json");

    var json_block_data = JSON.parse(raw_block_data);
    var json_shape_data = JSON.parse(raw_shape_data);

    var shape_data = {};

    json_shape_data.forEach(element => {
        shape_data[element[0]] = element;
    });

    //Make block data
    json_block_data.forEach(element => {
        var shape = {};
        if(element.shape !== undefined){
            shape = shape_data[element.shape];
        } else {
            shape = shape_data["SQUARE"];
        }

        block_data[element.ident] = element;

        if(shape !== undefined){
            if(shape[1][element.scale-1] !== undefined){
                block_data[element.ident].verts = shape[1][element.scale-1].verts;
                block_data[element.ident].ports = shape[1][element.scale-1].ports;
            } else {
                if(element.scale === undefined){
                    block_data[element.ident].verts = shape[1][0].verts;
                    block_data[element.ident].ports = shape[1][0].ports;
                } else {
                    //console.log("BadScale ",element);
                }
            }
        } else {
            console.log("No Shape ",element);
            block_data[element.ident] = undefined;
        }
    });

    //Reshape
    json_block_data.forEach(element => {
        block_data[element.ident].ports = getPorts(block_data[element.ident]);
        block_data[element.ident].verts = getVerts(block_data[element.ident]);
    });

    //make faction-blocks
    json_block_data.forEach(element => {

        if(element.features !== undefined){
            if(element.features.includes("COMMAND")){
                if(checkFaction(element.group)){
                    faction_blocks[element.group].command.push(element.ident);
                    block_data[element.ident].type = "command";
                }
            } else {
                if(element.features.includes("THRUSTER")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].thruster.push(element.ident);
                        block_data[element.ident].type = "thruster";
                    }
                }

                else if(element.features.includes("CANNON") || element.features.includes("TURRET") || element.features.includes("MELEE") || element.features.includes("LASER") || element.features.includes("LAUNCHER")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].weapon.push(element.ident);
                        block_data[element.ident].type = "weapon";
                    }
                } 

                else if(element.features.includes("SHIELD")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].shield.push(element.ident);
                        block_data[element.ident].type = "shield";
                    }
                }

                else if(element.features.includes("GENERATOR")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].generator.push(element.ident);
                        block_data[element.ident].type = "generator";
                    }
                } 

                else {
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].other.push(element.ident);
                        block_data[element.ident].type = "other";
                    }
                } 
            }
        } else {
            if(checkFaction(element.group)){
                faction_blocks[element.group].hull.push(element.ident);
                block_data[element.ident].type = "hull";
            }
        }
    });
}

function getPorts(b) {
    var dx = [];
    var dy = [];
    var ports = [];
    for(var i = 1; i < b.verts.length; i++){
        dx.push(b.verts[i-1][0] - b.verts[i][0]);
        dy.push(b.verts[i-1][1] - b.verts[i][1]);
    }
    dx.push(b.verts[b.verts.length-1][0] - b.verts[0][0]);
    dy.push(b.verts[b.verts.length-1][1] - b.verts[0][1]);

    //Got normals and ports
    for(var i = 0; i < b.ports.length; i++){
        var port = {};

        port.x = util.round(-((dx[b.ports[i][0]]) * (b.ports[i][1])) + b.verts[b.ports[i][0]][0]);
        port.y = util.round(-((dy[b.ports[i][0]]) * (b.ports[i][1])) + b.verts[b.ports[i][0]][1]);
        
        if(b.ports[i].length > 2 ){
           port.type = (b.ports[i][2]);
        }

        if(dy[b.ports[i][0]] === 0){
            if(dx[b.ports[i][0]] > 0){
                port.angle = (270);
            } else {
                port.angle = (90);
            }
        } else if(dx[b.ports[i][0]] === 0) {
            if(dy[b.ports[i][0]] > 0){
                port.angle = (0);
            } else {
                port.angle = (180);
            }
        } else {
            if(b.verts[b.ports[i][0]][1] > 0){
                port.angle = util.round(Math.atan(dy[b.ports[i][0]]/dx[b.ports[i][0]]) * 180/Math.PI + 90);
            } else {
                port.angle = util.round(Math.atan(dy[b.ports[i][0]]/dx[b.ports[i][0]]) * 180/Math.PI + 270);
            }
        }
        ports.push(port);
    }

    //Check angles
    for(var i = 0; i < ports.length; i++){
        var x = ports[i].x + Math.cos(ports[i].angle / 180 * Math.PI) * 5;
        var y = ports[i].y + Math.sin(ports[i].angle / 180 * Math.PI) * 5;

        var d1 = util.distance(0,0,ports[i].x,ports[i].y);
        var d2 = util.distance(0,0,x,y);

        if(d2 < d1){
            ports[i].angle += 180;
            while(ports[i].angle < 0.0) ports[i].angle+= 360.0;
            while(ports[i].angle >= 360.0) ports[i].angle -= 360.0;
            ports[i].angle = util.round(ports[i].angle);
        }
    }
    
    return(ports);
}

function getVerts(b) {
    var verts = [];
    for(var i = 0; i < b.verts.length; i++){
        var vert = {};
        vert.x = b.verts[i][0];
        vert.y = b.verts[i][1];
        verts.push(vert);
    }

    return(verts)
}

var mirror_shapes = [];
function getMirrorShapes(){
    for(var key in block_data){
        if(block_data[key].shape !== undefined && block_data[key].shape.slice(-1) === "L"){
            mirror_shapes.push(block_data[key].shape.slice(0,block_data[key].shape.length-1));
        }
    }
}

function findMirror(b) {
    var shape_to_find = b.shape.slice(0,b.shape.length-1);
    if(b.shape.slice(-1) === "L"){
        shape_to_find += "R";
    } else {
        shape_to_find += "L";
    }

    for(var key in block_data){
        if(block_data[key].shape !== undefined && block_data[key].shape === shape_to_find){
            if(block_data[key].scale === b.scale && b.group === block_data[key].group && b.name === block_data[key].name && b.blurb === block_data[key].blurb && b.fillColor === block_data[key].fillColor && b.density === block_data[key].density){
                return(block_data[key].ident)
            }
        }
    }
}

function getMirrors() {
    for(var key in block_data){
        if(block_data[key].shape !== undefined && mirror_shapes.includes(block_data[key].shape.slice(0,block_data[key].shape.length-1))){
            block_data[key].mirror = findMirror(block_data[key]);
            //console.log(block_data[key].ident,block_data[key].ident === findMirror(block_data[block_data[key].mirror]))
        }
    }
}

loadData();
getMirrorShapes();
getMirrors();

fs.writeFile('./src/json/block_data.json', JSON.stringify(block_data), 'utf-8', function(err) {
	if (err) throw err
	console.log('File Saved')
});
fs.writeFile('./src/json/faction_blocks.json', JSON.stringify(faction_blocks), 'utf-8', function(err) {
	if (err) throw err
	console.log('File Saved')
});

module.exports = {
    block_data: block_data,
    faction_blocks: faction_blocks
}
