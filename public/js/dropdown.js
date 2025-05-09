// public/js/deckview.js (of waar je het ook hebt)
document.addEventListener("DOMContentLoaded", function () {
    const deckSelector = document.getElementById("deck-selector");
    if (!deckSelector) return;

    deckSelector.addEventListener("change", function () {
        const selectedDeckId = deckSelector.value;
        if (selectedDeckId !== "") {
            // Redirect naar de deckview pagina van het geselecteerde deck
            window.location.href = `/deckview/${selectedDeckId}`;
        }
    });
});
