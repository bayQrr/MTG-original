document.addEventListener("DOMContentLoaded", function () {
    const kaarten = document.querySelectorAll(".kaart");
    const popup = document.getElementById("kaartPopup");
    const popupImg = document.getElementById("popupImg");
    const popupTitle = document.getElementById("popupTitle");
    const closeButton = document.querySelector(".close");
    const searchBar = document.getElementById("searchBar");

  
    // Kaarten aanklikken om details te tonen
    kaarten.forEach(kaart => {
        kaart.addEventListener("click", function () {
            let imgSrc = this.querySelector("img").src;
            let naam = this.querySelector("p").textContent;

            popupImg.src = imgSrc;
            popupTitle.textContent = naam;
            popup.style.display = "flex";
        });
    });

    // Sluit popup bij klikken op de sluitknop
    closeButton.addEventListener("click", function () {
        popup.style.display = "none";
    });

    // Sluit popup bij klikken buiten de content
    popup.addEventListener("click", function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});
