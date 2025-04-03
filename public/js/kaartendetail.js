document.addEventListener("DOMContentLoaded", function () {
  const kaarten = document.querySelectorAll(".kaart");
  const popup = document.getElementById("kaartPopup");
  const popupImg = document.getElementById("popupImg");
  const popupTitle = document.getElementById("popupTitle");
  const popupType = document.getElementById("popupType");
  const popupMana = document.getElementById("popupMana");
  const popupRarity = document.getElementById("popupRarity");
  const popupPowerToughness = document.getElementById("popupPowerToughness");
  const popupText = document.getElementById("popupText");
  const closeBtn = document.querySelector(".close");

  // Open de popup bij klik op een kaart
  kaarten.forEach(kaart => {
      kaart.addEventListener("click", function () {
          const name = kaart.getAttribute("data-name");
          const type = kaart.getAttribute("data-type");
          const manaCost = kaart.getAttribute("data-mana-cost");
          const rarity = kaart.getAttribute("data-rarity");
          const power = kaart.getAttribute("data-power");
          const toughness = kaart.getAttribute("data-toughness");
          const text = kaart.getAttribute("data-text");
          const imageUrl = kaart.querySelector("img").src;

          // Vul de popup met de kaartgegevens
          popupTitle.textContent = name;
          popupType.textContent = type;
          popupMana.textContent = manaCost;
          popupRarity.textContent = rarity;
          popupPowerToughness.textContent = `Power: ${power}, Toughness: ${toughness}`;
          popupText.textContent = text;
          popupImg.src = imageUrl;

          // Toon de popup
          popup.style.display = "block";
      });
  });

  // Sluit de popup als op de sluitknop wordt geklikt
  closeBtn.addEventListener("click", function () {
      popup.style.display = "none";
  });

  // Sluit de popup als ergens buiten de popup wordt geklikt
  window.addEventListener("click", function (e) {
      if (e.target === popup) {
          popup.style.display = "none";
      }
  });
});


let currentPage = 1;
const kaartenPerPagina = 8;

function showPage(page) {
    const startIndex = (page - 1) * kaartenPerPagina;
    const endIndex = page * kaartenPerPagina;
    const kaarten = document.querySelectorAll(".kaart");
    const kaartenArray = Array.from(kaarten);

    // Verberg alle kaarten
    kaartenArray.forEach(kaart => {
        kaart.style.display = "none";
    });

    // Toon de kaarten voor de huidige pagina
    const cardsToShow = kaartenArray.slice(startIndex, endIndex);
    cardsToShow.forEach(kaart => {
        kaart.style.display = "block";
    });

    // Update de paginering knoppen
    updatePagination(page);
}

function updatePagination(page) {
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const pageButtons = document.querySelectorAll(".page-btn");

    // Zet de 'active' klasse op de huidige pagina
    pageButtons.forEach(button => {
        button.classList.remove("active");
        if (parseInt(button.dataset.page) === page) {
            button.classList.add("active");
        }
    });

    // Zet de prev en next knoppen inactief indien nodig
    prevButton.disabled = (page === 1);
    nextButton.disabled = (page === Math.ceil(document.querySelectorAll(".kaart").length / kaartenPerPagina));
}

document.querySelector(".prev").addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
});

document.querySelector(".next").addEventListener("click", function () {
    if (currentPage < Math.ceil(document.querySelectorAll(".kaart").length / kaartenPerPagina)) {
        currentPage++;
        showPage(currentPage);
    }
});

document.querySelectorAll(".page-btn").forEach(button => {
    button.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        showPage(currentPage);
    });
});

// Initialiseer de eerste pagina
showPage(currentPage);

