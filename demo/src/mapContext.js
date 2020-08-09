import Core from "2048-core";
import React from "react";

const core = new Core();
core.init();

const MapContext = React.createContext(core);

export { core, MapContext };
