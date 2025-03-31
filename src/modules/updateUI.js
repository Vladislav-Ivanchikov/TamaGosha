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

let state;

export function updatePet(pet) {
  updatePetBars(pet);
  updatePetImg(pet, petStates);
  updateWarningButtons(pet);
}

function updatePetBars(pet) {
  if (!pet.isAlive) {
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
  if (!pet.isAlive) {
    state = states.die;
    state.audio.play();
  } else {
    state = states[pet.getState()];
    if (state.classes[0] !== pet.state) {
      pet.state = state.classes[0];
      state.audio.play();
    }
  }
  petImg.src = state.src;
  myPetWrapper.style.backgroundColor = state.bgColor;
  myPetWrapper.className = state.classes.join(" ");
  petName.style.color = state.textColor || "black";
}

function updateWarningButtons(pet) {
  if (!pet.isAlive) {
    petButtons.forEach((btn) => {
      btn.disabled = true;
      btn.classList.remove("warning");
    });
  } else {
    toggleWarning(feedBtn, pet.hunger > 80);
    toggleWarning(playBtn, pet.happiness < 20);
    toggleWarning(healBtn, pet.health < 20);
  }
}

function toggleWarning(btn, condition) {
  condition ? btn.classList.add("warning") : btn.classList.remove("warning");
}

export const audioEffects = {
  feed: new Audio("../audio/feed.mp3"),
  play: new Audio("../audio/play.mp3"),
  heal: new Audio("../audio/heal.mp3"),
  happy: new Audio("../audio/happy.mp3"),
  hungry: new Audio("../audio/hungry.mp3"),
  sad: new Audio("../audio/sad.mp3"),
  sick: new Audio("../audio/sick.mp3"),
  die: new Audio("../audio/die.mp3"),
  event: new Audio("../audio/event.mp3"),
};

const petStates = {
  die: {
    src: "../petImg/die.jpg",
    audio: audioEffects.die,
    bgColor: "transparent",
    classes: ["die"],
  },
  hungry: {
    src: "../petImg/hungry1.jpg",
    audio: audioEffects.hungry,
    bgColor: "yellow",
    classes: ["hungry"],
    textColor: "black",
  },
  happy: {
    src: "../petImg/happy1.jpg",
    audio: audioEffects.happy,
    bgColor: "green",
    classes: ["happy"],
    textColor: "white",
  },
  sad: {
    src: "../petImg/sad1.jpg",
    audio: audioEffects.sad,
    bgColor: "blue",
    classes: ["sad"],
    textColor: "white",
  },
  sick: {
    src: "../petImg/ill1.jpg",
    audio: audioEffects.sick,
    bgColor: "red",
    classes: ["sick"],
    textColor: "black",
  },
};
