import React, { useEffect, useState, useContext, useCallback } from "react";
import { MapContext } from "./mapContext";
import Block from "./Block";
import "./App.css";

const useForceUpdate = () => useState()[1];

export default () => {
  const updateState = useForceUpdate();

  const core = useContext(MapContext);

  const [best, setBest] = useState(0);

  const state = core.getMap();

  const action = useCallback((move) => {
    core[move]();
    updateState({});
  });

  const start = useCallback(() => {
    updateState({});
    core.restart();
  });

  useEffect(() => {
    core.addEventListener("success", () => {
      setBest(Math.max(best, core.score()));
      core.restart();
    });

    window.addEventListener("keydown", (e) => {
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
    <>
      <div>
        <button type="button" onClick={start}>
          START!
        </button>
        <span>score:{core.score()}</span>
        <span>best:{best}</span>
      </div>
      <div className="wrap">
        {state.map((row, index) => {
          return (
            <div key={String(index)}>
              {row.map((val, col) => {
                return <Block key={String(index * 4 + col)} val={val} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
