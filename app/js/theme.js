// Darkmode feature
const changeThemeBtn = document.querySelector(".btn-darkmode");
let isDark = false;

changeThemeBtn.addEventListener("click", (e) => {
  document.body.classList.toggle("darkmode");

  changeScrollbarTheme();
});

export function changeScrollbarTheme() {
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
