import { calculateClampValues } from "../utils/functions.js";
import { changeScrollbarTheme } from "./theme.js";

const inputs = document.querySelectorAll(".input");
const resCode = document.querySelector(".calculator__result__code");
const resCodeEx = document.querySelector(".calculator__result__example");
const minFontInput = document.querySelector('[name="minFont"');
const maxFontInput = document.querySelector('[name="maxFont"');
const minVpInput = document.querySelector('[name="minVp"');
const maxVpInput = document.querySelector('[name="maxVp"');
const fontUnitBtns = document.querySelectorAll("input[name='font-unit']");
const vpUnitBtns = document.querySelectorAll("input[name='vp-unit']");
const baseInputFont = document.querySelector("#base-font");
const baseInputVp = document.querySelector("#base-vp");

let isFontUnitPx = true;
let isVpUnitPx = true;

let baseFont = 16; // px
let baseVp = 16; // px

let minFont = 1; // rem
let maxFont = 2.75; // rem
let minVp = 37.5; // rem
let maxVp = 90; // rem

const scaleCheckbox = document.querySelector("[name='allow-scale'");
let isTextScaling = false;

const closureClampCalculator = (() => {
  inputs.forEach((input) => {
    input.addEventListener("keyup", (e) => {
      calculateClamp();
      modifyExampleText();
    });
  });

  const calculateClamp = () => {
    minFont = Number(minFontInput.value);
    maxFont = Number(maxFontInput.value);
    minVp = Number(minVpInput.value);
    maxVp = Number(maxVpInput.value);

    if (isFontUnitPx) {
      minFont /= baseFont;
      maxFont /= baseFont;
    }
    if (isVpUnitPx) {
      minVp /= baseVp;
      maxVp /= baseVp;
    }

    const result = calculateClampValues(minFont, maxFont, minVp, maxVp);

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
})();

const closureLocalStorage = (() => {
  const properties = ["isFontUnitPx", "isVpUnitPx", "baseFont", "baseVp", "minFont", "maxFont", "minVp", "maxVp"];
  window.addEventListener("DOMContentLoaded", () => {
    // If it's the first time accessing this website, then set default values.
    // If any of the required properties are missing then reset all to default.
    const localStorageProps = Object.keys({ ...localStorage });
    if (!properties.every((item) => localStorageProps.includes(item))) {
      // Checking if matchMedia is supported. Then finding out if user's theme is dark
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        localStorage.setItem("isDarkThemeOn", "true");
        document.body.classList.toggle("darkmode");
        changeScrollbarTheme();
      } else {
        localStorage.setItem("isDarkThemeOn", "false");
      }
      localStorage.setItem("isFontUnitPx", "true");
      localStorage.setItem("isVpUnitPx", "true");
      localStorage.setItem("baseFont", 16);
      localStorage.setItem("baseVp", 16);
      localStorage.setItem("minFont", 1);
      localStorage.setItem("maxFont", 2.75);
      localStorage.setItem("minVp", 37.5);
      localStorage.setItem("maxVp", 90);
    } else {
      if (localStorage.getItem("isDarkThemeOn") === "true") {
        document.body.classList.add("darkmode");
        changeScrollbarTheme();
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
      minFontInput.value = isFontUnitPx ? minFont * baseFont : minFont;
      maxFontInput.value = isFontUnitPx ? maxFont * baseFont : maxFont;
      minVpInput.value = isVpUnitPx ? minVp * baseVp : minVp;
      maxVpInput.value = isVpUnitPx ? maxVp * baseVp : maxVp;
      calculateClamp();
      modifyExampleText();
    }
  });

  // Below here I change dynamically the localStorage. Ideally I want to set these values only
  // when closing the page. But the solution I found (using "beforeunload" event listener)
  // is not reliable, especially on mobile.
  const changeThemeBtn = document.querySelector(".btn-darkmode");
  changeThemeBtn.addEventListener("click", () => {
    localStorage.setItem("isDarkThemeOn", document.body.classList.contains("darkmode"));
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
