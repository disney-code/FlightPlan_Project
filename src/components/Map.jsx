import React, { useEffect, useState  } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { latLngBounds, divIcon } from 'leaflet';
import './map.css';
import { renderToStaticMarkup } from 'react-dom/server'; // Import renderToStaticMarkup
import FilledCircleMarker from './FilledCircleMarker';

//data = {ANITO:[],PKP:[],LAMOB:[]} jdj
function Map({data,waypoints}){
	console.log("inside map.jsx")
	console.log("below is data: ")
	console.log(data)
	console.log("below is waypoints:")
	console.log(waypoints)
	// const data = {
		
	// 	ANITO:[-0.28,104.87],
	// 	PKP: [-2.17,106.14],
	// 	LAMOB: [-12,108.88],
	// 	IDOKU: [-18.26,111.11],
		
		
	// 	REVOP: [-30.55,116.63],
	// 	JULIM:[-31.42,116.29]
		
	//       };
	const [mapBounds, setMapBounds] = useState(null);
	// const waypoints = [[-0.28,104.87],
	// 	[-2.17,106.14],
	// 	[-12,108.88],
	// 	[-18.26,111.11],
	// 	[-30.55,116.63],
	// 	[-31.42,116.29]]
	
	useEffect(() => {
		if (data) {
		    const bounds = latLngBounds(waypoints);
		    setMapBounds(bounds);
		     
		  }

		  
		},[] 
	      );

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
