document.addEventListener("DOMContentLoaded", () => {
  const addDeckBtn = document.getElementById("add-deck-btn");
  const deckSection = document.getElementById("deck-section");
  const deckPopup = document.getElementById("deck-popup");
  const closeBtn = document.querySelector(".deck-close-btn");
  const deckForm = document.getElementById("popup-deck-form");
  const deckIdInput = document.getElementById("deck-id");
  const nameInput = document.getElementById("deck-name");
  const imageInput = document.getElementById("deck-img-url");

  addDeckBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // checkt hoeveel decks er zijn
    const currentDeckCount =
      deckSection.getElementsByClassName("deck-item").length;
    if (currentDeckCount >= 9) {
      alert("Je kan maximaal 9 decks maken.");
      return;
    }
    deckForm.action = "/deck/create-deck";
    nameInput.value = "";
    imageInput.value = "";
    deckPopup.style.display = "flex";
  });

  // popup kunnen sluiten
  closeBtn.addEventListener("click", () => {
    deckPopup.style.display = "none";
  });

  // het popup kunnen sluiten als het buiten ergens wordt gedrukt
  window.addEventListener("click", (event) => {
    if (event.target === deckPopup) {
      deckPopup.style.display = "none";
    }
  });

  // deck kunnen bewerken
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

  document.querySelectorAll(".deck-item").forEach((item) => {
    const link = item.querySelector("a");
    item.addEventListener("click", (e) => {
      // er voor zorgt dat je niet kan doorklikken als je op verwijderd of bewerken drukt
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
