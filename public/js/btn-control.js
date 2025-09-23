let taxToggle = document.getElementById("switchCheckDefault");
taxToggle.addEventListener("click", () => {
  let taxInfo = document.getElementsByClassName("tax-info");
  for (let info of taxInfo) {
    if (info.style.display === "inline") {
      info.style.display = "none";
    } else {
      info.style.display = "inline";
    }
  }
});
