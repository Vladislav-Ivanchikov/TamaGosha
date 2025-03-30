import { petStates } from "./pet.js";

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
let audio;

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
  } else {
    state = states[pet.getState()];
  }

  pet.state = state.classes[0];
  petImg.src = state.src;

  if (audio !== state.audio) {
    audio = state.audio;
    audio.play();
  }

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
