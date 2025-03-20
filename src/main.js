import { Pet } from "./modules/pet.js";
import { updatePet } from "./modules/updateUI.js";
import {
  loadData,
  loadPetName,
  saveData,
  savePetName,
  getUserID,
} from "./modules/storage.js";

const userID = getUserID();
let pet;
const lastPetName = loadPetName();

(async () => {
  if (lastPetName) {
    pet = await loadData(userID, lastPetName);
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
      await saveData(userID, pet);
    }
  }

  updatePet(pet);
  document.getElementById("petName").textContent =
    pet.name[0].toUpperCase() + pet.name.slice(1);

  document.getElementById("feedBtn").addEventListener("click", async () => {
    pet.feed();
    await saveData(userID, pet);
    updatePet(pet);
  });

  document.getElementById("playBtn").addEventListener("click", async () => {
    pet.play();
    await saveData(userID, pet);
    updatePet(pet);
  });

  document.getElementById("healBtn").addEventListener("click", async () => {
    const type = prompt("Введите тип лечения (weak, medium, strong)");
    if (type !== "weak" && type !== "medium" && type !== "strong") {
      alert("Неверный тип лечения");
      return;
    }
    pet.heal(type);
    await saveData(userID, pet);
    updatePet(pet);
  });

  document.getElementById("eventBtn").addEventListener("click", async () => {
    pet.event();
    await saveData(userID, pet);
    updatePet(pet);
  });

  document.getElementById("logBtn").addEventListener("click", () => {
    const logList = document.createElement("ul");
    for (
      let i = pet.logInfo.length - 1;
      i >= Math.max(0, pet.logInfo.length - 5);
      i--
    ) {
      const logItem = document.createElement("li");
      logItem.textContent = pet.logInfo[i].desc;
      logList.appendChild(logItem);
    }
    createModal("Логи", logList);
  });

  setInterval(async () => {
    if (!pet.isAlive) {
      localStorage.removeItem(pet.name);
      localStorage.removeItem("petName");
      return;
    } else {
      pet.update();
      updatePet(pet);
      await saveData(userID, pet);
    }
  }, 2000);
})();
