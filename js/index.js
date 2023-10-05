const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();

// Scrollers

console.log("i");

let hasFocus = false;

const lerp = (current, target, factor) =>
  current * (1 - factor) + target * factor;

class LoopingText {
  constructor(el, vertical = false) {
    this.el = el;
    this.lerp = { current: 0, target: 0 };
    this.interpolationFactor = 0.1;
    this.speed = vertical ? 0.1 : 0.05;
    this.direction = el.classList.contains("reverse") ? -1 : 1; // -1 (to-left), 1 (to-right)
    // Init
    this.vertical = vertical;
    this.el.style.cssText = `position: relative; display: inline-flex; white-space: nowrap;`;
    this.el.children[1].style.cssText = `position: absolute; ${
      vertical ? "top" : "left"
    }: ${100 * -this.direction}%;`;
    // this.events();
    // this.render();
  }

  events() {
    document
      .getElementById("mainContentContainer")
      .addEventListener("scroll", () => {
        console.log("hi");
        this.lerp.target += this.speed * 2;
      });
  }

  update() {
    this.lerp.target += this.speed;
    this.lerp.current = lerp(
      this.lerp.current,
      this.lerp.target,
      this.interpolationFactor
    );

    if (this.lerp.target > 100) {
      this.lerp.current -= this.lerp.target;
      this.lerp.target = 0;
    }

    const x = this.lerp.current * this.direction;

    this.el.style.transform = this.vertical
      ? `translateY(${x}%)`
      : `translateX(${x}%)`;
  }
}

const updatables = [];

function render() {
  window.requestAnimationFrame(render);
  for (let i = 0; i < updatables.length; i++) {
    updatables[i].update();
  }
}
render();

updatables.push(
  new LoopingText(document.getElementById("verticalScrollerContainer"), true)
);

function hideTitle() {
  document.getElementById("title").classList.add("hide");
  setTimeout(showEventPopup, 10000);
}

function duplicateCards(count) {
  const c = document.querySelector(".card");
  for (let i = 0; i < count; i++) {
    c.after(c.cloneNode(true));
  }
}

const desktopCardMouseOverHandlers = [];
const desktopCardMouseOutHandlers = [];
const desktopCardClickHandlers = [];
const desktopCardBackClickHandlers = [];

function setupCardsDesktop() {
  const cards = document.getElementById("cards").children;
  const offset = 56;
  const maxX = cards.length * offset;

  for (let i = 0; i < cards.length; i++) {
    console.log("redo");
    cards[i].style.transform = `translateX(${-(cards.length - i) * offset}px)`;
    const mouseOverHandler = () => {
      // max is cards.length * offset;
      // loop through each, moving
      console.log("mosueover");
      if (!hasFocus) {
        cards[i].classList.add("pointer");
        for (let j = 0; j < i + 1; j++) {
          cards[j].style.transform = `translateX(${
            -maxX + (j * offset) / 2
          }px)`;
        }
        for (let j = i + 1; j < cards.length; j++) {
          cards[j].style.transform = `translateX(${
            -maxX / 2 + (j * offset) / 2
          }px)`;
        }
      }
    };
    desktopCardMouseOverHandlers.push(mouseOverHandler);
    cards[i].addEventListener("mouseover", mouseOverHandler);

    const mouseOutHandler = () => {
      console.log("mouseout");
      if (!hasFocus) {
        cards[i].classList.remove("pointer");
        for (let i = 0; i < cards.length; i++) {
          console.log("ee");
          cards[i].style.transform = `translateX(${
            -(cards.length - i) * offset
          }px)`;
        }
      }
    };
    desktopCardMouseOutHandlers.push(mouseOutHandler);
    cards[i].addEventListener("mouseout", mouseOutHandler);

    const clickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(hasFocus);
      if (hasFocus) {
        return;
      }
      console.log("click");
      hasFocus = true;
      const video = cards[i].querySelector("video");
      console.log(video.dataset);
      if (video.dataset.vidSrc) {
        video.src = video.dataset.vidSrc;
      }

      for (let j = 0; j < cards.length; j++) {
        cards[i].classList.remove("pointer");
        cards[j].style.transform = `translateX(${0}%)`;
      }
      cards[i].style.transform = `translateX(${-100}%)`;
      video.play();
      console.log("video play");
    };
    desktopCardClickHandlers.push(clickHandler);
    cards[i].addEventListener("mouseup", clickHandler);

    const cardBackClickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("back click");
      const video = cards[i].querySelector("video");
      video.currentTime = 0;
      video.pause();
      video.dataset.vidSrc = video.src;
      video.src = "";
      hasFocus = false;
      for (let j = 0; j < cards.length; j++) {
        console.log("jejeje");
        cards[j].style.transform = `translateX(${
          -(cards.length - j) * offset
        }px)`;
      }
    };
    desktopCardBackClickHandlers.push(cardBackClickHandler);
    cards[i]
      .querySelector(".cardBack")
      .addEventListener("mouseup", cardBackClickHandler);
  }
}

const mobileCardClickHandlers = [];
const mobileCardBackClickHandlers = [];

