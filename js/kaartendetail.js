document.addEventListener("DOMContentLoaded", function () {
    // Selecteer alle kaart-elementen
    const kaarten = document.querySelectorAll(".kaart");
    console.log("Aantal kaarten gevonden:", kaarten.length);
  
    // Haal de popup-elementen op
    const popup = document.getElementById("kaartPopup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    const popupType = document.getElementById("popupType");
    const popupMana = document.getElementById("popupMana");
    const popupRarity = document.getElementById("popupRarity");
    const popupSet = document.getElementById("popupSet");
    const popupPowerToughness = document.getElementById("popupPowerToughness");
    const popupText = document.getElementById("popupText");
    const popupFlavor = document.getElementById("popupFlavor");
    const popupArtist = document.getElementById("popupArtist");
  
    // Teller-elementen in de popup
    const increaseBtn = document.querySelector(".increase-btn");
    const decreaseBtn = document.querySelector(".decrease-btn");
    const cardCount = document.getElementById("cardCount");
    let count = 1;
    cardCount.textContent = count;
  
    increaseBtn.addEventListener("click", function (event) {
      event.preventDefault();
      count++;
      cardCount.textContent = count;
      console.log("Teller verhoogd:", count);
    });
  
    decreaseBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if (count > 1) {
        count--;
        cardCount.textContent = count;
        console.log("Teller verlaagd:", count);
      }
    });
  
    // Voeg click-event toe aan elke kaart
    kaarten.forEach(kaart => {
      kaart.addEventListener("click", function () {
        console.log("Kaart geklikt:", kaart);
        
        // Lees de data-attributen uit
        // Zorg dat in je EJS voor elke kaart de naam in <p> staat!
        const name = kaart.getAttribute("data-name");
        const type = kaart.getAttribute("data-type");
        const manaCost = kaart.getAttribute("data-mana-cost");
        const rarity = kaart.getAttribute("data-rarity");
        const set = kaart.getAttribute("data-set");
        const power = kaart.getAttribute("data-power");
        const toughness = kaart.getAttribute("data-toughness");
        const text = kaart.getAttribute("data-text");
        const flavor = kaart.getAttribute("data-flavor");
        const artist = kaart.getAttribute("data-artist");
  
        console.log("Data gelezen:", { name, type, manaCost, rarity, set });
  
        // Haal de afbeelding op uit het <img>-element
        const imgEl = kaart.querySelector("img");
        if (imgEl) {
          popupImg.src = imgEl.src;
        } else {
          console.error("Geen afbeelding gevonden in deze kaart.");
        }
  
        // Vul de popup met de gegevens
        popupTitle.textContent = name || "";
        popupType.textContent = type || "";
        popupMana.textContent = manaCost || "";
        popupRarity.textContent = rarity || "";
        popupSet.textContent = set || "";
        if (power && toughness) {
          popupPowerToughness.textContent = power + "/" + toughness;
        } else {
          popupPowerToughness.textContent = "";
        }
        popupText.textContent = text || "";
        popupFlavor.textContent = flavor || "";
        popupArtist.textContent = artist || "";
  
        // Maak de popup zichtbaar (verwijder eventueel de "hidden" class)
        popup.style.display = "flex";
        console.log("Popup zichtbaar");
  
        // Reset teller naar 1 bij openen
        count = 1;
        cardCount.textContent = count;
      });
    });
  
    // Sluit de popup wanneer op de sluitknop wordt geklikt
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function () {
      popup.style.display = "none";
      console.log("Popup gesloten via sluitknop");
    });
  
    // Sluit de popup als er buiten de container wordt geklikt
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        popup.style.display = "none";
        console.log("Popup gesloten door buiten de container te klikken");
      }
    });
  });
  