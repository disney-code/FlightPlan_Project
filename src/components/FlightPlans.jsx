import {useState,useEffect} from 'react';
import axios from 'axios';
function FlightPlan() {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
	const [flightNumber, setFlightNumber] = useState('');
  
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("Results have been updated:", results);

  }, [results]);

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

  
  const designatedPoints = routeElement.map(route => route.position.designatedPoint);
  console.log(designatedPoints)
  
  async function makeApiRequest(point) {
    try {
      console.log("POinT: ", point)
      console.log("type of point: ", typeof point)
      const apiEndPoint=`http://118.189.146.180:9080/geopoints/search/fixes/${point}?apikey=${apiKey}`
      const response = await fetch(apiEndPoint);
      const data = await response.json();
      const transformedData = [];
      if (data.length>0){
        data.forEach(item=>{
          const parts = item.split(' '); // Split the item by space
        if (parts.length === 2) {
          
          const [key, value] = parts; // Separate key and value
          console.log("KeY: ", key)
          console.log("type of KeY: ", typeof key)
          const temp=value.slice(1,-1)
          const [x,y] = temp.split(',').map(Number)
          const obj = {
            [key]:  [x,y] 
            
          };
       
          transformedData.push(obj);
        }

        else{
          console.log("There is more than one spacing!!!!!!")
        }
        })
      }
      setResults((prevResults) => [...prevResults, transformedData]);
      
    } catch (error) {
      console.error(`Error for point ${point}: ${error}`);
    }
  }

  async function processItems() {
    for (const item of designatedPoints) {
      
      await makeApiRequest(item);
      // Add a delay or rate-limiting logic here to respect API limits.
    }
  }
  
  processItems()

 
  
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

      {/* <div>
      <h2>Results:</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
          {results.length === 0 && <p>No results to display.</p>}
      </div> */}
    </div>
  );
}

export default FlightPlan;