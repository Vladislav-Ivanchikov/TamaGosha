export class Pet {
  constructor(name) {
    this.name = name;
    this.hunger = 50;
    this.happiness = 60;
    this.health = 80;
    this.energy = 70;
    this.coins = 15;
    this.lastVisit = Date.now();
    this.lastPlayCount = 0;
    this.isAlive = true;
    this.state = "happy"; //  "hungry", "ill", "happy"
    this.logInfo = [];
  }

  addLog(desc) {
    this.logInfo.push({
      time: new Date().toUTCString(),
      desc: desc,
    });
    if (this.logInfo.length > 50) this.logInfo.shift();
  }

  getLog() {
    return this.logInfo;
  }

  getState() {
    if (this.health === 0) return "die";
    if (this.hunger > 80 && this.health > 20) return "hungry";
    if (this.happiness < 20 && this.health > 20) return "sad";
    if (this.health < 20) return "sick";
    return "happy";
  }

  getRandomEvent() {
    let eventType;
    const chance = Math.random();
    if (chance < 0.05) eventType = "extra";
    else if (chance < 0.35) eventType = "rare";
    else eventType = "common";
    const filteredEvents = events.filter((item) => item.type === eventType);
    if (filteredEvents.length === 0) {
      console.error(`Нет событий типа "${eventType}"`);
      return null;
    }
    return filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
  }

  feed() {
    if (this.hunger < 15) {
      alert("Питомец не голоден");
      throw new Error("Питомец не голоден");
    }
    try {
      const food = foods[Math.floor(Math.random() * foods.length)];
      this.hunger = Math.max(0, this.hunger + food.hunger);
      this.happiness = Math.min(100, this.happiness + (food.happiness || 0));
      this.health = Math.max(0, this.health + (food.health || 0));
      alert(`Вы покормили ${this.name} ${food.name}`);
      this.addLog(`Вы покормили ${this.name} ${food.name}`);
      this.checkIsAlive();
    } catch (e) {
      console.error("Ошибка при кормлении питомца:", e);
    }
  }

  play() {
    if (this.hunger > 90 || this.energy < 10 || this.happiness > 90) {
      alert(`${this.name} сейчас не до игр`);
      throw new Error("Питомец не готов к игре");
    }
    const energyCost = this.lastPlayCount > 2 ? 15 : 10;
    if (this.energy < energyCost) {
      alert("Недостаточно энергии");
      throw new Error("Недостаточно энергии");
    }
    try {
      this.lastPlayCount++;
      this.energy -= energyCost;
      if (this.lastPlayCount > 2) {
        this.hunger = Math.max(0, this.hunger + 3);
      }
      this.happiness = Math.min(100, this.happiness + 10);
      this.coins += 5;
      setTimeout(() => {
        this.lastPlayCount = Math.max(0, this.lastPlayCount - 1);
      }, 60000);
      alert(`Вы поиграли с ${this.name} и заработали 5 монет`);
      this.addLog(`Вы поиграли с ${this.name}`);
      this.checkIsAlive();
    } catch (e) {
      console.error("Ошибка при игре с питомцем:", e);
    }
  }

  heal(type) {
    try {
      const heal = heals[type];
      if (this.coins < heal.cost) {
        alert("Недостаточно монет");
        return;
      }
      this.coins -= heal.cost;
      this.health = Math.min(100, this.health + heal.health);
      if (heal.energy) this.energy = Math.min(100, this.energy + heal.energy);
      alert(`Вы вылечили ${this.name} ${type}`);
      this.addLog(`Вы вылечили ${this.name} ${type}`);
      this.checkIsAlive();
    } catch (e) {
      console.error("Ошибка при лечении питомца:", e);
    }
  }

  event(offline = false) {
    if (offline) {
      const event = this.getRandomEvent();
      if (event.happiness)
        this.happiness = Math.min(100, this.happiness + event.happiness);
      if (event.coins) this.coins = Math.max(0, this.coins + event.coins);
      if (event.health) this.health = Math.min(100, this.health + event.health);
      if (event.energy) this.energy = Math.min(100, this.energy + event.energy);
      this.addLog(event.desc);
      this.checkIsAlive();
      return;
    }
    if (this.hunger > 90 || this.energy < 10) {
      alert("Питомец устал или голоден, отдохните или покормите его");
      throw new Error("Питомец устал или голоден");
    }
    const event = this.getRandomEvent();
    this.energy -= 10;
    if (event.happiness)
      this.happiness = Math.min(100, this.happiness + event.happiness);
    if (event.coins) this.coins = Math.max(0, this.coins + event.coins);
    if (event.health) this.health = Math.min(100, this.health + event.health);
    if (event.energy) this.energy = Math.min(100, this.energy + event.energy);
    alert(event.desc);
    this.addLog(event.desc);
    this.checkIsAlive();
  }

  update() {
    if (!this.isAlive) return;
    const now = Date.now();
    const elapsed = (now - this.lastVisit) / 1000;
    this.lastVisit = now;

    this.hunger = Math.min(100, this.hunger + 0.1 * elapsed);
    this.happiness = Math.max(0, this.happiness - 0.1 * elapsed);
    this.energy = Math.min(100, this.energy + 0.2 * elapsed);

    if (this.hunger > 80 && this.happiness < 20)
      this.health = Math.max(0, this.health - 0.18 * elapsed);
    this.hunger > 80 || this.happiness < 20
      ? (this.health = Math.max(0, this.health - 0.12 * elapsed))
      : (this.health = Math.max(0, this.health - 0.05 * elapsed));

    if (elapsed >= 600) {
      const offlineEventsCount = Math.floor(elapsed / 600); // Trigger an event every minute
      for (let i = 0; i < offlineEventsCount; i++) {
        this.event(true);
      }
    }

    this.checkIsAlive();
  }

  checkIsAlive() {
    if (this.health === 0) {
      this.isAlive = false;
      this.logInfo.push({
        time: new Date().toUTCString(),
        desc: `${this.name} has died.`,
      });
      alert(`${this.name[0].toUpperCase() + this.name.slice(1)} has died.`);
      setTimeout(() => {
        let newGame = confirm("Start new game ?");
        if (newGame) {
          this.logInfo = [];
          window.location.reload();
        }
      }, 2000);
    }
  }
}

