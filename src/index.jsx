import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./App.css";
import Home from "./Home";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board" element={<App />}>
        <Route path=":playerID" element={<App/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
