document.addEventListener("DOMContentLoaded", function () {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckPopup = document.getElementById("deck-popup");
    const closePopup = document.querySelector(".deck-close-btn");
    const saveDeckBtn = document.getElementById("save-deck-btn");
    const deckNameInput = document.getElementById("deck-name");
    const deckImgUrlInput = document.getElementById("deck-img-url");
    const deckContainer = document.getElementById("deck-container");

    let decks = JSON.parse(localStorage.getItem("savedDecks")) || [];

    function saveDecksToStorage() {
        localStorage.setItem("savedDecks", JSON.stringify(decks));
    }

    function renderDecks() {
        deckContainer.innerHTML = "";
        decks.forEach((deck, index) => {
            const newDeck = document.createElement("article");
            newDeck.classList.add("deck-item");

            const deckImage = document.createElement("img");
            deckImage.src = deck.imgUrl;
            deckImage.alt = deck.name;
            deckImage.width = 100;

            const deckText = document.createElement("p");
            deckText.textContent = deck.name;

            const deckActions = document.createElement("div");
            deckActions.classList.add("deck-actions");

            const editButton = document.createElement("button");
            editButton.classList.add("edit-deck");
            editButton.textContent = "✏️";
            editButton.addEventListener("click", (event) => {
                event.stopPropagation();
                openEditPopup(index);
            });

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-deck");
            deleteButton.textContent = "🗑️";
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteDeck(index);
            });

            deckActions.appendChild(editButton);
            deckActions.appendChild(deleteButton);

            newDeck.appendChild(deckImage);
            newDeck.appendChild(deckText);
            newDeck.appendChild(deckActions);
            deckContainer.appendChild(newDeck);

            newDeck.addEventListener("click", () => {
                window.location.href = "deckview.html";
            });
        });
    }

    function saveNewDeck() {
        const deckName = deckNameInput.value.trim();
        const deckImgUrl = deckImgUrlInput.value.trim() || "/assets/images/Magic_card_back 19.png";

        if (deckName === "") {
            alert("Geef een naam aan het deck.");
            return;
        }
        
        // Check of er al 9 decks zijn
        if (decks.length >= 9) {
            alert("Je hebt te veel decks");
            return;
        }

        decks.push({ name: deckName, imgUrl: deckImgUrl });
        saveDecksToStorage();
        renderDecks();
        deckPopup.style.display = "none";
    }

    function openEditPopup(index) {
        const deck = decks[index];
        deckNameInput.value = deck.name;
        deckImgUrlInput.value = deck.imgUrl;

        saveDeckBtn.onclick = function () {
            if (deckNameInput.value.trim() !== "") {
                decks[index].name = deckNameInput.value.trim();
            }
            if (deckImgUrlInput.value.trim() !== "") {
                decks[index].imgUrl = deckImgUrlInput.value.trim();
            }

            saveDecksToStorage();
            renderDecks();
            deckPopup.style.display = "none";
            saveDeckBtn.onclick = saveNewDeck;
        };

        deckPopup.style.display = "flex";
    }

    function deleteDeck(index) {
        decks.splice(index, 1);
        saveDecksToStorage();
        renderDecks();
    }

    function resetPopup() {
        deckNameInput.value = "";
        deckImgUrlInput.value = "";
        saveDeckBtn.onclick = saveNewDeck;
    }

    addDeckBtn.addEventListener("click", () => {
        resetPopup();
        deckPopup.style.display = "flex";
    });

    closePopup.addEventListener("click", () => {
        deckPopup.style.display = "none";
        saveDeckBtn.onclick = saveNewDeck;
    });

    saveDeckBtn.onclick = saveNewDeck;

    renderDecks();
});
