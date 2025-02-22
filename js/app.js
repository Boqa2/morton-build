const anime = document.querySelector(".mt1");
const anime2 = document.querySelectorAll(".animes");
const animes = document.querySelector(".anime");

let currentIndexTab = 0;
let priusIndex = 0;
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  const menuItems = document.querySelectorAll(".link");
  const header = document.querySelector("header");

  function changeSlide(index, resetInner = false) {
    if (index === currentIndexTab || index >= slides.length || index < 0)
      return;

    setTimeout(() => {
      slides[currentIndexTab].classList.remove("active");
      currentIndexTab = index;
      slides[currentIndexTab].classList.add("active");
      menuItems.forEach((item, i) =>
        item.classList.toggle("active", i === currentIndexTab)
      );

      header.style.background =
        currentIndexTab === 1 || currentIndexTab === 3 ? "#000" : "transparent";

      if (resetInner) {
        currentIndex = 0;
      }
    }, 300);
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const index = parseInt(item.getAttribute("data-slide-index"));
      changeSlide(index, true);
    });
  });

  window.increaseSlide = function () {
    changeSlide(currentIndexTab + 1);
  };
  const contents = document.querySelectorAll(".sli");
  const contentsText = document.querySelectorAll(".text-slider");
  const dotsContainer = document.querySelector(".dots");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  function updateDots() {
    dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }
  function updateButtons() {
    prevButton.disabled = currentIndex === 0;
  }

  function createDots() {
    contents.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        contents[currentIndex].classList.remove("actives");
        contentsText[currentIndex].classList.remove("active");
        currentIndex = index;
        contents[currentIndex].classList.add("actives");
        contentsText[currentIndex].classList.add("active");
        setTimeout(() => {
          increaseSlide();
          currentIndex = 0;
          contents[5].classList.remove("actives");
          contentsText[5].classList.remove("active");
          contents[0].classList.add("actives");
          contentsText[0].classList.add("active");
          updateDots();
        }, 100);
        updateDots();
        updateButtons();
      });
      dotsContainer.appendChild(dot);
    });
    updateDots();
    updateButtons();
  }

  let lastSlideReached = false;

  nextButton.addEventListener("click", () => {
    setTimeout(() => {
      contents[currentIndex].classList.remove("actives");
      contentsText[currentIndex].classList.remove("active");

      if (currentIndex < contents.length - 1) {
        currentIndex++;
        lastSlideReached = false;
      } else if (!lastSlideReached) {
        lastSlideReached = true; // Устанавливаем флаг после достижения конца
        setTimeout(() => {
          increaseSlide(); // Вызываем только один раз
          currentIndex = 0; // Возвращаем индекс в начало
          contents[contents.length - 1].classList.remove("actives");
          contentsText[contents.length - 1].classList.remove("active");
          contents[0].classList.add("actives");
          contentsText[0].classList.add("active");
          updateDots();
        }, 100);
        return;
      }

      contents[currentIndex].classList.add("actives");
      contentsText[currentIndex].classList.add("active");
      updateDots();
      updateButtons();
    }, 400);
  });

  prevButton.addEventListener("click", () => {
    setTimeout(() => {
      contents[currentIndex].classList.remove("actives");
      contentsText[currentIndex].classList.remove("active");

      currentIndex = Math.max(currentIndex - 1, 0);

      contents[currentIndex].classList.add("actives");
      contentsText[currentIndex].classList.add("active");
      updateDots();
      updateButtons();
    }, 400);
  });
  createDots();
});

const continer = document.querySelector(".container");
const close = document.querySelector(".x1");

close.addEventListener("click", () => {
  if (continer.classList.contains(".hidden")) {
    continer.classList.remove("hidden");
  } else {
    continer.classList.add("hidden");
  }
});
