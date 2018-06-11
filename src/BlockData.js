"use strict";

var fs = require("fs");

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

function getAngles(b) {
    var dx = [];
    var dy = [];
    var angle = [];
    var ports = [];
    var thruster = [];

    for(var i = 1; i < b.verts.length; i++){
        dx.push(b.verts[i-1][0] - b.verts[i][0]);
        dy.push(b.verts[i-1][1] - b.verts[i][1]);
    }
    dx.push(b.verts[b.verts.length-1][0] - b.verts[0][0]);
    dy.push(b.verts[b.verts.length-1][1] - b.verts[0][1]);

    for(var i = 0; i < b.ports.length; i++){
        ports.push([-((dx[b.ports[i][0]]) * (b.ports[i][1])) + b.verts[b.ports[i][0]][0],-((dy[b.ports[i][0]]) * (b.ports[i][1]) - b.verts[b.ports[i][0]][1])])
    }

    console.log(b.verts)
    console.log(ports)
    for(var i = 0; i < dx.length; i++){
        if(dy[i] === 0){
            if(dx[i] > 0){
                angle.push(270);
            } else {
                angle.push(90);
            }
        } else if(dx[i] === 0) {
            if(dy[i] > 0){
                angle.push(0);
            } else {
                angle.push(180);
            }
        } else {
            angle.push(Math.atan(dy[i]/dx[i]) * 180.0/Math.PI);
        }
    }
    return(angle);
}

var b = block_data[802];
console.log(getAngles(b))

module.exports = {
    block_data: block_data,
    faction_blocks: faction_blocks
}
