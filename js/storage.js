// =====================================
// ONLY ONE MOVE — STORAGE SYSTEM
// =====================================

const DEFAULT_PLAYER_DATA = {
    coins: 300,
    level: 1,
    totalStars: 0,
    streak: 1,
    completedLevels: {},
    bestStars: {}
};

// Получить данные игрока
function getPlayerData() {
    const saved = localStorage.getItem("playerData");

    if (saved === null) {
        const newData = { ...DEFAULT_PLAYER_DATA };
        savePlayerData(newData);
        return newData;
    }

    try {
        const parsed = JSON.parse(saved);

        return {
            ...DEFAULT_PLAYER_DATA,
            ...parsed,
            completedLevels: parsed.completedLevels || {},
            bestStars: parsed.bestStars || {}
        };
    } catch (error) {
        console.error("Ошибка загрузки сохранения:", error);
        return { ...DEFAULT_PLAYER_DATA };
    }
}

// Сохранить данные
function savePlayerData(data) {
    localStorage.setItem(
        "playerData",
        JSON.stringify(data)
    );
}

// ===============================
// МОНЕТЫ 🪙
// ===============================

function getCoins() {
    return getPlayerData().coins;
}

function addCoins(amount) {
    const data = getPlayerData();
    data.coins += amount;
    savePlayerData(data);

    return data.coins;
}

function spendCoins(amount) {
    const data = getPlayerData();

    if (data.coins < amount) {
        return false;
    }

    data.coins -= amount;
    savePlayerData(data);

    return true;
}

// ===============================
// УРОВНИ
// ===============================

function getCurrentLevel() {
    return getPlayerData().level;
}

function setCurrentLevel(level) {
    const data = getPlayerData();

    data.level = Math.max(1, level);

    savePlayerData(data);
}

// ===============================
// ПРОХОЖДЕНИЕ
// ===============================

function completeLevel(level, stars, coinReward) {
    const data = getPlayerData();

    const key = String(level);

    const alreadyCompleted =
        data.completedLevels[key] === true;

    const oldBest =
        data.bestStars[key] || 0;

    // Монеты только за первое прохождение
    if (!alreadyCompleted) {
        data.coins += coinReward;
        data.completedLevels[key] = true;
    }

    // Добавляем только улучшение результата ⭐
    if (stars > oldBest) {
        data.totalStars += stars - oldBest;
        data.bestStars[key] = stars;
    }

    // Открываем следующий уровень
    if (level >= data.level) {
        data.level = level + 1;
    }

    savePlayerData(data);

    return {
        firstCompletion: !alreadyCompleted,
        coins: data.coins,
        totalStars: data.totalStars,
        bestStars: data.bestStars[key]
    };
}

function isLevelCompleted(level) {
    return (
        getPlayerData().completedLevels[String(level)] === true
    );
}

function getBestStars(level) {
    return (
        getPlayerData().bestStars[String(level)] || 0
    );
}

// ===============================
// STREAK 🔥
// ===============================

function getStreak() {
    return getPlayerData().streak;
}

function setStreak(value) {
    const data = getPlayerData();

    data.streak = Math.max(1, value);

    savePlayerData(data);
}
