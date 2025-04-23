

function handleMathTextDirection(mathElement: HTMLElement) {
  mathElement.style.setProperty("unicode-bidi", "plaintext");
  mathElement.style.setProperty("direction", "ltr");
  mathElement.style.setProperty("padding-inline-start", "5px");
  mathElement.style.setProperty("white-space", "nowrap");
}

export function applyRTLStyleToGptResponse(gptResponseEl: HTMLDivElement) {
  gptResponseEl.style.setProperty("direction", "rtl");

  // Set the text direction for math content elements
  const elementsContainingMath = gptResponseEl.querySelectorAll<HTMLElement>(
    "p.whitespace-pre-wrap.break-words, li.whitespace-normal.break-words, div.math.math-display, h3, h4"
  );

  elementsContainingMath.forEach((el) => {
    el.style.setProperty("unicode-bidi", "plaintext");
    el.style.lineHeight = "2";
    el.style.marginBlock = "2px";
  });

  // Set the text direction for all dynamic paragraphs
  for (const el of elementsContainingMath) {
    const mathElements = el.querySelectorAll(
      ".katex"
    ) as NodeListOf<HTMLElement>;
    if (mathElements.length > 0) {
      console.log("Static math elements found:", mathElements);
      for (const mathElement of mathElements) {
        handleMathTextDirection(mathElement as HTMLDivElement);
      }
    }

    // Katex elements lode in the DOM after the math elements are added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const mathElements = el.querySelectorAll(
            ".katex"
          ) as NodeListOf<HTMLElement>;
          if (mathElements.length > 0) {
            for (const mathElement of mathElements) {
              handleMathTextDirection(mathElement as HTMLDivElement);
            }
            // observer.disconnect(); // Stop observing once the math elements are found
          }
        }
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const mathElements = node.matches?.("div.math.math-display")
          ? [node]
          : Array.from(node.querySelectorAll("div.math.math-display"));

        for (const el of mathElements) {
          console.log("Math element added:", el);
          handleMathTextDirection(el as HTMLDivElement);
        }
      }
    }
  });

  observer.observe(gptResponseEl, {
    childList: true,
    subtree: true,
  });
}

export function applyLTRStyleToGptResponse(gptResponseEl: HTMLDivElement) {
  gptResponseEl.style.setProperty("direction", "ltr");

  const elementsContainingMath = gptResponseEl.querySelectorAll<HTMLElement>(
    "p.whitespace-pre-wrap.break-words, li.whitespace-normal.break-words, div.math.math-display, h3, h4"
  );

  elementsContainingMath.forEach((el) => {
    el.style.setProperty("unicode-bidi", "initial");
  });
}