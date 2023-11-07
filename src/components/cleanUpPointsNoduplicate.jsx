function replaceObjects(resultObjects, finalArray) {
	// Create a new array to store the updated objects
	const updatedResultObjects = [];
	
	// Create a map of keys in the finalArray for quick lookup
	const finalArrayKeys = finalArray.map((item) => Object.keys(item)[0]);
	//finalArrayKeys=['KAT', 'OKABU']
	// Iterate over resultObjects
	for (const resultObject of resultObjects) {
	  // Extract the key of the current object
	  const key = Object.keys(resultObject)[0];
	  //key = 'KAT'
	  // Check if the key is in finalArrayKeys
	  if (finalArrayKeys.includes(key)) {
		//console.log(key)
	    // Find the corresponding object in finalArray
	    const finalObject = finalArray.find((item) => Object.keys(item)[0] === key);
	    const innerArray = finalObject[key];
	    const flattenedArray = innerArray.flat();
	    updatedResultObjects.push({ [key]: flattenedArray });
	    //console.log(updatedResultObjects)
	  } else {
		const innerArray = resultObject[key]
		const flattenedArray = Array.isArray(innerArray[0]) ? innerArray.flat() : innerArray;
		updatedResultObjects.push({ [key]: flattenedArray });
	  }
	}
	
	return updatedResultObjects;
      }
export {replaceObjects};
// Example data resultObjects is from flightPlans.jsx
// const resultObjects = [
// 	{ KAT: [[13.03, 7.69], [-33.71, 150.3], [7.16, 79.87]] },
// 	{ SULEN: [[4.41, 90.4]] },
// 	{ OKABU: [[3.27, 94.85], [3.27, 94.85]] },
// 	{ ARAMA: [[-33.71, 150.3]] }
//       ];
//finalArray is from pickOutMultiple.jsx
// const finalArray = [{ KAT: [7.16, 79.87] }, { OKABU: [3.27, 94.85] }];
      
// const updatedResultObjects = replaceObjects(resultObjects, finalArray);
// console.log(updatedResultObjects);
      
// updatedResultObjects = [
// 	{ KAT: [ 7.16, 79.87 ] },
// 	{ SULEN: [ 4.41, 90.4 ] },
// 	{ OKABU: [ 3.27, 94.85 ] },
// 	{ ARAMA: [ -33.71, 150.3 ] }
//       ]

//updatedResultObjects can be cleaned up then add airport arrival and departure then passed to Maps.jsx

// resultObjects=[
// 	{ KAT: [ [13.03, 7.69], [-33.71, 150.3], [7.16, 79.87] ] },
// 	{ SULEN: [[4.41, 90.4]] },
// 	{ OKABU: [[3.27, 94.85], [3.27, 94.85]] },
// 	{ ARAMA:[[-33.71, 150.3]] }
//       ]

//resultObjects is from FlightPlans.jsx

//finalArray =  [ { KAT: [ 7.16, 79.87 ] }, { OKABU: [ 3.27, 94.85 ] } ]
//finalArray is an output from pickOutMultiple.jsx