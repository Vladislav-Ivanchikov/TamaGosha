import { Pet } from "./pet.js";

let cachedPet = null;

export function getUserID() {
  let id = localStorage.getItem("userID");
  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("userID", id);
  }
  return id;
}

export async function saveData(userID, pet) {
  try {
    const responce = await fetch(`/api/${userID}/${pet.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pet),
    });
    console.log("Ответ сервера:", responce.status);
    if (!responce.ok) {
      throw new Error(
        `Ошибка сервера: ${responce.status} ${responce.statusText}`
      );
    }
  } catch (e) {
    console.error("Error saving data:", e);
    throw e;
  }
}

export function savePetName(petName) {
  try {
    localStorage.setItem("petName", petName);
  } catch (e) {
    console.error("Error saving pet name:", e);
  }
}

export async function loadData(userID, petName) {
  if (cachedPet && cachedPet.userID === userID && cachedPet.name === petName) {
    console.log("Data loaded from cache for", cachedPet.name);
    return cachedPet;
  }
  try {
    const res = await fetch(`/api/${userID}/${petName}`);
    const data = await res.json();
    if (!data || data.error) {
      console.error("Error loading data:", data.error);
      return null;
    }
    console.log("Data loaded for", data.name);
    const pet = new Pet(data.name);
    Object.assign(pet, data);
    cachedPet = pet;
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
