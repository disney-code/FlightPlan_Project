const axios = require('axios');
function extractCoordinates(data) {
	return data.flatMap(item => {
		const regex = /\(([^)]+)\)/;
	  const match = regex.exec(item);
      
	  if (match && match[1]) {
	    const coordinates = match[1].split(',').map(parseFloat);
	    return coordinates;
	  }
      
	  return null;
	});
      }

//       console.log(extractCoordinates([ 'WSSS (1.36,103.99)' ]))
async function getAirportCoordinates(departureICAO, arrivalICAO) {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
  const apiUrl = 'http://118.189.146.180:9080/geopoints/search/airports/';

  const departurePromise =  axios.get(`http://118.189.146.180:9080/geopoints/search/airports/${departureICAO}?apikey=${apiKey}`);
  const arrivalPromise =  axios.get(`${apiUrl}${arrivalICAO}?apikey=${apiKey}`);

  try {
    const [departureResponse, arrivalResponse] = await Promise.all([departurePromise, arrivalPromise]);
	let departureData1 = departureResponse.data
	let arrivalData1= arrivalResponse.data
	
    const departureData = { [departureICAO]: extractCoordinates(departureData1) };
    const arrivalData = { [arrivalICAO]: extractCoordinates(arrivalData1) };
	
    return [departureData, arrivalData];
  } catch (error) {
    console.error('Error fetching airport coordinates:', error);
    return [];
  }
}

// Example usage:
getAirportCoordinates('WSSS', 'YPPH')
  .then(result => console.log(result))
  .catch(error => console.error(error));
