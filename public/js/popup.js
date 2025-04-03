
let popup = document.getElementById("popup");
let closePopup = document.getElementById("close-popup");


function showPopup() {
    popup.classList.add("active"); 
}


function hidePopup() {
    popup.classList.remove("active"); 
}


let sliderItems = document.querySelectorAll('.wrong-slider a');

sliderItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
       let  title = item.querySelector('h2').innerText;
        
       
        if (title === "Magic The Gathering") {
            return; 
        }

        event.preventDefault(); 
        showPopup(); 
    });
});

// alsje op de  (x) drukt, sluit de popup
closePopup.onclick = function() {
    hidePopup();
}

// buiten de popup klikken sluit de pop up
window.onclick = function(event) {
    if (event.target == popup) {
        hidePopup();
    }
}
