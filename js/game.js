const START_STARS = 3;

const FREE_THINK_TIME = 20;

const TIME_STAR_PENALTIES = [
    30,
    40,
    50
];

let activeLevel = 1;

let levelSolved = false;
let levelFailed = false;

let currentStars = START_STARS;

let wrongAttempts = 0;

let elapsedSeconds = 0;

let levelStartedAt = null;

let levelTimerInterval = null;

/*
    Храним уже применённые
    временные штрафы.

    Благодаря этому штрафы времени
    складываются с ошибками игрока.
*/
let appliedTimePenalties = new Set();


/* =========================
   START LEVEL
========================= */

function startLevel(levelNumber) {

    stopLevelTimer();

    activeLevel = levelNumber;

    levelSolved = false;
    levelFailed = false;

    currentStars = START_STARS;

    wrongAttempts = 0;

    elapsedSeconds = 0;

    levelStartedAt = Date.now();

    appliedTimePenalties = new Set();

    updateStarsDisplay();
    updateTimerDisplay();

    levelTimerInterval = setInterval(() => {

        if (levelSolved || levelFailed) {

            stopLevelTimer();

            return;
        }

        elapsedSeconds = Math.floor(
            (Date.now() - levelStartedAt) / 1000
        );

        checkTimePenalty();

        updateTimerDisplay();

    }, 250);
}


/* =========================
   TIME PENALTIES
========================= */

function checkTimePenalty() {

    if (levelSolved || levelFailed) {
        return;
    }

    for (const threshold of TIME_STAR_PENALTIES) {

        if (
            elapsedSeconds >= threshold &&
            !appliedTimePenalties.has(threshold)
        ) {

            /*
                Сначала отмечаем штраф,
                чтобы он никогда не применился
                второй раз.
            */
            appliedTimePenalties.add(threshold);

            burnStar("time");

            /*
                Если после штрафа уровень
                проигран — дальше ничего
                не проверяем.
            */
            if (levelFailed) {
                return;
            }
        }
    }
}


/* =========================
   BURN ONE STAR
========================= */

function burnStar(reason) {

    if (levelSolved || levelFailed) {
        return;
    }

    currentStars = Math.max(
        0,
        currentStars - 1
    );

    updateStarsDisplay();

    if (currentStars <= 0) {

        failLevel(reason);

        return;
    }

    if (reason === "time") {

        showGameMessage(
            `⏱ Время! −⭐ Осталось: ${currentStars}`,
            "bad"
        );

    } else {

        showGameMessage(
            `❌ Ошибка! −⭐ Осталось: ${currentStars}`,
            "bad"
        );
    }
}


/* =========================
   WRONG MOVE
========================= */

function registerWrongMove() {

    if (levelSolved || levelFailed) {
        return;
    }

    wrongAttempts++;

    burnStar("mistakes");
}


/* =========================
   FAIL LEVEL
========================= */

function failLevel(reason) {

    if (levelSolved || levelFailed) {
        return;
    }

    levelFailed = true;

    stopLevelTimer();

    let heartLost = false;

    if (typeof useEnergy === "function") {

        heartLost = useEnergy();
    }

    if (typeof updateEnergyUI === "function") {

        updateEnergyUI();
    }

    let reasonText =
        "Звёзды закончились";

    if (reason === "time") {

        reasonText =
            "Время и ошибки исчерпали все звёзды";

    } else if (reason === "mistakes") {

        reasonText =
            "Все звёзды потеряны";
    }

    showLoseModal(
        reasonText,
        heartLost
    );
}


/* =========================
   LOSE MODAL
========================= */

function showLoseModal(
    reasonText,
    heartLost
) {

    let modal =
        document.getElementById(
            "loseModal"
        );

    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "loseModal";

        modal.className =
            "overlay";

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
                    </span>/5
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

        document.body.appendChild(
            modal
        );
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

    modal.classList.add(
        "show"
    );
}


