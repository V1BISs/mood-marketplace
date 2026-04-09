import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { initializeData } from "@/shared/lib/initData";
import { store } from "@/app/store";
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import "./shared/styles/variables.css";
import "./index.css";
import App from "./App";

initializeData().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
  );
});