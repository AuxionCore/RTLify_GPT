import handleGptResponseAlignment from "./gptResAlignment";
import handleUserPromptsAlignment from "./userPromptsAlignment";

export default function observeDocument() {
  // const documentObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((m) => {
  //     if (m.type === "childList") {
  //       m.addedNodes.forEach((node) => {
  //         if (node.nodeType === Node.ELEMENT_NODE) {
  //           const element = node as HTMLDivElement;

  //           // Check if the element has the data-test-render-count attribute
  //           checkForRenderCount(element);

  //           if (element.hasAttribute("data-test-render-count")) {
  //             // If it has the attribute, we need to wait for the streaming element
  //             waitForStreamingElement(
  //               element,
  //               (streamingElement) => {
  //                 const isStreaming =
  //                   streamingElement.getAttribute("data-is-streaming");

  //                 if (isStreaming === "false") {
  //                   waitForChildContent(streamingElement, async () => {
  //                     await handleGptResponseAlignment(
  //                       streamingElement as HTMLDivElement
  //                     );
  //                   });
  //                 } else {
  //                   const streamingObserver = new MutationObserver(
  //                     (attrMutations) => {
  //                       attrMutations.forEach((attrMutation) => {
  //                         if (
  //                           attrMutation.type === "attributes" &&
  //                           attrMutation.attributeName === "data-is-streaming"
  //                         ) {
  //                           const target =
  //                             attrMutation.target as HTMLDivElement;
  //                           const newValue =
  //                             target.getAttribute("data-is-streaming");
  //                           if (newValue === "false") {
  //                             streamingObserver.disconnect();

  //                             waitForChildContent(target, async () => {
  //                               await handleGptResponseAlignment(target);
  //                             });
  //                           }
  //                         }
  //                       });
  //                     }
  //                   );

  //                   streamingObserver.observe(streamingElement, {
  //                     attributes: true,
  //                     attributeFilter: ["data-is-streaming"],
  //                   });
  //                 }
  //               },
  //               async () => {
  //                 await handleUserPromptsAlignment(element);
  //               }
  //             );
  //           }
  //         }
  //       });
  //     } else if (
  //       m.type === "attributes" &&
  //       m.attributeName === "data-test-render-count"
  //     ) {
  //       checkForRenderCount(m.target as HTMLDivElement);
  //     }
  //   });
  // });

  const documentObserver = new MutationObserver(handleMutations);

  // Main mutation handler
  function handleMutations(mutations: MutationRecord[]) {
    mutations.forEach(handleMutation);
  }

  // Handle a single mutation
  function handleMutation(m: MutationRecord) {
    if (m.type === "childList") {
      m.addedNodes.forEach(handleAddedNode);
    } else if (
      m.type === "attributes" &&
      m.attributeName === "data-test-render-count"
    ) {
      checkForRenderCount(m.target as HTMLDivElement);
    }
  }

  // Handle newly added nodes
  function handleAddedNode(node: Node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLDivElement;

    // Check for render count attribute
    checkForRenderCount(element);

    if (!element.hasAttribute("data-test-render-count")) return;

    // Wait for the streaming element related to this node
    waitForStreamingElement(element, handleStreamingElementReady, () =>
      handleUserPromptsAlignment(element)
    );
  }

  // Called when streaming element is ready
  function handleStreamingElementReady(streamingElement: Element) {
    const isStreaming = streamingElement.getAttribute("data-is-streaming");

    if (isStreaming === "false") {
      // TODO: it seems that this is not needed anymore, since we have startStreamingWatcher function
      // waitForChildContent(streamingElement as HTMLElement, async () => {
      //   await handleGptResponseAlignment(streamingElement as HTMLDivElement);
      // });
    } else {
      // Observe until data-is-streaming changes to false
      const streamingObserver = new MutationObserver(
        handleStreamingAttributeChange
      );
      streamingObserver.observe(streamingElement, {
        attributes: true,
        attributeFilter: ["data-is-streaming"],
      });

      function handleStreamingAttributeChange(attrMutations: MutationRecord[]) {
        attrMutations.forEach((attrMutation) => {
          if (
            attrMutation.type === "attributes" &&
            attrMutation.attributeName === "data-is-streaming"
          ) {
            const target = attrMutation.target as HTMLDivElement;
            const newValue = target.getAttribute("data-is-streaming");

            if (newValue === "false") {
              streamingObserver.disconnect();

              // Wait for full content before aligning
              waitForChildContent(target, async () => {
                console.log("Streaming Element finished B:", target);
                // await handleGptResponseAlignment(target);
              });
            }
          }
        });
      }
    }
  }

  documentObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-test-render-count"],
  });

  // Check if the element has the data-test-render-count attribute
  function checkForRenderCount(el: HTMLDivElement) {
    if (el.hasAttribute("data-test-render-count")) {
      startStreamingWatcher(el);
      return;
    }

    const child = el.querySelector<HTMLDivElement>("[data-test-render-count]");
    if (child) {
      startStreamingWatcher(child);
    }
  }

  function startStreamingWatcher(element: HTMLDivElement) {
    waitForStreamingElement(
      element,
      (streamingElement) => {
        const isStreaming = streamingElement.getAttribute("data-is-streaming");
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
                    console.log("Streaming Element finished D:", target);
                    // await handleGptResponseAlignment(target);
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
      async () => {
        await handleUserPromptsAlignment(element);
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