/* =========================
   RETRY
========================= */

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

    startLevel(
        activeLevel
    );

    /*
        Для спичек снова запускаем
        состояние головоломки.
    */
    if (
        typeof startMatchstickPuzzle ===
        "function"
    ) {

        startMatchstickPuzzle();
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


function openEnergyFromLose() {

    closeLoseModal();

    if (
        typeof openEnergyShop ===
        "function"
    ) {

        openEnergyShop();
    }
}


function homeAfterLose() {

    closeLoseModal();

    if (
        typeof goHome ===
        "function"
    ) {

        goHome();
    }
}


/* =========================
   SOLVE LEVEL
========================= */

function solveLevel(
    coinReward = 30
) {

    if (levelSolved || levelFailed) {
        return;
    }

    levelSolved = true;

    stopLevelTimer();

    /*
        Если игрок решил уровень
        с одной звездой —
        получает одну.

        С нулём решить уже невозможно,
        потому что failLevel вызывается
        сразу после потери последней.
    */
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


/* =========================
   COMPLETE MODAL
========================= */

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

        if (
            result.firstCompletion
        ) {

            rewardElement.textContent =
                `+${result.coinReward} 🪙`;

        } else {

            rewardElement.textContent =
                `Лучший результат: ${
                    "⭐".repeat(
                        result.bestStars
                    )
                }`;
        }
    }

    setTimeout(() => {

        modal.classList.add(
            "show"
        );

    }, 250);
}


/* =========================
   STARS UI
========================= */

function updateStarsDisplay() {

    const text =
        currentStars > 0
            ? "⭐".repeat(
                currentStars
            )
            : "💔";

    const levelStars =
        document.getElementById(
            "levelStars"
        );

    if (levelStars) {

        levelStars.textContent =
            text;
    }

    document
        .querySelectorAll(
            "[data-level-stars]"
        )
        .forEach(element => {

            element.textContent =
                text;
        });
}


/* =========================
   TIMER UI
========================= */

function updateTimerDisplay() {

    const timer =
        document.getElementById(
            "levelTimer"
        );

    if (!timer) {
        return;
    }

    /*
        Первые 20 секунд —
        свободное размышление.
    */
    if (
        elapsedSeconds <
        FREE_THINK_TIME
    ) {

        const left =
            FREE_THINK_TIME -
            elapsedSeconds;

        timer.textContent =
            `🧠 ${left} сек.`;

        return;
    }


    /*
        После 20 секунд показываем,
        сколько осталось до следующего
        временного штрафа.
    */

    const nextPenalty =
        TIME_STAR_PENALTIES.find(
            threshold =>
                !appliedTimePenalties.has(
                    threshold
                )
        );

    if (
        nextPenalty !== undefined
    ) {

        const left =
            Math.max(
                0,
                nextPenalty -
                elapsedSeconds
            );

        const starsText =
            currentStars > 0
                ? "⭐".repeat(
                    currentStars
                )
                : "💔";

        timer.textContent =
            `${starsText} ${left} сек.`;

        return;
    }

    timer.textContent =
        "💔 Время вышло";
}


/* =========================
   STOP TIMER
========================= */

function stopLevelTimer() {

    if (
        levelTimerInterval !== null
    ) {

        clearInterval(
            levelTimerInterval
        );

        levelTimerInterval = null;
    }
}


/* =========================
   GAME MESSAGE
========================= */

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

    message.textContent =
        text;

    message.className =
        "message";

    if (type) {

        message.classList.add(
            type
        );
    }

    setTimeout(() => {

        /*
            Не удаляем новое сообщение,
            если за это время оно уже
            изменилось.
        */
        if (
            message.textContent ===
            text
        ) {

            message.textContent =
                "";

            message.className =
                "message";
        }

    }, 1600);
}


/* =========================
   NO ENERGY
========================= */

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


/* =========================
   ENERGY UI
========================= */

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


/* =========================
   MAIN UI
========================= */

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


/* =========================
   ENERGY TIMER REFRESH
========================= */

setInterval(() => {

    updateEnergyUI();

}, 1000);
