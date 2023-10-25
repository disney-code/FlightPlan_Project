const { findClosestKAT } = require('./shortestDist');

function findObjectsWithMultipleCoordinates(results) {
	const resultObjects = [];
	let prevHasMultipleCoordinates = false;
      
	for (let i = 0; i < results.length; i++) {
	  const currentObject = results[i]; //get the obj could be { KAT: [[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]] }
	  const currentCoordinates = Object.values(currentObject)[0]; //extract the value from an object, in this case it is [[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]]
	//console.log("current COordinates: ")	
	  //console.log(currentCoordinates)
	  if (currentCoordinates.length > 1) {
	    // If the current object has more than one coordinate, include it
	      if (i === results.length - 1 && i > 0){
		resultObjects.push(results[i-1]);
		resultObjects.push(currentObject);
		}
	else{resultObjects.push(currentObject);
		prevHasMultipleCoordinates = true;}
	 
	    
	  } else if (prevHasMultipleCoordinates) {
	    // If the previous object had multiple coordinates, include the current object
	    resultObjects.push(currentObject);
	    prevHasMultipleCoordinates = false;
	  } 
	}
      // resultObjects = [{REVOP:[[7.48, 28.31],[-30.55, 116.63]]},{JULIM: [[-31.42, 116.29]]}]
	// Once you get resultObjects 	
	let finalArray=[];
	let multipleCoordinates, singleCoordinates;
	for (let i = 0; i < resultObjects.length; i += 2) {
	const item1 = resultObjects[i];
	const item2 = resultObjects[i + 1];
      	const array1 = Object.values(item1)[0];
	const array2 = Object.values(item2)[0];
      
	if (array1.length > array2.length) {
	  multipleCoordinates = item1;
	  singleCoordinates = item2;
	} else {
	  multipleCoordinates = item2;
	  singleCoordinates = item1;
	}

	// console.log('Iteration:', i / 2);
	// console.log('multipleCoordinates: ',multipleCoordinates)
	// console.log('singleCoordinates: ',singleCoordinates)
	const key = Object.keys(singleCoordinates)[0]
	//console.log("singleCoordinates[key]: ",singleCoordinates[key][0] )
	let tempObj=findClosestKAT(multipleCoordinates, singleCoordinates[key][0]) // returns an object like { OKABU: [ 3.27, 94.85 ] }
	finalArray.push(tempObj)
}

      return finalArray;
	// resultObjects return an array of objects. these objecets are those with multiple coordinates or one before/after an object with multiple coodinates
      }

module.exports = {findObjectsWithMultipleCoordinates};

// results1 shld be data from the FlightPlans.jsx result variable 
// const results1 = [
// 	{ KAT: [[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]] },
// 	{ SULEN: [[4.41, 90.4]] },
// 	{ MABIX: [[3.27, 94.85]] },
// 	{SALAx:[[3.27, 94.85]]},
// 	{ OKABU: [[3.27, 94.85], [3.27, 94.85]] },
// 	{ARAMA:[[-33.71, 150.3]]}

//       ];
// const resultObjects = findObjectsWithMultipleCoordinates(results1);
// console.log("look below for resultObjects")
// console.log(resultObjects);



// let multipleCoordinates, singleCoordinates;
// let finalArray=[];
// for (let i = 0; i < resultObjects.length; i += 2) {
// 	const item1 = resultObjects[i];
// 	const item2 = resultObjects[i + 1];
//       	const array1 = Object.values(item1)[0];
// 	const array2 = Object.values(item2)[0];
      
// 	if (array1.length > array2.length) {
// 	  multipleCoordinates = item1;
// 	  singleCoordinates = item2;
// 	} else {
// 	  multipleCoordinates = item2;
// 	  singleCoordinates = item1;
// 	}

// 	console.log('Iteration:', i / 2);
// 	console.log('multipleCoordinates: ',multipleCoordinates)
// 	console.log('singleCoordinates: ',singleCoordinates)
// 	const key = Object.keys(singleCoordinates)[0]
// 	console.log("singleCoordinates[key]: ",singleCoordinates[key][0] )
// 	let tempObj=findClosestKAT(multipleCoordinates, singleCoordinates[key][0]) // returns an object like { OKABU: [ 3.27, 94.85 ] }
// 	finalArray.push(tempObj)
// }

// console.log("finaL ArRay: ",finalArray)

// if no duplicated coordinates, finalArray is []




// const results=[
// 	{ KAT: [ [13.03, 7.69], [-33.71, 150.3], [7.16, 79.87] ] },
// 	{ SULEN: [[4.41, 90.4]] },
// 	{ OKABU: [[3.27, 94.85], [3.27, 94.85]] },
// 	{ ARAMA:[[-33.71, 150.3]] }
//       ]



//Please dont delete whatever that is below. it is the data strcutur that the function findClosestKAT accepts
// const multipleCoordinates = {
// 		KAT: [
// 			[7.48, 28.31],
// 			[-30.55, 116.63]
// 		],
// 	      };
// const single_coordiante_point =  [-31.42, 116.29]


//findClosestKAT(multipleCoordinates, singleCoordinates)
      