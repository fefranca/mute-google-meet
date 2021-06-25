// Verify if this meeting is active and the status of the mute button
var active = false;
var muted = false;

var buttons = document.getElementsByTagName("button");
for (var elem of buttons) {
  if (elem.hasAttribute("data-is-muted")) {
    active = true;
    if (elem.getAttribute("data-is-muted") === "true") {
      muted = true;
    }
    // Note: video button also has data-is-muted attribute
    break;
  }
}

[active, muted]
