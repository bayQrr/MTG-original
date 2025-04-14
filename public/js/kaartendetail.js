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

    const increaseBtn = document.querySelector(".increase-btn");
    const decreaseBtn = document.querySelector(".decrease-btn");
    const cardCountSpan = document.getElementById("cardCount");

    let count = 1;

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

            popupTitle.textContent = name;
            popupType.textContent = type;
            popupMana.textContent = manaCost;
            popupRarity.textContent = rarity;
            popupPowerToughness.textContent = `Power: ${power}, Toughness: ${toughness}`;
            popupText.textContent = text;
            popupImg.src = imageUrl;

            count = 1;
            if (cardCountSpan) cardCountSpan.textContent = count;

            popup.style.display = "block";
        });

        const rarity = kaart.getAttribute("data-rarity");
        if (rarity) {
            kaart.classList.add(rarity.toLowerCase());
        }
    });

    closeBtn?.addEventListener("click", () => popup.style.display = "none");
    window.addEventListener("click", (e) => {
        if (e.target === popup) popup.style.display = "none";
    });

    increaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        count++;
        cardCountSpan.textContent = count;
    });

    decreaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        if (count > 1) {
            count--;
            cardCountSpan.textContent = count;
        }
    });

    showPage(currentPage); // <-- Herlaad huidige pagina
}

let currentPage = 1;
const kaartenPerPagina = 8;

function showPage(page) {
    const kaartenArray = Array.from(document.querySelectorAll(".kaart"));
    const startIndex = (page - 1) * kaartenPerPagina;
    const endIndex = page * kaartenPerPagina;

    kaartenArray.forEach(kaart => kaart.style.display = "none");
    kaartenArray.slice(startIndex, endIndex).forEach(kaart => kaart.style.display = "block");

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

    if (prevButton) prevButton.disabled = (page === 1);
    if (nextButton) nextButton.disabled = (page === totaalPaginas);
}

document.addEventListener("DOMContentLoaded", function () {
    initialiseerKaarten();

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

    // Live zoeken
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
});
document.addEventListener("DOMContentLoaded", function () {
    const addBtn = document.querySelector(".add-btn");
    const dropdown = document.querySelector(".deck-dropdown");

    if (addBtn && dropdown) {
        addBtn.addEventListener("click", function (event) {
            event.preventDefault(); // voorkom standaard submit gedrag
            dropdown.classList.toggle("hidden");
        });
    }
});
document.querySelectorAll('.kaart').forEach(kaart => {
    kaart.addEventListener('click', function() {
        const cardName = this.dataset.name;
        document.getElementById('cardNameInput').value = cardName;  
        document.getElementById('popupTitle').innerText = cardName; 
        document.getElementById('kaartPopup').style.display = "block"; 
    });
});


document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('kaartPopup').style.display = "none";
});