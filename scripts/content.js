(async () => {
  try {
    const waitForTextarea = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const textarea = document.getElementById("composer-background");
          if (textarea) {
            clearInterval(interval);
            resolve(textarea);
          }
        }, 1000);
      });
    };

    const addAlignButton = (textareaMenu) => {
      if (document.getElementById("align-icon-btn")) return; // אם הכפתור כבר קיים, לא להוסיף שוב

      const alignRightText = chrome.i18n.getMessage("alignRight");
      const alignLeftText = chrome.i18n.getMessage("alignLeft");

      const formatAlignRight = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4">
      <path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/>
      </svg>`;

      const formatAlignLeft = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#b4b4b4">
      <path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/>
      </svg>`;

      const alignIconBtn = document.createElement("div");
      alignIconBtn.id = "align-icon-btn"; // כדי למנוע כפילויות
      alignIconBtn.innerHTML = formatAlignRight;
      alignIconBtn.style.display = "flex";
      alignIconBtn.style.alignItems = "center";
      alignIconBtn.style.justifyContent = "center";
      alignIconBtn.style.cursor = "pointer";
      alignIconBtn.style.border = "solid 1px #b4b4b450";
      alignIconBtn.style.borderRadius = "50%";
      alignIconBtn.style.backgroundColor = "transparent";
      alignIconBtn.style.paddingInline = "10px";
      alignIconBtn.style.marginRight = "10px";
      alignIconBtn.setAttribute("data-state", "left");
      alignIconBtn.setAttribute("title", alignRightText);
      textareaMenu.appendChild(alignIconBtn);

      alignIconBtn.addEventListener("mouseover", () => {
        alignIconBtn.style.backgroundColor = "#424242";
      });

      alignIconBtn.addEventListener("mouseout", () => {
        alignIconBtn.style.backgroundColor = "transparent";
      });

      alignIconBtn.addEventListener("click", () => {
        const promptTextarea = document.getElementById("prompt-textarea");
        if (alignIconBtn.getAttribute("data-state") === "left") {
          alignIconBtn.setAttribute("data-state", "right");
          alignIconBtn.setAttribute("title", alignLeftText);
          alignIconBtn.innerHTML = formatAlignLeft;
          promptTextarea.style.direction = "rtl";
          promptTextarea.style.textAlign = "right";
        } else {
          alignIconBtn.setAttribute("data-state", "left");
          alignIconBtn.setAttribute("title", alignRightText);
          alignIconBtn.innerHTML = formatAlignRight;
          promptTextarea.style.direction = "ltr";
          promptTextarea.style.textAlign = "left";
        }
      });
    };

    // חכה שה- textarea יטען
    const textarea = await waitForTextarea();
    const textareaMenu = textarea.querySelector(
      ".justify-between .text-token-text-primary"
    );

    // הוסף את הכפתור בפעם הראשונה
    addAlignButton(textareaMenu);

    // התחלת מעקב על שינויים בדף כדי להוסיף את הכפתור מחדש אם הדף מתרענן
    const observer = new MutationObserver(() => {
      const updatedMenu = textarea.querySelector(
        ".justify-between .text-token-text-primary"
      );
      if (updatedMenu) addAlignButton(updatedMenu);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error("Error in main.js:", error);
  }
})();

(function () {
  function applyLTRStyleToKaTeX() {
    const katexElements = document.querySelectorAll(".katex");
    katexElements.forEach((el) => {
      el.style.direction = "ltr";
      el.style.display = "inline-block"; // מבטיח שהשורה לא תישבר
      el.style.unicodeBidi = "isolate"; // מונע ערבוב של כיווני טקסט
    });
  }

  // החלת הסגנון על אלמנטים קיימים
  applyLTRStyleToKaTeX();

  // יצירת observer למעקב אחרי שינויים בדף
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // בודק אם זה אלמנט HTML
          if (node.matches?.(".katex")) {
            node.style.direction = "ltr";
            node.style.display = "inline-block";
            node.style.unicodeBidi = "isolate";
          }
          // אם האלמנט מכיל בתוכו משוואות
          node.querySelectorAll?.(".katex").forEach((el) => {
            el.style.direction = "ltr";
            el.style.display = "inline-block";
            el.style.unicodeBidi = "isolate";
          });
        }
      });
    });
  });

  // התחל להאזין לשינויים בדף
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
