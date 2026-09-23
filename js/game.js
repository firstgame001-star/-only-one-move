// =====================================
// ONLY ONE MOVE — GAME ENGINE
// =====================================

const THINK_TIME = 20;
const MAX_WRONG_MOVES = 3;

let activeLevel = 1;
let levelSolved = false;

let thinkSeconds = THINK_TIME;
let playSeconds = 0;

let wrongAttempts = 0;

let thinkInterval = null;
let playInterval = null;


// =====================================
// START LEVEL
// =====================================

function startLevel(levelNumber) {

    activeLevel = levelNumber;

    levelSolved = false;
    wrongAttempts = 0;

    thinkSeconds = THINK_TIME;
    playSeconds = 0;

    stopLevelTimer();

    updateTimerDisplay();

    // 20 секунд на размышление
    thinkInterval = setInterval(() => {

        thinkSeconds--;

        if (thinkSeconds <= 0) {

            thinkSeconds = 0;

            clearInterval(thinkInterval);
            thinkInterval = null;

            startPlayTimer();

        }

        updateTimerDisplay();

    }, 1000);
}


// =====================================
// TIMER AFTER THINKING
// =====================================

function startPlayTimer() {

    playSeconds = 0;

    playInterval = setInterval(() => {

        playSeconds++;

        updateTimerDisplay();

    }, 1000);
}


// =====================================
// TIMER DISPLAY
// =====================================

function updateTimerDisplay() {

    const timer =
        document.getElementById("levelTimer");

    if (!timer) return;


    // Пока идёт время на размышление
    if (thinkSeconds > 0) {

        timer.textContent =
            "🧠 " + thinkSeconds + " сек.";

        return;
    }


    // После размышления
    const minutes =
        Math.floor(playSeconds / 60);

    const seconds =
        playSeconds % 60;

    timer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


// =====================================
// STOP TIMER
// =====================================

function stopLevelTimer() {

    if (thinkInterval) {
        clearInterval(thinkInterval);
        thinkInterval = null;
    }

    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
}


// =====================================
// STARS ⭐
// =====================================

function calculateStars() {

    /*
       Решил во время размышления:
       ⭐⭐⭐
    */

    if (thinkSeconds > 0) {
        return 3;
    }

    /*
       После окончания 20 секунд:
       до 20 дополнительных секунд = ⭐⭐⭐
       до 45 дополнительных секунд = ⭐⭐
       дальше = ⭐
    */

    if (playSeconds <= 20) {
        return 3;
    }

    if (playSeconds <= 45) {
        return 2;
    }

    return 1;
}


// =====================================
// WRONG MOVE ❌
// =====================================

function registerWrongMove() {

    if (levelSolved) return;

    wrongAttempts++;

    const attemptsLeft =
        MAX_WRONG_MOVES - wrongAttempts;


    // Ещё есть попытки
    if (attemptsLeft > 0) {

        showGameMessage(
            `❌ Неверно. Осталось попыток: ${attemptsLeft}`,
            "bad"
        );

        return;
    }


    // Третья ошибка = проигрыш
    loseLevel();
}


// =====================================
// LOSE
// =====================================

function loseLevel() {

    stopLevelTimer();

    wrongAttempts = 0;

    // С уровня 1 теряем сердце
    const heartUsed =
        useEnergy();


    if (!heartUsed) {

        showNoEnergy();

        return;
    }


    updateEnergyUI();


    const energy =
        getEnergyData();


    showGameMessage(
        `💔 Попытка не удалась. −1 ❤️`,
        "bad"
    );


    setTimeout(() => {

        showLoseModal(
            energy.energy
        );

    }, 600);
}


// =====================================
// LOSE WINDOW
// =====================================

function showLoseModal(energyLeft) {

    let modal =
        document.getElementById(
            "loseModal"
        );


    // Создаём окно автоматически,
    // если его ещё нет в HTML

    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id = "loseModal";
        modal.className = "overlay";

        modal.innerHTML = `
            <div class="win">

                <div style="
                    font-size:64px;
                    margin-bottom:12px;
                ">
                    💔
                </div>

                <h2>
                    Попытка не удалась
                </h2>

                <div style="
                    color:#929bab;
                    margin-top:10px;
                ">
                    Ты использовал 3 неверных хода
                </div>

                <div style="
                    font-size:22px;
                    font-weight:900;
                    margin-top:20px;
                ">
                    ❤️
                    <span id="loseEnergy">
                        0
                    </span>
                    /5
                </div>

                <button
                    class="next"
                    onclick="retryAfterLose()">

                    ↻ ПОПРОБОВАТЬ СНОВА

                </button>

                <button
                    class="shop-option"
                    onclick="openEnergyFromLose()">

                    ❤️ Восстановить энергию

                </button>

                <button
                    class="close-shop"
                    onclick="homeAfterLose()">

                    ← На главную

                </button>

            </div>
        `;

        document.body.appendChild(
            modal
        );
    }


    const energyText =
        document.getElementById(
            "loseEnergy"
        );

    if (energyText) {
        energyText.textContent =
            energyLeft;
    }


    modal.classList.add("show");
}


