import { codeData } from "./data.js";

const closureClampCalculator = (() => {
  const inputs = document.querySelectorAll(".input");
  const resCode = document.querySelector(".calculator__result__code");
  const resCodeEx = document.querySelector(".calculator__result__example");
  const minFontInput = document.querySelector('[name="minFont"');
  const maxFontInput = document.querySelector('[name="maxFont"');
  const minVpInput = document.querySelector('[name="minVp"');
  const maxVpInput = document.querySelector('[name="maxVp"');
  const fontUnitBtns = document.querySelectorAll("input[name='font-unit']");
  const vpUnitBtns = document.querySelectorAll("input[name='vp-unit']");
  let isFontUnitPx = true;
  let isVpUnitPx = true;
  const baseInputFont = document.querySelector("#base-font");
  const baseInputVp = document.querySelector("#base-vp");
  let baseFont = 16; // px
  let baseVp = 16; // px

  let minFont = 1; // rem
  let maxFont = 2.5; // rem
  let minVp = 37.5; // rem
  let maxVp = 90; // rem

  const scaleCheckbox = document.querySelector("[name='allow-scale'");
  let isTextScaling = false;

  inputs.forEach((input) => {
    input.addEventListener("keyup", (e) => {
      calculateClamp();
      modifyExampleText();
    });
  });

  const calculateClamp = () => {
    minFont = Number(document.querySelector('[name="minFont"').value);
    maxFont = Number(document.querySelector('[name="maxFont"').value);
    minVp = Number(document.querySelector('[name="minVp"').value);
    maxVp = Number(document.querySelector('[name="maxVp"').value);

    if (isFontUnitPx) {
      minFont /= baseFont;
      maxFont /= baseFont;
    }
    if (isVpUnitPx) {
      minVp /= baseVp;
      maxVp /= baseVp;
    }

    // y = mx + q
    let m = (maxFont - minFont) / (maxVp - minVp);
    let q = -minVp * m + minFont;

    m = parseFloat((m * 100).toFixed(3));
    q = parseFloat(q.toFixed(3));
    minFont = parseFloat(minFont.toFixed(3));
    maxFont = parseFloat(maxFont.toFixed(3));
    minVp = parseFloat(minVp.toFixed(3));
    maxVp = parseFloat(maxVp.toFixed(3));

    const result = `clamp(${minFont}rem, ${q}rem + ${m}vw, ${maxFont}rem)`;
    resCode.innerText = result;
    resCodeEx.innerText = `font-size: ${result};`;
  };

  function modifyExampleText() {
    const exampleTextStr = `This text will scale between ${isFontUnitPx ? (minFont * baseFont).toFixed(0) : minFont}${isFontUnitPx ? "px" : "rem"} \
    at ${isVpUnitPx ? (minVp * baseVp).toFixed(0) : minVp}${isVpUnitPx ? "px" : "rem"} \
    and ${isFontUnitPx ? (maxFont * baseFont).toFixed(0) : maxFont}${isFontUnitPx ? "px" : "rem"} \
    at ${isVpUnitPx ? (maxVp * baseVp).toFixed(0) : maxVp}${isVpUnitPx ? "px" : "rem"}.`;

    const exampleText = document.querySelector(".calculator__example__text");

    if (isTextScaling) {
      exampleText.innerText = "";
      exampleTextStr.split("").forEach((letter, index) => {
        const span = document.createElement("span");
        span.innerText = letter;
        span.style.fontSize = `${minFont + index * ((maxFont - minFont) / exampleTextStr.length)}rem`;
        exampleText.appendChild(span);
      });
    } else {
      exampleText.innerText = exampleTextStr;
      exampleText.style.fontSize = resCodeEx.innerText;
    }
  }

  fontUnitBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.value === "px") {
        // With the following if i'm checking if it's clicking on the button that is already pressed
        if (isFontUnitPx) return;
        isFontUnitPx = true;
      } else if (btn.value === "rem") {
        if (!isFontUnitPx) return;
        isFontUnitPx = false;
      }

      const unitUiPx = document.querySelectorAll(".unit-ui-font");
      unitUiPx.forEach((unit) => {
        unit.innerText = isFontUnitPx ? "PX" : "REM";

        const numberElem = unit.previousElementSibling;
        if (isFontUnitPx) {
          numberElem.value = parseFloat(numberElem.value) * baseFont;
        } else {
          numberElem.value = parseFloat(numberElem.value) / baseFont;
        }
      });

      modifyExampleText();
    });
  });

  vpUnitBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.value === "px") {
        if (isVpUnitPx) return;
        isVpUnitPx = true;
      } else if (btn.value === "rem") {
        if (!isVpUnitPx) return;
        isVpUnitPx = false;
      }

      const unitUiVp = document.querySelectorAll(".unit-ui-vp");

      unitUiVp.forEach((unit) => {
        unit.innerText = isVpUnitPx ? "PX" : "REM";

        const numberElem = unit.previousElementSibling;
        if (isVpUnitPx) {
          numberElem.value = parseFloat(numberElem.value) * baseVp;
        } else {
          numberElem.value = parseFloat(numberElem.value) / baseVp;
        }
      });
      modifyExampleText();
    });
  });

  baseInputFont.addEventListener("keyup", (e) => {
    baseFont = parseFloat(baseInputFont.value);
    calculateClamp();
    modifyExampleText();
  });
  baseInputVp.addEventListener("keyup", (e) => {
    baseVp = parseFloat(baseInputVp.value);
    calculateClamp();
    modifyExampleText();
  });

  scaleCheckbox.addEventListener("click", (e) => {
    isTextScaling = e.currentTarget.checked;
    modifyExampleText();
  });

  const closureLocalStorage = (() => {
    window.addEventListener("DOMContentLoaded", () => {
      if (localStorage.length === 0) {
        localStorage.setItem("isDarkThemeOn", "false");
        localStorage.setItem("isFontUnitPx", "true");
        localStorage.setItem("isVpUnitPx", "true");
        localStorage.setItem("baseFont", 16);
        localStorage.setItem("baseVp", 16);
        localStorage.setItem("minFont", 1);
        localStorage.setItem("maxFont", 2.5);
        localStorage.setItem("minVp", 37.5);
        localStorage.setItem("maxVp", 90);
      } else {
        if (localStorage.getItem("isDarkThemeOn") === "true") {
          document.body.classList.add("darkmode");
        }

        isFontUnitPx = JSON.parse(localStorage.getItem("isFontUnitPx"));
        isVpUnitPx = JSON.parse(localStorage.getItem("isVpUnitPx"));
        if (!isFontUnitPx) {
          fontUnitBtns.forEach((btn) => {
            if (btn.value === "rem") {
              btn.click();

              const unitUiPx = document.querySelectorAll(".unit-ui-font");
              unitUiPx.forEach((unit) => {
                unit.innerText = "REM";
              });
            }
          });
        }

        if (!isVpUnitPx) {
          vpUnitBtns.forEach((btn) => {
            if (btn.value === "rem") {
              btn.click();

              const unitUiVp = document.querySelectorAll(".unit-ui-vp");
              unitUiVp.forEach((unit) => {
                unit.innerText = "REM";
              });
            }
          });
        }

        baseFont = localStorage.getItem("baseFont");
        baseVp = localStorage.getItem("baseVp");
        baseInputFont.value = baseFont;
        baseInputVp.value = baseVp;

        minFont = localStorage.getItem("minFont");
        maxFont = localStorage.getItem("maxFont");
        minVp = localStorage.getItem("minVp");
        maxVp = localStorage.getItem("maxVp");
        document.querySelector('[name="minFont"').value = isFontUnitPx ? minFont * baseFont : minFont;
        document.querySelector('[name="maxFont"').value = isFontUnitPx ? maxFont * baseFont : maxFont;
        document.querySelector('[name="minVp"').value = isVpUnitPx ? minVp * baseVp : minVp;
        document.querySelector('[name="maxVp"').value = isVpUnitPx ? maxVp * baseVp : maxVp;
        calculateClamp();
        modifyExampleText();
      }
    });

    // Below here i change dynamically the localStorage. Ideally I want to set these values only
    // when closing the page. But the solution I found (using "beforeunload" event listener)
    // is not reliable, especially on mobile.
    const changeThemeBtn = document.querySelector(".btn-darkmode");
    changeThemeBtn.addEventListener("click", () => {
      localStorage.setItem("isDarkThemeOn", !document.body.classList.contains("darkmode"));
    });

    fontUnitBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        localStorage.setItem("isFontUnitPx", btn.value === "px" ? true : false);
      });
    });

    vpUnitBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        localStorage.setItem("isVpUnitPx", btn.value === "px" ? true : false);
      });
    });

    baseInputFont.addEventListener("keyup", (e) => {
      localStorage.setItem("baseFont", e.currentTarget.value);
    });

    baseInputVp.addEventListener("keyup", (e) => {
      localStorage.setItem("baseVp", e.currentTarget.value);
    });

    [minFontInput, maxFontInput].forEach((input) => {
      input.addEventListener("keyup", (e) => {
        localStorage.setItem(e.currentTarget.name, isFontUnitPx ? e.currentTarget.value / baseFont : e.currentTarget.value);
      });
    });

    [minVpInput, maxVpInput].forEach((input) => {
      input.addEventListener("keyup", (e) => {
        localStorage.setItem(e.currentTarget.name, isVpUnitPx ? e.currentTarget.value / baseVp : e.currentTarget.value);
      });
    });
  })();
})();

