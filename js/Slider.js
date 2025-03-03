document.addEventListener("DOMContentLoaded", function () {
    // Check of het een mobiel apparaat is
    const isMobile = window.innerWidth <= 768;
  
    if (isMobile) {
      const sliderItems = document.querySelectorAll(".slider-item");
      const prevButton = document.querySelector(".slider-arrow-left");
      const nextButton = document.querySelector(".slider-arrow-right");
      let currentIndex = Array.from(sliderItems).findIndex((item) =>
        item.classList.contains("active")
      );
  
      // Als er geen actieve slide is, maak de eerste actief
      if (currentIndex === -1) {
        currentIndex = 0;
        sliderItems[0].classList.add("active");
      }
  
      function showSlide(index) {
        // Bereken nieuwe index met wrap-around
        if (index >= sliderItems.length) index = 0;
        if (index < 0) index = sliderItems.length - 1;
  
        // Verberg huidige slide
        const currentSlide = sliderItems[currentIndex];
        currentSlide.style.opacity = "0";
  
        setTimeout(() => {
          // Verwijder active class van alle slides
          sliderItems.forEach((item) => {
            item.classList.remove("active");
            item.style.display = "none";
          });
  
          // Toon nieuwe slide
          const newSlide = sliderItems[index];
          newSlide.style.display = "flex";
          newSlide.classList.add("active");
  
          setTimeout(() => {
            newSlide.style.opacity = "1";
          }, 50);
  
          currentIndex = index;
        }, 500); // Wacht op fade-out animatie
      }
  
      // Event listeners voor de pijlen
      prevButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
      });
  
      nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
      });
  
      // Toetsenbord navigatie
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          showSlide(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
          showSlide(currentIndex + 1);
        }
      });
  
      // Update bij schermgrootte verandering
      window.addEventListener("resize", function () {
        const newIsMobile = window.innerWidth <= 768;
        if (!newIsMobile) {
          sliderItems.forEach((item) => {
            item.style.display = "flex";
            item.style.opacity = "1";
            item.classList.remove("active");
            item.style.position = "relative";
          });
        }
      });
    }
  });
  