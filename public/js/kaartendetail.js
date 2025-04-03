document.addEventListener("DOMContentLoaded", function () {
  // Selecteer alle kaarten
  const kaarten = document.querySelectorAll(".kaart");
  console.log("Aantal kaarten gevonden:", kaarten.length);

  // Selecteer de popup en de onderdelen
  const popup = document.getElementById("kaartPopup");
  const popupImg = document.getElementById("popupImg");
  const popupTitle = document.getElementById("popupTitle");
  const popupType = document.getElementById("popupType");
  const popupMana = document.getElementById("popupMana");
  const popupRarity = document.getElementById("popupRarity");
  const popupPowerToughness = document.getElementById("popupPowerToughness");
  const popupText = document.getElementById("popupText");

  // Teller-elementen
  const increaseBtn = document.querySelector(".increase-btn");
  const decreaseBtn = document.querySelector(".decrease-btn");
  const cardCount = document.getElementById("cardCount");

  let count = 1;
  if (cardCount) {
    cardCount.textContent = count;

    increaseBtn.addEventListener("click", function (event) {
      event.preventDefault();
      count++;
      cardCount.textContent = count;
    });

    decreaseBtn.addEventListener("click", function (event) {
      event.preventDefault();
      if (count > 1) {
        count--;
        cardCount.textContent = count;
      }
    });
  }

  // Voeg een click-event toe aan elke kaart
  kaarten.forEach(kaart => {
    kaart.addEventListener("click", function () {
      // Lees de data uit de kaart
      const name = kaart.getAttribute("data-name");
      const type = kaart.getAttribute("data-type");
      const manaCost = kaart.getAttribute("data-mana-cost");
      const rarity = kaart.getAttribute("data-rarity");
      const power = kaart.getAttribute("data-power");
      const toughness = kaart.getAttribute("data-toughness");
      const text = kaart.getAttribute("data-text");


      // Vul de popup met de gegevens
      popupTitle.textContent = name || "";
      popupType.textContent = type || "";
      popupMana.textContent = manaCost || "";
      popupRarity.textContent = rarity || "";
      if (power && toughness) {
        popupPowerToughness.textContent = power + "/" + toughness;
      } else {
        popupPowerToughness.textContent = "";
      }
      popupText.textContent = text || "";

      // Haal de afbeelding op en vul de popup
      const imgEl = kaart.querySelector("img");
      if (imgEl) {
        popupImg.src = imgEl.src;
      } else {
        console.error("Geen afbeelding gevonden in deze kaart.");
      }

      // Maak de popup zichtbaar
      popup.style.display = "flex";

      // Reset de teller naar 1
      count = 1;
      if (cardCount) {
        cardCount.textContent = count;
      }
    });
  });

  // Sluit de popup bij klik op de sluitknop
  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // Sluit de popup als er buiten de container wordt geklikt
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
});