/* =========================================
   ONLY ONE MOVE — STORAGE
   100 уровней / 20 этапов / 5 уровней
========================================= */

const TOTAL_LEVELS = 100;
const LEVELS_PER_CHAPTER = 5;
const TOTAL_CHAPTERS = 20;


/* =========================================
   CREATE CHAPTERS
========================================= */

const CHAPTERS = {};

for (let chapterId = 1; chapterId <= TOTAL_CHAPTERS; chapterId++) {

    const firstLevel =
        (chapterId - 1) * LEVELS_PER_CHAPTER + 1;

    const lastLevel =
        firstLevel + LEVELS_PER_CHAPTER - 1;

    CHAPTERS[chapterId] = {
        id: chapterId,
        name: `Этап ${chapterId}`,
        firstLevel: firstLevel,
        lastLevel: lastLevel,

        /*
            Пока оставляем 15/15.
            Позже можем изменить, например,
            на 12/15, не ломая сохранения.
        */
        requiredStars: 15
    };
}


/* =========================================
   DEFAULT PLAYER
========================================= */

const DEFAULT_PLAYER_DATA = {

    coins: 300,

    /*
        level = следующий основной уровень,
        который игрок должен пройти.
    */
    level: 1,

    totalStars: 0,

    streak: 1,

    completedLevels: {},

    /*
        Например:
        {
            "1": 2,
            "2": 3
        }
    */
    bestStars: {},

    unlockedChapters: {
        "1": true
    }
};


/* =========================================
   GET PLAYER
========================================= */

function getPlayerData() {

    const saved =
        localStorage.getItem("playerData");

    if (saved === null) {

        const data =
            JSON.parse(
                JSON.stringify(
                    DEFAULT_PLAYER_DATA
                )
            );

        savePlayerData(data);

        return data;
    }

    try {

        const parsed =
            JSON.parse(saved);

        return {

            ...DEFAULT_PLAYER_DATA,
            ...parsed,

            completedLevels:
                parsed.completedLevels || {},

            bestStars:
                parsed.bestStars || {},

            unlockedChapters:
                parsed.unlockedChapters || {
                    "1": true
                }
        };

    } catch (error) {

        console.error(
            "Ошибка сохранения:",
            error
        );

        return JSON.parse(
            JSON.stringify(
                DEFAULT_PLAYER_DATA
            )
        );
    }
}


/* =========================================
   SAVE
========================================= */

function savePlayerData(data) {

    localStorage.setItem(
        "playerData",
        JSON.stringify(data)
    );
}


/* =========================================
   COINS
========================================= */

function getCoins() {

    return getPlayerData().coins;
}


function addCoins(amount) {

    const data =
        getPlayerData();

    data.coins +=
        Number(amount) || 0;

    savePlayerData(data);

    return data.coins;
}


function spendCoins(amount) {

    const data =
        getPlayerData();

    amount =
        Number(amount) || 0;

    if (data.coins < amount) {
        return false;
    }

    data.coins -= amount;

    savePlayerData(data);

    return true;
}


/* =========================================
   CURRENT LEVEL
========================================= */

function getCurrentLevel() {

    return getPlayerData().level;
}


function setCurrentLevel(level) {

    const data =
        getPlayerData();

    data.level =
        Math.min(
            TOTAL_LEVELS,
            Math.max(
                1,
                Number(level) || 1
            )
        );

    savePlayerData(data);
}


/* =========================================
   LEVEL STATUS
========================================= */

function isLevelCompleted(level) {

    const data =
        getPlayerData();

    return (
        data.completedLevels[
            String(level)
        ] === true
    );
}


function getBestStars(level) {

    const data =
        getPlayerData();

    return Number(
        data.bestStars[
            String(level)
        ] || 0
    );
}


/* =========================================
   CHAPTER HELPERS
========================================= */

function getChapterForLevel(level) {

    level =
        Number(level);

    if (
        level < 1 ||
        level > TOTAL_LEVELS
    ) {
        return null;
    }

    return Math.ceil(
        level / LEVELS_PER_CHAPTER
    );
}


