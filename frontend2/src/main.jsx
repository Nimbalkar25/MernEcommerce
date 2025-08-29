import { StrictMode } from "react";
import ReactDOM from "react-dom"; // React 17 uses this
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";

import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const rootElement = document.getElementById("root");

const options = {
  timeout : 5000,
  position : positions.BOTTOM_CENTER,
  transition : transitions.SCALE,
}
ReactDOM.render(
  <Provider store={store}>
    <AlertProvider template = {AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </Provider>,
  rootElement
);
