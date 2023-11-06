// this function is to use when there are more than one coordinate associated with a fixes or navaid

function calculateDistance(coord1, coord2) {
	const [lat1, lon1] = coord1;
	const [lat2, lon2] = coord2;
	const R = 6371; // Earth's radius in kilometers
      
	const lat1Rad = (lat1 * Math.PI) / 180;
	const lon1Rad = (lon1 * Math.PI) / 180;
	const lat2Rad = (lat2 * Math.PI) / 180;
	const lon2Rad = (lon2 * Math.PI) / 180;
      
	const dLat = lat2Rad - lat1Rad;
	const dLon = lon2Rad - lon1Rad;
      
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
	  Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;
      
	return distance;
      }
      
function findClosestKAT(NAVAID_COORDINATES, WAYPOINT_COORDINATES) {
	//who calls findClosestKAT? pickOutMultiple.jsx
	console.log("Inside shortestDist.js file")
	console.log("Below is the first point(Inside shortestDist.js file): ")
	console.log(NAVAID_COORDINATES)
	console.log("Below is second coordinate(Inside shortestDist.js file): ")
	console.log(WAYPOINT_COORDINATES)
	let closestKAT = null;
	let minDistance = Number.MAX_VALUE;
      
	for (const key in NAVAID_COORDINATES) {
	  if (Object.prototype.hasOwnProperty.call(NAVAID_COORDINATES, key)) {
	    const coordinates = NAVAID_COORDINATES[key];
	    for (const coord of coordinates) {
	      const distance = calculateDistance(coord, WAYPOINT_COORDINATES);
	      if (distance < minDistance) {
		minDistance = distance;
		closestKAT = {
		  [key]: coord,
		  
		};
	      }
	    }
	  }
	}
      console.log("cloest coordinate: ")
      console.log(closestKAT)
	return closestKAT;
	//closestKAT looks like { OKABU: [ 3.27, 94.85 ] }
      }
      
      // Export the function to use it in your React component
export {  findClosestKAT };
// const NAVAID_COORDINATES = {
// 	KAT: [
// 		[7.48, 28.31],
// 		[-30.55, 116.63]
// 	],
//       };
//       const WAYPOINT_COORDINATES =  [-31.42, 116.29]
// findClosestKAT(NAVAID_COORDINATES, WAYPOINT_COORDINATES)


//for SIA242, it is giving error because the first one the one with multiple coordinate
//NAVAID_COORDINATES ={RIC:[
//[37.5, -77.32],[-33.61, 150.8],[-33.6, 150.78]
//]}
//WAYPOINT_COORDINATES =[]

