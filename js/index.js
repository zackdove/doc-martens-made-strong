const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty("--app-height", `${window.innerHeight}px`);
};
window.addEventListener("resize", appHeight);
appHeight();

// Scrollers

console.log("i");

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

function setupCards() {
  const cards = document.getElementById("cards").children;
  const offset = 64;
  const maxX = cards.length * offset;
  let hasFocus = false;
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.transform = `translateX(${-(cards.length - i) * offset}px)`;
    cards[i].addEventListener("mouseover", () => {
      // max is cards.length * offset;
      // loop through each, moving

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
    });
    cards[i].addEventListener("mouseout", () => {
      if (!hasFocus) {
        cards[i].classList.remove("pointer");
        for (let i = 0; i < cards.length; i++) {
          cards[i].style.transform = `translateX(${
            -(cards.length - i) * offset
          }px)`;
        }
      }
    });
    cards[i].addEventListener("click", () => {
      hasFocus = true;
      console.log("naughty");
      for (let j = 0; j < cards.length; j++) {
        cards[i].classList.remove("pointer");
        cards[j].style.transform = `translateX(${0}%)`;
      }
      cards[i].style.transform = `translateX(${-100}%)`;
      // Load video here (or actually at start of this function)
    });
    console.log(cards[i]);
    console.log(cards[i].querySelector(".cardBack"));
    cards[i].querySelector(".cardBack").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("hello");
      hasFocus = false;
      for (let j = 0; j < cards.length; j++) {
        console.log(j);
        cards[j].style.transform = `translateX(${
          -(cards.length - j) * offset
        }px)`;
      }
    });
  }
}
duplicateCards(12);
setupCards();

function showEventPopup() {
  document.getElementById("eventPopup").classList.add("show");
}
function hideEventPopup() {
  document.getElementById("eventPopup").classList.remove("show");
}
