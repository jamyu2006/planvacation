import { createBrowserRouter, RouterProvider,createRoutesFromElements, Route } from 'react-router-dom'
import Root from './routes/root';
import Page from './routes/page';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      <Route path="/:index" element={<Page />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App