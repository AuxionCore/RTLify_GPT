import handleGptResponseAlignment from "./gptResAlignment";
import handleUserPromptsAlignment from "./userPromptsAlignment";

export default function observeDocument() {
  const documentObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLDivElement;

          if (element.hasAttribute("data-test-render-count")) {
            console.log(
              "[observer] MutationObserver detected a new message",
              element
            );
            waitForStreamingElement(
              element,
              (streamingElement) => {
                const isStreaming =
                  streamingElement.getAttribute("data-is-streaming");
                console.log(
                  "[observer] Found streaming element. Streaming:",
                  isStreaming
                );

                if (isStreaming === "false") {
                  console.log(
                    "[observer] Already finished streaming. Waiting for content..."
                  );
                  waitForChildContent(streamingElement, async () => {
                    console.log(
                      "[childContentObserver] Content loaded. Aligning..."
                    );
                    await handleGptResponseAlignment(
                      streamingElement as HTMLDivElement
                    );
                  });
                } else {
                  const streamingObserver = new MutationObserver(
                    (attrMutations) => {
                      attrMutations.forEach((attrMutation) => {
                        if (
                          attrMutation.type === "attributes" &&
                          attrMutation.attributeName === "data-is-streaming"
                        ) {
                          const target = attrMutation.target as HTMLDivElement;
                          const newValue =
                            target.getAttribute("data-is-streaming");
                          console.log(
                            "[streamingObserver] data-is-streaming changed to:",
                            newValue
                          );

                          if (newValue === "false") {
                            console.log(
                              "[streamingObserver] Streaming finished. Waiting for content..."
                            );
                            streamingObserver.disconnect();

                            waitForChildContent(target, async () => {
                              console.log(
                                "[childContentObserver] Content loaded. Aligning..."
                              );
                              await handleGptResponseAlignment(target);
                            });
                          }
                        }
                      });
                    }
                  );

                  streamingObserver.observe(streamingElement, {
                    attributes: true,
                    attributeFilter: ["data-is-streaming"],
                  });
                }
              },
              () => {
                // fallback אם בכלל לא נוסף streamingElement
                console.log(
                  "[observer] No streaming element found. Handling user prompt instead."
                );
                handleUserPromptsAlignment(element);
              }
            );
          }
        }
      });
    });
  });

  documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // Wait for the streaming element to be added to the DOM
  function waitForStreamingElement(
    container: HTMLElement,
    callback: (el: HTMLElement) => void,
    onTimeout?: () => void
  ) {
    const existing = container.querySelector(
      "[data-is-streaming]"
    ) as HTMLElement;
    if (existing) {
      callback(existing);
      return;
    }

    // A timeout to handle the case where it doesn't appear
    const timeout = setTimeout(() => {
      observer.disconnect();
      onTimeout?.();
    }, 5000); // 5 seconds timeout

    const observer = new MutationObserver(() => {
      const el = container.querySelector(
        "[data-is-streaming]"
      ) as HTMLDivElement;
      if (el) {
        clearTimeout(timeout);
        observer.disconnect();
        callback(el);
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });
  }

  function waitForChildContent(target: HTMLElement, callback: () => void) {
    if (target.childNodes.length > 0) {
      callback();
      return;
    }

    const childObserver = new MutationObserver(() => {
      if (target.childNodes.length > 0) {
        childObserver.disconnect();
        callback();
      }
    });

    childObserver.observe(target, {
      childList: true,
      subtree: false,
    });
  }
}
