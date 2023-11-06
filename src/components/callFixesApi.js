// type can be fixes or navaids
// term can be KAT (navaids) or NELON (fixes)
async function apiCallNavOrFix(type, term) {
	const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
	const apiUrl = `http://118.189.146.180:9080/geopoints/search/${type}/${term}?apikey=${apiKey}`;
      
	try {
	  const response = await fetch(apiUrl);
	  
	  if (response.ok) {
	    const data = await response.json();
	    
	    return data;
	  } else {
	    throw new Error('Request failed with status ' + response.status);
	  }
	} catch (error) {
	  return { error: error.message };
	}
      }
async function apiCallAirports(type, term) {
	const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
	const apiUrl = `http://118.189.146.180:9080/geopoints/search/${type}/${term}?apikey=${apiKey}`;
      
	try {
	console.log("inside callFixesApi.js: ")
	console.log("Airport api url below:")
	console.log(apiUrl)
	  const response = await fetch(apiUrl);
	  
	  if (response.ok) {
	    const data = await response.json();
	    
	    return data;
	  } else {
	    throw new Error('Request failed with status ' + response.status);
	  }
	} catch (error) {
	  return { error: error.message };
	}
      }


export { apiCallNavOrFix ,apiCallAirports};