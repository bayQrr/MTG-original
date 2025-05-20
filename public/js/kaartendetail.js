
let currentPage = 1;//pagina waar je nu in zit
const kaartenPerPagina = 4; //vertoont 4 kaarten per pagina

//deze functie toont enkel de kaarten van de pagina's da ik kies
function showPage(page) {
    const kaartenArray = Array.from(document.querySelectorAll(".kaart"));
    const startIndex = (page - 1) * kaartenPerPagina;
    const endIndex = page * kaartenPerPagina;

    kaartenArray.forEach(kaart => (kaart.style.display = "none"));//de api eerst verbergen
    kaartenArray.slice(startIndex, endIndex).forEach(kaart => (kaart.style.display = "block"));//dan alle kaarten tonen die horen op die pagina

    currentPage = page;// pagina waar je nu in zit bewerken
    updatePagination(page); //knoppen updaten (1,2,3...)
}
//functie mbt de paginatie
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
// als je op de eerste pagina/laatste pagina zit en je klikt op volgende, dan blijf je op die pagina
    if (prevButton) prevButton.disabled = page === 1;
    if (nextButton) nextButton.disabled = page === totaalPaginas;
}

// functie mbt de kaarten en popup
function initialiseerKaarten() {
    // api info
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
// knop  aantal toevoegen
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
// info in de popup zetten, die info werd gehaald uit api met mongodb
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
// teller resetten
            count = 1;
            if (cardCountSpan) cardCountSpan.textContent = count;
            if (cardCountInput) cardCountInput.value = count;
// popup wordt getoond, de achtergrond wordt geblurred
            popup.style.display = "block";
            blurWrapper.classList.add("blur");
        });
// de rarity 
        const kaartRarity = kaart.getAttribute("data-rarity");
        if (kaartRarity) {
            kaart.classList.add(kaartRarity.toLowerCase());
        }
    });
// als je op kruisknop klikt sluit de popup
    closeBtn?.addEventListener("click", () => {
        popup.style.display = "none";//popup verdwijnen
        document.getElementById("mainContent")?.classList.remove("blur");//de blurry achtegrond weg doen
    });
//zelfde principe maar met het klikken buiten de popup
    window.addEventListener("click", e => {
        if (e.target === popup) {
            popup.style.display = "none";
            document.getElementById("mainContent")?.classList.remove("blur");
        }
    });
//als je klikt op + dan verhoogd aantal (bij kaarten toevoegen)
    increaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        count++;
        if (cardCountSpan) cardCountSpan.textContent = count;
        if (cardCountInput) cardCountInput.value = count;
    });
//als je klikt op - dan verlaagd aantal (bij kaarten toevoegen)
    decreaseBtn?.addEventListener("click", function (e) {
        e.preventDefault();
        if (count > 1) {
            count--;
            if (cardCountSpan) cardCountSpan.textContent = count;
            if (cardCountInput) cardCountInput.value = count;
        }
    });

    // Roept de showPage aan na initialisatie vn de kaarten
    showPage(currentPage);
}

document.addEventListener("DOMContentLoaded", function () {
    initialiseerKaarten();//functie aanroepen
//paginering van vorige pagina
    document.querySelector(".prev")?.addEventListener("click", function () {
        if (currentPage > 1) showPage(currentPage - 1);
    });
// paginering van volgende pagina
    document.querySelector(".next")?.addEventListener("click", function () {
        const totaalPaginas = Math.ceil(document.querySelectorAll(".kaart").length / kaartenPerPagina);
        if (currentPage < totaalPaginas) showPage(currentPage + 1);
    });
// paginering van het kiezen van de pagina
    document.querySelectorAll(".page-btn[data-page]").forEach(button => {
        button.addEventListener("click", function () {
            const selectedPage = parseInt(this.dataset.page);
            showPage(selectedPage);
        });
    });

    // Live zoeken met zoekbalk, als je al paar letters schrijft versijnen er al kaarten dat start met die letters
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
// dropdown bij voegen van een kaart 
    const addBtn = document.querySelector(".add-btn");
    const dropdown = document.querySelector(".deck-dropdown");
    if (addBtn && dropdown) {
        addBtn.addEventListener("click", function (event) {
            event.preventDefault();
            dropdown.classList.toggle("hidden");
        });
    }
});
