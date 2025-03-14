document.addEventListener("DOMContentLoaded", function () {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckPopup = document.getElementById("deck-popup");
    const closePopup = document.querySelector(".deck-close-btn");
    const saveDeckBtn = document.getElementById("save-deck-btn");
    const deckNameInput = document.getElementById("deck-name");
    const deckImgUrlInput = document.getElementById("deck-img-url");
    const deckContainer = document.getElementById("deck-container");

    // Zorg ervoor dat de pop-up standaard verborgen blijft
    deckPopup.style.display = "none";

    // Open de popup bij klikken op de knop
    addDeckBtn.addEventListener("click", () => {
        resetPopup(); // Reset velden voor een nieuw deck
        deckPopup.style.display = "flex";
    });

    // Sluit de popup bij klikken op sluitknop
    closePopup.addEventListener("click", () => {
        deckPopup.style.display = "none";
        saveDeckBtn.onclick = saveNewDeck; // Zorgt ervoor dat de knop teruggaat naar de standaard functie
    });

    // Functie voor nieuw deck opslaan
    function saveNewDeck() {
        const deckName = deckNameInput.value.trim();
        const deckImgUrl = deckImgUrlInput.value.trim() || "/assets/images/Magic_card_back 19.png";

        if (deckName === "") {
            alert("Geef een naam aan het deck.");
            return;
        }

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
        newDeck.appendChild(deckActions);

        deckContainer.appendChild(newDeck); // Voeg het nieuwe deck toe aan de juiste section

        // Popup sluiten
        deckPopup.style.display = "none";

        // Reset de event listener zodat hij niet vast blijft in de bewerk-modus
        saveDeckBtn.onclick = saveNewDeck;
    }

    // Functie om een bestaand deck te bewerken
    function openEditPopup(deckText, deckImage) {
        // Vul de invoervelden met de huidige gegevens
        deckNameInput.value = deckText.textContent;
        deckImgUrlInput.value = deckImage.src;

        // Verander de "Opslaan" knop naar update-modus
        saveDeckBtn.onclick = function () {
            if (deckNameInput.value.trim() !== "") {
                deckText.textContent = deckNameInput.value.trim();
            }
            if (deckImgUrlInput.value.trim() !== "") {
                deckImage.src = deckImgUrlInput.value.trim();
            }

            // Sluit de pop-up na opslaan
            deckPopup.style.display = "none";

            // Reset de event listener naar de standaard "nieuw deck" functie
            saveDeckBtn.onclick = saveNewDeck;
        };

        // Toon de bestaande pop-up
        deckPopup.style.display = "flex";
    }

    // Functie om de pop-up te resetten bij een nieuw deck
    function resetPopup() {
        deckNameInput.value = "";
        deckImgUrlInput.value = "";
        saveDeckBtn.onclick = saveNewDeck;
    }

    // Koppel de standaard "nieuw deck opslaan" functie aan de Opslaan knop
    saveDeckBtn.onclick = saveNewDeck;

});


