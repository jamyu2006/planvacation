/**
 * This is still in progress.... For now I simply console logged an array
 * of segment objects. Every segment object properties representing
 * different modes of transportation. These properties are associated to an
 * array of route objects. So essentially I found every possible route 
 * for every mode of transportation in every segment of the trip.
 */

import { useLocation } from "react-router-dom";
import useAllPossibleRoutes from "../hooks/useAllPossibleRoutes";
const ViewPossibleRoutes = () => {
    const {state} = useLocation();
    const {startingLocation, tripLocations} = state;
    // to make the code neater, I used a hook... Look at the hooks folder if you care to see the logic
    const [routes, setRoutes] = useAllPossibleRoutes(startingLocation, tripLocations);
    console.log(routes);
}

export default ViewPossibleRoutes;