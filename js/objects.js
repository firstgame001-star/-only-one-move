/* =========================================
   ONLY ONE MOVE — OBJECT PUZZLES
   LEVEL 2 — FREE THE FISH
========================================= */

let objectPuzzleLocked = false;
let fishAnimationTimer = null;


/* =========================================
   START LEVEL 2
========================================= */

function startObjectPuzzle() {

    objectPuzzleLocked = false;

    resetFishPuzzle();
    startFishSwimming();
}


/* =========================================
   RESET
========================================= */

function resetFishPuzzle() {

    objectPuzzleLocked = false;

    if (fishAnimationTimer) {
        clearTimeout(fishAnimationTimer);
        fishAnimationTimer = null;
    }

    const puzzle =
        document.getElementById("fishPuzzle");

    const fish =
        document.getElementById("fish");


    if (puzzle) {

        puzzle.classList.remove(
            "fish-solved"
        );
    }


    if (fish) {

        fish.classList.remove(
            "fish-free",
            "fish-turn",
            "fish-escaping"
        );

        fish.style.transform = "";
        fish.style.left = "";
        fish.style.top = "";
    }


    document
        .querySelectorAll(".fish-bar")
        .forEach(bar => {

            bar.classList.remove(
                "bar-moved",
                "fish-exit-open",
                "bar-wrong"
            );

            bar.style.transform = "";
        });


    startFishSwimming();
}


/* =========================================
   FISH IDLE SWIMMING
========================================= */

function startFishSwimming() {

    const fish =
        document.getElementById("fish");

    const puzzle =
        document.getElementById("fishPuzzle");


    if (!fish || !puzzle) return;


    if (fishAnimationTimer) {

        clearTimeout(
            fishAnimationTimer
        );
    }


    /*
       JS только переключает направление.
       Само плавное движение сделаем CSS.
    */

    function swimRight() {

        if (
            levelSolved ||
            levelFailed ||
            objectPuzzleLocked
        ) {
            return;
        }


        fish.classList.remove(
            "fish-swim-left"
        );


        fish.classList.add(
            "fish-swim-right"
        );


        fishAnimationTimer =
            setTimeout(
                swimLeft,
                2700
            );
    }


    function swimLeft() {

        if (
            levelSolved ||
            levelFailed ||
            objectPuzzleLocked
        ) {
            return;
        }


        fish.classList.remove(
            "fish-swim-right"
        );


        fish.classList.add(
            "fish-swim-left"
        );


        fishAnimationTimer =
            setTimeout(
                swimRight,
                2700
            );
    }


    fish.classList.remove(
        "fish-swim-left",
        "fish-swim-right"
    );


    setTimeout(() => {

        if (
            !levelSolved &&
            !levelFailed
        ) {

            swimRight();
        }

    }, 150);
}


/* =========================================
   PLAYER MOVES A BAR
========================================= */

function moveFishBar(barNumber) {

    if (
        objectPuzzleLocked ||
        levelSolved ||
        levelFailed
    ) {
        return;
    }


    const bar =
        document.querySelector(
            `.fish-bar[data-bar="${barNumber}"]`
        );


    if (!bar) return;


    objectPuzzleLocked = true;


    if (fishAnimationTimer) {

        clearTimeout(
            fishAnimationTimer
        );

        fishAnimationTimer = null;
    }


    /*
       ПРАВИЛЬНАЯ ПЛАНКА

       data-bar="4"
    */

    if (
        Number(barNumber) === 4
    ) {

        correctFishMove(bar);

    } else {

        wrongFishMove(bar);
    }
}


/* =========================================
   WRONG MOVE
========================================= */

function wrongFishMove(bar) {

    bar.classList.add(
        "bar-wrong"
    );


    if (
        typeof showGameMessage ===
        "function"
    ) {

        showGameMessage(
            "🐟 Рыбка всё ещё заперта! −⭐",
            "bad"
        );
    }


    /*
       Планка слегка дёргается,
       но остаётся на месте.
    */

    setTimeout(() => {

        bar.classList.remove(
            "bar-wrong"
        );


        if (
            typeof registerWrongMove ===
            "function"
        ) {

            registerWrongMove();
        }


        if (!levelFailed) {

            objectPuzzleLocked = false;

            startFishSwimming();
        }

    }, 450);
}


/* =========================================
   CORRECT MOVE
========================================= */

function correctFishMove(bar) {

    const puzzle =
        document.getElementById(
            "fishPuzzle"
        );


    const fish =
        document.getElementById(
            "fish"
        );


    /*
       Убираем правильную деревянную планку.
    */

    bar.classList.add(
        "fish-exit-open"
    );


    if (puzzle) {

        puzzle.classList.add(
            "fish-solved"
        );
    }


    if (
        typeof showGameMessage ===
        "function"
    ) {

        showGameMessage(
            "🌊 Выход открыт!",
            "good"
        );
    }


    /*
       Небольшая пауза —
       рыбка замечает выход.
    */

    setTimeout(() => {

        if (!fish) return;


        fish.classList.remove(
            "fish-swim-left",
            "fish-swim-right"
        );


        fish.classList.add(
            "fish-escaping"
        );

    }, 300);


    /*
       Рыбка выплывает наружу.
    */

    setTimeout(() => {

        if (!fish) return;


        fish.classList.add(
            "fish-free"
        );

    }, 550);


    /*
       Победа после завершения анимации.
    */

    setTimeout(() => {

        if (
            !levelSolved &&
            !levelFailed &&
            typeof solveLevel ===
            "function"
        ) {

            solveLevel(30);
        }

    }, 1500);
}


/* =========================================
   STOP FISH ANIMATION
========================================= */

function stopFishSwimming() {

    if (fishAnimationTimer) {

        clearTimeout(
            fishAnimationTimer
        );

        fishAnimationTimer = null;
    }
}