const foods = [
  { name: "Корм", hunger: -20 },
  { name: "Лакомство", hunger: -10, happiness: 5 },
  { name: "Сочная курочка", hunger: -30, happiness: 10 },
  { name: "Вчерашний суп", hunger: -15, happiness: -5 },
];

const heals = {
  weak: { health: 10, cost: 10 },
  medium: { health: 30, cost: 20 },
  strong: { health: 40, cost: 30, energy: 10 },
};

export const events = [
  { desc: "Питомец нашел клад!", type: "extra", happiness: 20, coins: 25 }, // Положительное
  { desc: "Питомец устал", type: "rare", energy: -30 }, // Отрицательное
  { desc: "Питомец выспался", type: "extra", energy: 40 }, // Положительное
  { desc: "Дождливый день", type: "rare", happiness: -20 }, // Отрицательное
  { desc: "Питомец нашел нового друга", type: "rare", happiness: 10 }, // Положительное
  { desc: "Питомец нашел новую игру", type: "common", happiness: 8 }, // Положительное
  { desc: "Питомец заболел", type: "rare", health: -20 }, // Отрицательное
  { desc: "Питомец нашел монету", type: "common", coins: 5 }, // Положительное
  { desc: "Питомец порвал игрушку", type: "common", happiness: -8 }, // Отрицательное
  { desc: "Жаркий день", type: "common", happiness: -10, energy: -10 }, // Отрицательное
  { desc: "Питомец нашел вкусняшку", type: "common", hunger: -10 }, // Положительное
  { desc: "Питомец поиграл с бабочкой", type: "common", happiness: 10 }, // Положительное
  { desc: "Питомец получил похвалу", type: "common", happiness: 10 }, // Положительное
  { desc: "Питомец нашел удобное место для сна", type: "common", energy: 20 }, // Положительное
  {
    desc: "Питомец научился новому трюку",
    type: "common",
    happiness: 10,
    coins: 5,
  }, // Положительное
  { desc: "Питомец получил массаж", type: "common", health: 10 }, // Положительное
  { desc: "Питомец нашел старую игрушку", type: "common", happiness: 5 }, // Положительное
  { desc: "Питомец уронил еду", type: "common", hunger: 10 }, // Отрицательное
  { desc: "Питомец заскучал", type: "common", happiness: -5 }, // Отрицательное
  { desc: "Питомец поцарапался", type: "common", health: -5 }, // Отрицательное
  { desc: "Питомец устал от шума", type: "common", energy: -10 }, // Отрицательное
  { desc: "Питомец потерял монету", type: "common", coins: -5 }, // Отрицательное
  { desc: "Питомец съел что-то не то", type: "common", health: -8, hunger: -8 }, // Отрицательное
  {
    desc: "Питомец застрял в кустах",
    type: "common",
    happiness: -5,
    energy: -5,
  }, // Отрицательное
  { desc: "Питомец выиграл в лотерею", type: "rare", coins: 20, happiness: 10 }, // Положительное
  {
    desc: "Питомец получил супер-лакомство",
    type: "rare",
    hunger: -20,
    happiness: 10,
  }, // Положительное
  { desc: "Питомец попал под дождь", type: "rare", health: -5, happiness: -10 }, // Отрицательное
  {
    desc: "Питомец подрался с другим питомцем",
    type: "rare",
    health: -15,
    happiness: -10,
  }, // Отрицательное
  {
    desc: "Питомец стал звездой дня",
    type: "extra",
    happiness: 30,
    coins: 50,
    energy: 20,
  }, // Положительное
];
