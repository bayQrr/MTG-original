const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#unique-navigation");
const body = document.querySelector("body");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");

    body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "auto";
});

// sluit menu bij klikken op een link
document.querySelectorAll("#unique-nav-list li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    body.style.overflow = "auto";
}));

// sluit menu bij klikken buiten het menu
document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && 
        !navMenu.contains(e.target) && 
        navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.style.overflow = "auto";
    }
});
