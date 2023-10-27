import React, { useEffect, useState ,useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { latLngBounds, divIcon } from 'leaflet';
import './map.css';
import { renderToStaticMarkup } from 'react-dom/server'; // Import renderToStaticMarkup
import FilledCircleMarker from './FilledCircleMarker';
//data = {ANITO:[],PKP:[],LAMOB:[]}
function Map(){
	const data = {
		
		ANITO:[-0.28,104.87],
		PKP: [-2.17,106.14],
		LAMOB: [-12,108.88],
		IDOKU: [-18.26,111.11],
		
		
		REVOP: [-30.55,116.63],
		JULIM:[-31.42,116.29]
		
	      };
	const [mapBounds, setMapBounds] = useState(null);
	//const [waypoints, setWaypoints] = useState([]);
	const waypoints= Object.values(data)
	useEffect(() => {
		if (data) {
			
		// console.log("inside map.jsx. data: ", data)
		// const newWaypoints = Object.values(data);
		// console.log("waypoints below: (line 15)");
      		// console.log(newWaypoints);
		//waypoints = [[],[]]
		  if (waypoints.length > 0) {
		    const bounds = latLngBounds(waypoints);
		    setMapBounds(bounds);
		  }

		  
		}
	      }, []);

	      if (!data) {
		// You can render a loading state or a message here when data is null.
		return (
		  <div>Loading...</div>
		);
	      }
	return(
		<div>
			<MapContainer bounds={mapBounds} center={waypoints[0]} 
			scrollWheelZoom={false}
			zoom={5} style={{ height: '400px', width: '100%' }}>
  			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="© OpenStreetMap contributors" />
  			<Polyline positions={waypoints} color="blue" />
  			{Object.keys(data).map((key, index) => (
  <Marker
    key={index}
    position={data[key]}
    icon={new divIcon({
	className: 'custom-marker',
	html: renderToStaticMarkup(<FilledCircleMarker name={key} />)
      })}
  />
			))}
  
			</MapContainer>
		</div>
	      )

}


export default Map;
// import React, { useEffect, useState ,useMemo } from 'react';
// import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
// import { latLngBounds, divIcon } from 'leaflet';
// // import 'leaflet/dist/leaflet.css';
// // import 'react-leaflet-markercluster/dist/styles.min.css';
// import './map.css';
// import { renderToStaticMarkup } from 'react-dom/server'; // Import renderToStaticMarkup
// import FilledCircleMarker from './FilledCircleMarker';
// function Map(){
// 	// console.log(cleanedResults)
// 	//cleanedResults = [{ANTIO:[-0.28, 104.87]}]
// 	//but for map to display it should look like  
	
// 	const cleanedResults = {
		
// 		ANITO:[-0.28,104.87],
// 		PKP: [-2.17,106.14],
// 		LAMOB: [-12,108.88],
// 		IDOKU: [-18.26,111.11],
		
		
// 		REVOP: [-30.55,116.63],
// 		JULIM:[-31.42,116.29]
		
// 	      };
	
// 	console.log("Inside map line 12, look above for cleanedResults")
// 	const [mapBounds, setMapBounds] = useState(null);
// 	const [waypoints, setWaypoints] = useState([]);
// 	useEffect(() => {
// 		if (cleanedResults) {
// 		const points = Object.values(cleanedResults);
		 
	    
// 		  if (points.length > 0) {
// 		    const bounds = latLngBounds(waypoints);
// 		    console.log("here is how bounds look like: ", bounds)
// 		    setMapBounds(bounds);
// 		    setWaypoints(points);
// 		  }
// 		}
// 	      }, []);
	
// 	//waypoints = [[7.18, 79.89], [7.16, 79.87]]
// 	return(
// 		<div>
// 			<MapContainer bounds={mapBounds} center={waypoints[0]} 
// 			scrollWheelZoom={false}
// 			zoom={5} style={{ height: '500px', width: '100%' }}>
//   			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//   attribution="© OpenStreetMap contributors" />
//   			<Polyline positions={waypoints} color="blue" />
//   			{cleanedResults && Object.keys(cleanedResults).map((key, index) => (
//   <Marker
//     key={index}
//     position={cleanedResults[key]}
//     icon={new divIcon({
// 	className: 'custom-marker',
// 	html: renderToStaticMarkup(<FilledCircleMarker name={key} />)
//       })}
//   />
// 			))}
  
// 			</MapContainer>
// 		</div>
// 	      )

// }


// export default Map;