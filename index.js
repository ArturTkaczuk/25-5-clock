function App() {
  const [displayedTime, setDisplayedTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [breakOn, setBreakOn] = React.useState(false);
  const [breakSound, setBreakSound] = React.useState(
    new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-991.mp3"
    )
  );

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if ((breakTime <= 60 && amount < 0) || timerOn) return;
      setBreakTime((prev) => prev + amount);
    } else if (type === "session") {
      if ((sessionTime <= 60 && amount < 0) || timerOn) return;
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayedTime(sessionTime + amount);
      }
    }
  };

  const resetTime = () => {
    setDisplayedTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setTimerOn(false);
    setBreakOn(false);
    clearInterval(localStorage.getItem("interval-id"));
  };

  const playBreakSound = () => {
    breakSound.currentTime = 0;
    breakSound.play();
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVar = breakOn;
    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayedTime((prev) => {
            if (prev <= 0 && !onBreakVar) {
              playBreakSound();
              onBreakVar = true;
              setBreakOn(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVar) {
              playBreakSound();
              onBreakVar = false;
              setBreakOn(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  return (
    <div className="center-align">
      <h1>25 + 5 timer</h1>
      <div className="container">
        <TimeLength
          title={"Break Length"}
          changeTime={changeTime}
          type={"break"}
          time={breakTime}
          formatTime={formatTime}
        />
        <TimeLength
          title={"Session Length"}
          changeTime={changeTime}
          type={"session"}
          time={sessionTime}
          formatTime={formatTime}
        />
      </div>
      <div className={displayedTime < 60 ? "red-color" : null}>
        <h3>{breakOn ? "Break" : "Session"}</h3>
        <h1>{formatTime(displayedTime)}</h1>
        <button
          onClick={() => controlTime()}
          className="btn-large blue darken-1"
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button
          onClick={resetTime}
          className="btn-large blue darken-1 button-margin"
        >
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    </div>
  );
}

function TimeLength({ title, changeTime, type, time, formatTime }) {
  return (
    <div>
      <h2>{title}</h2>
      <div className="time">
        <button
          onClick={() => changeTime(-60, type)}
          className="btn blue darken-1"
        >
          <i className="material-icons">arrow_downward</i>
        </button>
        <h2>{formatTime(time)}</h2>
        <button
          onClick={() => changeTime(60, type)}
          className="btn blue darken-1"
        >
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
