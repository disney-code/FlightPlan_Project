import {useState} from 'react';
import axios from 'axios';
function FlightPlan() {

	const [flightNumber, setFlightNumber] = useState('');

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

if (firstMatchingFlightPlan) {
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;

  // Handle the extracted data
  console.log('Extracted "routeText":', routeText);
  console.log('Extracted "routeElement":', routeElement);
  
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