document.addEventListener("DOMContentLoaded", function () {
    const kaarten = document.querySelectorAll(".kaart");
    const popup = document.getElementById("kaartPopup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    const closeButton = document.querySelector(".close");

    // Kaarten verhogen/verlagen
    const increaseBtn = document.querySelector(".increase-btn");
    const decreaseBtn = document.querySelector(".decrease-btn");
    const cardCount = document.getElementById("cardCount");

    let count = 1;


   
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

    // Kaarten klikken om details te tonen
    kaarten.forEach(kaart => {
        kaart.addEventListener("click", function () {
            let imgSrc = this.querySelector("img").src;
            let naam = this.querySelector("p").textContent;

            popupImg.src = imgSrc;
            popupTitle.textContent = naam;
            popup.style.display = "flex";

            // Reset teller naar 1 bij openen van popup
            count = 1;
            cardCount.textContent = count;
        });
    });

    // Sluit bij klik op de sloitknop
    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Sluit popup bij klikken ergens buiten de container
    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});

// Toevoegen aan deck functie 
document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-btn");
    const dropdown = document.querySelector(".deck-dropdown");

    addButton.addEventListener("click", function (event) {
        event.preventDefault(); 
        dropdown.classList.toggle("hidden"); 
    });
});

// kaarten ophalen n op via  API
document.addEventListener("DOMContentLoaded", function () {
    const kaartenContainer = document.getElementById("kaartContainer");

    fetch("https://api.magicthegathering.io/v1/cards")
        .then(response => response.json())
        .then(data => {
            renderKaarten(data.cards);
        })
        .catch(error => console.error("Fout bij het ophalen van kaarten:", error));
});

function renderKaarten(kaarten) {
    const kaartenContainer = document.getElementById("kaartContainer");
    kaartenContainer.innerHTML = ''; // Leegmaken eerst

    // enkel eerste 4 tonen (dit moet nog aangepast worden zodat dit bij elke pagina wordt gedaan)
    const maxKaarten = kaarten.slice(0, 8); // enkel eerste 4

    //  telkens 4 kaarten per rij
    for (let i = 0; i < maxKaarten.length; i += 4) {
        const rij = document.createElement('section');
        rij.classList.add('rij');

        // Voeg 4 kaarten toe aan deze rij
        for (let j = i; j < i + 4 && j < maxKaarten.length; j++) {
            const kaart = maxKaarten[j];
            const kaartElement = document.createElement('section');
            kaartElement.classList.add('kaart', kaart.rarity?.toLowerCase() || 'common');

            const kaartNaam = document.createElement('p');
            kaartNaam.textContent = kaart.name;

            const kaartAfbeelding = document.createElement('img');
            kaartAfbeelding.src = kaart.imageUrl || "/assets/images/cardExample.jpg";

            kaartElement.appendChild(kaartNaam);
            kaartElement.appendChild(kaartAfbeelding);

            kaartElement.addEventListener("click", function () {
                showDetails(kaart);
            });

            rij.appendChild(kaartElement);
        }

        kaartenContainer.appendChild(rij);
    }
}

// Toon de details van een kaart in de popup
function showDetails(kaart) {
    const popup = document.getElementById("kaartPopup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    
//  popup toont img en titel 
    popupImg.src = kaart.imageUrl || "/assets/images/cardExample.jpg";
    popupTitle.textContent = kaart.name;

// specificaties (nog te bespreken in groep welke we moeten nemen)
    document.getElementById("popupType").textContent = kaart.type || "";
    document.getElementById("popupMana").textContent = kaart.manaCost || "";
    document.getElementById("popupRarity").textContent = kaart.rarity || "";
    document.getElementById("popupSet").textContent = kaart.set || "";
    document.getElementById("popupPowerToughness").textContent = (kaart.power && kaart.toughness) ? `${kaart.power}/${kaart.toughness}` : "";
    document.getElementById("popupText").textContent = kaart.text || "";
    document.getElementById("popupFlavor").textContent = kaart.flavor || "";
    document.getElementById("popupArtist").textContent = kaart.artist || "";
    //  popup zichtbaar mken
    popup.style.display = "flex";
}

// Sluit de popup wanneer op de close button wordt geklikt
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById("kaartPopup").style.display = "none";
});
