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
                }
            } else {
                if(element.features.includes("THRUSTER")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].thruster.push(element.ident);
                    }
                }

                else if(element.features.includes("CANNON") || element.features.includes("TURRET") || element.features.includes("MELEE") || element.features.includes("LASER") || element.features.includes("LAUNCHER")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].weapon.push(element.ident);
                    }
                } 

                else if(element.features.includes("SHIELD")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].shield.push(element.ident);
                    }
                }

                else if(element.features.includes("GENERATOR")){
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].generator.push(element.ident);
                    }
                } 

                else {
                    if(checkFaction(element.group)){
                        faction_blocks[element.group].other.push(element.ident);
                    }
                } 


            }
        } else {
            if(checkFaction(element.group)){
                faction_blocks[element.group].hull.push(element.ident);
            }
        }
    });
}


loadData();

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
    if(b.ident === 827){
        console.log()
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
        ctx.stroke();
        ctx.strokeText(i,(b.ports[i].x + offset_x) * zoom,-(b.ports[i].y - offset_y -1) * zoom);
    }

    console.log(b);
}

drawBlock(block_data[827],25,50);
drawBlock(block_data[828],50,50);
//827
module.exports = {
    block_data: block_data,
    faction_blocks: faction_blocks
}