function getChapterData(chapterId) {

    return (
        CHAPTERS[
            Number(chapterId)
        ] || null
    );
}


/* =========================================
   HAS PLAYER FINISHED ALL 5 LEVELS?
========================================= */

function isChapterFirstRunComplete(chapterId) {

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return false;
    }

    for (
        let level = chapter.firstLevel;
        level <= chapter.lastLevel;
        level++
    ) {

        if (
            !isLevelCompleted(level)
        ) {
            return false;
        }
    }

    return true;
}


/* =========================================
   CAN LEVEL BE OPENED?
========================================= */

function canPlayLevel(level) {

    level =
        Number(level);

    if (
        level < 1 ||
        level > TOTAL_LEVELS
    ) {
        return false;
    }

    const chapterId =
        getChapterForLevel(level);

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return false;
    }

    /*
        Этап должен быть открыт.
    */

    if (
        !isChapterUnlocked(chapterId)
    ) {
        return false;
    }


    /*
        Если уровень ещё НЕ пройден,
        разрешаем только следующий
        последовательный уровень.
    */

    if (
        !isLevelCompleted(level)
    ) {

        /*
            Первый уровень этапа.
        */

        if (
            level ===
            chapter.firstLevel
        ) {

            return true;
        }

        /*
            Например:
            уровень 2 откроется только
            после прохождения уровня 1.
        */

        return isLevelCompleted(
            level - 1
        );
    }


    /*
        Уровень уже пройден.

        ПОВТОР запрещён, пока игрок
        впервые не закончил ВСЕ 5
        уровней этого этапа.
    */

    if (
        !isChapterFirstRunComplete(
            chapterId
        )
    ) {
        return false;
    }


    /*
        После окончания этапа
        можно улучшать уровни,
        где меньше 3 звёзд.
    */

    return (
        getBestStars(level) < 3
    );
}


/* =========================================
   WHY LEVEL IS LOCKED
========================================= */

function getLevelLockReason(level) {

    level =
        Number(level);

    const chapterId =
        getChapterForLevel(level);

    if (!chapterId) {
        return "Уровень недоступен";
    }

    if (
        !isChapterUnlocked(
            chapterId
        )
    ) {
        return "🔒 Этап ещё не открыт";
    }

    if (
        isLevelCompleted(level)
    ) {

        if (
            !isChapterFirstRunComplete(
                chapterId
            )
        ) {
            return "🔒 Повтор откроется после завершения этапа";
        }

        if (
            getBestStars(level) >= 3
        ) {
            return "⭐⭐⭐ Здесь уже лучший результат";
        }
    }

    if (
        level > 1 &&
        !isLevelCompleted(
            level - 1
        )
    ) {
        return `🔒 Сначала пройди уровень ${level - 1}`;
    }

    return "🔒 Пока недоступно";
}


/* =========================================
   COMPLETE LEVEL
========================================= */

function completeLevel(
    level,
    stars,
    coinReward
) {

    const data =
        getPlayerData();

    level =
        Number(level);

    const key =
        String(level);

    const alreadyCompleted =
        data.completedLevels[key] === true;

    const oldBest =
        Number(
            data.bestStars[key] || 0
        );

    const newStars =
        Math.max(
            1,
            Math.min(
                3,
                Number(stars) || 1
            )
        );


    /*
        ПЕРВОЕ ПРОХОЖДЕНИЕ
    */

    if (!alreadyCompleted) {

        data.completedLevels[key] =
            true;

        /*
            Монеты выдаём только один раз.
        */

        data.coins +=
            Number(coinReward) || 0;
    }


    /*
        ЛУЧШИЙ РЕЗУЛЬТАТ
    */

    if (newStars > oldBest) {

        const difference =
            newStars - oldBest;

        data.bestStars[key] =
            newStars;

        data.totalStars +=
            difference;
    }


    /*
        Продвигаем основной прогресс
        только при первом прохождении.
    */

    if (
        !alreadyCompleted &&
        level >= data.level &&
        level < TOTAL_LEVELS
    ) {

        data.level =
            level + 1;
    }


    savePlayerData(data);


    /*
        После сохранения проверяем,
        закончил ли игрок этап.
    */

    const chapterId =
        getChapterForLevel(level);

    const chapterFinished =
        isChapterFirstRunComplete(
            chapterId
        );


    /*
        ВАЖНО:
        следующий этап здесь автоматически
        НЕ открываем.

        Позже применим наше условие по ⭐.
    */


    return {

        firstCompletion:
            !alreadyCompleted,

        coins:
            getPlayerData().coins,

        totalStars:
            getPlayerData().totalStars,

        bestStars:
            getBestStars(level),

        improved:
            newStars > oldBest,

        chapterId:
            chapterId,

        chapterFinished:
            chapterFinished
    };
}


