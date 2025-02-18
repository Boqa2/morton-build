const anime = document.querySelector(".mt1");
const anime2 = document.querySelectorAll(".animes");
const containerHover = document.querySelector(".foto-slide");

document.addEventListener("DOMContentLoaded", function () {
  const slidesContainer = document.querySelector(".inner-swiper");
  const slides = document.querySelectorAll(".slide");
  const menuItems = document.querySelectorAll(".link");
  const header = document.querySelector("header");

  let currentIndex = 2;
  let slideHeight = document.querySelector(".slide").clientHeight;
  //   let autoSlideInterval;
  let isScrolling = false;
  let lastTouchY = 0;
  let lastScrollTime = 0;
  const SCROLL_DELAY = 800;
  const SWIPE_THRESHOLD = 100;
  let previousIndex = 0;

  function updateSlider() {
    slidesContainer.style.transform = `translateY(${
      -currentIndex * slideHeight
    }px)`;
    menuItems.forEach((item, index) =>
      item.classList.toggle("active", index === currentIndex)
    );
    if (currentIndex == 1) {
      header.style.background = "#000";
    } else {
      header.style.background = "transparent";
    }
    updateAnimation();
    previousIndex = currentIndex;
  }

  function updateAnimation() {
    if (currentIndex === 0 && previousIndex !== 0) {
      anime.classList.add("forTopFade");
      anime.classList.remove("forTopFade2");
      anime2.forEach((span) => {
        span.classList.add("forTopFade");
        span.classList.remove("forTopFade2");
      });
    } else if (currentIndex !== 0 && previousIndex === 0) {
      anime.classList.add("forTopFade2");
      anime.classList.remove("forTopFade");
      anime2.forEach((span) => {
        span.classList.add("forTopFade2");
        span.classList.remove("forTopFade");
      });
    }

    if (currentIndex === 2 && previousIndex !== 2) {
      anime2.forEach((span) => {
        span.classList.add("forTopFade");
        span.classList.remove("forTopFade2");
      });
    } else if (currentIndex !== 2 && previousIndex === 2) {
      anime2.forEach((span) => {
        span.classList.add("forTopFade2");
        span.classList.remove("forTopFade");
      });
    }
  }
  function changeSlide(delta) {
    const now = Date.now();
    if (isScrolling || now - lastScrollTime < SCROLL_DELAY) return;
    isScrolling = true;
    lastScrollTime = now;

    currentIndex = (currentIndex + delta + slides.length) % slides.length;
    updateSlider();

    setTimeout(() => (isScrolling = false), 600);
  }

  //   function startAutoSlide() {
  //     autoSlideInterval = setInterval(() => changeSlide(1), 12000);
  //   }
  window.goToSlide = function (index) {
    previousIndex = currentIndex; // Сохраняем прошлый индекс
    currentIndex = index;
    updateSlider();
    clearInterval(autoSlideInterval);
  };
  slidesContainer.addEventListener("touchstart", (event) => {
    lastTouchY = event.touches[0].clientY;
  });
  slidesContainer.addEventListener("touchmove", (event) => {
    let touchY = event.touches[0].clientY;
    let deltaY = lastTouchY - touchY;
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      changeSlide(deltaY > 0 ? 1 : -1);
      lastTouchY = touchY;
    }
  });
  //   slidesContainer.addEventListener("mouseenter", () =>
  //     clearInterval(autoSlideInterval)
  //   );
  //   slidesContainer.addEventListener("mouseleave", startAutoSlide);
  menuItems.forEach((item) =>
    item.addEventListener("click", () => {
      currentIndex = parseInt(item.getAttribute("data-slide-index"));
      updateSlider();
    })
  );

  slidesContainer.addEventListener("wheel", (event) => {
    if (
      Math.abs(event.deltaY) > Math.abs(event.deltaX) &&
      Math.abs(event.deltaY) > 50
    ) {
      changeSlide(event.deltaY > 0 ? 1 : -1);
    }
  });

  updateSlider();
  //   startAutoSlide();
});

