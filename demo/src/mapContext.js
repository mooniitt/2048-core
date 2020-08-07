import Core from "2048-core";
import React, { Children } from "react";

const core = new Core();
const MapContext = React.createContext();

export { core, MapContext };
