import { Pet } from "./modules/pet.js";
import { updateDisplay } from "./modules/updateUI.js";
import {
  loadData,
  loadPetName,
  saveData,
  savePetName,
} from "./modules/storage.js";

let pet;
const lastPetName = loadPetName();
if (lastPetName) {
  pet = loadData(lastPetName);
  if (pet) {
    console.log("Питомец загружен:", pet.name);
  } else {
    alert("Питомец не найден");
  }
}

if (!pet) {
  let petName;
  do {
    petName = prompt("Введите имя вашего питомца:");
    if (!petName) {
      alert("Имя не может быть пустым!");
    }
  } while (!petName || petName.trim() === "");
  if (petName) {
    console.log("Создан новый питомец:", petName);
    pet = new Pet(petName);
    savePetName(pet.name);
    saveData(pet);
  }
}

updateDisplay(pet);
document.getElementById("petName").textContent =
  pet.name[0].toUpperCase() + pet.name.slice(1);

document.getElementById("feedBtn").addEventListener("click", () => {
  pet.feed();
  saveData(pet);
  updateDisplay(pet);
});

document.getElementById("playBtn").addEventListener("click", () => {
  pet.play();
  saveData(pet);
  updateDisplay(pet);
});

document.getElementById("healBtn").addEventListener("click", () => {
  const type = prompt("Введите тип лечения (weak, medium, strong)");
  if (type !== "weak" && type !== "medium" && type !== "strong") {
    alert("Неверный тип лечения");
    return;
  }
  pet.heal(type);
  saveData(pet);
  updateDisplay(pet);
});

document.getElementById("eventBtn").addEventListener("click", () => {
  pet.event();
  saveData(pet);
  updateDisplay(pet);
});

document.getElementById("cornerBtn").addEventListener("click", () => {
  let petInfo = [];
  for (let i = pet.logInfo.length - 1; i >= 0; i--) {
    petInfo.push(pet.logInfo[i]);
  }
  console.log(petInfo);
});

setInterval(() => {
  if (!pet.isAlive) {
    localStorage.removeItem(pet.name);
    localStorage.removeItem("petName");
    return;
  } else {
    pet.update();
    updateDisplay(pet);
    saveData(pet);
  }
}, 2000);
