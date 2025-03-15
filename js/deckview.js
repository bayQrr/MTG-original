document.addEventListener("DOMContentLoaded", function () {
    const deckContainer = document.querySelector(".deck-containter"); 
    if (!deckContainer) return;

    // Maak een container voor de dropdown
    const deckSelectorContainer = document.createElement("div");
    deckSelectorContainer.id = "deck-selector-container";
    deckSelectorContainer.classList.add("deck-selector-wrapper");

    // Maak de dropdown
    const deckSelector = document.createElement("select");
    deckSelector.id = "deck-selector";
    deckSelector.classList.add("deck-dropdown");
    deckSelector.innerHTML = `<option value="">-- Kies een deck --</option>`;

    deckSelectorContainer.appendChild(deckSelector);
    deckContainer.prepend(deckSelectorContainer); 

    let availableDecks = JSON.parse(localStorage.getItem("savedDecks")) || [];

    function updateDeckDropdown() {
        deckSelector.innerHTML = `<option value="">-- Kies een deck --</option>`;
    
        // default decks
        const defaultDecks = [
            { name: "Deck 1", value: "default1" },
            { name: "Deck 2", value: "default2" },
            { name: "Deck 3", value: "default3" }
        ];
    
        defaultDecks.forEach(deck => {
            const option = document.createElement("option");
            option.value = deck.value;
            option.textContent = deck.name;
            deckSelector.appendChild(option);
        });
    
        // toevoegen in local store
        availableDecks.forEach((deck, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = deck.name;
            deckSelector.appendChild(option);
        });
    }
    
    deckSelector.addEventListener("change", function () {
        const selectedValue = deckSelector.value;
        if (selectedValue !== "") {
            let selectedDeck;
            if (selectedValue.startsWith("default")) {
                // juiste default kiezen
                if (selectedValue === "default1") {
                    selectedDeck = { name: "Deck 1" };
                } else if (selectedValue === "default2") {
                    selectedDeck = { name: "Deck 2" };
                } else if (selectedValue === "default3") {
                    selectedDeck = { name: "Deck 3" };
                }
            } else {
                selectedDeck = availableDecks[selectedValue];
            }

            // game updaten met de gekozen deck
            initializeGameWithDeck(selectedDeck);
        }
    });

    function initializeGameWithDeck(deck) {
        if (deck.cards !== undefined) {
            deckCards = deck.cards.slice();
        }
        drawnCards = [];
        updateDisplay();
    }

    updateDeckDropdown();
});
