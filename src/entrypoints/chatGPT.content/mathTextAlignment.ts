export default function mathTextAlignment() {
  const katexStyle = {
    direction: "ltr",
    display: "inline-block",
    unicodeBidi: "isolate",
  };

  function applyKaTeXStyles(el: HTMLElement) {
    el.style.direction = katexStyle.direction;
    el.style.display = katexStyle.display;
    el.style.unicodeBidi = katexStyle.unicodeBidi;
  }

  function applyLTRStyleToKaTeX() {
    const katexElements = document.querySelectorAll(".katex");
    katexElements.forEach((el) => applyKaTeXStyles(el as HTMLElement));
  }

  // Apply styles on initial load
  applyLTRStyleToKaTeX();

  // Observer to apply styles to newly added KaTeX elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Apply styles to the node itself if it's a KaTeX element
          if ((node as Element).matches?.(".katex")) {
            applyKaTeXStyles(node as HTMLElement);
          }

          // Apply styles to all child KaTeX elements
          (node as Element).querySelectorAll?.(".katex").forEach((el) => {
            applyKaTeXStyles(el as HTMLElement);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
