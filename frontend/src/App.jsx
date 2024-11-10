import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Root from './routes/root';
import PlanNewTrip from './routes/PlanNewTrip';
import ViewOldTrips from './routes/ViewOldTrips';
import Login from './routes/Login';
import Signup from './routes/Signup';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      <Route path="plan-new-trip" element={<PlanNewTrip />} />
      <Route path="view-old-trips" element={<ViewOldTrips />} />
      <Route path="login" element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
    </>
  )
);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
