// Iterate through Google Meet tabs, fetch status
async function updateStatus() {
  var activeCount = 0;
  var muted = false;
  var activeTab = null
  var tabs = await chrome.tabs.query({ url: "https://meet.google.com/*" });

  // Use getTabStatus script for each Google Meet tab
  const meetTabStatuses = tabs.map(async function (tab) {
    let injectionResults = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['getTabStatus.js'],
    });
    if (injectionResults[0].result[0]) {
      activeCount++;
      activeTab = tab;
      muted = injectionResults[0].result[1];
    }
  });
  await Promise.all(meetTabStatuses);

  // Should display status only if a single Google Meet instance is active
  if (activeCount == 1) {
    badgeText = "";
    badgeTitle = muted ? "unmute Google Meet" : "mute Google Meet";
    badgeIcon = muted ? "icon128_muted.png" : "icon128_active.png";
    activeTab = activeTab;
  }
  else {
    badgeText = (activeCount >= 2) ? "Error" : "";
    badgeTitle = (activeCount >= 2) ? "Multiple active Google Meet tabs" : "No active Google Meet tabs";
    badgeIcon = "icon128.png";
  }

  chrome.action.setBadgeText({ text: badgeText });
  chrome.action.setTitle({ title: badgeTitle })
  chrome.action.setIcon({ path: "images/" + badgeIcon })

  return (activeCount == 1) ? activeTab.id : null;
}

// Inject keypress for toggling mute in active Google Meet tab
async function sendKeypress(tab) {
  var activeTabID = await updateStatus();
  if (activeTabID != null) {
    await chrome.scripting.executeScript(
      {
        target: { tabId: activeTabID },
        files: ['dispatchKey.js'],
      }
    );
  }
}

// Extension icon clicked
chrome.action.onClicked.addListener(async function (tab) {
  await sendKeypress();
  updateStatus();
});

// Runs after a tab has been loaded or its audible state changed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete" || changeInfo.hasOwnProperty("audible")) {
    updateStatus();
  }
});

// Any tab has been removed
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  updateStatus();
});

// Prevent showing incorrect state on page suspend
chrome.runtime.onSuspend.addListener(function () {
  chrome.action.setIcon({ path: "images/icon128.png" });
  chrome.action.setBadgeText({ text: "" });
})

// Update status on load
updateStatus();
