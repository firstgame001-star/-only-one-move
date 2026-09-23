// =====================================
// ONLY ONE MOVE — APP
// =====================================

// Общие настройки
const GAME_CONFIG = {
    thinkTime: 20,          // 20 секунд на размышление
    maxWrongMoves: 3,       // 3 ошибки = проигрыш
    tutorialLevels: 5,      // 1–5 без потери сердца
    hintPrice: 50
};


// =====================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    refreshAppUI();
});

function refreshAppUI() {
    if (typeof updateMainUI === "function") {
        updateMainUI();
    }

    updateHomeProgress();
    updateStreakUI();
}


// =====================================
// ГЛАВНЫЙ ЭКРАН
// =====================================

function updateHomeProgress() {
    if (typeof getPlayerData !== "function") return;

    const data = getPlayerData();

    const progress =
        document.getElementById("progressFill");

    if (progress) {
        // 100 уровней = 100%
        progress.style.width =
            Math.min(
                Math.max(data.level, 1),
                100
            ) + "%";
    }
}


function updateStreakUI() {
    if (typeof getPlayerData !== "function") return;

    const data = getPlayerData();

    const streak =
        document.getElementById("streakValue");

    if (streak) {
        streak.textContent =
            data.streak || 1;
    }
}


// =====================================
// МАГАЗИН ЭНЕРГИИ ❤️
// =====================================

function openEnergyShop() {
    const modal =
        document.getElementById("energyModal");

    if (!modal) {
        console.error(
            "Не найден #energyModal"
        );
        return;
    }

    if (typeof updateEnergyUI === "function") {
        updateEnergyUI();
    }

    modal.classList.add("show");
}


function closeEnergyShop() {
    const modal =
        document.getElementById("energyModal");

    if (!modal) return;

    modal.classList.remove("show");
}


// =====================================
// ПОКУПКА СЕРДЕЦ
// =====================================

function buyEnergy(amount, price) {
    if (
        typeof getEnergyData !== "function" ||
        typeof spendCoins !== "function" ||
        typeof addEnergy !== "function"
    ) {
        console.error(
            "Energy/Storage system not loaded"
        );
        return;
    }

    const energyData =
        getEnergyData();

    // Уже 5/5
    if (energyData.energy >= MAX_ENERGY) {
        showAppNotice(
            "❤️ Энергия уже полная"
        );
        return;
    }

    // Проверяем монеты
    if (!spendCoins(price)) {
        showAppNotice(
            "Недостаточно монет 🪙"
        );
        return;
    }

    addEnergy(amount);

    refreshAppUI();

    if (typeof updateEnergyUI === "function") {
        updateEnergyUI();
    }

    const updated =
        getEnergyData();

    showAppNotice(
        `❤️ Энергия: ${updated.energy}/${MAX_ENERGY}`
    );
}


// =====================================
// ПОЛНОЕ ВОССТАНОВЛЕНИЕ
// =====================================

function buyFullEnergy() {
    if (
        typeof getEnergyData !== "function" ||
        typeof spendCoins !== "function" ||
        typeof addEnergy !== "function"
    ) {
        return;
    }

    const energyData =
        getEnergyData();

    if (energyData.energy >= MAX_ENERGY) {
        showAppNotice(
            "❤️ Энергия уже полная"
        );
        return;
    }

    const missing =
        MAX_ENERGY - energyData.energy;

    // Пока фиксированная цена
    const price = 350;

    if (!spendCoins(price)) {
        showAppNotice(
            "Недостаточно монет 🪙"
        );
        return;
    }

    addEnergy(missing);

    refreshAppUI();

    if (typeof updateEnergyUI === "function") {
        updateEnergyUI();
    }

    showAppNotice(
        "❤️ Энергия полностью восстановлена!"
    );
}


// =====================================
// DAILY REWARD 🎁
// =====================================

function dailyReward() {
    if (
        typeof addCoins !== "function"
    ) {
        return;
    }

    const today =
        new Date().toDateString();

    const lastClaim =
        localStorage.getItem(
            "dailyReward"
        );

    if (lastClaim === today) {
        showAppNotice(
            "🎁 Сегодня награда уже получена"
        );
        return;
    }

    addCoins(50);

    localStorage.setItem(
        "dailyReward",
        today
    );

    refreshAppUI();

    showAppNotice(
        "🎁 +50 монет!"
    );
}


// =====================================
// COMING SOON
// =====================================

function comingSoon(name) {
    showAppNotice(
        name + " — скоро 👀"
    );
}


// =====================================
// УВЕДОМЛЕНИЯ
// =====================================

function showAppNotice(text) {
    alert(text);
}


// =====================================
// ОБНОВЛЕНИЕ ТАЙМЕРА ❤️
// =====================================

// Обновляем магазин и главный экран
// каждую секунду.

setInterval(() => {
    if (
        typeof updateEnergyUI ===
        "function"
    ) {
        updateEnergyUI();
    }
}, 1000);