/* =========================================
   CHAPTER STARS
========================================= */

function getChapterEarnedStars(
    chapterId
) {

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return 0;
    }

    let stars = 0;

    for (
        let level = chapter.firstLevel;
        level <= chapter.lastLevel;
        level++
    ) {

        stars +=
            getBestStars(level);
    }

    return stars;
}


/* =========================================
   CHAPTER PROGRESS
========================================= */

function getChapterProgress(
    chapterId
) {

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return null;
    }

    const earned =
        getChapterEarnedStars(
            chapterId
        );

    return {

        chapterId:
            Number(chapterId),

        earned:
            earned,

        total:
            earned,

        required:
            chapter.requiredStars,

        missing:
            Math.max(
                0,
                chapter.requiredStars -
                earned
            ),

        firstRunComplete:
            isChapterFirstRunComplete(
                chapterId
            ),

        complete:
            earned >=
            chapter.requiredStars
    };
}


/* =========================================
   CHAPTER UNLOCK
========================================= */

function isChapterUnlocked(
    chapterId
) {

    chapterId =
        Number(chapterId);

    if (chapterId === 1) {
        return true;
    }

    const data =
        getPlayerData();

    if (
        data.unlockedChapters[
            String(chapterId)
        ] === true
    ) {
        return true;
    }

    const previousChapter =
        getChapterData(
            chapterId - 1
        );

    if (!previousChapter) {
        return false;
    }

    const previousComplete =
        isChapterFirstRunComplete(
            chapterId - 1
        );

    const previousStars =
        getChapterEarnedStars(
            chapterId - 1
        );

    if (
        previousComplete &&
        previousStars >=
            previousChapter.requiredStars
    ) {

        data.unlockedChapters[
            String(chapterId)
        ] = true;

        savePlayerData(data);

        return true;
    }

    return false;
}


function unlockChapter(
    chapterId
) {

    chapterId =
        Number(chapterId);

    if (
        chapterId < 1 ||
        chapterId > TOTAL_CHAPTERS
    ) {
        return false;
    }

    const data =
        getPlayerData();

    data.unlockedChapters[
        String(chapterId)
    ] = true;

    savePlayerData(data);

    return true;
}


/* =========================================
   LEVELS THAT NEED IMPROVEMENT
========================================= */

function getLevelsToImprove(
    chapterId
) {

    const chapter =
        getChapterData(chapterId);

    if (!chapter) {
        return [];
    }

    /*
        До первого прохождения всех 5
        уровней ничего улучшать нельзя.
    */

    if (
        !isChapterFirstRunComplete(
            chapterId
        )
    ) {
        return [];
    }

    const result = [];

    for (
        let level = chapter.firstLevel;
        level <= chapter.lastLevel;
        level++
    ) {

        const stars =
            getBestStars(level);

        if (stars < 3) {

            result.push({
                level: level,
                stars: stars,
                missing: 3 - stars
            });
        }
    }

    return result;
}


/* =========================================
   STREAK
========================================= */

function getStreak() {

    return getPlayerData().streak;
}


function setStreak(value) {

    const data =
        getPlayerData();

    data.streak =
        Math.max(
            1,
            Number(value) || 1
        );

    savePlayerData(data);
}
