document.addEventListener("DOMContentLoaded", function () {
    // Controleer of we op de game pagina zijn
    if (!document.getElementById("unique-draw-section")) return;
  
    let deck = [];
    let drawnCards = [];
  
    // DOM Elements met unieke ID's
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
        image: `assets/images/Magic_card_back 19.png`,
      }));
    }
  
    function shuffleDeck() {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      updateDisplay();
    }
  
    function drawCard() {
      if (deck.length === 0) {
        alert("Geen kaarten meer over!");
        return;
      }
  
      const card = deck.pop();
      drawnCards.push(card);
  
      displayCurrentCard(card);
      updateDisplay();
      addToHistory(card);
    }
  
    function displayCurrentCard(card) {
      drawnCard.src = card.image;
      drawnCard.alt = card.name;
    }
  
    function updateDisplay() {
      cardsRemaining.textContent = `${deck.length} kaarten over`;
    }
  
    function addToHistory(card) {
      const cardElement = document.createElement("img");
      cardElement.src = card.image;
      cardElement.alt = card.name;
      cardElement.title = card.name;
      cardElement.classList.add("history-card");
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
      shuffleDeck();
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
  