const myPetWrapper = document.getElementById("myPet");
const petImg = document.getElementById("petImage");
const petName = document.getElementById("petName");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const healBtn = document.getElementById("healBtn");
const eventBtn = document.getElementById("eventBtn");
const hungerBar = document.getElementById("hungerBar");
const happinessBar = document.getElementById("happinessBar");
const healthBar = document.getElementById("healthBar");
const energyBar = document.getElementById("energyBar");

const petBars = [hungerBar, happinessBar, healthBar, energyBar];
const petButtons = [feedBtn, playBtn, healBtn, eventBtn];

export function updatePet(pet) {
  updatePetBars(pet);
  updatePetImg(pet, petStates);
}

function updatePetBars(pet) {
  if (!pet.isAlive) {
    petButtons.forEach((btn) => {
      btn.classList.remove("warning");
      btn.disabled = true;
    });
    petBars.forEach((bar) => (bar.value = "0"));
  } else {
    hungerBar.value = pet.hunger;
    happinessBar.value = pet.happiness;
    healthBar.value = pet.health;
    energyBar.value = pet.energy;
    document.getElementById("coinInfo").textContent = pet.coins;
  }
}

function updatePetImg(pet, states) {
  let state = null;
  if (!pet.isAlive) {
    state = states.die;
  } else {
    state = states[pet.getState()];
  }
  pet.state = state.classes[0];
  petImg.src = state.src;
  myPetWrapper.style.backgroundColor = state.bgColor;
  myPetWrapper.className = state.classes.join(" ");
  petName.style.color = state.textColor || "black";
  updateWarningButtons(pet.state);
}

function updateWarningButtons(stateClass) {
  stateClass === "hungry"
    ? feedBtn.classList.add("warning")
    : feedBtn.classList.remove("warning");
  stateClass === "sick"
    ? healBtn.classList.add("warning")
    : healBtn.classList.remove("warning");
  stateClass === "sad"
    ? playBtn.classList.add("warning")
    : playBtn.classList.remove("warning");
}

const petStates = {
  die: { src: "../petImg/die.jpg", bgColor: "transparent", classes: [] },
  hungry: {
    src: "../petImg/hungry1.jpg",
    bgColor: "yellow",
    classes: ["hungry"],
    textColor: "black",
  },
  sick: {
    src: "../petImg/ill1.jpg",
    bgColor: "red",
    classes: ["sick"],
    textColor: "black",
  },
  happy: {
    src: "../petImg/happy1.jpg",
    bgColor: "green",
    classes: ["happy"],
    textColor: "white",
  },
  sad: {
    src: "../petImg/sad1.jpg",
    bgColor: "blue",
    classes: ["sad"],
    textColor: "white",
  },
};
