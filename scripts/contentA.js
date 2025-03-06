(function () {
  function applyLTRStyleToKaTeX() {
    const katexElements = document.querySelectorAll(".katex");
    katexElements.forEach((el) => {
      el.style.direction = "ltr";
      el.style.display = "inline-block"; // Make sure the element doesn't take the full width
      el.style.unicodeBidi = "isolate"; // Prevent the element from inheriting the parent's direction
    });
  }

  applyLTRStyleToKaTeX();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.matches?.(".katex")) {
            node.style.direction = "ltr";
            node.style.display = "inline-block";
            node.style.unicodeBidi = "isolate";
          }

          node.querySelectorAll?.(".katex").forEach((el) => {
            el.style.direction = "ltr";
            el.style.display = "inline-block";
            el.style.unicodeBidi = "isolate";
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
