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
            //console.log("No Shape ",element);
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

    console.log(faction_blocks);

}

loadData();


module.exports ={
    block_data: block_data,
    faction_blocks: faction_blocks
}