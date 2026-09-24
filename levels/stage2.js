// =====================================
// ONLY ONE MOVE — STAGE 2
// LEVELS 6–10 — HARDER ONE-MOVE PUZZLES
// =====================================

window.ONE_MOVE_LEVELS = window.ONE_MOVE_LEVELS || {};

function createStage2ChoiceLevel(config) {
    return {
        id: config.id,
        type: config.type,
        locked: false,
        solved: false,
        selected: null,
        timers: [],

        render() {
            const cells = Array.from({length: config.count}, (_, i) => {
                const n = i + 1;
                const variant = (i * 7 + config.id * 3) % 4;
                const rot = [0,90,180,270][(i * 5 + config.id) % 4];

                return `
                    <button
                        type="button"
                        class="s2-cell s2-${config.type}-cell v-${variant}"
                        data-choice="${n}"
                        style="--cell-rot:${rot}deg"
                        aria-label="${config.cellLabel} ${n}"
                    >
                        ${this.cellMarkup(n, variant)}
                    </button>
                `;
            }).join("");

            return `
                <div class="s2-puzzle s2-${config.type}" id="stage2Puzzle${config.id}">
                    <div class="s2-scene">
                        <div class="s2-scene-glow"></div>
                        <div class="s2-scene-title">${config.badge}</div>
                        <div class="s2-scene-sub">${config.sceneText}</div>
                    </div>

                    <div
                        class="s2-board"
                        style="--s2-cols:${config.cols};"
                    >
                        <div class="s2-board-grid"></div>
                        <div class="s2-flow-layer" aria-hidden="true"></div>
                        <div class="s2-cells">
                            ${cells}
                        </div>
                        ${config.decor || ""}
                    </div>
                </div>
            `;
        },

        cellMarkup(n, variant) {
            if (config.type === "circuit") {
                const d = [
                    "M8 50 H92",
                    "M50 8 V92",
                    "M8 50 H50 V92",
                    "M8 50 H92 M50 8 V50"
                ][variant];

                return `
                    <svg class="s2-wire-svg" viewBox="0 0 100 100">
                        <path class="s2-wire-base" d="${d}"></path>
                        <path class="s2-wire-hot" d="${d}"></path>
                    </svg>
                    <span class="s2-node"></span>
                `;
            }

            if (config.type === "gears") {
                const teeth = 10 + (n % 4) * 2;
                return `
                    <span class="s2-gear" style="--teeth:${teeth}">
                        <span class="s2-gear-core"></span>
                    </span>
                `;
            }

            if (config.type === "laser2") {
                return `
                    <span class="s2-mirror">
                        <span class="s2-mirror-glass"></span>
                        <span class="s2-mirror-led"></span>
                    </span>
                `;
            }

            if (config.type === "rail2") {
                return `
                    <span class="s2-switch">
                        <span class="s2-switch-bar"></span>
                        <span class="s2-switch-dot"></span>
                    </span>
                `;
            }

            return `
                <span class="s2-valve">
                    <span class="s2-valve-ring"></span>
                    <span class="s2-valve-handle"></span>
                </span>
            `;
        },

        start() {
            this.clearTimers();
            this.locked = false;
            this.solved = false;
            this.selected = null;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (!puzzle) return;

            puzzle.classList.remove("s2-running","s2-wrong","s2-solved");

            puzzle.querySelectorAll(".s2-cell").forEach(cell => {
                cell.disabled = false;
                cell.classList.remove("s2-picked","s2-bad","s2-good");

                cell.onclick = event => {
                    event.preventDefault();
                    this.choose(cell, Number(cell.dataset.choice));
                };
            });

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent = config.moveText;
            }
        },

        choose(cell, number) {
            if (this.locked || this.solved || levelSolved || levelFailed) return;

            this.locked = true;
            this.selected = number;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (!puzzle) return;

            puzzle.classList.add("s2-running");
            cell.classList.add("s2-picked");

            // exactly one visible action
            const current = Number(cell.dataset.turn || 0);
            cell.dataset.turn = String(current + 1);
            cell.style.setProperty("--action-turn", "90deg");

            puzzle.querySelectorAll(".s2-cell").forEach(btn => btn.disabled = true);

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent = config.checkText;
            }

            const timer = setTimeout(() => {
                if (number === config.correct) {
                    this.correct(cell);
                } else {
                    this.wrong(cell);
                }
            }, 360);

            this.timers.push(timer);
        },

        correct(cell) {
            if (levelSolved || levelFailed) return;

            this.solved = true;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (puzzle) {
                puzzle.classList.remove("s2-wrong");
                puzzle.classList.add("s2-solved");
            }

            cell.classList.remove("s2-picked");
            cell.classList.add("s2-good");

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent = config.successMove;
            }

            if (typeof gameMessage !== "undefined" && gameMessage) {
                gameMessage.className = "message good";
                gameMessage.textContent = config.successText;
            }

            const timer = setTimeout(() => {
                if (!levelSolved && !levelFailed) {
                    solveLevel(50);
                }
            }, 1250);

            this.timers.push(timer);
        },

        wrong(cell) {
            if (levelSolved || levelFailed) return;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (puzzle) {
                puzzle.classList.add("s2-wrong");
            }

            cell.classList.add("s2-bad");

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent = config.wrongMove;
            }

            if (typeof gameMessage !== "undefined" && gameMessage) {
                gameMessage.className = "message bad";
                gameMessage.textContent = config.wrongText;
            }

            registerWrongMove();

            if (levelSolved || levelFailed) return;

            const timer = setTimeout(() => this.resetAfterWrong(), 700);
            this.timers.push(timer);
        },

        resetAfterWrong() {
            if (levelSolved || levelFailed) return;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (!puzzle) return;

            puzzle.classList.remove("s2-running","s2-wrong");

            puzzle.querySelectorAll(".s2-cell").forEach(cell => {
                cell.disabled = false;
                cell.classList.remove("s2-picked","s2-bad","s2-good");
                cell.style.removeProperty("--action-turn");
                delete cell.dataset.turn;
            });

            this.selected = null;
            this.locked = false;

            if (typeof movesText !== "undefined" && movesText) {
                movesText.textContent = config.retryText;
            }
        },

        reset() {
            this.clearTimers();
            this.locked = false;
            this.solved = false;
            this.selected = null;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (!puzzle) return;

            puzzle.classList.remove("s2-running","s2-wrong","s2-solved");

            puzzle.querySelectorAll(".s2-cell").forEach(cell => {
                cell.disabled = false;
                cell.classList.remove("s2-picked","s2-bad","s2-good");
                cell.style.removeProperty("--action-turn");
                delete cell.dataset.turn;
            });
        },

        stop() {
            this.clearTimers();
            this.locked = true;

            const puzzle = document.getElementById("stage2Puzzle" + config.id);
            if (!puzzle) return;

            puzzle.querySelectorAll(".s2-cell").forEach(cell => {
                cell.disabled = true;
            });
        },

        clearTimers() {
            this.timers.forEach(timer => clearTimeout(timer));
            this.timers = [];
        }
    };
}

