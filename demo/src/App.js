import React, { useEffect, useState, useContext, useCallback } from "react";
import Button from "react-bootstrap/Button";
import { core, MapContext } from "./mapContext";
import Block from "./Block";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const useForceUpdate = () => useState()[1];

core.init();

export default React.memo(() => {
  const updateState = useForceUpdate();

  const state = useContext(MapContext);

  const action = useCallback(move => {
    core[move]();
    updateState({});
  });

  useEffect(() => {
    core.addEventListener("success", () => {
      alert(`YOU GOT ${core.score()}!`);
      core.restart();
    });

    window.addEventListener("keydown", e => {
      switch (e.keyCode) {
        case 37:
          action("leftMoving");
          break;
        case 38:
          action("topMoving");
          break;
        case 39:
          action("rightMoving");
          break;
        case 40:
          action("bottomMoving");
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div className="wrap">
      <Button variant="primary">Primary</Button>
      <span>{core.score()}</span>
      {/* {state.map((row, index) => {
        return (
          <div key={String(index)}>
            {row.map((val, col) => {
              return <Block key={String(index * 4 + col)} val={val} />;
            })}
          </div>
        );
      })} */}
    </div>
  );
});
