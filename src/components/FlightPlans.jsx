import {useState,useEffect} from 'react';
import axios from 'axios';
import { apiCallNavOrFix,apiCallAirports } from './callFixesApi';
import {findObjectsWithMultipleCoordinates} from './pickOutMultiple'
import {replaceObjects} from './cleanUpPointsNoduplicate'
import Map from './Map';
import ListOfFlights from './ListOfFlights'
function removeObjectsWithEmptyValues(arr) {
  return arr.filter(obj => Object.values(obj)[0].length > 0);
}

function mergeObjects(arr) {
  return arr.reduce((result, item) => {
    const key = Object.keys(item)[0];
    result[key] = item[key];
    return result;
  }, {});
}
function convertObjectToArray(obj) {
  return Object.values(obj);
}

// Start of the FlightPlan Component
function FlightPlan() {
  const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
  const flightPlanUrl=`http://118.189.146.180:9080/flight-manager/displayAll?apikey=${apiKey}`
	const [flightNumber, setFlightNumber] = useState('');
  
  const [results, setResults] = useState([]);
  const [loopDone,setLoopDone] = useState(false); 
  const [cleanedResults, setCleanedResults] = useState(null);
  //cleanedResults = {PKP:[],..}
  const [waypoints,setWayPoints] = useState(null)
  //waypoints = [[-0.28,70],[10,80],...]
  const [dataNotFound, setDataNotFound] = useState(false);
  useEffect(() => {
    
    if (loopDone){
      //loopDone is a flag so that when results is ready, things can happen
      console.log("Inside flightplans.jsx: ")
      console.log("results below:")
      console.log(results)
      const filteredResults = findObjectsWithMultipleCoordinates(results)
      // filteredResults contain the multiple coordinates points with one of thier coordinate only
      
      // filteredResults = [{REVOP: [-30.55, 116.63]}]
      // give filteredResults + results into replaceObjects function and get the output 
      const newCleanedResults = replaceObjects(results, filteredResults)
      //setCleanedResults(newCleanedResults); // Update the state with cleanedResults

      //newCleanedResults=[{ANITO: [-0.28,104.87]},{PKP:[-2.17, 106.14]},{TOPIR:[]},...]
      // function called removeObjectsWithEmptyValues will objects with empty array
      
      
      setCleanedResults(mergeObjects(removeObjectsWithEmptyValues(newCleanedResults)))
      //cleanedResults = {PKP:[-0.28,10], KAT:[1,3],...}
      setWayPoints(convertObjectToArray(mergeObjects(removeObjectsWithEmptyValues(newCleanedResults))))
      // waypoints will look like [[],[],[],[]...]
      console.log("Below you might see cleanedResults variable: ")
      console.log(mergeObjects(removeObjectsWithEmptyValues(newCleanedResults)))
  }}, [results,loopDone]);

  // When either results or loopDone changes, useEffect runs once

	const handleInputChange = (e) => {

		setFlightNumber(e.target.value);
    //flightNumber variable gets assigned a value
  }


	const handleSubmit = async(e) => {
    //code runs from line 71 to 233
			e.preventDefault();
      setResults([]);
    setLoopDone(false);
    setCleanedResults(null);
    setWayPoints(null);
    setDataNotFound(false)
      console.log("Submit button clicked")
      
try{
  
  const response = await axios.get(flightPlanUrl);
  //response ={data: Array(4440), status:200, statusText :"OK"}
  const allFlightPlans = response.data;
  console.log("response from Flight plan url ")
  //response.data =(4440)[{...},{...},{...},...]
  // each of {} in [] looks like 
// {_id: '653d18048e0fa50dcab3e121', messageType: 'FPL', aircraftIdentification
  
  //filtered Flight plan will have multiple eg SIA469
  // can filter allFlightPlans in a try and catch block
let filteredFlightPlan
  try{
   filteredFlightPlan = allFlightPlans.filter((plan) =>
  plan.aircraftIdentification.toLowerCase() === flightNumber.toLowerCase()
);}
catch(error){
console.log("Failed to  find a flight with this number")
}


//flightMatchingFlightPlan will have one flight plan of eg SIA469
const firstMatchingFlightPlan = filteredFlightPlan.find((plan) =>
  plan.filedRoute && (plan.filedRoute.routeText || plan.filedRoute.routeElement)
);
//firstMatchingFlightPlan can be undefined or an object
if (!firstMatchingFlightPlan){
  console.log("Flight Route for this Flight Number is not available")
  setDataNotFound(true);
}

else
{ // else line 104 to 238

//{_id: '653c72118e0fa50dcab3e049', messageType: 'ATFM', aircraftIdentification: 'SIA215', filedRoute: {…}, flightType: 'S', …}

// firstMatchingFlightPlan.filedRoute {flightRuleCategory: 'I', cruisingSpeed: '0.85 M', cruisingLevel: '370 F', routeText: 'ANITO B470 PKP/N0497F370 L764 LAMOB B469 IDOKU/N04…390 B469 TOPIR/N0496F380 L514 REVOP Q38 JULIM DCT', routeElement: Array(7), …}
  // if you can get into this if block, it means there is a route for this flight number
  // Extract the "routeText" and "routeElement" properties from the "filedRoute" object
  const {destinationAerodrome}=firstMatchingFlightPlan.arrival
  const {departureAerodrome}=firstMatchingFlightPlan.departure
  
  const { routeText, routeElement } = firstMatchingFlightPlan.filedRoute;
  //"routeText": "KAT P570 SULEN/M085F410 P570 MABIX/N0486F410 P756 OKABU/M085F410 M300 SALAX/N0486F410 Y340 BATAR A464 ARAMA"
  console.log("in flightplans.jsx file, below is routeText: ")
  console.log(routeText)
  console.log("in flightplans.jsx file, below is routeElement: ")
  console.log(routeElement)
  const designatedPoints = routeElement.filter(route => route.position?.designatedPoint).map(route => route.position.designatedPoint);
  //routeElement : [{position: {desginatedPoint:KAT}},{},...]
  designatedPoints.unshift(departureAerodrome)
  designatedPoints.push(destinationAerodrome)
  console.log("Designated Points: ",designatedPoints)

  // designatedPoints=["KAT", "YASH",...]

async function makeAirportCoordReq(point){
try{
  console.log("Calling for Airport coordinate for point: ")
  console.log(point)
const data = await apiCallAirports("airports", point)
console.log("airport ",point, 'data is ',data)
const transformedData = [];
if (data.length>0){
  for(const item of data){
    const parts = item.split(' '); // Split the item by space     
    const [_, value] = parts;  // eslint-disable-line no-unused-vars
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
}
catch(error){
  console.error(`Error while calling for Airport coordinate for point ${point}: ${error}`);
}
}

  async function makeApiRequest(point) {
    // every point (e.g REVOP) will call makeApiRequest once 
    try {
      
      let callNavaids=false;  
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
      
      const data = await apiCallNavOrFix("navaids",point)
      // data can look like ['KAT (13.03,7.69)', 'KAT (-33.71,150.30)', 'KAT (7.16,79.87)']
      console.log("call navaids for point:", point)
      console.log("Below is the coordinate for this point:")
      console.log(data)
      //data look like ['DIK (46.86,-102.77)','DI (-12.35,49.30)','DIR (18.98,12.88)','DI (31.91,70.89)']
      const filteredData = data.filter(item => item.startsWith(point+' '));
      console.log("Below is how filteredData looks: ")
      console.log(filteredData)
      for(const item of filteredData){
        const parts = item.split(' '); // Split the item by space
        const _ = parts[0] // eslint-disable-line no-unused-vars
        const value = parts[1];     
        //const [_, value] = parts; // Separate key and value
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
      
      const data = await apiCallNavOrFix("navaids",point)
     
      if (data.length>0){
        for(const item of data){
          const parts = item.split(' '); // Split the item by space     
          const [_, value] = parts;  // eslint-disable-line no-unused-vars
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
      // call to API for this point coordinates failed 
      console.error(`Error for point ${point}: ${error}`);
    }
  }

  async function processItems() {
    for (let i = 0; i < designatedPoints.length; i++) {
      if (i===0 ||i === designatedPoints.length - 1){
        const item = designatedPoints[i];
        console.log("Hai")
        console.log("here is i:", i)
        await makeAirportCoordReq(item);
      }
      else{
        const item = designatedPoints[i];
      await makeApiRequest(item);
      }
      
    
    }
    // for (const item of designatedPoints) {
    //   await makeApiRequest(item);
      
    // }
  }
  
  processItems().then(()=>{
    
    setLoopDone(true)   
  })
  
 }

 } // end of try on line 75

catch (error) {
  
  console.error('error in FlightPlans.jsx file on line 247, API Error IN FlightPlans.jsx file:', error);
} 

}; //end of handleSubmit


  return (
	<div className="container">
    <ListOfFlights/>

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
      {dataNotFound ? (
        <p>Flight route for this flight is not known.</p>
      ) : (
        <Map data={cleanedResults} waypoints={waypoints} />
      )}
    </div>
      {/* <div>
        
      <Map data={cleanedResults} waypoints={waypoints} />
      
      </div> */}
      
    </div>
  );
}

export default FlightPlan;