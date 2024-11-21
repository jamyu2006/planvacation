/**
 * This showcases all the routes on the map. For now it just places markers on all locations
 */

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAllPossibleRoutes from "../hooks/useAllPossibleRoutes";

const ViewPossibleRoutes = () => {
    const {state} = useLocation();
    const {startingLocation, tripLocations} = state;
    // these are the routes which i will later display
    const [routes, setRoutes] = useAllPossibleRoutes(startingLocation, tripLocations);
    // the map will be rendered and I will have access to its reference
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (routes.length == 0 || !window.google) return;

        console.log(routes);
        const map = new window.google.maps.Map(mapRef.current); //through this variable I can update the map that is displayed
        const geocoder = new window.google.maps.Geocoder();
        const allLocations = [startingLocation, ...tripLocations];
        const bounds = new window.google.maps.LatLngBounds();
        const locationLabels = {};

        /**
         * Iterates through all the locations to create markers and labels for each one.
         * Adds each marker to the map and adjusts the map bounds to include all markers.
         * Uses `locationLabels` to manage and display custom labels for locations.
         */
        const markers = allLocations.map((location, index) => {
            return new Promise((resolve) => {
                geocoder.geocode({address: location}, (results, status) => {
                    if (status === "OK" && results[0]) {
                        const position = results[0].geometry.location;
                        // adds the marker in the geographic coordinates of the location
                        const marker = new window.google.maps.Marker({position: position, map, title: location});
                        // uses the hashmap to check if the location is already one of the stopping points,
                        // if it is, it updates the label to include the other indexes
                        if (locationLabels[location]) {
                            locationLabels[location].push(index + 1);
                        } 
                        else {
                            locationLabels[location] = [index + 1];
                        }
                        // the next lines involve generating the labels and adding them to the map
                        const labelText = locationLabels[location].join(" and ");
                        const labelDiv = document.createElement("div");
                        labelDiv.style.position = "absolute";
                        labelDiv.style.fontSize = "14px";
                        labelDiv.style.fontWeight = "bold";
                        labelDiv.style.color = "black";
                        labelDiv.textContent = `Location ${labelText}`;
                        const overlay = new window.google.maps.OverlayView();
                        overlay.onAdd = function () {
                            const pane = this.getPanes().overlayLayer;
                            pane.appendChild(labelDiv);
                        };
                        overlay.draw = function () {
                            const projection = this.getProjection();
                            const pixelPosition = projection.fromLatLngToDivPixel(position);
                            labelDiv.style.left = `${pixelPosition.x}px`;
                            labelDiv.style.top = `${pixelPosition.y}px`;
                        };
                        overlay.setMap(map);
                        bounds.extend(position);
                        resolve(marker);
                    } 
                    else {
                        resolve(null);
                    }
                });
            });
        });


        // once all promises are resolved and the markers are created, this extends the map boundaries to fit all the markers
        Promise.all(markers).then(() => {
            map.fitBounds(bounds);
        });
    }, [routes, startingLocation, tripLocations]);

    if (routes.length === 0) {
        return (
            <div className="loading-message"> Loading..... </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh" }}>
            <div style={{ padding: "16px" }}>
                <h1>View Possible Routes</h1>
            </div>
            <div ref={mapRef} style={{ height: "400px", width: "45%" }}></div>
            <button onClick={() => navigate("/home")} style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}>
                Back to Home
            </button>
        </div>
    );
};

export default ViewPossibleRoutes;
