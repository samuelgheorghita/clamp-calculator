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
