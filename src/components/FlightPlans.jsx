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
console.log("firstMatchingFlightPlan: ")
console.log(firstMatchingFlightPlan)
if (firstMatchingFlightPlan) {
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const {destinationAerodrome}=firstMatchingFlightPlan.arrival
  const {departureAerodrome}=firstMatchingFlightPlan.departure
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;
  console.log("departure Aerodrome: ", departureAerodrome)
  console.log("Destination Aerodrome: ", destinationAerodrome)
  console.log(routeText)
  const designatedPoints = routeElement.map(route => route.position.designatedPoint);
  console.log("Designated Points: ",designatedPoints)
  
  async function makeApiRequest(point) {
    try {
      
      let callNavaids=false;
      const apiEndPoint=`http://118.189.146.180:9080/geopoints/search/fixes/${point}?apikey=${apiKey}`
      const response = await fetch(apiEndPoint);
      const data = await response.json();
      const transformedData = [];

      if (data.length>0){
        for(const item of data){
          const parts = item.split(' '); // Split the item by space        
          const [key, value] = parts; // Separate key and value
          
          if (key!==point){
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
        transformedData.push(obj);
      }
      setResults((prevResults) => [...prevResults, transformedData]);
      callNavaids=false
        } //end of calling navaids

        
      }// end of if cannot find data in fixes

      else{
       // query to navaids
console.log("querying navaids because fixes return [] for point: ", point)
       const apiNavaids=`http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`
          const response = await fetch(apiNavaids);
      const data = await response.json();

      if(point==="TOPIR"){
        console.log("data response from querying TOPIR at navaids: ", data)
      }

      if (data.length>0){
        for(const item of data){
          const parts = item.split(' '); // Split the item by space     
          const [key, value] = parts; // Separate key and value
          
          const temp=value.slice(1,-1)
          const [x,y] = temp.split(',').map(Number)
          const obj = {
            [key]:  [x,y] 
            
          };
          transformedData.push(obj);
          console.log("for TOPIR, data is below")
          console.log(transformedData)
        }
  
        setResults((prevResults) => [...prevResults, transformedData]);
      }
      else{
        transformedData.push({[point]: []});
        setResults((prevResults) => [...prevResults, transformedData]);
      }
      
      
    } }catch (error) {
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
} //catch for catching failure to retrive flight plans

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

      <div>
      {results.map((item, index) => (
        <ul key={index}>
          {item.map((result, subIndex) => (
            <li key={subIndex}>
              {Object.keys(result).map((key) => (
                <div key={key}>
                  {key}: [{result[key].join(', ')}]
                </div>
              ))}
            </li>
          ))}
        </ul>
      ))}
      </div>
    </div>
  );
}

export default FlightPlan;