window.ONE_MOVE_LEVELS[6] = createStage2ChoiceLevel({
    id: 6,
    type: "circuit",
    count: 25,
    cols: 5,
    correct: 18,
    cellLabel: "Контакт",
    badge: "⚡",
    sceneText: "Одна дорожка развернута неправильно",
    moveText: "⚡ Поверни один контакт",
    checkText: "⚡ Проверяем цепь…",
    successMove: "✓ Цепь замкнута",
    successText: "Ток дошёл до выхода.",
    wrongMove: "⚡ Цепь оборвалась",
    wrongText: "Не этот контакт. −⭐",
    retryText: "⚡ Найди другой контакт",
    decor: '<div class="s2-power-source">⚡</div><div class="s2-power-target">●</div>'
});

window.ONE_MOVE_LEVELS[7] = createStage2ChoiceLevel({
    id: 7,
    type: "gears",
    count: 20,
    cols: 5,
    correct: 13,
    cellLabel: "Шестерня",
    badge: "⚙️",
    sceneText: "Только одна шестерня нарушает передачу",
    moveText: "⚙️ Поверни одну шестерню",
    checkText: "⚙️ Запускаем механизм…",
    successMove: "✓ Механизм работает",
    successText: "Все шестерни вошли в зацепление.",
    wrongMove: "⚙️ Механизм заклинило",
    wrongText: "Не эта шестерня. −⭐",
    retryText: "⚙️ Попробуй другую шестерню",
    decor: '<div class="s2-gear-meter">▰▰▰▰</div>'
});

window.ONE_MOVE_LEVELS[8] = createStage2ChoiceLevel({
    id: 8,
    type: "laser2",
    count: 24,
    cols: 6,
    correct: 19,
    cellLabel: "Зеркало",
    badge: "🔴",
    sceneText: "Луч проходит через плотную матрицу зеркал",
    moveText: "🔴 Поверни одно зеркало",
    checkText: "🔴 Луч запущен…",
    successMove: "✓ Луч попал в цель",
    successText: "Маршрут лазера восстановлен.",
    wrongMove: "🔴 Луч ушёл в тупик",
    wrongText: "Не это зеркало. −⭐",
    retryText: "🔴 Проследи маршрут ещё раз",
    decor: '<div class="s2-laser-source"></div><div class="s2-laser-target"></div>'
});

window.ONE_MOVE_LEVELS[9] = createStage2ChoiceLevel({
    id: 9,
    type: "rail2",
    count: 20,
    cols: 5,
    correct: 14,
    cellLabel: "Стрелка",
    badge: "🚦",
    sceneText: "Три маршрута пересекаются в одной развязке",
    moveText: "🚦 Переключи одну стрелку",
    checkText: "🚂 Поезда двинулись…",
    successMove: "✓ Маршруты разведены",
    successText: "Все составы прошли развязку.",
    wrongMove: "🚧 Конфликт маршрутов",
    wrongText: "Неверная стрелка. −⭐",
    retryText: "🚦 Найди стрелку, влияющую на все пути",
    decor: '<div class="s2-train t-red">🚂</div><div class="s2-train t-blue">🚆</div><div class="s2-train t-gold">🚋</div>'
});

window.ONE_MOVE_LEVELS[10] = createStage2ChoiceLevel({
    id: 10,
    type: "valves",
    count: 30,
    cols: 6,
    correct: 23,
    cellLabel: "Клапан",
    badge: "💧",
    sceneText: "Два потока должны одновременно попасть к выходам",
    moveText: "💧 Поверни один клапан",
    checkText: "💧 Открываем поток…",
    successMove: "✓ Оба потока открыты",
    successText: "Система работает без утечек.",
    wrongMove: "💧 Давление ушло в тупик",
    wrongText: "Не этот клапан. −⭐",
    retryText: "💧 Ищи общий узел двух потоков",
    decor: '<div class="s2-water-source left">💧</div><div class="s2-water-source right">💧</div><div class="s2-water-exit">🏁</div>'
});
