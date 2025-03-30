import { Pet } from "./modules/pet.js";
import { updatePet } from "./modules/updateUI.js";
import {
  getUserID,
  saveData,
  savePetName,
  loadData,
  loadPetName,
} from "./modules/storage.js";
import createModal from "./modules/funcs/createModal.js";

const userID = getUserID();
let pet;
const lastPetName = loadPetName();

const UI_INTERVAL = 1000;
const BD_INTERVAL = 10000;

(async () => {
  try {
    if (lastPetName) {
      pet = await loadData(userID, lastPetName);
      if (pet) {
        console.log("Питомец загружен:", pet.name);
      } else {
        alert("Питомец не найден");
      }
    } else {
      alert("Питомец не найден");
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

    async function actionHandler(action) {
      action();
      await saveData(userID, pet);
      updatePet(pet);
    }

    document.getElementById("feedBtn").addEventListener("click", () => {
      actionHandler(() => pet.feed());
    });

    document.getElementById("playBtn").addEventListener("click", () => {
      actionHandler(() => pet.play());
    });

    document.getElementById("healBtn").addEventListener("click", async () => {
      const type = prompt("Введите тип лечения (weak, medium, strong)");
      if (type !== "weak" && type !== "medium" && type !== "strong") {
        alert("Неверный тип лечения");
        return;
      }
      actionHandler(() => pet.heal(type));
    });

    document.getElementById("eventBtn").addEventListener("click", async () => {
      actionHandler(() => pet.event());
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
        localStorage.clear();
        return;
      } else {
        pet.update();
        updatePet(pet);
      }
    }, UI_INTERVAL);

    let lastSavedPet = JSON.stringify(pet);
    setInterval(async () => {
      if (!pet.isAlive) {
        saveData(userID, pet);
        return;
      }
      const petStr = JSON.stringify(pet);
      if (petStr === lastSavedPet) return;
      await saveData(userID, pet);
      lastSavedPet = petStr;
    }, BD_INTERVAL);
  } catch (e) {
    console.error("Ошибка инициализации приложения:", e);
    alert("Произошла ошибка при загрузке приложения. Попробуйте позже.");
  }
})();
