import {useState} from 'react';
import axios from 'axios';
function FlightPlan() {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
	const [flightNumber, setFlightNumber] = useState('');
  const [responses, setResponses] = useState([]);
  
	const handleInputChange = (e) => {
		setFlightNumber(e.target.value);}


	const handleSubmit = async(e) => {
			e.preventDefault();
			// You can perform any additional actions or validation here
			console.log('Flight Number submitted:', flightNumber);

      const apiUrl ="http://118.189.146.180:9080/flight-manager/displayAll?apikey=0b42b27c-8d1a-4d71-82c4-302c3ae19c51"

try{
  const response = await axios.get(apiUrl);
  const allFlightPlans = response.data;
  const filteredFlightPlan = allFlightPlans.filter((plan) =>
  plan.aircraftIdentification.toLowerCase() === flightNumber.toLowerCase()
);

// Find the first flight plan with a "filedRoute" containing "routeText" or "routeElement"
const firstMatchingFlightPlan = filteredFlightPlan.find((plan) =>
  plan.filedRoute && (plan.filedRoute.routeText || plan.filedRoute.routeElement)
);
console.log("first Flight plan: ",firstMatchingFlightPlan)
if (firstMatchingFlightPlan) {
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;

  // Handle the extracted data
  console.log('Extracted "routeText":', routeText);
  console.log('Extracted "routeElement":', routeElement);
  //const designatedPoints = routeElement.map(route => route.position.designatedPoint);
  const designatedPoints =['PIBAP',  'VPK',"GOLUD",'NOMEP',"KIGOB"]
  //const designatedPoints =[ 'VPK',"KIGOB"]
  console.log(designatedPoints)
  const responses = await Promise.all(
    designatedPoints.map(async (point,index) => {
      
      try {
        console.log("Point: ", point)
        // Add a delay of 1 second (1000 milliseconds) between requests
        if (index > 0) {
          console.log("waitING")
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        const fixUrl = `http://118.189.146.180:9080/geopoints/search/fixes/${point}?apikey=${apiKey}`;
        const navaidUrl = `http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`;
  
        const fixResponse = await axios.get(fixUrl);
        const navaidResponse = await axios.get(navaidUrl);
        console.log("fix Response for ", point +":")
        console.log(fixResponse)
        console.log("navaids Response for ", point +":")
        console.log(navaidResponse)
        return {
          point,
          fixData: fixResponse.data,
          navaidData: navaidResponse.data,
        };
      } catch (error) {
        return {
          point,
          error: "Data not found for this point CHARLENE",
        };
      }
    })
  );

  console.log("REsponse: ",responses)

  
} else {
  console.log('No matching flight plan found with "filedRoute" containing "routeText" or "routeElement.');
}


}

catch (error) {
  // Handle any errors here
  console.error('API Error IN FlightPlans.jsx file:', error);
}




		      };

  return (
	<div className="container">
		<form className="mt-3" onSubmit={handleSubmit}>
	<div className="form-group">
      <label htmlFor="flightNumber">Enter Flight Number: </label>
      <input
      id="flightNumber"
        type="text"
	className="form-control"
        value={flightNumber}
        onChange={handleInputChange}
        placeholder="E.g., SIA215"
      />
      </div>
      
      <button  type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default FlightPlan;