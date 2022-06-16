
import React from "react";
import ReactDOM from "react-dom";
// react library for routing
import { BrowserRouter, Route, Switch } from "react-router-dom";

// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
// core styles
import "assets/scss/argon-dashboard-pro-react.scss?v1.2.0";

import "antd/dist/antd.css";
import "./index.css"
// import AdminLayout from "layouts/Admin.js";
// import RTLLayout from "layouts/RTL.js";
// import AuthLayout from "layouts/Auth.js";
// import IndexView from "views/Index.js";
import Login from "views/pages/Login/Login";
import AdminRoutes from "AdminRoutes";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import 'react-html5-camera-photo/build/css/index.css';
import 'dotenv/config';
let persistor = persistStore(store);
ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Switch>
          <Route path="/login" render={(props) => <Login {...props} />} />
          <AdminRoutes />
        </Switch>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
