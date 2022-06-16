import React from "react";
import "./Loader.css";
import { Spinner } from "reactstrap";

function Loader() {
  return (
    <div className="Loader">
      <Spinner color="dark" size="">
        Loading...
      </Spinner>
      {/* <div class="container">
        <div class="item item-1"></div>
        <div class="item item-2"></div>
        <div class="item item-3"></div>
        <div class="item item-4"></div>
      </div> */}
    </div>
  );
}

export default Loader;
