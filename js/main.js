function tooglemenu() {
  const menu = document.getElementById("nav-links");

  if (menu.style.display != "flex") {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}
