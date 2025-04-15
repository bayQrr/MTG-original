document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("unique-draw-section")) return;

    let deck = [];
    let drawnCards = [];

    // DOM Elements
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

    function initializeDeck() {
        deck = Array.from({ length: 60 }, (_, i) => ({
            id: i + 1,
            name: `Card ${i + 1}`,
            //   image: `assets/images/Magic_card_back 19.png`,
            image: `/assets/images/cardExample.jpg`
        }));
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        animateShuffle();
        updateDisplay();
    }

    function animateShuffle() {
        deckCard.classList.remove("shuffle-animation");
        void deckCard.offsetWidth;
        deckCard.classList.add("shuffle-animation");
    }



    function drawCard() {
        if (deck.length === 0) {
            alert("Geen kaarten meer over!");
            return;
        }

        const card = deck.pop();
        drawnCards.push(card);

        // Posities berekenen
        const deckRect = deckCard.getBoundingClientRect();
        const drawnRect = drawnCard.getBoundingClientRect();

        // Verberg de bovenste kaart van de stapel tijdens de animatie
        deckCard.style.visibility = "hidden";

        // Toon de animatiekaart
        const movingCard = document.getElementById("moving-card");
        movingCard.src = card.image;
        movingCard.alt = card.name;


        movingCard.style.display = "block";
        movingCard.style.opacity = "1";

        // Forceer hertekenen van het element om de animatie opnieuw te starten
        void movingCard.offsetWidth;

        // Reset de transform en zorg dat de animatie opnieuw start
        movingCard.style.transition = "none";
        movingCard.style.transform = `translate(0, 0)`;


        void movingCard.offsetWidth;


        const translateX = drawnRect.left - deckRect.left;
        const translateY = drawnRect.top - deckRect.top;

        movingCard.style.transition = "transform 0.6s ease";
        movingCard.style.transform = `translate(${translateX}px, ${translateY}px)`;


        setTimeout(() => {
            drawnCard.src = card.image;
            drawnCard.alt = card.name;
            movingCard.style.opacity = "0";

            // Toon de deck-kaart terug zodra animatie klaar is
            deckCard.style.visibility = "visible";

            addToHistory(card);
        }, 600);

        updateDisplay();
    }


    function animateDraw(card) {
        drawnCard.classList.remove("draw-animation");
        void drawnCard.offsetWidth;
        drawnCard.classList.add("draw-animation");

        setTimeout(() => {
            drawnCard.src = card.image;
            drawnCard.alt = card.name;
        }, 500);
    }

    function updateDisplay() {
        cardsRemaining.textContent = `${deck.length} kaarten over`;
    }

    function addToHistory(card) {
        const cardElement = document.createElement("img");
        cardElement.src = card.image;
        cardElement.alt = card.name;
        cardElement.title = card.name;
        cardElement.classList.add("history-card", "fade-in");
        drawnCardsHistory.insertBefore(cardElement, drawnCardsHistory.firstChild);
    }

    function calculateProbability() {
        const searchTerm = cardSearch.value.toLowerCase();
        const matchingCards = deck.filter((card) =>
            card.name.toLowerCase().includes(searchTerm)
        );

        const probability = (matchingCards.length / deck.length) * 100;
        oddsResult.textContent = `Kans: ${probability.toFixed(2)}%`;
    }

    function resetGame() {
        deck = [];
        drawnCards = [];
        initializeDeck();
        drawnCard.src = "assets/images/Magic_card_back 19.png";
        drawnCardsHistory.innerHTML = "";
        updateDisplay();
        oddsResult.textContent = "";
        cardSearch.value = "";
    }


    // Event Listeners
    shuffleButton.addEventListener("click", shuffleDeck);
    drawButton.addEventListener("click", drawCard);
    resetButton.addEventListener("click", resetGame);
    calculateOdds.addEventListener("click", calculateProbability);

    // Initialiseer het spel
    resetGame();
});
