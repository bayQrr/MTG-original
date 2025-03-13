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

document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.getElementById("slider-images");
  const sliderItems = document.querySelectorAll(".slider-item");
  const leftArrow = document.querySelector(".slider-arrow-left");
  const rightArrow = document.querySelector(".slider-arrow-right");

  let currentIndex = 0;
  const totalItems = sliderItems.length;

  // Functie om items te reorganiseren
  function updateSlider(direction) {
    // Bereken nieuwe index
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    } else {
      currentIndex = (currentIndex + 1) % totalItems;
    }

    // Verwijder active class van alle items
    sliderItems.forEach((item) => item.classList.remove("active"));

    // Voeg active class toe aan huidige item
    sliderItems[currentIndex].classList.add("active");

    // Bereken de verschuiving om het actieve item te centreren
    const itemWidth = 165; // 150px + 15px gap
    const offset = -currentIndex * itemWidth;
    const centerOffset = (window.innerWidth - 350) / 2 - 100; // 350px is de breedte van het actieve item

    // Pas de transform toe met een vloeiende transitie
    sliderContainer.style.transform = `translateX(${offset + centerOffset}px)`;

    // Als we bij het einde of begin zijn, bereid dan voor op de overgang
    if (currentIndex === totalItems - 1 || currentIndex === 0) {
      setTimeout(() => {
        sliderContainer.style.transition = "none";
        if (currentIndex === totalItems - 1) {
          // Voorbereiden om terug naar het begin te gaan
          sliderContainer.style.transform = `translateX(${centerOffset}px)`;
        } else if (currentIndex === 0) {
          // Voorbereiden om naar het einde te gaan
          sliderContainer.style.transform = `translateX(${
            -((totalItems - 1) * itemWidth) + centerOffset
          }px)`;
        }
        setTimeout(() => {
          sliderContainer.style.transition = "transform 0.5s ease";
        }, 50);
      }, 500);
    }
  }

  // Event listeners voor pijlen
  leftArrow.addEventListener("click", () => {
    updateSlider("left");
  });

  rightArrow.addEventListener("click", () => {
    updateSlider("right");
  });

  // Keyboard navigatie
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      updateSlider("left");
    } else if (e.key === "ArrowRight") {
      updateSlider("right");
    }
  });

  // Initialiseer eerste actieve item
  sliderItems[currentIndex].classList.add("active");
  const centerOffset = (window.innerWidth - 350) / 2 - 100;
  sliderContainer.style.transform = `translateX(${centerOffset}px)`;

  // Update centrering bij window resize
  window.addEventListener("resize", () => {
    const centerOffset = (window.innerWidth - 350) / 2 - 100;
    const itemWidth = 165;
    const offset = -currentIndex * itemWidth;
    sliderContainer.style.transform = `translateX(${offset + centerOffset}px)`;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const sliderItems = document.querySelectorAll(".slider-item");
  const leftArrow = document.querySelector(".slider-arrow-left");
  const rightArrow = document.querySelector(".slider-arrow-right");

  let currentIndex = Array.from(sliderItems).findIndex((item) =>
    item.classList.contains("active")
  );
  if (currentIndex === -1) currentIndex = 0;

  function updateSlider(newIndex) {
    // Verwijder active class van huidige item
    sliderItems[currentIndex].classList.remove("active");

    // Update index met circulaire logica
    if (newIndex < 0) {
      newIndex = sliderItems.length - 1;
    } else if (newIndex >= sliderItems.length) {
      newIndex = 0;
    }

    // Voeg active class toe aan nieuwe item
    sliderItems[newIndex].classList.add("active");

    // Scroll het actieve item in beeld
    sliderItems[newIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    currentIndex = newIndex;
  }

  // Event listeners voor pijlen
  leftArrow.addEventListener("click", () => {
    updateSlider(currentIndex - 1);
  });

  rightArrow.addEventListener("click", () => {
    updateSlider(currentIndex + 1);
  });

  // Event listeners voor items
  sliderItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateSlider(index);
    });
  });

  // Keyboard navigatie
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      updateSlider(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      updateSlider(currentIndex + 1);
    }
  });

  // Initialiseer eerste actieve item
  updateSlider(currentIndex);
});
