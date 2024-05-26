import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Map from './pages/Map';
import AppUpdate, { mapLoader } from './AppUpdate';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/weather/:lat/:lon",
    element: <AppUpdate />,
    loader: mapLoader
  },
  {
    path: "/map",
    element: <Map />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();