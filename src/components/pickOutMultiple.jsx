
import { findClosestKAT } from './shortestDist';
import {filterOutEmptyPoints} from './filterOutEmptyPoints'
function findObjectsWithMultipleCoordinates(results) {
	//who calls this function? FlightPlans.jsx
	console.log("Inside pickOutMultiple.jsx")
	console.log("Below is results:")
	console.log(results)
	results = filterOutEmptyPoints(results)
	console.log("2 Inside pickOutMultiple.jsx")
	console.log("2 Below is results:")
	console.log(results)
	// for SIA 
	//results  = [{HSN:[[29.93,122.36]]},{TOGUG:[[29.2, 122.53]]},{BEGMO:[[28,122.83]]},{LAPUG:[[1.69,103.41],[123,117.38]]},{BEBEM:[[22.95,116.36]]},{DOTMI:[[22.72,116.17]]},{MONTA:[21.56,116.20],[34.54,133.16],[10.92,122.52]},{ARROW:[-35,173.83],[19.84,114.37],[22.36,-155.21]},{EPDOS:[[19,113.56]]}]
	const resultObjects = [];
	let prevHasMultipleCoordinates = false;
      
	for (let i = 0; i < results.length; i++) {
	  const currentObject = results[i]; //get the obj could be { KAT: [[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]] }
	  const currentCoordinates = Object.values(currentObject)[0]; //extract the value from an object, in this case it is 
	  //[[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]]
	//added on 4/11/23
		if (i===0){
			// this is to check if first obj has multiple
			if (currentCoordinates.length>1){
				//resultObjects is an array of object
				resultObjects.push(currentObject)
				resultObjects.push(results[i+1])
				prevHasMultipleCoordinates = true //inform that current Object has multiple coordinates

			}
			continue
		}
		else{// for all objects that are not first objects
		
			if (currentCoordinates.length>1){
				if (!prevHasMultipleCoordinates){
					resultObjects.push(currentObject)
					resultObjects.push(results[i-1])
				prevHasMultipleCoordinates = true;// say that this object has multiple coordinates

				}
				
				else{
					// if prevHasMultipleCoordinates, then look at the one infront 
					resultObjects.push(currentObject)
					resultObjects.push(results[i+1])
					prevHasMultipleCoordinates = true; // say this object dont have multiple
				}
			}
			else{
				prevHasMultipleCoordinates = false;
			}

		}
	} // end of for loop
	console.log("inside pickOutMultiple.jsx line 54,resultObjects below: ")
	console.log(resultObjects)
	//end of adding on 4/11/23
//resultObjects for SIA833 = [{LAPUG:[[1.69, 103.41],[23, 117.38]]},
//{BEGMO:[[28, 121.83]]}, {MONTA:[[21.56, 116.2],[34.54, 133.16],[10.92, 122.52]}
//{DOTMI:[[22.72, 116.17]] } , {ARROW:[[-35, 173.83],[19.84, 114.37],[22.36, -155.21]]},{EPDOS:[19, 113.56]]}]
	
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
	console.log('multipleCoordinates (line82): ',multipleCoordinates)
	// console.log('singleCoordinates: ',singleCoordinates)
	const key = Object.keys(singleCoordinates)[0]
	console.log("singleCoordinates[key] (line85): ",singleCoordinates[key][0] )
	let tempObj=findClosestKAT(multipleCoordinates, singleCoordinates[key][0]) // returns an object like { OKABU: [ 3.27, 94.85 ] }
	// multipleCoordinates = {UK: [[72.79, -56.13],[39.28, -123.24]...]}
	// singleCoordinates[key][0] = [54.5,31.08]
	
	finalArray.push(tempObj)
}

      return finalArray;
	// resultObjects return an array of objects. these objecets are those with multiple coordinates or one before/after an object with multiple coodinates
	// e.g. finalArray = [{REVOP: [-30.55, 116.63]}]
      }

export {findObjectsWithMultipleCoordinates};

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
      