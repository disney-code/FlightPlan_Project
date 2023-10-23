
import React, { useEffect, useState ,useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import { latLngBounds, divIcon } from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'react-leaflet-markercluster/dist/styles.min.css';
import './map.css';
import { renderToStaticMarkup } from 'react-dom/server'; // Import renderToStaticMarkup
import FilledCircleMarker from './FilledCircleMarker';
function Map(){
	const data = {
		
		VCBI:[7.18,79.89],
		KAT: [7.16, 79.87],
		MABIX: [3.27, 94.85],
		SULEN: [4.41, 90.4],
		
		OKABU: [3.44, 97.61],
		SALAX: [2.21, 101.56],
		BATAR: [2.17, 102.09],
		ARAMA: [1.61, 103.12],
		WSSS: [1.36,103.99],
	      };
	const waypoints = Object.values(data);
	//waypoints is the values of the keys 
	//waypoints = [[7.16, 79.87],[7.18, 79.89],[3.27, 94.85],...,[1.36, 103.99]]   
	const [mapBounds, setMapBounds] = useState(null);
	useEffect(() => {
		if (waypoints.length > 0) {
		  const bounds = latLngBounds(waypoints);
		  console.log("bounds: ", bounds)
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