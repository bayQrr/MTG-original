document.addEventListener("DOMContentLoaded", () => {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const popup = document.getElementById("deck-popup");
    const closeBtn = document.querySelector(".deck-close-btn"); // Correcte class naam
    const saveDeckBtn = document.getElementById("save-deck-btn");
    const deckSection = document.getElementById("deck-section");

    // Toon de popup
    addDeckBtn.addEventListener("click", () => {
        popup.style.display = "flex";
    });

    // Sluit de popup
    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Opslaan van een nieuw deck
    saveDeckBtn.addEventListener("click", () => {
        const deckName = document.getElementById("deck-name").value.trim();
        const deckImg = document.getElementById("deck-img-url").value.trim();

        if (deckName && deckImg) {
            const newDeck = document.createElement("article");
            newDeck.classList.add("deck-item");

            const imgElement = document.createElement("img");
            imgElement.src = deckImg;
            imgElement.alt = deckName;
            imgElement.style.width = "100px";

            const textElement = document.createElement("p");
            textElement.textContent = deckName;

            newDeck.appendChild(imgElement);
            newDeck.appendChild(textElement);
            deckSection.appendChild(newDeck);

            // Sluit popup na opslaan
            popup.style.display = "none";

            // Leeg de inputvelden
            document.getElementById("deck-name").value = "";
            document.getElementById("deck-img-url").value = "";
        } else {
            alert("Vul alle velden in!");
        }
    });

    // Sluit de popup als je buiten de container klikt
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#unique-navigation");
const body = document.querySelector("body");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    // Voorkom scrollen wanneer menu open is
    body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "auto";
});

// Sluit menu bij klikken op een link
document.querySelectorAll("#unique-nav-list li a").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    body.style.overflow = "auto";
}));

// Sluit menu bij klikken buiten het menu
document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && 
        !navMenu.contains(e.target) && 
        navMenu.classList.contains("active")) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        body.style.overflow = "auto";
    }
});
