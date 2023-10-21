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
			
			console.log('Flight Number submitted:', flightNumber);
      const apiUrl ="http://118.189.146.180:9080/flight-manager/displayAll?apikey=0b42b27c-8d1a-4d71-82c4-302c3ae19c51"

try{
  const response = await axios.get(apiUrl);
  const allFlightPlans = response.data;
  const filteredFlightPlan = allFlightPlans.filter((plan) =>
  plan.aircraftIdentification.toLowerCase() === flightNumber.toLowerCase()
);


const firstMatchingFlightPlan = filteredFlightPlan.find((plan) =>
  plan.filedRoute && (plan.filedRoute.routeText || plan.filedRoute.routeElement)
);

if (firstMatchingFlightPlan) {
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;

  
  const designatedPoints = routeElement.map(route => route.position.designatedPoint);
  console.log(designatedPoints)
  
  async function makeApiRequest(point) {
    try {
      let callNavaids=false;
      console.log("POinT: ", point)
      console.log("type of point: ", typeof point)
      const apiEndPoint=`http://118.189.146.180:9080/geopoints/search/fixes/${point}?apikey=${apiKey}`
      const response = await fetch(apiEndPoint);
      const data = await response.json();
      const transformedData = [];
      if (data.length>0){
        for(const item of data){
          const parts = item.split(' '); // Split the item by space        
          const [key, value] = parts; // Separate key and value
          if (key!==point){
            console.log("key not equal point")
            console.log("key is: ", key)
            console.log("PoInT is: ", point)
            callNavaids=true
            break
          }
          const temp=value.slice(1,-1)
          const [x,y] = temp.split(',').map(Number)
          const obj = {
            [key]:  [x,y] 
            
          };
       
          transformedData.push(obj);
        
        } //end of for loop line 55

        if (!callNavaids){
          setResults((prevResults) => [...prevResults, transformedData]);
        }


        if (callNavaids){
          const apiNavaids=`http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`
          const response = await fetch(apiNavaids);
      const data = await response.json();
      for(const item of data){
        const parts = item.split(' '); // Split the item by space     
        const [key, value] = parts; // Separate key and value
        
        const temp=value.slice(1,-1)
        const [x,y] = temp.split(',').map(Number)
        const obj = {
          [key]:  [x,y] 
          
        };
        console.log("pls u may see VPK below: ")
        console.log(obj)
     
        transformedData.push(obj);
        console.log("VPK transformed data")
        console.log(transformedData)
      
      }
      setResults((prevResults) => [...prevResults, transformedData]);
      callNavaids=false
        } //end of calling navaids

        
      }// end of if cannot find data in fixes

      else{
        //call navaids endpoint
      }
      
      
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
  
  console.error('API Error IN FlightPlans.jsx file:', error);
}
}; //end of handleSubmit


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