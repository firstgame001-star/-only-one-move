// =====================================
// ONLY ONE MOVE — GAME ENGINE
// =====================================

// ---------- НАСТРОЙКИ ----------

const START_STARS = 3;

const FREE_THINK_TIME = 20;     // первые 20 сек.
const STAR_BURN_INTERVAL = 10;  // затем каждые 10 сек. сгорает ⭐

const MAX_LEVEL_TIME =
    FREE_THINK_TIME +
    STAR_BURN_INTERVAL * START_STARS; // 50 сек.


// ---------- СОСТОЯНИЕ УРОВНЯ ----------

let activeLevel = 1;

let levelSolved = false;
let levelFailed = false;

let currentStars = START_STARS;

let wrongAttempts = 0;

let elapsedSeconds = 0;
let levelStartedAt = null;

let levelTimerInterval = null;


// =====================================
// START LEVEL
// =====================================

function startLevel(levelNumber) {

    stopLevelTimer();

    activeLevel = levelNumber;

    levelSolved = false;
    levelFailed = false;

    currentStars = START_STARS;

    wrongAttempts = 0;

    elapsedSeconds = 0;

    levelStartedAt = Date.now();

    updateStarsDisplay();
    updateTimerDisplay();

    levelTimerInterval = setInterval(() => {

        if (levelSolved || levelFailed) {
            stopLevelTimer();
            return;
        }

        elapsedSeconds =
            Math.floor(
                (Date.now() - levelStartedAt) / 1000
            );

        checkTimePenalty();

        updateTimerDisplay();

    }, 250);
}


// =====================================
// TIME PENALTIES
// =====================================

function checkTimePenalty() {

    if (levelSolved || levelFailed) {
        return;
    }

    /*
        0–29 сек.  = ⭐⭐⭐
        30–39 сек. = ⭐⭐
        40–49 сек. = ⭐
        50 сек.     = 💔 проигрыш

        Но ошибки тоже могут уже
        уменьшить количество звёзд.
    */

    let starsAllowedByTime = 3;

    if (elapsedSeconds >= 50) {
        starsAllowedByTime = 0;
    }
    else if (elapsedSeconds >= 40) {
        starsAllowedByTime = 1;
    }
    else if (elapsedSeconds >= 30) {
        starsAllowedByTime = 2;
    }


    /*
        Время может только уменьшать
        звёзды, но никогда не возвращать их.
    */

    if (starsAllowedByTime < currentStars) {

        const difference =
            currentStars - starsAllowedByTime;

        currentStars =
            starsAllowedByTime;

        updateStarsDisplay();


        if (currentStars <= 0) {

            failLevel("time");

            return;
        }


        if (difference > 0) {

            showGameMessage(
                `⏱ Время! −⭐ Осталось: ${currentStars}`,
                "bad"
            );
        }
    }
}


// =====================================
// WRONG MOVE
// =====================================

function registerWrongMove() {

    if (levelSolved || levelFailed) {
        return;
    }

    wrongAttempts++;

    currentStars--;

    updateStarsDisplay();


    // Звёзд больше нет
    if (currentStars <= 0) {

        currentStars = 0;

        updateStarsDisplay();

        failLevel("mistakes");

        return;
    }


    showGameMessage(
        `❌ Ошибка! −⭐ Осталось: ${currentStars}`,
        "bad"
    );
}


// =====================================
// FAIL LEVEL 💔
// =====================================

function failLevel(reason) {

    if (levelSolved || levelFailed) {
        return;
    }

    levelFailed = true;

    stopLevelTimer();


    let heartLost = false;


    // Сердце теряется с первого уровня
    if (
        typeof useEnergy === "function"
    ) {

        heartLost = useEnergy();
    }


    if (
        typeof updateEnergyUI === "function"
    ) {

        updateEnergyUI();
    }


    let reasonText =
        "Звёзды закончились";


    if (reason === "time") {

        reasonText =
            "Время вышло";

    }

    else if (reason === "mistakes") {

        reasonText =
            "Слишком много неверных ходов";

    }


    showLoseModal(
        reasonText,
        heartLost
    );
}


// =====================================
// LOSE MODAL
// =====================================

