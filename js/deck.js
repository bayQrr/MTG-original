document.addEventListener("DOMContentLoaded", function () {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckPopup = document.getElementById("deck-popup");
    const closePopup = document.querySelector(".deck-close-btn");
    const saveDeckBtn = document.getElementById("save-deck-btn");
    const deckNameInput = document.getElementById("deck-name");
    const deckImgUrlInput = document.getElementById("deck-img-url");
    const deckSection = document.getElementById("deck-section");

    let newDeckTitle = document.getElementById("new-deck-title");

    if (!newDeckTitle) {
        newDeckTitle = document.createElement("h2");
        newDeckTitle.id = "new-deck-title";
        newDeckTitle.textContent = "New Deck";
        deckSection.appendChild(newDeckTitle);
    }

    // Open de popup
    addDeckBtn.addEventListener("click", () => {
        deckPopup.style.display = "flex";
    });

    // Sluit de popup
    closePopup.addEventListener("click", () => {
        deckPopup.style.display = "none";
    });

    // Deck opslaan
    saveDeckBtn.addEventListener("click", () => {
        const deckName = deckNameInput.value.trim();
        const deckImgUrl = deckImgUrlInput.value.trim() || "/assets/images/Magic_card_back 19.png";

        if (deckName === "") {
            alert("Geef een naam aan het deck.");
            return;
        }

        // Toon "New Deck" titel als er een nieuw deck wordt toegevoegd
        newDeckTitle.style.display = "block";

        // Maak een nieuw deck item
        const newDeck = document.createElement("article");
        newDeck.classList.add("deck-item");

        const deckImage = document.createElement("img");
        deckImage.src = deckImgUrl;
        deckImage.alt = deckName;
        deckImage.width = 100;

        const deckText = document.createElement("p");
        deckText.textContent = deckName;

        newDeck.appendChild(deckImage);
        newDeck.appendChild(deckText);
        deckSection.appendChild(newDeck); // Voeg het toe aan deck-section

        // Popup sluiten
        deckPopup.style.display = "none";

        // Input velden resetten
        deckNameInput.value = "";
        deckImgUrlInput.value = "";
    });
});
