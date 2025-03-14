document.addEventListener("DOMContentLoaded", function () {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckPopup = document.getElementById("deck-popup");
    const closePopup = document.querySelector(".deck-close-btn");
    const saveDeckBtn = document.getElementById("save-deck-btn");
    const deckNameInput = document.getElementById("deck-name");
    const deckImgUrlInput = document.getElementById("deck-img-url");
    const deckSection = document.getElementById("deck-section");

    let newDeckWrapper = document.getElementById("new-deck-wrapper");
    let newDeckTitle = document.getElementById("new-deck-title");
    let newDeckContainer = document.getElementById("new-deck-container");

    // **Stap 1: Maak een nieuwe section voor de titel en decks**
    if (!newDeckWrapper) {
        newDeckWrapper = document.createElement("section");
        newDeckWrapper.id = "new-deck-wrapper";
        deckSection.appendChild(newDeckWrapper);
    }

    // **Stap 2: Voeg de titel toe binnen de nieuwe section**
    if (!newDeckTitle) {
        newDeckTitle = document.createElement("h2");
        newDeckTitle.id = "new-deck-title";
        newDeckTitle.textContent = "New Deck";
        newDeckWrapper.appendChild(newDeckTitle);
    }

    // **Stap 3: Voeg de deck-container toe binnen dezelfde section**
    if (!newDeckContainer) {
        newDeckContainer = document.createElement("section");
        newDeckContainer.id = "new-deck-container";
        newDeckWrapper.appendChild(newDeckContainer);
    }

    // Open de popup alleen bij klikken op de knop
    addDeckBtn.addEventListener("click", () => {
        deckPopup.style.display = "flex";
    });

    // Sluit de popup bij klikken op sluitknop
    closePopup.addEventListener("click", () => {
        deckPopup.style.display = "none";
    });

    // **Deck opslaan**
    saveDeckBtn.addEventListener("click", () => {
        const deckName = deckNameInput.value.trim();
        const deckImgUrl = deckImgUrlInput.value.trim() || "/assets/images/Magic_card_back 19.png";

        if (deckName === "") {
            alert("Geef een naam aan het deck.");
            return;
        }

        // **Zorg ervoor dat de "New Deck" titel correct wordt weergegeven**
        newDeckTitle.style.display = "block";

        // **Maak een nieuw deck item**
        const newDeck = document.createElement("article");
        newDeck.classList.add("deck-item");

        const deckImage = document.createElement("img");
        deckImage.src = deckImgUrl;
        deckImage.alt = deckName;
        deckImage.width = 100;

        const deckText = document.createElement("p");
        deckText.textContent = deckName;

        // Maak de bewerk/verwijder knoppen
        const deckActions = document.createElement("div");
        deckActions.classList.add("deck-actions");

        const editButton = document.createElement("button");
        editButton.classList.add("edit-deck");
        editButton.textContent = "✏️";
        editButton.addEventListener("click", () => openEditPopup(deckText, deckImage));

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-deck");
        deleteButton.textContent = "🗑️";
        deleteButton.addEventListener("click", () => newDeck.remove());

        deckActions.appendChild(editButton);
        deckActions.appendChild(deleteButton);

        newDeck.appendChild(deckImage);
        newDeck.appendChild(deckText);
        newDeck.appendChild(deckActions);

        // **Voeg het nieuwe deck toe binnen de deck-container**
        newDeckContainer.appendChild(newDeck);

        // Popup sluiten
        deckPopup.style.display = "none";

        // Input velden resetten
        deckNameInput.value = "";
        deckImgUrlInput.value = "";
    });
});
