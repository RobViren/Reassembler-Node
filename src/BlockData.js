var fs = require("fs");

function loadData(){
    var raw_block_data = fs.readFileSync("./json/blocks.json");
    var raw_shape_data = fs.readFileSync("./json/shapes.json");

    var json_block_data = JSON.parse(raw_block_data);
    var json_shape_data = JSON.parse(raw_shape_data);
}

loadData();

