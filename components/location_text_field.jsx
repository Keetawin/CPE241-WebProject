import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import Geocode from "react-geocode";

const containerStyle = {
  width: 'full',
  height: '400px'
};

const center = { lat: 15.857 , lng: 100.722 };

const LocationTextField = ({ onLocationSelect }) => {
  const [markers, setMarkers] = useState({ lat: 15.86 , lng: 100.72 })
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `AIzaSyAzUxpMF9CXlwDXo_O86l5A0o7LVHVMaDU`
  })
  const markerRef = useRef(null);
  useEffect(() => {
  }, [markers])
  

  Geocode.setApiKey("AIzaSyAzUxpMF9CXlwDXo_O86l5A0o7LVHVMaDU");
  Geocode.setLanguage("en");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  const handleAddress = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (let i = 0; i < response.results[0].address_components.length; i++) {
          for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log(city, state, country);
        console.log(address);
        onLocationSelect(address)
      },
      (error) => {
        console.error(error);
      }
    );
  }

const onMapClick = (e) => {
    setMarkers(
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      },
    )
    
  };



  return (
    isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        onClick={onMapClick}
        id='google-map-script'
      >
        <Marker           
        position={{ 
            lat: markers.lat,
            lng: markers.lng 
          }} 
        draggable={true}
        ref={markerRef}  
        onPositionChanged={()=>{
          // console.log(markerRef.current)
          handleAddress(markerRef.current?.marker.position.lat(), markerRef.current?.marker.position.lng())
        }} />
        <></>
      </GoogleMap>
    ) : <></>

  );
};

export default LocationTextField;