import Root from "./routes/Root.jsx";
import Login from "./routes/Login.jsx";
import Signup from "./routes/Signup.jsx";
import Home from "./routes/Home.jsx";
import CreateTrip from "./routes/CreateTrip.jsx"
import ViewTrip from "./routes/ViewTrip.jsx"
import ViewPossibleRoutes from "./routes/ViewPossibleRoutes.jsx";

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path = "/" element = {<Root/>}/>
            <Route path = "/login" element = {<Login/>}/>
            <Route path = "/signup" element = {<Signup/>}/>
            <Route path = "/home" element = {<Home/>}/>
            {/* TO DO HAVE EACH TRIP BE ITS OWN VIEWTRIP INDEX */}
            <Route path = "/home/viewtrip" element = {<ViewTrip/>}/>
            <Route path= "/create-trip" element = {<CreateTrip/>}/>
            <Route path= "/view-possible-routes" element = {<ViewPossibleRoutes />}/>
        </>
    )
);

const App = () => {
    return <RouterProvider router={router} />;
}


export default App;