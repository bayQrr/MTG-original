let currentPage = 1;
const kaartenPerPagina = 4;

function showPage(page) {
    const kaartenArray = Array.from(document.querySelectorAll(".kaart"));
    const startIndex = (page - 1) * kaartenPerPagina;
    const endIndex = page * kaartenPerPagina;

    kaartenArray.forEach(kaart => (kaart.style.display = "none"));
    kaartenArray.slice(startIndex, endIndex).forEach(kaart => (kaart.style.display = "block"));

    currentPage = page;
    updatePagination(page);
}

function updatePagination(page) {
    const kaarten = document.querySelectorAll(".kaart");
    const totaalPaginas = Math.ceil(kaarten.length / kaartenPerPagina);
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const pageButtons = document.querySelectorAll(".page-btn[data-page]");

    pageButtons.forEach(button => {
        button.classList.remove("active");
        if (parseInt(button.dataset.page) === page) {
            button.classList.add("active");
        }
    });

    if (prevButton) prevButton.disabled = page === 1;
    if (nextButton) nextButton.disabled = page === totaalPaginas;
}

function initialiseerKaarten() {
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

    // element voor de teller
    const increaseBtn = document.querySelector(".increase-btn");
    const decreaseBtn = document.querySelector(".decrease-btn");
    const cardCountSpan = document.getElementById("cardCount");
    const cardCountInput = document.getElementById("cardCountInput");

    let count = 1;

    kaarten.forEach(kaart => {
        kaart.addEventListener("click", function () {
            const cardId = kaart.getAttribute("data-card-id"); 
            const name = kaart.getAttribute("data-name");
            const type = kaart.getAttribute("data-type");
            const manaCost = kaart.getAttribute("data-mana-cost");
            const rarity = kaart.getAttribute("data-rarity");
            const power = kaart.getAttribute("data-power");
            const toughness = kaart.getAttribute("data-toughness");
            const text = kaart.getAttribute("data-text");
            const imageUrl = kaart.querySelector("img").src;
          const blurWrapper = document.getElementById("mainContent");

            // popup-elementen invullen
            popupTitle.textContent = name;
            popupType.textContent = type;
            popupMana.textContent = manaCost;
            popupRarity.textContent = rarity;
            popupPowerToughness.textContent = `Power: ${power}, Toughness: ${toughness}`;
            popupText.textContent = text;
            popupImg.src = imageUrl;
           
            if (cardId) {
                const cardIdInput = document.getElementById("cardIdInput");
                if (cardIdInput) {
                    cardIdInput.value = cardId;
                }
            }

            const cardNameInput = document.getElementById("cardNameInput");
            if (cardNameInput) {
                cardNameInput.value = name;
            }

            // reset de teller
            count = 1;
            if (cardCountSpan) cardCountSpan.textContent = count;
            if (cardCountInput) cardCountInput.value = count;

            // toont de popup
            popup.style.display = "block";
               blurWrapper.classList.add("blur"); 
            
        });

        // voeg klasse op basis van rarity
        const kaartRarity = kaart.getAttribute("data-rarity");
        if (kaartRarity) {
            kaart.classList.add(kaartRarity.toLowerCase());
        }
    });

    // bij het klikken op de close btn in popupcontainer, wordt de achtergrond blurr terug weggehaald
    closeBtn?.addEventListener("click", () => {
    popup.style.display = "none";
    document.getElementById("mainContent")?.classList.remove("blur");
});

window.addEventListener("click", e => {
    if (e.target === popup) {
        popup.style.display = "none";
        document.getElementById("mainContent")?.classList.remove("blur");
    }
});
    increaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        count++;
        if (cardCountSpan) cardCountSpan.textContent = count;
        if (cardCountInput) cardCountInput.value = count;
    });

    decreaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        if (count > 1) {
            count--;
            if (cardCountSpan) cardCountSpan.textContent = count;
            if (cardCountInput) cardCountInput.value = count;
        }
    });

    // roept de paginering aan
    showPage(currentPage);
}

document.querySelectorAll(".kaart").forEach(kaart => {
    kaart.addEventListener("click", function () {
        const cardName = this.dataset.name;
        const cardNameInput = document.getElementById("cardNameInput");
        if (cardNameInput) {
            cardNameInput.value = cardName;
        }
        const popupTitle = document.getElementById("popupTitle");
        if (popupTitle) {
            popupTitle.innerText = cardName;
        }
        const kaartPopup = document.getElementById("kaartPopup");
        if (kaartPopup) {
            kaartPopup.style.display = "block";
        }
    });
});

document.querySelector(".close")?.addEventListener("click", function () {
    const popup = document.getElementById("kaartPopup");
    if (popup) {
        popup.style.display = "none";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    initialiseerKaarten();

    // paginering
    document.querySelector(".prev")?.addEventListener("click", function () {
        if (currentPage > 1) showPage(currentPage - 1);
    });

    document.querySelector(".next")?.addEventListener("click", function () {
        const totaalPaginas = Math.ceil(document.querySelectorAll(".kaart").length / kaartenPerPagina);
        if (currentPage < totaalPaginas) showPage(currentPage + 1);
    });

    document.querySelectorAll(".page-btn[data-page]").forEach(button => {
        button.addEventListener("click", function () {
            const selectedPage = parseInt(this.dataset.page);
            showPage(selectedPage);
        });
    });

    // actief zoeken
    const zoekInput = document.getElementById("searchBar");
    const kaartContainer = document.getElementById("kaartContainer");

    zoekInput.addEventListener("input", async () => {
        const zoekterm = zoekInput.value;
        try {
            const response = await fetch(`/cards?zoekterm=${encodeURIComponent(zoekterm)}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const nieuweKaarten = doc.querySelector("#kaartContainer");
            if (nieuweKaarten) {
                kaartContainer.innerHTML = nieuweKaarten.innerHTML;
                initialiseerKaarten();
            }
        } catch (err) {
            console.error("Fout bij zoeken:", err);
        }
    });

    // dropdown voor deck-selectie
    const addBtn = document.querySelector(".add-btn");
    const dropdown = document.querySelector(".deck-dropdown");
    if (addBtn && dropdown) {
        addBtn.addEventListener("click", function (event) {
            event.preventDefault(); // voorkom standaard submit gedrag
            dropdown.classList.toggle("hidden");
        });
    }
});