// =====================================
// RETRY
// =====================================

function retryAfterLose() {

    const energy =
        getEnergyData();


    // Играть с 0 ❤️ нельзя
    if (energy.energy <= 0) {

        closeLoseModal();

        showNoEnergy();

        return;
    }


    closeLoseModal();


    // Эта функция находится
    // в index.html
    if (
        typeof resetPuzzleVisual ===
        "function"
    ) {
        resetPuzzleVisual();
    }


    startLevel(activeLevel);
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


function closeLoseModal() {

    const modal =
        document.getElementById(
            "loseModal"
        );

    if (modal) {
        modal.classList.remove(
            "show"
        );
    }
}


// =====================================
// CORRECT SOLUTION ✅
// =====================================

function solveLevel(
    coinReward = 30
) {

    if (levelSolved) return;

    levelSolved = true;

    stopLevelTimer();


    const stars =
        calculateStars();


    const result =
        completeLevel(
            activeLevel,
            stars,
            coinReward
        );


    updateMainUI();


    if (
        typeof updateProgress ===
        "function"
    ) {
        updateProgress();
    }


    showLevelComplete({

        level:
            activeLevel,

        stars:
            stars,

        seconds:
            playSeconds,

        coinReward:
            result.firstCompletion
                ? coinReward
                : 0,

        firstCompletion:
            result.firstCompletion

    });
}


// =====================================
// WIN WINDOW
// =====================================

function showLevelComplete(result) {

    const modal =
        document.getElementById(
            "levelCompleteModal"
        );

    if (!modal) return;


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

        if (
            thinkSeconds > 0
        ) {

            timeElement.textContent =
                "Решено во время обдумывания!";

        } else {

            timeElement.textContent =
                `Время: ${result.seconds} сек.`;
        }
    }


    if (rewardElement) {

        if (
            result.firstCompletion
        ) {

            rewardElement.textContent =
                `+${result.coinReward} 🪙`;

        } else {

            rewardElement.textContent =
                "Лучший результат сохранён";
        }
    }


    setTimeout(() => {

        modal.classList.add(
            "show"
        );

    }, 400);
}


// =====================================
// NO ENERGY ❤️
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

    if (!message) return;


    message.className =
        "message " + type;

    message.textContent =
        text;


    setTimeout(() => {

        if (!levelSolved) {
            message.textContent = "";
        }

    }, 1800);
}


// =====================================
// ENERGY UI ❤️
// =====================================

function updateEnergyUI() {

    if (
        typeof getEnergyData !==
        "function"
    ) return;


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
                data.energy >=
                MAX_ENERGY
            ) {

                element.textContent =
                    "Полная энергия";

            } else {

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
    ) return;


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
// ENERGY CLOCK
// =====================================

setInterval(() => {

    updateEnergyUI();

}, 1000);
