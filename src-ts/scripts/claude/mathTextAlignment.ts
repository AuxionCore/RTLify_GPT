(async function () {
  function handleMathTextDirection(root: HTMLElement | Document = document) {
    const mathSelectors = [".katex"];
    const mainParagraphSelector = "p.whitespace-pre-wrap.break-words";

    const mathElements = root.querySelectorAll<HTMLElement>(
      mathSelectors.join(", ")
    );

    const mainParagraphs = root.querySelectorAll<HTMLElement>(
      mainParagraphSelector
    );

    mainParagraphs.forEach((el) => {
      el.style.lineHeight = "2.3";
      el.style.marginBlock = "5px";
    });

    mathElements.forEach((el) => {
      el.style.direction = "ltr";
      el.style.unicodeBidi = "isolate";
      el.style.paddingInlineStart = "5px";
      el.style.whiteSpace = "nowrap";
    });
  }

  function observeMathElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const containsMath = node.querySelector(
            ".katex, p.whitespace-pre-wrap.break-words"
          );
          if (containsMath) {
            handleMathTextDirection(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    handleMathTextDirection();
  }

  // Start observing for new elements
  observeMathElements();
})();
