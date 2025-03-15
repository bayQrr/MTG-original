document.addEventListener("DOMContentLoaded", function () {
  const sliderItems = document.querySelectorAll(".slider-item");
  const nextButton = document.querySelector(".slider-arrow-right");
  const prevButton = document.querySelector(".slider-arrow-left");
  let currentIndex = 0;

  if (!nextButton || !prevButton ||  sliderItems.length === 0) {
      console.error("FOUT: Knoppen of slider-items niet gevonden!");
      return;
  }


  function updateSlider() {
    const screenWidth = window.innerWidth;

    sliderItems.forEach((item, index) => {

      if (screenWidth > 768) {
        item.style.display = "block";
      } else {
        if (index === currentIndex) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      }
    });
  }


  nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % sliderItems.length;
      updateSlider();
  });

  // Vorige afbeelding
  prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + sliderItems.length) % sliderItems.length;
      updateSlider();
  });

  updateSlider(); 

  window.addEventListener('resize', updateSlider);
});