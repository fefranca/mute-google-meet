// Dispatch Cmd + D (metaKey) for Mac OS or Ctrl + D (ctrlKey) otherwise
var macOS = (navigator.userAgent.indexOf("Mac") != -1);

document.dispatchEvent(
  new KeyboardEvent("keydown", {
    metaKey: macOS,
    ctrlKey: !macOS,
    bubbles: true,
    cancelable: true,
    keyCode: 68,
    code: "KeyD"
  })
);
