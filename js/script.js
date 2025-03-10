document.addEventListener("DOMContentLoaded", function () {
    const sliderItems = document.querySelectorAll(".slider-item");
    const leftArrow = document.querySelector(".slider-arrow-left");
    const rightArrow = document.querySelector(".slider-arrow-right");
    let currentIndex = 0;
  
    function updateSlider() {
      if (window.innerWidth <= 800) {
        // Toon maar één item op kleine schermen
        sliderItems.forEach((item, index) => {
          if (index === currentIndex) {
            item.style.display = "flex";
            item.classList.add("active");
          } else {
            item.style.display = "none";
            item.classList.remove("active");
          }
        });
      } else if (window.innerWidth <= 1300) {
        // Toon drie items op middelgrote schermen
        sliderItems.forEach((item, index) => {
          if (index >= currentIndex && index < currentIndex + 3) {
            item.style.display = "flex";
            if (index === currentIndex + 1) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          } else {
            item.style.display = "none";
          }
        });
      }
    }
  
    leftArrow.addEventListener("click", () => {
      if (window.innerWidth <= 800) {
        // Voor kleine schermen
        currentIndex =
          (currentIndex - 1 + sliderItems.length) % sliderItems.length;
      } else if (currentIndex > 0) {
        // Voor grotere schermen
        currentIndex--;
      }
      updateSlider();
    });
  
    rightArrow.addEventListener("click", () => {
      if (window.innerWidth <= 800) {
        // Voor kleine schermen
        currentIndex = (currentIndex + 1) % sliderItems.length;
      } else if (currentIndex < sliderItems.length - 3) {
        // Voor grotere schermen
        currentIndex++;
      }
      updateSlider();
    });
  
    // Update slider bij laden en resizen van het venster
    window.addEventListener("resize", updateSlider);
    updateSlider();
  });
  