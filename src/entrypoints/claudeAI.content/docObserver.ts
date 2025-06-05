import handleGptResponseAlignment from "./gptResAlignment";
import handleUserPromptsAlignment from "./userPromptsAlignment";

export default function observeDocument() {
  console.log("Observing document for changes...");
  const documentObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.type === "childList") {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLDivElement;
            checkForRenderCount(element);
            // if (element.hasAttribute("data-test-render-count")) {
            //   console.log("Found a new element:", element);
            //   waitForStreamingElement(
            //     element,
            //     (streamingElement) => {
            //       const isStreaming =
            //         streamingElement.getAttribute("data-is-streaming");

            //       if (isStreaming === "false") {
            //         waitForChildContent(streamingElement, async () => {
            //           await handleGptResponseAlignment(
            //             streamingElement as HTMLDivElement
            //           );
            //         });
            //       } else {
            //         const streamingObserver = new MutationObserver(
            //           (attrMutations) => {
            //             console.log(
            //               "Streaming attribute changed:",
            //               attrMutations
            //             );
            //             attrMutations.forEach((attrMutation) => {
            //               if (
            //                 attrMutation.type === "attributes" &&
            //                 attrMutation.attributeName === "data-is-streaming"
            //               ) {
            //                 const target =
            //                   attrMutation.target as HTMLDivElement;
            //                 const newValue =
            //                   target.getAttribute("data-is-streaming");
            //                 console.log("New value:", newValue);

            //                 if (newValue === "false") {
            //                   console.log(
            //                     "Streaming ended, handling alignment..."
            //                   );
            //                   streamingObserver.disconnect();

            //                   waitForChildContent(target, async () => {
            //                     await handleGptResponseAlignment(target);
            //                   });
            //                 }
            //               }
            //             });
            //           }
            //         );

            //         streamingObserver.observe(streamingElement, {
            //           attributes: true,
            //           attributeFilter: ["data-is-streaming"],
            //         });
            //       }
            //     },
            //     () => {
            //       handleUserPromptsAlignment(element);
            //     }
            //   );
            // }
          }
        });
      } else if (
        m.type === "attributes" &&
        m.attributeName === "data-test-render-count"
      ) {
        // ברגע שהתכונה מתווספת
        checkForRenderCount(m.target as HTMLDivElement);
      }
    });
  });

  documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-test-render-count"],
  });

  // Check if the element has the data-test-render-count attribute
  function checkForRenderCount(el: HTMLDivElement) {
    if (el.hasAttribute("data-test-render-count")) {
      console.log("Found a new element:", el);
      startStreamingWatcher(el);
      return;
    }

    const child = el.querySelector<HTMLDivElement>("[data-test-render-count]");
    if (child) {
      console.log("Found a new element (in children):", child);
      startStreamingWatcher(child);
    }
  }

  function startStreamingWatcher(element: HTMLDivElement) {
    waitForStreamingElement(
      element,
      (streamingElement) => {
        const isStreaming = streamingElement.getAttribute("data-is-streaming");
        console.log("Streaming element found:", isStreaming);
        if (isStreaming === "false") {
          waitForChildContent(streamingElement, async () => {
            await handleGptResponseAlignment(
              streamingElement as HTMLDivElement
            );
          });
        } else {
          const streamingObserver = new MutationObserver((mutations) => {
            mutations.forEach((mut) => {
              if (
                mut.type === "attributes" &&
                mut.attributeName === "data-is-streaming"
              ) {
                const target = mut.target as HTMLDivElement;
                const newVal = target.getAttribute("data-is-streaming");
                if (newVal === "false") {
                  streamingObserver.disconnect();
                  waitForChildContent(target, async () => {
                    await handleGptResponseAlignment(target);
                  });
                }
              }
            });
          });
          streamingObserver.observe(streamingElement, {
            attributes: true,
            attributeFilter: ["data-is-streaming"],
          });
        }
      },
      () => {
        handleUserPromptsAlignment(element);
      }
    );
  }

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
