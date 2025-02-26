const myPetWrapper = document.getElementById("myPet");
const petImg = document.getElementById("petImage");
const petName = document.getElementById("petName");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const healBtn = document.getElementById("healBtn");
const iventBtn = document.getElementById("iventBtn");
const hungerBar = document.getElementById("hungerBar");
const happinessBar = document.getElementById("happinessBar");
const healthBar = document.getElementById("healthBar");
const energyBar = document.getElementById("energyBar");

export function updateDisplay(pet) {
  if (!pet.isAlive) {
    feedBtn.disabled = true;
    playBtn.disabled = true;
    healBtn.disabled = true;
    iventBtn.disabled = true;
    hungerBar.value = "0";
    happinessBar.value = "0";
    healthBar.value = "0";
  } else {
    hungerBar.value = pet.hunger;
    happinessBar.value = pet.happiness;
    healthBar.value = pet.health;
    energyBar.value = pet.energy;
    document.getElementById("coinInfo").textContent = pet.coins;
  }
  updatePetImg(pet);
}

function updatePetImg(pet) {
  if (pet.hunger === 100 || pet.happiness === 0 || pet.health === 0) {
    petImg.src = "../petImg/die.jpg";
    myPetWrapper.style.backgroundColor = "transparent";
  } else if (pet.hunger > 70 && pet.health > 20) {
    petImg.src = "../petImg/hungry1.jpg";
    myPetWrapper.style.backgroundColor = "yellow";
    petName.style.color = "black";
  } else if (pet.health < 20) {
    petImg.src = "../petImg/ill1.jpg";
    myPetWrapper.style.backgroundColor = "red";
    petName.style.color = "black";
  } else {
    petImg.src = "../petImg/happy1.jpg";
    myPetWrapper.style.backgroundColor = "green";
    petName.style.color = "white";
  }
}
