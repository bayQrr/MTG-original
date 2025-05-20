document.addEventListener("DOMContentLoaded", () => {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckSection = document.getElementById("deck-section"); 
    const deckPopup = document.getElementById("deck-popup");
    const closeBtn = document.querySelector(".deck-close-btn");
    const deckForm = document.getElementById("popup-deck-form");
    const deckIdInput = document.getElementById("deck-id");
    const nameInput = document.getElementById("deck-name");
    const imageInput = document.getElementById("deck-img-url");
  
    // deck aanmaken functie  via de deckRouter.ts
    addDeckBtn.addEventListener("click", (event) => {
      event.preventDefault(); //zorgt ervoor dat de pagina niet herladen wordt
      // Tel het aantal decks op basis van het aantal ".deck-item" elementen
      const currentDeckCount =
        deckSection.getElementsByClassName("deck-item").length;
      if (currentDeckCount >= 9) { //max 9decks toegestaan
        alert("Je kan maximaal 9 decks maken.");//als meer dan 9decks, krijg je melding
        return;
      }
      deckForm.action = "/deck/create-deck"; //verijwst nr de form
      nameInput.value = ""; //inputvelden als default leegmaken
      imageInput.value = "";
      deckPopup.style.display = "flex"; //popup deckaanmaken wordt getoond
    });
  
    // Sluiten van de pop-up bij het klikken op de sluitknop
    closeBtn.addEventListener("click", () => {
      deckPopup.style.display = "none";
    });
  
    // Sluiten van de pop-up als buiten de pop-up geklikt wordt
    window.addEventListener("click", (event) => {
      if (event.target === deckPopup) {
        deckPopup.style.display = "none";
      }
    });
  
    // Bewerken van een deck via de deckRouter.ts
    const editButtons = document.querySelectorAll(".edit-deck-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        const name = button.getAttribute("data-name");
        const image = button.getAttribute("data-image");
  
        deckForm.action = `/deck/${id}`;
        deckIdInput.value = id;
        nameInput.value = name;
        imageInput.value = image;
        deckPopup.style.display = "flex";
      });
    });
  
    // Zorgen dat bij klikken op een deck-item (behalve op de knoppen) wordt genavigeerd naar de deckview
    document.querySelectorAll(".deck-item").forEach((item) => {
      const link = item.querySelector("a");
      item.addEventListener("click", (e) => {
        // Voorkom doorklikken als op een knop (bewerk/verwijder) geklikt wordt
        if (e.target.closest("button")) return;
        if (link) window.location.href = link.href;
      });
    });

    // flashmessage automatisch laten verdiinen
    document.addEventListener("DOMContentLoaded", () => {
  const flash = document.getElementById("flash-message");
  if (flash) {
    setTimeout(() => {
      flash.style.display = "none";
    }, 4000); // message gaat weg na 4 seconden
  }
});

  });
  