function showLoseModal(
    reasonText,
    heartLost
) {

    let modal =
        document.getElementById(
            "loseModal"
        );


    // Создаём окно автоматически
    if (!modal) {

        modal =
            document.createElement("div");

        modal.id = "loseModal";

        modal.className = "overlay";


        modal.innerHTML = `
            <div class="win">

                <div style="
                    font-size:68px;
                    margin-bottom:10px;
                ">
                    💔
                </div>

                <h2>
                    ПОПЫТКА НЕ УДАЛАСЬ
                </h2>

                <div
                    id="loseReason"
                    style="
                        margin-top:10px;
                        color:#9da5b4;
                        font-weight:700;
                    ">
                </div>

                <div style="
                    margin-top:20px;
                    font-size:22px;
                    font-weight:900;
                ">
                    ❤️
                    <span id="loseEnergy">
                        0
                    </span>
                    /5
                </div>

                <div
                    id="heartLostText"
                    style="
                        margin-top:8px;
                        color:#ff7373;
                        font-weight:900;
                    ">
                </div>

                <button
                    class="next"
                    onclick="retryAfterLose()">

                    ↻ ПОПРОБОВАТЬ СНОВА

                </button>

                <button
                    class="shop-option"
                    onclick="openEnergyFromLose()">

                    ❤️ ВОССТАНОВИТЬ ЭНЕРГИЮ

                </button>

                <button
                    class="close-shop"
                    onclick="homeAfterLose()">

                    ← На главную

                </button>

            </div>
        `;


        document.body.appendChild(modal);
    }


    const reason =
        document.getElementById(
            "loseReason"
        );

    if (reason) {
        reason.textContent =
            reasonText;
    }


    const energy =
        typeof getEnergyData === "function"
            ? getEnergyData()
            : { energy: 0 };


    const energyText =
        document.getElementById(
            "loseEnergy"
        );

    if (energyText) {

        energyText.textContent =
            energy.energy;
    }


    const lostText =
        document.getElementById(
            "heartLostText"
        );

    if (lostText) {

        lostText.textContent =
            heartLost
                ? "−1 ❤️"
                : "❤️ Энергия закончилась";
    }


    modal.classList.add("show");
}


// =====================================
// RETRY AFTER LOSE
// =====================================

function retryAfterLose() {

    const energy =
        typeof getEnergyData === "function"
            ? getEnergyData()
            : { energy: 0 };


    if (energy.energy <= 0) {

        closeLoseModal();

        showNoEnergy();

        return;
    }


    closeLoseModal();


    if (
        typeof resetPuzzleVisual ===
        "function"
    ) {

        resetPuzzleVisual();
    }


    startLevel(activeLevel);
}


// =====================================
// CLOSE LOSE
// =====================================

function closeLoseModal() {

    const modal =
        document.getElementById(
            "loseModal"
        );

    if (modal) {

        modal.classList.remove("show");
    }
}


// =====================================
// ENERGY FROM LOSE
// =====================================

function openEnergyFromLose() {

    closeLoseModal();


    if (
        typeof openEnergyShop ===
        "function"
    ) {

        openEnergyShop();
    }
}


// =====================================
// HOME AFTER LOSE
// =====================================

function homeAfterLose() {

    closeLoseModal();


    if (
        typeof goHome ===
        "function"
    ) {

        goHome();
    }
}


// =====================================
// CORRECT SOLUTION
// =====================================

function solveLevel(
    coinReward = 30
) {

    if (levelSolved || levelFailed) {
        return;
    }


    levelSolved = true;

    stopLevelTimer();


    const starsEarned =
        Math.max(
            1,
            currentStars
        );


    const result =
        completeLevel(
            activeLevel,
            starsEarned,
            coinReward
        );


    updateMainUI();


    showLevelComplete({

        level:
            activeLevel,

        stars:
            starsEarned,

        seconds:
            elapsedSeconds,

        wrongAttempts:
            wrongAttempts,

        coinReward:
            result.firstCompletion
                ? coinReward
                : 0,

        firstCompletion:
            result.firstCompletion,

        bestStars:
            result.bestStars
    });
}


// =====================================
// WIN MODAL
// =====================================

function showLevelComplete(result) {

    const modal =
        document.getElementById(
            "levelCompleteModal"
        );

    if (!modal) {
        return;
    }


    const starsElement =
        document.getElementById(
            "completeStars"
        );

    const timeElement =
        document.getElementById(
            "completeTime"
        );

    const rewardElement =
        document.getElementById(
            "completeReward"
        );


    if (starsElement) {

        starsElement.textContent =
            "⭐".repeat(
                result.stars
            );
    }


    if (timeElement) {

        timeElement.textContent =
            `Время: ${result.seconds} сек.`;
    }


    if (rewardElement) {

        if (result.firstCompletion) {

            rewardElement.textContent =
                `+${result.coinReward} 🪙`;

        }

        else {

            rewardElement.textContent =
                `Лучший результат: ${"⭐".repeat(result.bestStars)}`;
        }
    }


    setTimeout(() => {

        modal.classList.add("show");

    }, 350);
}


