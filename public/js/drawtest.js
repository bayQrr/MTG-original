document.addEventListener("DOMContentLoaded", function () {
    const drawSection = document.getElementById("unique-draw-section");
    if (!drawSection) return;

    // State
    let deck = [];
    let drawnCards = [];

    // DOM Elements
    const deckSelector = document.getElementById("deck-selector");
    const deckCard = document.getElementById("unique-deck-card");
    const drawnCard = document.getElementById("unique-drawn-card");
    const cardsRemaining = document.getElementById("cards-remaining");
    const drawnCardsHistory = document.getElementById("drawn-cards-history");
    const drawButton = document.getElementById("unique-draw-button");
    const shuffleButton = document.getElementById("unique-shuffle-button");
    const resetButton = document.getElementById("unique-reset-button");
    const cardSearch = document.getElementById("card-search");
    const calculateOdds = document.getElementById("calculate-odds");
    const oddsResult = document.getElementById("odds-result");

    // 👉 Deck ophalen als gebruiker deck kiest
    deckSelector.addEventListener("change", async (e) => {
        const deckId = e.target.value;
        if (!deckId) return;

        try {
            const res = await fetch(`/api/deck/${deckId}`);
            const cards = await res.json();

            // Build deck met duplicates (op basis van count)
            deck = [];
            cards.forEach(card => {
                for (let i = 0; i < (card.count || 1); i++) {
                    deck.push({
                        name: card.name,
                        image: card.imageUrl || "/assets/images/Magic_card_back 19.png"
                    });
                }
            });

            drawnCards = [];
            drawnCard.src = "/assets/images/Magic_card_back 19.png";
            drawnCardsHistory.innerHTML = "";
            updateDisplay();

        } catch (err) {
            console.error("Fout bij ophalen deck:", err);
        }
    });

    // 🎴 Kaart trekken
    drawButton.addEventListener("click", () => {
        if (deck.length === 0) {
            alert("Geen kaarten meer over!");
            return;
        }

        const card = deck.pop();
        drawnCards.push(card);

        animateCardDraw(card);
        updateDisplay();
        addToHistory(card);
    });

    // 🔁 Schudden
    shuffleButton.addEventListener("click", () => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        animateShuffle();
        updateDisplay();
    });

    // 🔄 Reset
    resetButton.addEventListener("click", () => {
        deckSelector.dispatchEvent(new Event("change")); // herlaad deck
        oddsResult.textContent = "";
        cardSearch.value = "";
    });

    // 🔍 Kansberekening (via backend)
    calculateOdds.addEventListener("click", async () => {
        const searchTerm = cardSearch.value.trim().toLowerCase();
        const deckId = deckSelector.value;
        if (!searchTerm || !deckId) return;

        try {
            const res = await fetch(`/api/deck/${deckId}/search?term=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();

            oddsResult.textContent = `Kans: ${data.kans}% (${data.matches} van ${data.totaalKaarten})`;

        } catch (err) {
            console.error("Fout bij berekening:", err);
        }
    });

    // 🧮 UI Updates
    function updateDisplay() {
        cardsRemaining.textContent = `${deck.length} kaarten over`;
    }

    function addToHistory(card) {
        const img = document.createElement("img");
        img.src = card.image;
        img.alt = card.name;
        img.title = card.name;
        img.classList.add("history-card", "fade-in");
        drawnCardsHistory.insertBefore(img, drawnCardsHistory.firstChild);
    }

    function animateCardDraw(card) {
        const movingCard = document.getElementById("moving-card");

        const deckRect = deckCard.getBoundingClientRect();
        const drawnRect = drawnCard.getBoundingClientRect();
        const translateX = drawnRect.left - deckRect.left;
        const translateY = drawnRect.top - deckRect.top;

        deckCard.style.visibility = "hidden";
        movingCard.src = card.image;
        movingCard.alt = card.name;
        movingCard.style.opacity = "1";
        movingCard.style.display = "block";
        movingCard.style.transition = "none";
        movingCard.style.transform = `translate(0, 0)`;
        void movingCard.offsetWidth;

        movingCard.style.transition = "transform 0.6s ease";
        movingCard.style.transform = `translate(${translateX}px, ${translateY}px)`;

        setTimeout(() => {
            drawnCard.src = card.image;
            drawnCard.alt = card.name;
            movingCard.style.opacity = "0";
            deckCard.style.visibility = "visible";
        }, 600);
    }

    function animateShuffle() {
        deckCard.classList.remove("shuffle-animation");
        void deckCard.offsetWidth;
        deckCard.classList.add("shuffle-animation");
    }
});
