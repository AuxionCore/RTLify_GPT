(async function () {
  console.log("[claude] Claude AI: Injecting textAlignment script");

  chrome.runtime.sendMessage({
    action: "runScript",
    script: "documentObserver",
  });

  chrome.runtime.sendMessage({
    action: "runScript",
    script: "loadedElements",
  });
})();
