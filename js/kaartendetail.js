document.addEventListener("DOMContentLoaded", function () {
    const kaarten = document.querySelectorAll(".kaart");
    const popup = document.getElementById("kaartPopup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    const closeButton = document.querySelector(".close");

//    kaarten verhogen/verlagen
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

    // Kaarten klikken om die details te tonen
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

    // Sluit bij sliotknop
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
