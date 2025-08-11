import { debugLog } from "../../utils/debugLogger";

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
  requestAnimationFrame(() => {
    setTimeout(() => {
      mathElement.style.setProperty("unicode-bidi", "plaintext");
      mathElement.style.setProperty("direction", "ltr");
      mathElement.style.setProperty("padding-inline-start", "5px");
      mathElement.style.setProperty("white-space", "nowrap");
    }, 100);
  });
}

// Store observers for cleanup
const observerMap = new WeakMap<HTMLElement, MutationObserver>();

export function applyRTLStyleToGptResponse(el: HTMLDivElement) {
  debugLog("Applying RTL style to GPT response", el);
  
  // Clean up any existing observer
  const existingObserver = observerMap.get(el);
  if (existingObserver) {
    existingObserver.disconnect();
    observerMap.delete(el);
  }

  el.style.setProperty("direction", "rtl");

  // Expressions to match math fractions within parentheses
  const mathFractionRegex = /\((\d+\/[a-zA-Z]+)\)/g;

  // Expressions to match negative numbers within parentheses
  const negativeNumberRegex = /(−|\-)\d+(\.\d+)?/g;

  const hasInnerTags = Array.from(el.childNodes).some(
    (node) => node.nodeType === Node.ELEMENT_NODE
  );

  if (!hasInnerTags) {
    let html = el.innerHTML;

    const replacedHtml = html
      .replace(
        mathFractionRegex,
        '<span style="direction:ltr; unicode-bidi:isolate">($1)</span>'
      )
      .replace(
        negativeNumberRegex,
        (match) =>
          `<span style="direction:ltr; unicode-bidi:isolate">${match}</span>`
      );
    if (html !== replacedHtml) {
      el.innerHTML = replacedHtml;
    }
    el.style.lineHeight = "2";
    el.style.marginBlock = "2px";
  } else {
    // Set the text direction for all dynamic paragraphs
    const mathElements = el.querySelectorAll(
      ".katex"
    ) as NodeListOf<HTMLElement>;
    if (mathElements.length > 0) {
      for (const mathElement of mathElements) {
        handleMathTextDirection(mathElement as HTMLDivElement);
      }
    }

    // Katex elements load in the DOM after the math elements are added
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const mathElements = el.querySelectorAll(
            ".katex, div.math.math-display"
          ) as NodeListOf<HTMLElement>;
          if (mathElements.length > 0) {
            for (const mathElement of mathElements) {
              handleMathTextDirection(mathElement as HTMLDivElement);
            }
          }
        }
      }
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
    });

    // Store the observer for later cleanup
    observerMap.set(el, observer);
  }
}

export function applyLTRStyleToGptResponse(gptResponseEl: HTMLDivElement) {
  debugLog("Applying LTR style to GPT response (resetting)", gptResponseEl);
  
  // Clean up any existing observer
  const existingObserver = observerMap.get(gptResponseEl);
  if (existingObserver) {
    existingObserver.disconnect();
    observerMap.delete(gptResponseEl);
  }

  // Reset the main element direction and styles
  gptResponseEl.style.removeProperty("direction");
  gptResponseEl.style.removeProperty("line-height");
  gptResponseEl.style.removeProperty("margin-block");

  // Reset ALL child elements that might have RTL styles applied
  const allChildElements = gptResponseEl.querySelectorAll("*") as NodeListOf<HTMLElement>;
  allChildElements.forEach((el) => {
    el.style.removeProperty("direction");
    el.style.removeProperty("line-height");
    el.style.removeProperty("margin-block");
    el.style.removeProperty("unicode-bidi");
    el.style.removeProperty("padding-inline-start");
    el.style.removeProperty("white-space");
  });

  // Reset unicode-bidi for elements that might have been modified
  const elementsContainingMath = gptResponseEl.querySelectorAll<HTMLElement>(
    "p.whitespace-pre-wrap.break-words, li.whitespace-normal.break-words, div.math.math-display, h3, h4"
  );

  elementsContainingMath.forEach((el) => {
    el.style.removeProperty("unicode-bidi");
  });

  // Remove any LTR isolation spans that were added for math expressions
  const isolatedSpans = gptResponseEl.querySelectorAll('span[style*="direction:ltr"][style*="unicode-bidi:isolate"]');
  isolatedSpans.forEach((span) => {
    const parent = span.parentNode;
    if (parent) {
      // Replace the span with its text content
      const textNode = document.createTextNode(span.textContent || '');
      parent.replaceChild(textNode, span);
      
      // Normalize the parent to merge adjacent text nodes
      parent.normalize();
    }
  });

  // Reset any math elements that were modified
  const mathElements = gptResponseEl.querySelectorAll(".katex, div.math.math-display") as NodeListOf<HTMLElement>;
  mathElements.forEach((mathElement) => {
    mathElement.style.removeProperty("unicode-bidi");
    mathElement.style.removeProperty("direction");
    mathElement.style.removeProperty("padding-inline-start");
    mathElement.style.removeProperty("white-space");
  });

  debugLog("Finished resetting LTR styles for all elements");
}
