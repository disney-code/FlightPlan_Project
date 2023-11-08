import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListOfFlights() {
  const [selectedOption, setSelectedOption] = useState('');
  const [filteredFlightPlan, setFilteredFlightPlan] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
      const flightPlanUrl = `http://118.189.146.180:9080/flight-manager/displayAll?apikey=${apiKey}`;
      try {
        const response = await axios.get(flightPlanUrl);
        const allFlightPlans = response.data;
        const flightIdentifications = allFlightPlans.map((flightPlan) => flightPlan.aircraftIdentification);
        setFilteredFlightPlan(flightIdentifications);
        setLoading(false); // Set loading to false when the data is loaded
      } catch (error) {
        console.error(error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchData();
  }, []);

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <h2>A list of Flights:</h2>
      {loading ? ( // Display a loading message while data is being fetched
        <p>Loading...</p>
      ) : (
        <select value={selectedOption} onChange={handleDropdownChange}>
          <option value="">Select an option</option>
          {filteredFlightPlan.map((str, index) => (
            <option key={index} value={str}>
              {str}
            </option>
          ))}
        </select>
      )}
      <p>You selected: {selectedOption}</p>
    </div>
  );
}

export default ListOfFlights;


// // const axios = require('axios');
// import axios from 'axios';
// import {useState} from 'react';
// async function ListOfFlights(){
// 	const [selectedOption, setSelectedOption] = useState('');
// 	const apiKey = '0b42b27c-8d1a-4d71-82c4-302c3ae19c51';
// 	const flightPlanUrl=`http://118.189.146.180:9080/flight-manager/displayAll?apikey=${apiKey}`
// 	let filteredFlightPlan
// 	try{
  
// 		const response = await axios.get(flightPlanUrl);
// 		const allFlightPlans = response.data;
// 		filteredFlightPlan = allFlightPlans.map((flightPlan) => flightPlan.aircraftIdentification);
// 		console.log(filteredFlightPlan)
// 		console.log("Length of the array is below: ")
// 		console.log(filteredFlightPlan.length)
// 	}
// 	catch(error){
// 			console.error(error)
// 		}

// 	const handleDropdownChange = (event) => {
// 			setSelectedOption(event.target.value);
// 		      };

// return (
// <div>
//       <h2>Select a Flight:</h2>
//       <select value={selectedOption} onChange={handleDropdownChange}>
//         <option value="">Select an option</option>
//         {filteredFlightPlan.map((str, index) => (
//           <option key={index} value={str}>
//             {str}
//           </option>
//         ))}
//       </select>
//       <p>You selected: {selectedOption}</p>
//     </div>

// )
	
// }
// // ListOfFlights()
// export default ListOfFlights;