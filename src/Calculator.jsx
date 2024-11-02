/* eslint-disable react/prop-types */
import { memo, useEffect, useReducer } from "react";
// eslint-disable-next-line no-unused-vars
import clickSound from "./ClickSound.mp3";
// import clickSound from "./music.mp3";

function reducer(state, action) {
  switch (action.type) {
    case "setNumbers":
      return {
        ...state,
        number: action.payload,
        duration: +(
          (state.number * state.sets * state.speed) / 60 +
          (state.sets - 1) * state.durationBreak
        ),
      };
    case "setSets":
      return {
        ...state,
        sets: action.payload,
      };
    case "setDuration":
      return {
        ...state,
        duration: +(
          (state.number * state.sets * state.speed) / 60 +
          (state.sets - 1) * state.durationBreak
        ),
      };
    case "increaseDuration":
      return {
        ...state,
        duration: +(Math.floor(state.duration) + 1),
      };
    case "decreaseDuration":
      return {
        ...state,
        duration: state.duration > 0 ? Math.ceil(state.duration) - 1 : 0,
      };
    case "setSpeed":
      return {
        ...state,
        speed: action.payload,
      };
    case "setDurationBreak":
      return {
        ...state,
        durationBreak: action.payload,
      };
    default:
      throw new Error("unkown action type");
  }
}

function Calculator({ workouts, allowSound }) {
  // // USESTATE VERSION
  // const [number, setNumber] = useState(workouts.at(0).numExercises);
  // const [sets, setSets] = useState(3);
  // const [speed, setSpeed] = useState(90);
  // const [durationBreak, setDurationBreak] = useState(5);
  // const [duration, setDuration] = useState(0);

  // const playSound = useCallback(
  //   function () {
  //     if (!allowSound) return;
  //     const sound = new Audio(clickSound);
  //     sound.play();
  //   },
  //   [allowSound, state.duration]
  // );

  const [state, dispatch] = useReducer(reducer, {
    number: workouts.at(0).numExercises,
    sets: 3,
    speed: 90,
    durationBreak: 5,
    duration: 0,
  });

  useEffect(
    function () {
      document.title = `Your ${state.number}-excercises workout`;
    },
    [state.number]
  );

  useEffect(
    function () {
      dispatch({ type: "setDuration" });
    },
    [
      state.speed,
      state.number,
      state.sets,
      state.speed,
      state.sets,
      state.durationBreak,
    ]
  );

  useEffect(
    function () {
      const playSound = function () {
        if (!allowSound) return;
        const sound = new Audio(clickSound);
        sound.play();
      };
      playSound();
    },
    [allowSound, state.duration]
  );

  // useEffect(
  //   function () {
  //     setDuration(
  //       () => (number * sets * speed) / 60 + (sets - 1) * durationBreak
  //     );
  //   },
  //   [number, sets, speed, durationBreak]
  // );

  // const mins = Math.floor(state.duration);
  // const seconds = +state.duration - mins * 60;
  // // );

  const mins = Math.floor(state.duration);
  const seconds = (+state.duration - mins) * 60;
  console.log(mins, seconds);

  console.log("Duration");
  console.log(state.duration);

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select
            value={state.number}
            onChange={(e) => {
              dispatch({ type: "setNumbers", payload: +e.target.value });
            }}
          >
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={state.sets}
            onChange={(e) => {
              dispatch({ type: "setSets", payload: e.target.value });
            }}
          />
          <span>{state.sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={state.speed}
            onChange={(e) => {
              dispatch({ type: "setSpeed", payload: e.target.value });
            }}
          />
          <span>{state.speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={state.durationBreak}
            onChange={(e) => {
              dispatch({
                type: "setDurationBreak",
                payload: e.target.value,
              });
            }}
          />
          <span>{state.durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button
          onClick={() => {
            dispatch({
              type: "decreaseDuration",
              payload: 1,
            });
          }}
        >
          –
        </button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button
          onClick={() => {
            dispatch({
              type: "increaseDuration",
              action: 1,
            });
          }}
        >
          +
        </button>
      </section>
    </>
  );
}

export default memo(Calculator);
