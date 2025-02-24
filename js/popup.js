// Get the popup
let popup = document.getElementById("popup");
let closePopup = document.getElementById("close-popup");

// Function to show the popup
function showPopup() {
    popup.classList.add("active"); // Show the popup by adding the active class
}

// Function to hide the popup
function hidePopup() {
    popup.classList.remove("active"); // Hide the popup by removing the active class
}

// Add event listeners to the slider items
let sliderItems = document.querySelectorAll('.wrong-slider a');

sliderItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
       let  title = item.querySelector('h2').innerText;
        
        // Check if the clicked item is "Magic The Gathering"
        if (title === "Magic The Gathering") {
            return; // Do nothing if the item is "Magic The Gathering"
        }

        // For other items, show the popup
        event.preventDefault(); // Prevent the default link behavior
        showPopup(); // Show the popup
    });
});

// When the user clicks on <span> (x), close the popup
closePopup.onclick = function() {
    hidePopup();
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        hidePopup();
    }
}