function setupCardsMobile() {
  const cards = document.getElementById("cards").children;
  const offset = 56;
  const maxY = cards.length * offset;

  document.getElementById("mainContent").style.height = `${
    maxY + document.getElementById("cards").offsetTop
  }px`;

  document.getElementById("main").style.overflowY = "scroll";
  document.getElementById("mainContent").style.overflowY = "hidden";
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.transform = `translateY(${i * offset}px)`;

    const clickHandler = (e) => {
      console.log("mobile click");
      if (hasFocus) {
        return;
      }

      const video = cards[i].querySelector("video");
      console.log(video.dataset);
      if (video.dataset.vidSrc) {
        video.src = video.dataset.vidSrc;
      }
      video.play();
      hasFocus = true;
      // document.getElementById("main").scrollTo({ behavior: "smooth" });
      const offsetY =
        document.getElementById("main").scrollTop +
        cards[0].getBoundingClientRect().top;
      console.log(offsetY);
      document.getElementById("main").scrollTo({ top: 0, behavior: "smooth" });

      for (let j = 0; j < cards.length; j++) {
        cards[j].classList.remove("pointer");
        cards[j].style.transform = `translateY(${100}%)`;
      }
      cards[i].style.transform = `translateY(${-offsetY}px)`;
      document.getElementById("mainContent").style.overflowY = "hidden";
      document.getElementById(
        "mainContent"
      ).style.height = `${cards[i].offsetHeight}px`;
      // Load video here (or actually at start of this function)
    };
    mobileCardClickHandlers.push(clickHandler);
    cards[i].addEventListener("click", clickHandler);

    const cardBackClickHandler = (e) => {
      console.log("mobile back");
      e.preventDefault();
      e.stopPropagation();
      const video = cards[i].querySelector("video");
      video.currentTime = 0;
      video.pause();
      video.dataset.vidSrc = video.src;
      video.src = "";
      document.getElementById("main").scrollTo({ top: 0, behavior: "smooth" });
      hasFocus = false;
      for (let j = 0; j < cards.length; j++) {
        cards[j].style.transform = `translateY(${j * offset}px)`;
      }
      document.getElementById("mainContent").style.height = `${
        maxY + document.getElementById("cards").offsetTop
      }px`;
    };
    mobileCardBackClickHandlers.push(cardBackClickHandler);
    cards[i]
      .querySelector(".cardBack")
      .addEventListener("click", cardBackClickHandler);
  }
}

function removeEventListeners() {
  document.getElementById("mainContent").style.overflowY = "initial";
  if (desktopCardMouseOverHandlers.length > 0) {
    const cards = document.getElementById("cards").children;
    for (let i = 0; i < cards.length; i++) {
      cards[i].removeEventListener(
        "mouseover",
        desktopCardMouseOverHandlers[i]
      );

      const video = cards[i].querySelector("video");
      console.log(video.src);
      video.currentTime = 0;
      video.pause();
      if (video.src.includes("mp4")) {
        video.dataset.vidSrc = video.src;
        video.src = "";
      }
      cards[i].removeEventListener("mouseout", desktopCardMouseOutHandlers[i]);
      cards[i].removeEventListener("mouseup", desktopCardClickHandlers[i]);
      cards[i]
        .querySelector(".cardBack")
        .removeEventListener("mouseup", desktopCardBackClickHandlers[i]);
    }
    desktopCardMouseOverHandlers.length = 0;
    desktopCardMouseOutHandlers.length = 0;
    desktopCardClickHandlers.length = 0;
    desktopCardBackClickHandlers.length = 0;
  }
  if (mobileCardClickHandlers.length > 0) {
    const cards = document.getElementById("cards").children;
    for (let i = 0; i < cards.length; i++) {
      cards[i].removeEventListener("click", mobileCardClickHandlers[i]);
      const video = cards[i].querySelector("video");
      video.currentTime = 0;
      video.pause();
      if (video.src.includes("mp4")) {
        video.dataset.vidSrc = video.src;
        video.src = "";
      }
      cards[i]
        .querySelector(".cardBack")
        .removeEventListener("click", mobileCardBackClickHandlers[i]);
    }
    mobileCardClickHandlers.length = 0;
    mobileCardBackClickHandlers.length = 0;
  }
}

function handleResize(e) {
  console.log(e);

  if (e.target.nodeName !== "VIDEO") {
    hasFocus = false;
    removeEventListeners();
    if (window.matchMedia("(max-width: 1200px").matches) {
      setupCardsMobile();
    } else {
      setupCardsDesktop();
    }
  }
}

function setupCards() {
  if (window.matchMedia("(max-width: 1200px").matches) {
    window.onload = () => {
      setupCardsMobile();
    };
  } else {
    setupCardsDesktop();
  }
  window.addEventListener("resize", handleResize, true);
}

// remove this for prod
// duplicateCards(13);

setupCards();

function showEventPopup() {
  document.getElementById("eventPopup").classList.add("show");
}
function hideEventPopup() {
  document.getElementById("eventPopup").classList.remove("show");
}
