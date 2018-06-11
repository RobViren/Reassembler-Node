//Utility functions

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function doesRepeat(value,arr){
	if(arr.length == 0){
		return false;
	}
	for(var i =0; i < arr.length; ++i){
		if(arr[i] == value){
			return true;
		}
	}

	return false;
}

function distance(x1,y1,x2,y2){
	return(Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2)));
}

//I fucnking hate default pass by refernce objects you fucks
function copyObject(original){
	var copy = JSON.parse(JSON.stringify(original));
	return(copy);
}


module.exports = {
  getRandomInt: getRandomInt,
  doesRepeat: doesRepeat,
  distance, distance,
  copyObject: copyObject
};
