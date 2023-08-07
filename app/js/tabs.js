import { codeData } from "../utils/data.js";

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
// Then I remove all snippets that are extra.
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
