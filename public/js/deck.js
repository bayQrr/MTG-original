document.addEventListener("DOMContentLoaded", () => {
    const addDeckBtn = document.getElementById("add-deck-btn");
    const deckPopup = document.getElementById("deck-popup");
    const closeBtn = document.querySelector(".deck-close-btn");
    const deckForm = document.getElementById("popup-deck-form");
    const deckIdInput = document.getElementById("deck-id");
    const nameInput = document.getElementById("deck-name");
    const imageInput = document.getElementById("deck-img-url");

    // Toevoegen aan de hand van de deckRouter.ts
    addDeckBtn.addEventListener("click", (event) => {
        event.preventDefault();
        deckForm.action = "/create-deck";
        nameInput.value = "";
        imageInput.value = "";
        deckPopup.style.display = "flex";
    });

    // Sluiten
    closeBtn.addEventListener("click", () => {
        deckPopup.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === deckPopup) {
            deckPopup.style.display = "none";
        }
    });

    // dit zorgt ervoor dat je kan bewerken aan de hand van de deckRouter.ts
    const editButtons = document.querySelectorAll(".edit-deck-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const name = button.getAttribute("data-name");
            const image = button.getAttribute("data-image");

            deckForm.action = `/edit-deck/${id}`;
            nameInput.value = name;
            imageInput.value = image;
            deckPopup.style.display = "flex";
        });
    });



    document.querySelectorAll(".deck-item").forEach(item => {
        const link = item.querySelector("a");
        item.addEventListener("click", (e) => {
            // Voorkom dat je doorklikt als je op een knop (bewerk/verwijder) klikt
            if (e.target.closest("button")) return;
            if (link) window.location.href = link.href;
        });
    });

});