const closureCopyBtns = (() => {
  const copyBtns = document.querySelectorAll(".calculator__copy-btn");
  let timeout;
  let svg;

  let timeout2;
  let divMess;

  copyBtns.forEach((copyBtn) => {
    copyBtn.addEventListener("click", (e) => {
      copyHandler(e, copyBtn.previousElementSibling);

      // Adding visual confirmation for copy
      createConfirmationTickSvg(copyBtn);
    });
  });

  const codeCopyBtns = document.querySelectorAll(".code__copy-btn");
  codeCopyBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      copyHandler(e, btn.nextElementSibling);

      // Adding visual confirmation for copy
      createConfirmationMessage(e.currentTarget);
    });
  });

  // Copy buttons functionality - this method works only with input elements
  // execCommand() is deprecated - use Clipboard API with https (not working with http)
  function copyHandler(e, elementToCopy) {
    // Create a new textarea element and give it id='temp_element'
    const textarea = document.createElement("textarea");
    textarea.id = "temp_element";
    // Optional step to make less noise on the page, if any!
    textarea.style.height = 0;
    // Now append it to your page somewhere, in this case <body>
    document.body.appendChild(textarea);
    // Give our textarea a value of whatever inside the code element
    textarea.value = elementToCopy.innerText;
    // Now copy whatever inside the textarea to clipboard
    const selector = document.querySelector("#temp_element");
    selector.select();
    document.execCommand("copy");
    // Remove the textarea
    document.body.removeChild(textarea);
  }

  const createConfirmationMessage = (btnClicked) => {
    // const copyIcon = document.querySelector(".code__copy-icon");
    const copyIcon = Array.from(btnClicked.childNodes).find((childElem) => childElem?.classList?.contains("code__copy-icon"));

    if (timeout2) {
      divMess.remove();
      document.querySelectorAll(".code__copy-icon").forEach((icon) => {
        icon.src = "./app/assets/images/copy-svgrepo-com.svg";
      });
      clearTimeout(timeout2);
    }

    divMess = document.createElement("div");
    divMess.classList.add("code__copy-mess");
    divMess.innerText = "Copied!";
    copyIcon.parentElement.appendChild(divMess);
    // document.querySelector(".code__tab-code").appendChild(divMess);

    copyIcon.src = "./app/assets/images/copy-success-svgrepo-com.svg";

    timeout2 = setTimeout(() => {
      copyIcon.src = "./app/assets/images/copy-svgrepo-com.svg";
      divMess.remove();
    }, 3000);
  };

  const createConfirmationTickSvg = (copyBtn) => {
    if (timeout) {
      svg.remove();
      clearTimeout(timeout);
    }

    svg = document.createElement("img");
    svg.src = "/app/assets/images/check-svgrepo-com.svg";
    svg.classList.add("svg-check");
    svg.alt = "Confirmation tick";
    copyBtn.appendChild(svg);

    timeout = setTimeout(() => {
      svg.remove();
    }, 3000);
  };
})();

