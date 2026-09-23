// ===============================
// ONLY ONE MOVE — ENERGY SYSTEM
// ===============================

const MAX_ENERGY = 5;
const INFINITE_ENERGY_MODE = true; // TEMP: unlimited energy for testing
const ENERGY_REGEN_TIME = 15 * 60 * 1000; // 15 минут

function getEnergyData() {
    if (INFINITE_ENERGY_MODE) {
        return {
            energy: MAX_ENERGY,
            updatedAt: Date.now(),
            infinite: true
        };
    }

    const savedEnergy = localStorage.getItem("energy");
    const savedTime = localStorage.getItem("energyUpdatedAt");

    let energy = savedEnergy === null
        ? MAX_ENERGY
        : Number(savedEnergy);

    let updatedAt = savedTime === null
        ? Date.now()
        : Number(savedTime);

    // Если энергия не полная — считаем,
    // сколько сердец восстановилось, пока игрок отсутствовал
    if (energy < MAX_ENERGY) {
        const now = Date.now();
        const elapsed = now - updatedAt;

        const restoredHearts = Math.floor(
            elapsed / ENERGY_REGEN_TIME
        );

        if (restoredHearts > 0) {
            energy = Math.min(
                MAX_ENERGY,
                energy + restoredHearts
            );

            // Сохраняем остаток времени,
            // чтобы таймер не начинался заново
            updatedAt += restoredHearts * ENERGY_REGEN_TIME;

            if (energy === MAX_ENERGY) {
                updatedAt = Date.now();
            }

            saveEnergyData(energy, updatedAt);
        }
    }

    return {
        energy,
        updatedAt
    };
}


function saveEnergyData(energy, updatedAt = Date.now()) {
    localStorage.setItem("energy", String(energy));
    localStorage.setItem(
        "energyUpdatedAt",
        String(updatedAt)
    );
}


// Потратить одно сердце
function useEnergy() {
    if (INFINITE_ENERGY_MODE) {
        return false;
    }

    const data = getEnergyData();

    if (data.energy <= 0) {
        return false;
    }

    const newEnergy = data.energy - 1;

    // Если до этого энергия была полной,
    // именно сейчас запускаем 15-минутный таймер
    const newUpdatedAt =
        data.energy === MAX_ENERGY
            ? Date.now()
            : data.updatedAt;

    saveEnergyData(newEnergy, newUpdatedAt);

    return true;
}


// Купить / получить сердца
function addEnergy(amount = 1) {
    if (INFINITE_ENERGY_MODE) {
        return MAX_ENERGY;
    }

    const data = getEnergyData();

    const newEnergy = Math.min(
        MAX_ENERGY,
        data.energy + amount
    );

    if (newEnergy === MAX_ENERGY) {
        saveEnergyData(newEnergy, Date.now());
    } else {
        saveEnergyData(newEnergy, data.updatedAt);
    }

    return newEnergy;
}


// Сколько осталось до следующего сердца
function getEnergyTimer() {
    if (INFINITE_ENERGY_MODE) {
        return "∞";
    }

    const data = getEnergyData();

    if (data.energy >= MAX_ENERGY) {
        return "MAX";
    }

    const elapsed = Date.now() - data.updatedAt;
    const remaining =
        ENERGY_REGEN_TIME -
        (elapsed % ENERGY_REGEN_TIME);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor(
        (remaining % 60000) / 1000
    );

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}
