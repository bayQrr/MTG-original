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
        newDeck.appendChild(deckActions); // Voeg knoppen toe

        deckSection.appendChild(newDeck); // Voeg het deck toe aan deck-section

        // Popup sluiten
        deckPopup.style.display = "none";

        // Input velden resetten
        deckNameInput.value = "";
        deckImgUrlInput.value = "";
    });

    // 🔹 Voeg de bewerk-pop-up toe aan de body als die nog niet bestaat
    let editPopup = document.getElementById("edit-popup");
    let editOverlay = document.getElementById("edit-overlay");

    if (!editPopup) {
        editOverlay = document.createElement("div");
        editOverlay.id = "edit-overlay";
        editOverlay.classList.add("edit-overlay");
        document.body.appendChild(editOverlay);

        editPopup = document.createElement("div");
        editPopup.id = "edit-popup";
        editPopup.classList.add("edit-popup");
        editPopup.innerHTML = `
            <h2>Bewerk Deck</h2>
            <input type="text" id="edit-deck-name" placeholder="Nieuwe naam">
            <input type="url" id="edit-deck-img-url" placeholder="Nieuwe afbeelding URL">
            <div class="popup-buttons">
                <button id="save-edit-btn">Opslaan</button>
                <button class="close-edit-popup">Annuleren</button>
            </div>
        `;
        document.body.appendChild(editPopup);
    }

    const closeEditPopup = editPopup.querySelector(".close-edit-popup");
    closeEditPopup.addEventListener("click", () => {
        editPopup.style.display = "none";
        editOverlay.style.display = "none";
    });

    // Open de bewerk-pop-up
    function openEditPopup(deckText, deckImage) {
        const editDeckName = document.getElementById("edit-deck-name");
        const editDeckImgUrl = document.getElementById("edit-deck-img-url");
        const saveEditBtn = document.getElementById("save-edit-btn");

        editDeckName.value = deckText.textContent;
        editDeckImgUrl.value = deckImage.src;

        editPopup.style.display = "block";
        editOverlay.style.display = "block";

        saveEditBtn.onclick = function () {
            if (editDeckName.value.trim() !== "") {
                deckText.textContent = editDeckName.value.trim();
            }
            if (editDeckImgUrl.value.trim() !== "") {
                deckImage.src = editDeckImgUrl.value.trim();
            }
            editPopup.style.display = "none";
            editOverlay.style.display = "none";
        };
    }
});
