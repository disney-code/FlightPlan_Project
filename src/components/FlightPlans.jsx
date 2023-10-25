import {useState,useEffect} from 'react';
import axios from 'axios';
import { apiCallNavOrFix } from './callFixesApi';
import {findObjectsWithMultipleCoordinates} from './pickOutMultiple'
import {replaceObjects} from './cleanUpPointsNoduplicate'
import Map from './Map';

// function removeObjectsWithEmptyArrays(arrayOfObjects) {
//   return arrayOfObjects.filter(obj => obj.value.length > 0);
// }

function removeObjectsWithEmptyValues(arr) {
  return arr.filter(obj => Object.values(obj)[0].length > 0);
}
function FlightPlan() {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
  const flightPlanUrl="http://118.189.146.180:9080/flight-manager/displayAll?apikey=0b42b27c-8d1a-4d71-82c4-302c3ae19c51"
	const [flightNumber, setFlightNumber] = useState('');
  
  const [results, setResults] = useState([]);
  const [loopDone,setLoopDone] = useState(false); 
  const [cleanedResults, setCleanedResults] = useState([]);
  useEffect(() => {
    if (loopDone){
      console.log("results shown below, line 15: ")
      console.log(results)
      const filteredResults = findObjectsWithMultipleCoordinates(results)
      // filteredResults contain the multiple coordinates points with one of thier coordinate only
      console.log(filteredResults)
      // filteredResults = [{REVOP: [-30.55, 116.63]}]
      // give filteredResults + results into replaceObjects function and get the output 
      const newCleanedResults = replaceObjects(results, filteredResults)
      setCleanedResults(newCleanedResults); // Update the state with cleanedResults
      console.log("Below is the cleaned up results line 30: ")
      console.log(newCleanedResults)
      //newCleanedResults=[{ANITO: [-0.28,104.87]},{PKP:[-2.17, 106.14]}]
      console.log(newCleanedResults[0])
      console.log("above is newCleanedResults[0]")
      console.log(newCleanedResults[0]['ANITO'])
      console.log(newCleanedResults[0].value)
      
      // setCleanedResults(removeObjectsWithEmptyArrays(newCleanedResults))
      // console.log("cleaned results lin 34: ")
      console.log(removeObjectsWithEmptyValues(newCleanedResults))
      console.log("line 52")
  }}, [results,loopDone]);

	const handleInputChange = (e) => {

		setFlightNumber(e.target.value);
  }


	const handleSubmit = async(e) => {
			e.preventDefault();
      console.log("Submit button clicked")
      
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
  // if you can get into this if block, it means there is a route for this flight number
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const {destinationAerodrome}=firstMatchingFlightPlan.arrival
  const {departureAerodrome}=firstMatchingFlightPlan.departure
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;
  const designatedPoints = routeElement.map(route => route.position.designatedPoint);
  console.log("Designated Points: ",designatedPoints)
  async function makeApiRequest(point) {
    try {
      
      let callNavaids=false;
      // const apiEndPoint=`http://118.189.146.180:9080/geopoints/search/fixes/${point}?apikey=${apiKey}`
      // const response = await fetch(apiEndPoint);
      // const data = await response.json();  
      const data = await apiCallNavOrFix("fixes",point)
      // data may look like ['REVOP (7.48,28.31)', 'REVOP (-30.55,116.63)'] or ['JULIM (-31.42,116.29)']
      const transformedData = [];
      if (data.length>0){
        // if you get into this block, means they found some data from the API call
        for(const item of data){
          // item could be a string like 'REVOP (7.48,28.31)'
          const parts = item.split(' '); // Split the item by space   
          // parts become an array like ['REVOP', '(7.48,28.31)']     
          const [currentKey, value] = parts; // Separate key and value
          // currentKey ='REVOP' and value = '(7.48,28.31)'
          if (currentKey!==point){
            callNavaids=true
            break
          }
          const temp=value.slice(1,-1)
          // value.slice(1,-1) removes the first and last character
          const [x,y] = temp.split(',').map(Number)
          // temp.split(',') returns an array ['1.78','2.10']
          transformedData.push([x,y]);
          //transformedData is an array for a Particular point
        
        } //end of for loop line 55

        if (!callNavaids){
          let newObj={[point]:transformedData}
          setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
        }


        if (callNavaids){
      //     const apiNavaids=`http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`
      //     const response = await fetch(apiNavaids);
      // const data = await response.json();
      const data = await apiCallNavOrFix("navaids",point)
      // data can look like ['KAT (13.03,7.69)', 'KAT (-33.71,150.30)', 'KAT (7.16,79.87)']
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

        
      }// end of if CAN find data in fixes

      else{
       // query to navaids
console.log("querying navaids because fixes return [] for point: ", point)
      //  const apiNavaids=`http://118.189.146.180:9080/geopoints/search/navaids/${point}?apikey=${apiKey}`
      //     const response = await fetch(apiNavaids);
      // const data = await response.json();
      const data = await apiCallNavOrFix("navaids",point)
      if(point==="PKP"){
        console.log("data response from querying TOPIR at navaids: ", data)
      }
      
      if (data.length>0){
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
      }
      else{
        transformedData.push([]);
        let newObj={[point]:transformedData}
      setResults((prevResults) =>[
            ...prevResults,
            newObj
          ] );
      }
      
      
    } } // end of trying to query API
    catch (error) {
      // call to API fail for this point
      console.error(`Error for point ${point}: ${error}`);
    }
  }

  async function processItems() {
    for (const item of designatedPoints) {
      await makeApiRequest(item);
      
    }
// console.log(results)
  }
  
  processItems().then(()=>{
    
    setLoopDone(true)
    console.log("in line 174, chceck what is LoopDone: ", loopDone)
   
  })
  // after processItems() complete, your results variable is updated, you may need to call 
 
 
  
} else {
  console.log('No matching flight plan found with "filedRoute" containing "routeText" or "routeElement.');
}


 } // end of try

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
        
      </div>
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