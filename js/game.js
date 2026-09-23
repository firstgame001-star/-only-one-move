// =====================================
// ONLY ONE MOVE — GAME ENGINE
// =====================================

let activeLevel = null;
let levelStartedAt = null;
let levelTimerInterval = null;
let levelSeconds = 0;
let wrongAttempts = 0;
let levelSolved = false;


// =====================================
// ЗАПУСК УРОВНЯ
// =====================================

function startLevel(levelNumber) {
    activeLevel = levelNumber;
    wrongAttempts = 0;
    levelSolved = false;
    levelSeconds = 0;
    levelStartedAt = Date.now();

    stopLevelTimer();

    levelTimerInterval = setInterval(() => {
        levelSeconds = Math.floor(
            (Date.now() - levelStartedAt) / 1000
        );

        updateTimerDisplay();
    }, 1000);

    updateTimerDisplay();
}


// =====================================
// ТАЙМЕР
// =====================================

function stopLevelTimer() {
    if (levelTimerInterval !== null) {
        clearInterval(levelTimerInterval);
        levelTimerInterval = null;
    }
}


function updateTimerDisplay() {
    const timer = document.getElementById("levelTimer");

    if (!timer) return;

    const minutes = Math.floor(levelSeconds / 60);
    const seconds = levelSeconds % 60;

    timer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


// =====================================
// ЗВЁЗДЫ
// =====================================

function calculateStars() {
    // Пока единые правила.
    // Позже пороги будут зависеть от сложности уровня.

    if (levelSeconds <= 20) {
        return 3;
    }

    if (levelSeconds <= 45) {
        return 2;
    }

    return 1;
}


// =====================================
// НЕПРАВИЛЬНЫЙ ХОД
// =====================================

function registerWrongMove() {
    if (levelSolved) return;

    wrongAttempts++;

    // Первые 5 уровней — обучение.
    // Сердца там не тратятся.
    if (activeLevel <= 5) {
        showGameMessage(
            "Не совсем 👀 Попробуй ещё раз."
        );
        return;
    }

    const attemptsLeft = 3 - wrongAttempts;

    if (attemptsLeft > 0) {
        showGameMessage(
            `Неверно. До потери ❤️: ${attemptsLeft}`
        );

        return;
    }

    // Три ошибки = минус одно сердце
    wrongAttempts = 0;

    const used = useEnergy();

    if (!used) {
        showNoEnergy();
        return;
    }

    const energyData = getEnergyData();

    updateEnergyUI();

    showGameMessage(
        `−1 ❤️ Осталось ${energyData.energy}/${MAX_ENERGY}`
    );

    if (energyData.energy <= 0) {
        setTimeout(() => {
            showNoEnergy();
        }, 700);
    }
}


// =====================================
// ПРАВИЛЬНОЕ РЕШЕНИЕ
// =====================================

function solveLevel(coinReward = 30) {
    if (levelSolved) return;

    levelSolved = true;

    stopLevelTimer();

    const stars = calculateStars();

    const result = completeLevel(
        activeLevel,
        stars,
        coinReward
    );

    updateMainUI();

    showLevelComplete({
        level: activeLevel,
        stars,
        seconds: levelSeconds,
        coinReward:
            result.firstCompletion ? coinReward : 0,
        firstCompletion: result.firstCompletion
    });
}


// =====================================
// ОКНО ПРОХОЖДЕНИЯ
// =====================================

function showLevelComplete(result) {
    const modal =
        document.getElementById("levelCompleteModal");

    if (!modal) {
        console.log("Уровень пройден!", result);
        return;
    }

    const starsElement =
        document.getElementById("completeStars");

    const timeElement =
        document.getElementById("completeTime");

    const rewardElement =
        document.getElementById("completeReward");

    if (starsElement) {
        starsElement.textContent =
            "⭐".repeat(result.stars);
    }

    if (timeElement) {
        timeElement.textContent =
            `Время: ${result.seconds} сек.`;
    }

    if (rewardElement) {
        if (result.firstCompletion) {
            rewardElement.textContent =
                `+${result.coinReward} 🪙`;
        } else {
            rewardElement.textContent =
                "Уровень уже был пройден";
        }
    }

    modal.classList.add("show");
}


// =====================================
// НЕТ ЭНЕРГИИ
// =====================================

function showNoEnergy() {
    stopLevelTimer();

    const timer = getEnergyTimer();

    const modal =
        document.getElementById("energyModal");

    if (!modal) {
        alert(
            `❤️ Энергия закончилась.\n` +
            `Следующее сердце через ${timer}`
        );

        return;
    }

    modal.classList.add("show");

    updateEnergyUI();
}


// =====================================
// СООБЩЕНИЯ
// =====================================

function showGameMessage(message) {
    const element =
        document.getElementById("gameMessage");

    if (!element) {
        console.log(message);
        return;
    }

    element.textContent = message;
    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 1800);
}


// =====================================
// ОБНОВЛЕНИЕ ❤️
// =====================================

function updateEnergyUI() {
    const data = getEnergyData();

    const energyElements =
        document.querySelectorAll("[data-energy]");

    energyElements.forEach(element => {
        element.textContent =
            `${data.energy}/${MAX_ENERGY}`;
    });

    const timerElements =
        document.querySelectorAll(
            "[data-energy-timer]"
        );

    timerElements.forEach(element => {
        if (data.energy >= MAX_ENERGY) {
            element.textContent = "Полная энергия";
        } else {
            element.textContent =
                `+1 через ${getEnergyTimer()}`;
        }
    });
}


// =====================================
// ГЛАВНЫЙ ИНТЕРФЕЙС
// =====================================

function updateMainUI() {
    const data = getPlayerData();

    const coinElements =
        document.querySelectorAll("[data-coins]");

    coinElements.forEach(element => {
        element.textContent = data.coins;
    });

    const levelElements =
        document.querySelectorAll("[data-level]");

    levelElements.forEach(element => {
        element.textContent = data.level;
    });

    const starElements =
        document.querySelectorAll("[data-stars]");

    starElements.forEach(element => {
        element.textContent = data.totalStars;
    });

    updateEnergyUI();
}


// Обновляем таймер энергии постоянно,
// пока приложение открыто
setInterval(() => {
    updateEnergyUI();
}, 1000);
