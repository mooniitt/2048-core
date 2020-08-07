import React from "react";
import "./Block.css";
export default React.memo(({ val }) => {
  return <span className="block">{val}</span>;
});
