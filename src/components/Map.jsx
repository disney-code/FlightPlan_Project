
import axios from 'axios';

import React, { useEffect, useState ,useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
function Map(){

	const waypoints = useMemo(
		() => [
		  [51.5074, -0.1278],  // London
		  [53.8008, -1.5491],   // Leeds
		  [55.8617,-4.2583]
		],
		[]
	      );
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
    <Marker key={index} position={waypoint} />
  ))}
</MapContainer>
		</div>
	      )

}


export default Map;