// =====================================
// STARS UI
// =====================================

function updateStarsDisplay() {

    /*
        Если позже добавим специальный
        #levelStars — обновится он.

        Пока также ищем элементы
        с data-level-stars.
    */


    const text =
        currentStars > 0
            ? "⭐".repeat(currentStars)
            : "💔";


    const levelStars =
        document.getElementById(
            "levelStars"
        );


    if (levelStars) {

        levelStars.textContent = text;
    }


    document
        .querySelectorAll(
            "[data-level-stars]"
        )
        .forEach(element => {

            element.textContent = text;
        });
}


// =====================================
// TIMER UI
// =====================================

function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "levelTimer"
        );

    if (!timer) {
        return;
    }


    /*
        0–20:
        время на размышление

        20–30:
        предупреждение до первой потери ⭐

        30–40:
        до следующей ⭐

        40–50:
        последняя ⭐
    */


    if (elapsedSeconds < 20) {

        const left =
            20 - elapsedSeconds;

        timer.textContent =
            `🧠 ${left} сек.`;

        return;
    }


    if (elapsedSeconds < 30) {

        const left =
            30 - elapsedSeconds;

        timer.textContent =
            `⭐⭐⭐ ${left} сек.`;

        return;
    }


    if (elapsedSeconds < 40) {

        const left =
            40 - elapsedSeconds;

        timer.textContent =
            `⭐⭐ ${left} сек.`;

        return;
    }


    if (elapsedSeconds < 50) {

        const left =
            50 - elapsedSeconds;

        timer.textContent =
            `⭐ ${left} сек.`;

        return;
    }


    timer.textContent =
        "💔 Время вышло";
}


// =====================================
// STOP TIMER
// =====================================

function stopLevelTimer() {

    if (levelTimerInterval !== null) {

        clearInterval(
            levelTimerInterval
        );

        levelTimerInterval = null;
    }
}


// =====================================
// GAME MESSAGE
// =====================================

function showGameMessage(
    text,
    type = ""
) {

    const message =
        document.getElementById(
            "gameMessage"
        );


    if (!message) {

        console.log(text);

        return;
    }


    message.textContent = text;

    message.classList.add("show");


    if (type) {

        message.classList.add(type);
    }


    setTimeout(() => {

        message.classList.remove(
            "show"
        );

        if (type) {

            message.classList.remove(
                type
            );
        }

    }, 1600);
}


// =====================================
// NO ENERGY
// =====================================

function showNoEnergy() {

    stopLevelTimer();


    if (
        typeof openEnergyShop ===
        "function"
    ) {

        openEnergyShop();

        return;
    }


    alert(
        "❤️ Энергия закончилась"
    );
}


// =====================================
// ENERGY UI
// =====================================

function updateEnergyUI() {

    if (
        typeof getEnergyData !==
        "function"
    ) {

        return;
    }


    const data =
        getEnergyData();


    document
        .querySelectorAll(
            "[data-energy]"
        )
        .forEach(element => {

            element.textContent =
                `${data.energy}/${MAX_ENERGY}`;
        });


    document
        .querySelectorAll(
            "[data-energy-timer]"
        )
        .forEach(element => {

            if (
                data.energy >= MAX_ENERGY
            ) {

                element.textContent =
                    "Полная энергия";
            }

            else {

                element.textContent =
                    `+1 ❤️ через ${getEnergyTimer()}`;
            }
        });
}


// =====================================
// MAIN UI
// =====================================

function updateMainUI() {

    if (
        typeof getPlayerData !==
        "function"
    ) {

        return;
    }


    const data =
        getPlayerData();


    document
        .querySelectorAll(
            "[data-coins]"
        )
        .forEach(element => {

            element.textContent =
                data.coins;
        });


    document
        .querySelectorAll(
            "[data-level]"
        )
        .forEach(element => {

            element.textContent =
                data.level;
        });


    document
        .querySelectorAll(
            "[data-stars]"
        )
        .forEach(element => {

            element.textContent =
                data.totalStars;
        });


    updateEnergyUI();
}


// =====================================
// ENERGY REGEN DISPLAY
// =====================================

setInterval(() => {

    updateEnergyUI();

}, 1000);
