import { Pet } from "./modules/pet.js";
import { updatePet, audioEffects } from "./modules/updateUI.js";
import {
  getUserID,
  saveData,
  savePetName,
  loadData,
  loadPetName,
} from "./modules/storage.js";
import createModal from "./modules/funcs/createModal.js";

let audioType;
let pet;
const userID = getUserID();
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

    document.getElementById("feedBtn").addEventListener("click", (e) => {
      actionHandler(() => pet.feed(), e);
    });

    document.getElementById("playBtn").addEventListener("click", (e) => {
      actionHandler(() => pet.play(), e);
    });

    document.getElementById("healBtn").addEventListener("click", async (e) => {
      const type = prompt("Введите тип лечения (weak, medium, strong)");
      if (type !== "weak" && type !== "medium" && type !== "strong") {
        alert("Неверный тип лечения");
        return;
      }
      await actionHandler(() => pet.heal(type), e);
    });

    document.getElementById("eventBtn").addEventListener("click", async (e) => {
      actionHandler(() => pet.event(), e);
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

async function actionHandler(action, e) {
  audioHandler(e);
  action();
  await saveData(userID, pet);
  updatePet(pet);
}

function audioHandler(e) {
  audioType = e.target.id.slice(0, -3);
  const audio = audioEffects[audioType];
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
  audio.play();
}
