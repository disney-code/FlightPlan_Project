import {useState,useEffect} from 'react';
import axios from 'axios';
function FlightPlan() {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
  const flightPlanUrl="http://118.189.146.180:9080/flight-manager/displayAll?apikey=0b42b27c-8d1a-4d71-82c4-302c3ae19c51"
	const [flightNumber, setFlightNumber] = useState('');
  
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log("Results have been updated:", results);

  }, [results]);

	const handleInputChange = (e) => {

		setFlightNumber(e.target.value);
  }


	const handleSubmit = async(e) => {
			e.preventDefault();
      
try{
  const response = await axios.get(flightPlanUrl);
  const allFlightPlans = response.data;
  //filtered Flight plan will have multiple eg SIA469
  const filteredFlightPlan = allFlightPlans.filter((plan) =>
  plan.aircraftIdentification.toLowerCase() === flightNumber.toLowerCase()
);
//flightMatchingFlightPlan will have one flight plan of eg SIA469
const firstMatchingFlightPlan = filteredFlightPlan.find((plan) =>
  plan.filedRoute && (plan.filedRoute.routeText || plan.filedRoute.routeElement)
);

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
      let key;
      if (data.length>0){
        for(const item of data){
          const parts = item.split(' '); // Split the item by space        
          const [currentKey, value] = parts; // Separate key and value
          
          if (currentKey!==point){
            callNavaids=true
            break
          }
          key = currentKey;
          const temp=value.slice(1,-1)
          const [x,y] = temp.split(',').map(Number)
          
       
          transformedData.push([x,y]);
        
        } //end of for loop line 55

        if (!callNavaids){
          let newObj={[point]:transformedData}
          setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
        }


        if (callNavaids){
          const apiNavaids=`http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`
          const response = await fetch(apiNavaids);
      const data = await response.json();
      let key2;
      for(const item of data){
        const parts = item.split(' '); // Split the item by space     
        const [currentKey, value] = parts; // Separate key and value
        
        const temp=value.slice(1,-1)
        const [x,y] = temp.split(',').map(Number)
        transformedData.push([x,y]);
      }
      
      let newObj={[point]:transformedData}
      setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
     
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
          const [currentKey, value] = parts; // Separate key and value
          const temp=value.slice(1,-1)
          const [x,y] = temp.split(',').map(Number)
         
          transformedData.push([x,y]);
          console.log("for TOPIR, data is below")
          console.log(transformedData)
        }
  
        let newObj={[point]:transformedData}
      setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
      }
      else{
        transformedData.push([]);
        let newObj={[point]:transformedData}
      setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
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

//check if results variable has object with more than one coordinates


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
      {/* {results.map((item, index) => (
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
      ))} */}
      </div>
    </div>
  );
}

export default FlightPlan;