import { Pet } from "./pet.js";

export function saveData(pet) {
  try {
    localStorage.setItem(pet.name, JSON.stringify(pet));
  } catch (e) {
    console.error("Error saving data:", e);
  }
}

export function savePetName(petName) {
  try {
    localStorage.setItem("petName", petName);
  } catch (e) {
    console.error("Error saving pet name:", e);
  }
}

export function loadData(petName) {
  try {
    const data = localStorage.getItem(petName);
    if (!data) {
      return null;
    }
    const savedData = JSON.parse(data);
    const pet = new Pet(savedData.name);
    Object.assign(pet, savedData);
    return pet;
  } catch (e) {
    console.error("Error loading data:", e);
    return null;
  }
}

export function loadPetName() {
  try {
    return localStorage.getItem("petName");
  } catch (e) {
    console.error("Error loading pet name:", e);
    return null;
  }
}
