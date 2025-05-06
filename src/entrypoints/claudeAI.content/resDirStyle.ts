function wrapMathExpressions(root: HTMLElement): void {
  const walker: TreeWalker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null
  );

  const mathRegex: RegExp = /\((\d+\/[a-zA-Z]+)\)/g;

  let currentNode: Node | null;
  while ((currentNode = walker.nextNode())) {
    const textNode = currentNode as Text;
    const originalText = textNode.nodeValue;

    if (originalText && mathRegex.test(originalText)) {
      const span: HTMLSpanElement = document.createElement("span");
      span.innerHTML = originalText.replace(
        mathRegex,
        `<span style="direction:ltr; unicode-bidi:isolate">($1)</span>`
      );

      const parent = textNode.parentNode;
      if (parent) {
        parent.replaceChild(span, textNode);
      }
    }
  }
}

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

  // An example of a math expression: (1/cos)
  const mathRegex = /\((\d+\/[a-zA-Z]+)\)/g;

  for (const el of elementsContainingMath) {
    console.log("Math element found:", el);
    const html = el.innerHTML;

  if (mathRegex.test(html)) {
    el.innerHTML = html.replace(
      mathRegex,
      '<span style="direction:ltr; unicode-bidi:isolate">($1)</span>'
    );

    el.style.lineHeight = "2";
    el.style.marginBlock = "2px";
  }
  };

  // Set the text direction for all dynamic paragraphs
  for (const el of elementsContainingMath) {
    const mathElements = el.querySelectorAll(
      ".katex"
    ) as NodeListOf<HTMLElement>;
    if (mathElements.length > 0) {
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
