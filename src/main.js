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
    pet = await loadData(lastPetName);
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
      await saveData(pet, userID);
    }
  }

  updatePet(pet);
  document.getElementById("petName").textContent =
    pet.name[0].toUpperCase() + pet.name.slice(1);

  document.getElementById("feedBtn").addEventListener("click", async () => {
    pet.feed();
    await saveData(pet, userID);
    updatePet(pet);
  });

  document.getElementById("playBtn").addEventListener("click", async () => {
    pet.play();
    await saveData(pet, userID);
    updatePet(pet);
  });

  document.getElementById("healBtn").addEventListener("click", async () => {
    const type = prompt("Введите тип лечения (weak, medium, strong)");
    if (type !== "weak" && type !== "medium" && type !== "strong") {
      alert("Неверный тип лечения");
      return;
    }
    pet.heal(type);
    await saveData(pet, userID);
    updatePet(pet);
  });

  document.getElementById("eventBtn").addEventListener("click", async () => {
    pet.event();
    await saveData(pet, userID);
    updatePet(pet);
  });

  document.getElementById("logBtn").addEventListener("click", () => {
    const fragment = document.createDocumentFragment();
    const logDiv = document.createElement("div");
    logDiv.classList.add("log-modal");
    const logContent = document.createElement("div");
    logContent.classList.add("log-modal-content");
    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close");
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = function () {
      logDiv.style.display = "none";
    };
    logContent.appendChild(closeBtn);
    const logTitle = document.createElement("h2");
    logTitle.textContent = "История событий";
    logContent.appendChild(logTitle);
    const logList = document.createElement("ul");
    for (let i = pet.logInfo.length - 1; i >= pet.logInfo.length - 5; i--) {
      // Вывод 5 последних событий
      const logItem = document.createElement("li");
      logItem.textContent = pet.logInfo[i].desc;
      logList.appendChild(logItem);
    }
    logContent.appendChild(logList);
    logDiv.appendChild(logContent);
    fragment.appendChild(logDiv);
    document.body.appendChild(fragment);
    logDiv.style.display = "block";
  });

  setInterval(async () => {
    if (!pet.isAlive) {
      localStorage.removeItem(pet.name);
      localStorage.removeItem("petName");
      return;
    } else {
      pet.update();
      updatePet(pet);
      await saveData(pet, userID);
    }
  }, 2000);
})();
