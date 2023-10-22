
import axios from 'axios';

import React, { useEffect, useState ,useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { latLngBounds, divIcon } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'react-leaflet-markercluster/dist/styles.min.css';
import './map.css';
import { renderToStaticMarkup } from 'react-dom/server'; // Import renderToStaticMarkup
import FilledCircleMarker from './FilledCircleMarker';
function Map(){
	const data = [
		[{WSSS: [1.36,103.99]}],
		[{ ANITO: [-0.28, 104.87] }],
		[{ PKP: [-2.17, 106.14] }],
		[{ LAMOB: [-12, 108.88] }],
		[{IDOKU: [-18.26, 111.11]}],
		[{ REVOP: [-30.55, 116.63] }],
		[{JULIM: [-31.42, 116.29]}],
		[{YPPH :[-31.94,115.97]}]
	      ];
	      const waypoints = useMemo(() => [], []);
	      const waypointsName = useMemo(() => [], []);

	data.forEach(innerArray => {
	  innerArray.forEach(obj => {
	    // Extract the values of the objects and push them into the result array
	    for (const key in obj) {
	      if (obj.hasOwnProperty(key)) {
		waypoints.push(obj[key]);
		waypointsName.push(key)
	      }
	    }
	  });
	});
	console.log("Below is the extraction Charlene:")
	// console.log(waypoints);
	// console.log("Name of waypoints: ",waypointsName)
	
	      const [mapBounds, setMapBounds] = useState(null);
	      useEffect(() => {
		if (waypoints.length > 0) {
		  const bounds = latLngBounds(waypoints);
		  setMapBounds(bounds);
		}
	      }, [waypoints]);
	      return(
		<div>
			<MapContainer bounds={mapBounds} center={waypoints[0]} 
			scrollWheelZoom={false}
			zoom={7} style={{ height: '400px', width: '100%' }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="© OpenStreetMap contributors" />
  <Polyline positions={waypoints} color="blue" />

  {waypoints.map((waypoint, index) => (
          <Marker
            key={index}
            position={waypoint}
            icon={new divIcon({ className: 'custom-marker', html: renderToStaticMarkup(<FilledCircleMarker name="YPPH" />) })}
          />
        ))}
 
</MapContainer>
		</div>
	      )

}


export default Map;