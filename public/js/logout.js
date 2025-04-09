document.addEventListener("DOMContentLoaded", function () {
    const profileIcon = document.getElementById("unique-profile-icon");
    const dropdown = document.getElementById("profile-dropdown");

    // wanneer je op icon drukt kan je de uitlog knop zien
    profileIcon.addEventListener("click", function (event) {
        event.preventDefault();
        dropdown.classList.toggle("show");
    });

    // deze zorgt ervoor dat je de uitlog knop niet meer ziet wnr je opnieuw drukt
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove("show");
        }
    });

    document.getElementById("unique-profile-link").addEventListener("click", () => {
        const tooltip = document.querySelector(".tooltip");
        if (tooltip) tooltip.style.display = "none";
    });

});

