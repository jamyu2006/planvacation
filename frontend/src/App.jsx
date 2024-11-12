import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import Root from './routes/root';
import PlanNewTrip from './routes/PlanNewTrip';
import Login from './routes/Login';
import Signup from './routes/Signup';
import HomePage from './routes/HomePage';
import "./Styles.css"


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      <Route path="plan-new-trip" element={<PlanNewTrip />} />
      <Route path="login" element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/>
      <Route path="home" element={<HomePage/>}/>
    </>
  )
);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