document.addEventListener("DOMContentLoaded", () => {
  function initSlider(slider, slide) {
    const slidesContainer = document.querySelector(slider);
    const slides = document.querySelectorAll(slide);
    const prevButton = document.querySelector(".custom-prevs");
    const nextButton = document.querySelector(".custom-nexts");
    const dotsContainer = document.querySelector(".dots");
    let slideWidth = slides[0].offsetWidth;
    let currentIndex = 0;
    let autoSlideDirection = 1; // 1 - вперед, -1 - назад
    let autoSlideInterval;

    function updateSlider(transition = true) {
      slideWidth = slides[0].offsetWidth;
      slidesContainer.style.transition = transition
        ? "transform 0.4s ease-in-out"
        : "none";
      slidesContainer.style.transform = `translateX(${
        -currentIndex * slideWidth
      }px)`;
      updateDots();
      updateButtons();
    }

    function updateButtons() {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === slides.length - 1;
      prevButton
        .querySelectorAll(".line")
        .forEach((line) =>
          line.classList.toggle("inactive", currentIndex === 0)
        );
      nextButton
        .querySelectorAll(".line")
        .forEach((line) =>
          line.classList.toggle("inactive", currentIndex === slides.length - 1)
        );
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
      } else {
        autoSlideDirection = -1; // Меняем направление
        currentIndex--;
      }
      updateSlider();
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        autoSlideDirection = 1; // Меняем направление
        currentIndex++;
      }
      updateSlider();
    }

    function createDots() {
      for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        dot.addEventListener("click", () => {
          currentIndex = i;
          updateSlider();
        });
        dotsContainer.appendChild(dot);
      }
      updateDots();
    }

    function updateDots() {
      dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
      });
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        if (autoSlideDirection === 1) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, 5000); // Интервал в 3 секунды
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    prevButton.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });

    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
        startAutoSlide();
      } else if (event.key === "ArrowLeft") {
        prevSlide();
        startAutoSlide();
      }
    });

    window.addEventListener("resize", () => updateSlider(false));

    containerHover.addEventListener("mouseenter", stopAutoSlide);
    containerHover.addEventListener("mouseleave", startAutoSlide);

    createDots();
    updateSlider();
    startAutoSlide();
  }

  initSlider(".inner-morton", ".sli");
});

document.addEventListener("DOMContentLoaded", () => {
  function initSlider() {
    const slidesContainer = document.querySelector(".text-inner");
    const slides = document.querySelectorAll(".text-slider");
    const dots = document.querySelectorAll(".dot");
    const prevButton = document.querySelector(".custom-prevs");
    const nextButton = document.querySelector(".custom-nexts");
    let slideWidth = slides[0].offsetWidth;
    let currentIndex = 0;
    let autoSlideDirection = 1; // 1 - вперед, -1 - назад
    let autoSlideInterval;

    function updateSlider() {
      slideWidth = slides[0].offsetWidth;
      slidesContainer.style.transform = `translateX(${
        -currentIndex * slideWidth
      }px)`;
    }

    function nextSlide() {
      if (currentIndex < slides.length - 1) {
        currentIndex++;
      } else {
        autoSlideDirection = -1; // Меняем направление
        currentIndex--;
      }
      updateSlider();
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        autoSlideDirection = 1;
        currentIndex++;
      }
      updateSlider();
    }
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider();
      });
    });
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        if (autoSlideDirection === 1) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, 5000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }
    prevButton.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });

    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") nextSlide();
      else if (event.key === "ArrowLeft") prevSlide();
    });

    window.addEventListener("resize", () => updateSlider());
    containerHover.addEventListener("mouseenter", stopAutoSlide);
    containerHover.addEventListener("mouseleave", startAutoSlide);

    updateSlider();
    startAutoSlide();
  }
  initSlider();
});
