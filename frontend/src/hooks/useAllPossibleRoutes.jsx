/**
 * So this hook takes in the starting position and the list of positions and 
 * returns a state containing all the routes. Routes is an array of segment objects.
 * Each segment is a connection between consective locations.
 * Segment object contains every mode of transportation as a property
 * The mode of transportation property is associated with an array of routes for that mode of transportation
 */

import { useJsApiLoader, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];

const useAllPossibleRoutes = (startingLocation, tripLocations) => {
    const [routes, setRoutes] = useState([]);
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: key,
        libraries
    });

    // takes in a mode of transportation, a origin, a destination, and returns an array of route objects
    const getAllRoutes = async (modeOfTransportation, origin, destination, directionsService) => {
        const request = {origin, destination, travelMode: modeOfTransportation, provideRouteAlternatives: true};
        return new Promise((resolve) => {
            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    resolve(result.routes);
                } 
                else {
                    resolve([]);
                }
            });
        });
    }

    useEffect(() => {
        if (!isLoaded || !startingLocation) return;
        
        const directionsService = new window.google.maps.DirectionsService();
        const modesOfTransportation = [
            window.google.maps.TravelMode.DRIVING,
            window.google.maps.TravelMode.WALKING,
            window.google.maps.TravelMode.BICYCLING,
            window.google.maps.TravelMode.TRANSIT
        ];

        const fetchRoutes = async () => {

            //initialize empty list for all routes
            const newRoutes = [];

            // this iterates through the trip locations
            for (let i = 0; i < tripLocations.length; i++) {
                const origin = (i === 0) ? startingLocation : tripLocations[i-1];
                const destination = tripLocations[i];
                const segmentObject = {driving: [], walking: [], bicycling: [], transit: []};

                // this iterates through the modes of transportation for each segment
                for (let modeOfTransportation of modesOfTransportation) {

                    //finds all possible routes in that segment for that mode of transportation
                    const possibleRoutes = await getAllRoutes(modeOfTransportation, origin, destination, directionsService);
                    segmentObject[modeOfTransportation.toLowerCase()] = possibleRoutes;
                }

                newRoutes.push(segmentObject);
            }
            setRoutes(newRoutes);
        }
        fetchRoutes();
    }, [isLoaded, startingLocation, tripLocations]);


    // returns the state
    return [routes, setRoutes];
}

export default useAllPossibleRoutes;
