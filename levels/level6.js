// =====================================
// ONLY ONE MOVE — LEVEL 6
// ARROW CUBES — ROBOT ROUTE
// =====================================

window.ONE_MOVE_LEVELS = window.ONE_MOVE_LEVELS || {};

window.ONE_MOVE_LEVELS[6] = {
    id: 6,
    type: "arrow-cubes",

    locked: false,
    solved: false,
    selectedCell: null,
    correctCell: 7,
    timers: [],

    // 5×5. Exactly one clockwise rotation (cell 8 for the player,
    // zero-based index 7 here) creates a route from START to EXIT.
    baseDirections: [
        "R","R","D","U","U",
        "L","U","U","D","R",
        "L","D","L","L","R",
        "L","R","R","D","R",
        "D","D","D","R","U"
    ],

    directions: [],

    arrowFor(direction) {
        return {
            U: "↑",
            R: "→",
            D: "↓",
            L: "←"
        }[direction] || "•";
    },

    rotateClockwise(direction) {
        return {
            U: "R",
            R: "D",
            D: "L",
            L: "U"
        }[direction] || direction;
    },

    render() {
        const cells = this.baseDirections.map((direction, index) => {
            const isExit = index === 24;

            return `
                <button
                    type="button"
                    class="arrow-cube ${isExit ? "arrow-exit-cube" : ""}"
                    data-cell="${index}"
                    data-direction="${direction}"
                    aria-label="${isExit ? "Выход" : "Куб " + (index + 1)}"
                    ${isExit ? "disabled" : ""}
                >
                    <span class="arrow-cube-face">
                        ${isExit
                            ? '<span class="arrow-exit-flag">⚑</span>'
                            : `<span class="arrow-symbol">${this.arrowFor(direction)}</span>`
                        }
                    </span>
                </button>
            `;
        }).join("");

        return `
            <div id="arrowCubePuzzle" class="arrow-cube-puzzle">
                <div class="arrow-scene-note">
                    <span class="arrow-note-icon">🤖</span>
                    <span>
                        Робот пойдёт по стрелкам автоматически.
                        Один куб можно повернуть на 90°.
                    </span>
                </div>

                <div class="arrow-board" id="arrowBoard">
                    <div class="arrow-stone stone-a"></div>
                    <div class="arrow-stone stone-b"></div>
                    <div class="arrow-lamp lamp-a"></div>
                    <div class="arrow-lamp lamp-b"></div>

                    <div class="arrow-cells" id="arrowCells">
                        ${cells}

                        <div class="arrow-robot" id="arrowRobot" aria-hidden="true">
                            <span class="robot-head">🤖</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    start() {
        this.clearTimers();

        this.locked = false;
        this.solved = false;
        this.selectedCell = null;
        this.directions = [...this.baseDirections];

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "arrow-running",
            "arrow-wrong-state",
            "arrow-solved"
        );

        puzzle.querySelectorAll(".arrow-cube").forEach(button => {
            const index = Number(button.dataset.cell);
            const direction = this.baseDirections[index];

            button.classList.remove(
                "arrow-selected",
                "arrow-visited",
                "arrow-wrong",
                "arrow-correct"
            );

            if (index === 24) {
                button.disabled = true;
                return;
            }

            button.disabled = false;
            button.dataset.direction = direction;

            const symbol = button.querySelector(".arrow-symbol");
            if (symbol) {
                symbol.textContent = this.arrowFor(direction);
            }

            button.onclick = event => {
                event.preventDefault();
                this.chooseCube(button, index);
            };
        });

        this.setRobotCell(0, false);

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🤖 Поверни один куб";
        }
    },

    chooseCube(button, index) {
        if (
            this.locked ||
            this.solved ||
            levelSolved ||
            levelFailed
        ) {
            return;
        }

        this.locked = true;
        this.selectedCell = index;

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (puzzle) {
            puzzle.classList.add("arrow-running");
        }

        const current = this.directions[index];
        const rotated = this.rotateClockwise(current);

        this.directions[index] = rotated;
        button.dataset.direction = rotated;
        button.classList.add("arrow-selected");

        const symbol = button.querySelector(".arrow-symbol");
        if (symbol) {
            symbol.classList.add("arrow-turning");

            const timer = setTimeout(() => {
                symbol.textContent = this.arrowFor(rotated);
                symbol.classList.remove("arrow-turning");
            }, 150);

            this.timers.push(timer);
        }

        document.querySelectorAll("#arrowCubePuzzle .arrow-cube")
            .forEach(cell => cell.disabled = true);

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🤖 Робот проверяет маршрут…";
        }

        const timer = setTimeout(() => {
            this.runRobot();
        }, 360);

        this.timers.push(timer);
    },

    simulate() {
        const visited = new Set();
        const route = [0];

        let index = 0;

        for (let step = 0; step < 40; step++) {
            if (index === 24) {
                return {
                    success: true,
                    route
                };
            }

            if (visited.has(index)) {
                return {
                    success: false,
                    route,
                    reason: "loop"
                };
            }

            visited.add(index);

            const row = Math.floor(index / 5);
            const col = index % 5;
            const direction = this.directions[index];

            let nextRow = row;
            let nextCol = col;

            if (direction === "U") nextRow--;
            if (direction === "R") nextCol++;
            if (direction === "D") nextRow++;
            if (direction === "L") nextCol--;

            if (
                nextRow < 0 ||
                nextRow >= 5 ||
                nextCol < 0 ||
                nextCol >= 5
            ) {
                return {
                    success: false,
                    route,
                    reason: "edge"
                };
            }

            index = nextRow * 5 + nextCol;
            route.push(index);
        }

        return {
            success: false,
            route,
            reason: "limit"
        };
    },

    runRobot() {
        const result = this.simulate();

        this.setRobotCell(0, false);

        result.route.forEach((index, order) => {
            const timer = setTimeout(() => {
                this.setRobotCell(index, true);

                const cell = document.querySelector(
                    `#arrowCubePuzzle .arrow-cube[data-cell="${index}"]`
                );

                if (cell) {
                    cell.classList.add("arrow-visited");
                }

                if (order === result.route.length - 1) {
                    const doneTimer = setTimeout(() => {
                        if (result.success) {
                            this.correctMove();
                        } else {
                            this.wrongMove();
                        }
                    }, 260);

                    this.timers.push(doneTimer);
                }
            }, order * 230);

            this.timers.push(timer);
        });
    },

    setRobotCell(index, animate = true) {
        const robot = document.getElementById("arrowRobot");
        if (!robot) return;

        const row = Math.floor(index / 5);
        const col = index % 5;

        robot.style.transition =
            animate
                ? "left .21s ease, top .21s ease, transform .21s ease"
                : "none";

        robot.style.left =
            ((col + 0.5) * 20) + "%";

        robot.style.top =
            ((row + 0.5) * 20) + "%";

        robot.dataset.cell = String(index);
    },

    correctMove() {
        if (levelSolved || levelFailed) return;

        this.solved = true;

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (puzzle) {
            puzzle.classList.remove("arrow-wrong-state");
            puzzle.classList.add("arrow-solved");
        }

        const selected = document.querySelector(
            `#arrowCubePuzzle .arrow-cube[data-cell="${this.selectedCell}"]`
        );

        if (selected) {
            selected.classList.remove("arrow-selected");
            selected.classList.add("arrow-correct");
        }

        const exit = document.querySelector(
            "#arrowCubePuzzle .arrow-exit-cube"
        );

        if (exit) {
            exit.classList.add("arrow-correct");
        }

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "✓ Робот дошёл до выхода";
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message good";
            gameMessage.textContent = "Маршрут найден!";
        }

        const timer = setTimeout(() => {
            if (!levelSolved && !levelFailed) {
                solveLevel(50);
            }
        }, 850);

        this.timers.push(timer);
    },

    wrongMove() {
        if (levelSolved || levelFailed) return;

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (puzzle) {
            puzzle.classList.add("arrow-wrong-state");
        }

        const selected = document.querySelector(
            `#arrowCubePuzzle .arrow-cube[data-cell="${this.selectedCell}"]`
        );

        if (selected) {
            selected.classList.add("arrow-wrong");
        }

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🤖 Маршрут завёл в тупик";
        }

        if (typeof gameMessage !== "undefined" && gameMessage) {
            gameMessage.className = "message bad";
            gameMessage.textContent = "Не этот куб. −⭐";
        }

        registerWrongMove();

        if (levelSolved || levelFailed) return;

        const timer = setTimeout(() => {
            this.resetAfterWrong();
        }, 760);

        this.timers.push(timer);
    },

    resetAfterWrong() {
        if (levelSolved || levelFailed) return;

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "arrow-running",
            "arrow-wrong-state"
        );

        this.directions = [...this.baseDirections];

        puzzle.querySelectorAll(".arrow-cube").forEach(button => {
            const index = Number(button.dataset.cell);
            const direction = this.baseDirections[index];

            button.classList.remove(
                "arrow-selected",
                "arrow-visited",
                "arrow-wrong",
                "arrow-correct"
            );

            if (index === 24) {
                button.disabled = true;
                return;
            }

            button.disabled = false;
            button.dataset.direction = direction;

            const symbol = button.querySelector(".arrow-symbol");
            if (symbol) {
                symbol.textContent = this.arrowFor(direction);
            }
        });

        this.selectedCell = null;
        this.locked = false;
        this.setRobotCell(0, false);

        if (typeof movesText !== "undefined" && movesText) {
            movesText.textContent = "🤖 Попробуй другой куб";
        }
    },

    reset() {
        this.clearTimers();
        this.locked = false;
        this.solved = false;
        this.selectedCell = null;
        this.directions = [...this.baseDirections];

        const puzzle = document.getElementById("arrowCubePuzzle");
        if (!puzzle) return;

        puzzle.classList.remove(
            "arrow-running",
            "arrow-wrong-state",
            "arrow-solved"
        );

        puzzle.querySelectorAll(".arrow-cube").forEach(button => {
            const index = Number(button.dataset.cell);
            const direction = this.baseDirections[index];

            button.classList.remove(
                "arrow-selected",
                "arrow-visited",
                "arrow-wrong",
                "arrow-correct"
            );

            if (index === 24) {
                button.disabled = true;
                return;
            }

            button.disabled = false;
            button.dataset.direction = direction;

            const symbol = button.querySelector(".arrow-symbol");
            if (symbol) {
                symbol.textContent = this.arrowFor(direction);
            }
        });

        this.setRobotCell(0, false);
    },

    stop() {
        this.clearTimers();
        this.locked = true;

        document.querySelectorAll("#arrowCubePuzzle .arrow-cube")
            .forEach(button => {
                button.disabled = true;
            });
    },

    clearTimers() {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers = [];
    }
};
