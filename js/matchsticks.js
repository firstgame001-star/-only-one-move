// =====================================
// ONLY ONE MOVE
// MATCHSTICK PUZZLE ENGINE
// =====================================

const MATCHSTICK_CONFIG = {
    tutorialLevel: 1,
    allowAnyMatch: true,
    showCorrectTarget: false,
    wrongMoveCostsStar: true
};


// Семисегментные цифры
//       A
//      ---
//   F |   | B
//      -G-
//   E |   | C
//      ---
//       D

const DIGIT_SEGMENTS = {
    0: ["A", "B", "C", "D", "E", "F"],
    1: ["B", "C"],
    2: ["A", "B", "G", "E", "D"],
    3: ["A", "B", "C", "D", "G"],
    4: ["F", "G", "B", "C"],
    5: ["A", "F", "G", "C", "D"],
    6: ["A", "F", "G", "E", "C", "D"],
    7: ["A", "B", "C"],
    8: ["A", "B", "C", "D", "E", "F", "G"],
    9: ["A", "B", "C", "D", "F", "G"]
};


// =====================================
// MATCHSTICK LEVEL STATE
// =====================================

let selectedMatch = null;
let matchstickMoveUsed = false;


// =====================================
// START MATCHSTICK PUZZLE
// =====================================

function startMatchstickPuzzle() {

    selectedMatch = null;
    matchstickMoveUsed = false;

    clearMatchstickSelection();

    if (activeLevel === 1) {
        showMatchstickTutorial();
    }
}


// =====================================
// LEVEL 1 TUTORIAL
// =====================================

function showMatchstickTutorial() {

    const alreadySeen =
        localStorage.getItem(
            "matchstickTutorialSeen"
        );

    if (alreadySeen === "true") {
        return;
    }

    showGameMessage(
        "👆 Зажми любую спичку и попробуй исправить равенство"
    );

    localStorage.setItem(
        "matchstickTutorialSeen",
        "true"
    );
}


// =====================================
// SELECT MATCH
// =====================================

function selectMatchstick(element) {

    if (
        levelSolved ||
        levelFailed ||
        matchstickMoveUsed
    ) {
        return;
    }

    clearMatchstickSelection();

    selectedMatch = element;

    element.classList.add(
        "match-selected"
    );
}


// =====================================
// CLEAR SELECTION
// =====================================

function clearMatchstickSelection() {

    document
        .querySelectorAll(
            ".match-selected"
        )
        .forEach(match => {

            match.classList.remove(
                "match-selected"
            );
        });

    selectedMatch = null;
}


// =====================================
// WRONG MATCHSTICK MOVE
// =====================================

function wrongMatchstickMove() {

    if (
        levelSolved ||
        levelFailed
    ) {
        return;
    }

    matchstickMoveUsed = true;

    clearMatchstickSelection();

    // game.js сжигает одну ⭐
    registerWrongMove();

    // Возвращаем головоломку
    // в исходное состояние
    setTimeout(() => {

        matchstickMoveUsed = false;

        if (
            typeof resetPuzzleVisual ===
            "function"
        ) {
            resetPuzzleVisual();
        }

    }, 450);
}


// =====================================
// CORRECT MATCHSTICK MOVE
// =====================================

function correctMatchstickMove(
    reward = 30
) {

    if (
        levelSolved ||
        levelFailed
    ) {
        return;
    }

    matchstickMoveUsed = true;

    clearMatchstickSelection();

    solveLevel(reward);
}


// =====================================
// CHECK MATHEMATICAL EQUATION
// =====================================

function isEquationCorrect(
    left,
    operator,
    right,
    result
) {

    left = Number(left);
    right = Number(right);
    result = Number(result);

    if (
        !Number.isFinite(left) ||
        !Number.isFinite(right) ||
        !Number.isFinite(result)
    ) {
        return false;
    }

    switch (operator) {

        case "+":
            return left + right === result;

        case "-":
            return left - right === result;

        case "×":
        case "*":
            return left * right === result;

        case "÷":
        case "/":

            if (right === 0) {
                return false;
            }

            return left / right === result;

        default:
            return false;
    }
}


// =====================================
// FUTURE:
// Automatic segment recognition
// =====================================
//
// Следующим шагом сюда подключим:
//
// 1. Все спички цифр
// 2. Спички знаков + - =
// 3. Drag & Drop
// 4. Пустые допустимые позиции
// 5. Автоматическое распознавание цифры
// 6. Проверку равенства
//
// Правильное место игроку
// заранее НЕ показываем.
//
