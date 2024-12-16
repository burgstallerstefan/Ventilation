let IN_VENT = 1;
let IN_LIGHT = 0;
let OUT_VENT = 0;
let OUT_LIGHT = 1;
let TEN_MINUTES = 10 * 60 * 1000;
let timerId = null;

function runVent() {
  print("runOutOutput1: Turning on OUTPUT1 for 10 minutes");
  Shelly.call("Switch.Set", { id: OUT_VENT, on: true });

  if (timerId !== null) {
    Timer.clear(timerId);
  }

  timerId = Timer.set(TEN_MINUTES, false, function() {
    print("OUT_VENT False");
    Shelly.call("Switch.Set", { id: OUT_VENT, on: false });
    timerId = null;
  });
}

function setLight(){
  Shelly.call("Switch.Set", { id: OUT_LIGHT, on: true });
  print("OUT_LIGHT True");
}
function resetLight(){
  Shelly.call("Switch.Set", { id: OUT_LIGHT, on: false });
  print("OUT_LIGHT False");
}

// Event handler
Shelly.addEventHandler(function(event, user_data) {
  if (event.component === "input:" + IN_VENT) {
    print("Event handler for IN_VENT: state = " + event.info.state);
    if (event.info.state === false) {
      runVent();
    }
  }
  
  if (event.component === "input:" + IN_LIGHT) {
    print("Event handler for IN_LIGHT: state = " + event.info.state);
    if (event.info.state === false) {
      setLight();
    }
    if (event.info.state === true) {
      resetLight();
      runVent();
    }
  }
}, null);