const closureCreateTabs = (() => {
  const tabs = document.querySelectorAll(".code__tabs li a");
  const codeTab = document.querySelector(".code__tab-code");
  const snippetArr = [];

  // Adding every snippet of code to the page. This code is running before PrismJS.
  // PrismJS will run after this code and will format all the snippets.
  codeData.forEach((snippet) => {
    const pre = document.createElement("pre");
    pre.classList.add("line-numbers");
    pre.classList.add("code__tab-element");
    const code = document.createElement("code");
    code.classList.add("language-scss");
    code.classList.add("code__tab-text");
    code.innerHTML = snippet;
    pre.appendChild(code);
    codeTab.appendChild(pre);
  });

  // At this point PrimeJS has already run. I'm saving all snippets on memory (already formatted by PrismJS)
  // Then i remove all snippets that are extra.
  addEventListener("DOMContentLoaded", (e) => {
    const tabElements = document.querySelectorAll(".code__tab-element");
    tabElements.forEach((snippet, index) => {
      snippetArr.push(snippet);
      if (index !== 0) {
        snippet.remove();
      }
    });
    // Styling
    tabs[0].classList.add("bold");
  });

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (e) => {
      document.querySelector(".code__tab-element").remove();
      codeTab.appendChild(snippetArr[index]);

      // Styling tabs
      tabs.forEach((tab) => tab.classList.remove("bold"));
      tab.classList.add("bold");
    });
  });
})();

// Darkmode feature
const closureChangeTheme = (() => {
  const changeThemeBtn = document.querySelector(".btn-darkmode");
  let isDark = false;

  changeThemeBtn.addEventListener("click", (e) => {
    document.body.classList.toggle("darkmode");

    changeScrollbarTheme();
  });

  function changeScrollbarTheme() {
    // remove scrollbars
    document.documentElement.style.overflow = "hidden";
    // trigger reflow so that overflow style is applied
    document.body.clientWidth;
    // change scheme
    document.documentElement.setAttribute("data-color-scheme", isDark ? "light" : "dark");
    // remove overflow style, which will bring back the scrollbar with the correct scheme
    document.documentElement.style.overflow = "";

    isDark = !isDark;
  }
})();

// The function returns "sf" number of digits.
function formatNumber(num, sf = 4) {
  num = num.toFixed(sf);

  let [int, decimal] = String(num).split(".");

  if (int.length >= sf) {
    return int;
  } else {
    decimal = decimal.slice(0, sf - int.length);
    return Number(`${int}.${decimal}`);
  }
}
