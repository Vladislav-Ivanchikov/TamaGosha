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

const petStates = {
  die: { src: "../petImg/die.jpg", bgColor: "transparent", class: "" },
  hungry: {
    src: "../petImg/hungry1.jpg",
    bgColor: "",
    class: "hungry",
    textColor: "black",
  },
  sick: {
    src: "../petImg/ill1.jpg",
    bgColor: "",
    class: "sick",
    textColor: "black",
  },
  happy: {
    src: "../petImg/happy1.jpg",
    bgColor: "",
    class: "happy",
    textColor: "white",
  },
};

export function updatePet(pet) {
  updatePetBars(pet);
  updatePetImg(pet);
  updateWarningButtons(pet);
}

export function updatePetBars(pet) {
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

function updatePetImg(pet) {
  if (pet.hunger === 100 || pet.happiness === 0 || pet.health === 0) {
    pet.state = petStates.die;
  } else if (pet.hunger > 70 && pet.health > 20) {
    pet.state = petStates.hungry;
  } else if (pet.health < 20) {
    pet.state = petStates.sick;
  } else {
    pet.state = petStates.happy;
  }

  petImg.src = pet.state.src;
  myPetWrapper.style.backgroundColor = pet.state.bgColor;
  myPetWrapper.className = pet.state.class;
  petName.style.color = pet.state.textColor || "black";
}

function updateWarningButtons(pet) {
  pet.state.class === "hungry"
    ? feedBtn.classList.add("warning")
    : feedBtn.classList.remove("warning");
  pet.state.class === "sick"
    ? healBtn.classList.add("warning")
    : healBtn.classList.remove("warning");
  pet.state.class === "happy"
    ? eventBtn.classList.add("warning")
    : eventBtn.classList.remove("warning");
  pet.happiness < 20
    ? playBtn.classList.add("warning")
    : playBtn.classList.remove("warning");
}
